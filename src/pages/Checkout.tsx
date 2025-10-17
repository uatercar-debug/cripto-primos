import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CreditCard, Lock, ArrowLeft, Shield, CheckCircle, QrCode, Receipt, Award, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'info' | 'payment' | 'pix_pending' | 'boleto_pending'>('info');
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'pix' | 'boleto'>('credit_card');
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    docType: "CPF",
    docNumber: ""
  });
  const [paymentData, setPaymentData] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Funções de formatação
  const formatCardNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    const formatted = numbers.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formatted;
  };

  const formatExpiryDate = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length >= 2) {
      return numbers.substring(0, 2) + '/' + numbers.substring(2, 4);
    }
    return numbers;
  };

  const formatDocument = (value: string, type: string) => {
    const numbers = value.replace(/\D/g, '');
    if (type === 'CPF') {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else {
      return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
  };

  // Carregar SDK do MercadoPago
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://sdk.mercadopago.com/js/v2';
    script.async = true;
    script.onload = () => {
      console.log('MercadoPago SDK loaded successfully');
    };
    script.onerror = () => {
      console.error('Failed to load MercadoPago SDK');
      toast({
        title: "Erro de carregamento",
        description: "Não foi possível carregar o sistema de pagamento. Tente recarregar a página.",
        variant: "destructive",
      });
    };
    document.head.appendChild(script);
    
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [toast]);

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha nome e email.",
        variant: "destructive",
      });
      return;
    }

    setStep('payment');
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar campos obrigatórios baseado no método de pagamento
    if (!formData.name || !formData.email || !formData.docNumber) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    // Validação específica por método de pagamento
    if (paymentMethod === 'credit_card') {
      if (!formData.cardNumber || !formData.expiryDate || !formData.cvv || !formData.cardholderName) {
        toast({
          title: "Campos obrigatórios",
          description: "Por favor, preencha todos os dados do cartão.",
          variant: "destructive",
        });
        return;
      }

      // Validar formato do cartão
      const cardNumberClean = formData.cardNumber.replace(/\s/g, '');
      if (cardNumberClean.length < 13 || cardNumberClean.length > 19) {
        toast({
          title: "Cartão inválido",
          description: "Número do cartão deve ter entre 13 e 19 dígitos.",
          variant: "destructive",
        });
        return;
      }

      // Validar CVV
      if (formData.cvv.length < 3 || formData.cvv.length > 4) {
        toast({
          title: "CVV inválido",
          description: "CVV deve ter 3 ou 4 dígitos.",
          variant: "destructive",
        });
        return;
      }
    }

    // Validar documento
    const docClean = formData.docNumber.replace(/\D/g, '');
    if (formData.docType === 'CPF' && docClean.length !== 11) {
      toast({
        title: "CPF inválido",
        description: "CPF deve ter 11 dígitos.",
        variant: "destructive",
      });
      return;
    }
    if (formData.docType === 'CNPJ' && docClean.length !== 14) {
      toast({
        title: "CNPJ inválido",
        description: "CNPJ deve ter 14 dígitos.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('Processing MercadoPago payment...');
      
      // Preparar dados baseado no método de pagamento
      const basePaymentData = {
        name: formData.name,
        email: formData.email,
        docType: formData.docType,
        docNumber: docClean,
        amount: 29.00,
        paymentMethod: paymentMethod
      };

      let paymentData;
      
      if (paymentMethod === 'credit_card') {
        const cardNumberClean = formData.cardNumber.replace(/\s/g, '');
        paymentData = {
          ...basePaymentData,
          cardNumber: cardNumberClean,
          expiryDate: formData.expiryDate,
          cvv: formData.cvv,
          cardholderName: formData.cardholderName,
        };
      } else {
        // Para PIX e boleto, usar a função de processamento direto
        paymentData = {
          ...basePaymentData,
          payment_method_id: paymentMethod === 'pix' ? 'pix' : 'bolbradesco'
        };
      }

      // Usar sempre a função de processamento direto
      const functionName = 'process-mercadopago-payment';

      const { data, error } = await supabase.functions.invoke(functionName, {
        body: paymentData
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Erro na comunicação com o servidor');
      }

      console.log('Payment processed successfully:', data);

      // Tratar resposta baseado no status do pagamento
      if (data.status === 'approved') {
        toast({
          title: "Pagamento aprovado! 🎉",
          description: "Seu acesso foi liberado. Redirecionando para área VIP...",
        });
        setTimeout(() => navigate('/area-vip'), 2000);
      } else if (data.status === 'redirect_required') {
        // Caso PIX não esteja configurado, redirecionar para MercadoPago
        const redirectUrl = data.init_point;
        if (redirectUrl) {
          window.location.href = redirectUrl;
        } else {
          throw new Error('URL de redirecionamento não encontrada');
        }
      } else if (data.status === 'pending') {
        if (paymentMethod === 'pix') {
          setPaymentData(data);
          setStep('pix_pending');
          toast({
            title: "PIX gerado com sucesso! 🎉",
            description: "Complete o pagamento via PIX para liberar seu acesso.",
          });
        } else if (paymentMethod === 'boleto') {
          setPaymentData(data);
          setStep('boleto_pending');
          toast({
            title: "Boleto gerado com sucesso! 🎉", 
            description: "Complete o pagamento do boleto para liberar seu acesso.",
          });
        } else {
          toast({
            title: "Pagamento em análise",
            description: "Seu pagamento está sendo processado. Você receberá um email em breve.",
          });
          setTimeout(() => navigate('/'), 3000);
        }
      } else if (data.status === 'rejected') {
        toast({
          title: "Pagamento rejeitado",
          description: "Tente novamente com dados diferentes ou escolha outro método de pagamento.",
          variant: "destructive",
        });
      } else {
        throw new Error(data.status_detail || 'Status de pagamento desconhecido');
      }

    } catch (error) {
      console.error('Error processing payment:', error);
      toast({
        title: "Erro ao processar pagamento",
        description: error.message || "Tente novamente em alguns instantes ou entre em contato conosco.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container max-w-2xl mx-auto px-4">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Finalizar Compra</h1>
            <p className="text-muted-foreground">
              Curso Completo de Copytrading - Apenas R$ 29,00
            </p>
          </div>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              {step === 'info' ? 'Seus Dados' : 'Pagamento Seguro'}
            </CardTitle>
            
            {/* Selo MercadoPago */}
            <div className="flex items-center justify-center gap-4 py-4 px-4 bg-muted/30 rounded-lg border border-border mt-4">
              <img src="/mercadopago-logo.png" alt="MercadoPago" className="h-6" />
              <div className="flex items-center gap-6 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-success" />
                  <span>Seguro</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-primary" />
                  <span>+500M usuários</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-success" />
                  <span>Certificado</span>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            {step === 'info' && (
              <form onSubmit={handleInfoSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Seu nome completo"
                      className="mt-2"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="seu@email.com"
                      className="mt-2"
                      required
                    />
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-sm font-medium mb-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    O que você receberá:
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Acesso completo ao curso de copytrading</li>
                    <li>• E-book exclusivo em PDF</li>
                    <li>• Estratégias testadas e aprovadas</li>
                    <li>• Suporte via newsletter</li>
                  </ul>
                </div>

                <Button type="submit" className="w-full" size="lg">
                  Continuar para Pagamento
                </Button>
              </form>
            )}

            {step === 'payment' && (
              <form onSubmit={handlePaymentSubmit} className="space-y-6">
                {/* Seleção do método de pagamento */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-3 block">Escolha a forma de pagamento</label>
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('credit_card')}
                        className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                          paymentMethod === 'credit_card' 
                            ? 'border-primary bg-primary/10' 
                            : 'border-muted hover:border-primary/50'
                        }`}
                      >
                        <CreditCard className="w-6 h-6" />
                        <span className="text-sm font-medium">Cartão</span>
                        <span className="text-xs text-muted-foreground">Instantâneo</span>
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('pix')}
                        className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                          paymentMethod === 'pix' 
                            ? 'border-primary bg-primary/10' 
                            : 'border-muted hover:border-primary/50'
                        }`}
                      >
                        <QrCode className="w-6 h-6" />
                        <span className="text-sm font-medium">PIX</span>
                        <span className="text-xs text-muted-foreground">Instantâneo</span>
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('boleto')}
                        className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                          paymentMethod === 'boleto' 
                            ? 'border-primary bg-primary/10' 
                            : 'border-muted hover:border-primary/50'
                        }`}
                      >
                        <Receipt className="w-6 h-6" />
                        <span className="text-sm font-medium">Boleto</span>
                        <span className="text-xs text-muted-foreground">1-3 dias</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Campos específicos por método de pagamento */}
                {paymentMethod === 'credit_card' && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="cardNumber">Número do Cartão</Label>
                      <Input
                        id="cardNumber"
                        type="text"
                        value={formData.cardNumber}
                        onChange={(e) => {
                          const formatted = formatCardNumber(e.target.value);
                          setFormData(prev => ({ ...prev, cardNumber: formatted }));
                        }}
                        placeholder="0000 0000 0000 0000"
                        className="mt-2"
                        maxLength={19}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiryDate">Validade</Label>
                        <Input
                          id="expiryDate"
                          type="text"
                          value={formData.expiryDate}
                          onChange={(e) => {
                            const formatted = formatExpiryDate(e.target.value);
                            setFormData(prev => ({ ...prev, expiryDate: formatted }));
                          }}
                          placeholder="MM/AA"
                          className="mt-2"
                          maxLength={5}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          type="text"
                          value={formData.cvv}
                          onChange={(e) => setFormData(prev => ({ ...prev, cvv: e.target.value }))}
                          placeholder="123"
                          className="mt-2"
                          maxLength={4}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="cardholderName">Nome no Cartão</Label>
                      <Input
                        id="cardholderName"
                        type="text"
                        value={formData.cardholderName}
                        onChange={(e) => setFormData(prev => ({ ...prev, cardholderName: e.target.value }))}
                        placeholder="Nome como está no cartão"
                        className="mt-2"
                        required
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === 'pix' && (
                  <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                    <div className="flex items-center gap-2 text-primary mb-2">
                      <QrCode className="w-5 h-5" />
                      <span className="font-medium">Pagamento via PIX</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Após clicar em "Finalizar Pagamento", você receberá o QR Code do PIX. 
                      O pagamento é aprovado instantaneamente.
                    </p>
                  </div>
                )}

                {paymentMethod === 'boleto' && (
                  <div className="bg-accent/5 p-4 rounded-lg border border-accent/20">
                    <div className="flex items-center gap-2 text-accent mb-2">
                      <Receipt className="w-5 h-5" />
                      <span className="font-medium">Pagamento via Boleto</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      O boleto será gerado após finalizar o pagamento. 
                      Prazo de pagamento: até 3 dias úteis. Aprovação: 1-3 dias úteis.
                    </p>
                  </div>
                )}

                {/* Documento obrigatório para todos os métodos */}
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label htmlFor="docType">Documento</Label>
                    <select
                      id="docType"
                      value={formData.docType}
                      onChange={(e) => setFormData(prev => ({ ...prev, docType: e.target.value }))}
                      className="w-full px-3 py-2 border border-input rounded-md text-sm mt-2"
                    >
                      <option value="CPF">CPF</option>
                      <option value="CNPJ">CNPJ</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="docNumber">Número</Label>
                    <Input
                      id="docNumber"
                      type="text"
                      value={formData.docNumber}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/\D/g, '');
                        const formatted = formatDocument(raw, formData.docType);
                        setFormData(prev => ({ ...prev, docNumber: formatted }));
                      }}
                      placeholder={formData.docType === 'CPF' ? '000.000.000-00' : '00.000.000/0001-00'}
                      className="mt-2"
                      maxLength={formData.docType === 'CPF' ? 14 : 18}
                      required
                    />
                  </div>
                </div>

                {/* Selos de confiança */}
                <div className="bg-success/5 p-4 rounded-lg border border-success/20">
                  <div className="flex items-center gap-3 mb-3">
                    <img src="/mercadopago-logo.png" alt="MercadoPago" className="h-5" />
                    <div className="flex items-center gap-2 text-sm text-success font-medium">
                      <Shield className="w-4 h-4" />
                      <span>Pagamento 100% seguro</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Lock className="w-3 h-3 text-success" />
                      <span>SSL 256-bit</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-success" />
                      <span>PCI DSS</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="w-3 h-3 text-primary" />
                      <span>Líder LATAM</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-3 h-3 text-primary" />
                      <span>+500M usuários</span>
                    </div>
                  </div>
                </div>

                {/* Garantia */}
                <div className="bg-muted/30 p-4 rounded-lg border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-primary" />
                    <span className="font-medium text-foreground">Garantia de 7 dias</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Satisfação garantida ou seu dinheiro de volta, sem perguntas.
                  </p>
                </div>

                <div className="flex gap-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setStep('info')}
                    className="flex-1"
                  >
                    Voltar
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1" 
                    disabled={isLoading}
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processando...
                      </>
                    ) : (
                      <>
                        {paymentMethod === 'credit_card' && <CreditCard className="w-4 h-4 mr-2" />}
                        {paymentMethod === 'pix' && <QrCode className="w-4 h-4 mr-2" />}
                        {paymentMethod === 'boleto' && <Receipt className="w-4 h-4 mr-2" />}
                        Finalizar Pagamento
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}

            {step === 'pix_pending' && paymentData && (
              <div className="space-y-6 text-center">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <QrCode className="w-8 h-8 text-success" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">PIX Gerado com Sucesso!</h3>
                  <p className="text-muted-foreground">
                    Escaneie o QR Code ou copie o código PIX para realizar o pagamento
                  </p>
                </div>

                {paymentData.qr_code_base64 && (
                  <div className="bg-white p-4 rounded-lg border mx-auto max-w-xs">
                    <img 
                      src={`data:image/png;base64,${paymentData.qr_code_base64}`} 
                      alt="QR Code PIX" 
                      className="w-full"
                    />
                  </div>
                )}

                {paymentData.qr_code && (
                  <div className="space-y-3">
                    <p className="text-sm font-medium">Ou copie o código PIX:</p>
                    <div className="bg-muted p-3 rounded-lg break-all text-sm">
                      {paymentData.qr_code}
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => navigator.clipboard.writeText(paymentData.qr_code)}
                      className="w-full"
                    >
                      Copiar Código PIX
                    </Button>
                  </div>
                )}

                <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                  <p className="text-sm text-muted-foreground">
                    Após o pagamento, o acesso será liberado automaticamente em até 5 minutos.
                  </p>
                </div>

                <Button 
                  variant="outline" 
                  onClick={() => setStep('payment')}
                  className="w-full"
                >
                  Escolher Outra Forma de Pagamento
                </Button>
              </div>
            )}

            {step === 'boleto_pending' && paymentData && (
              <div className="space-y-6 text-center">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Receipt className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Boleto Gerado com Sucesso!</h3>
                  <p className="text-muted-foreground">
                    Clique no link abaixo para visualizar e imprimir seu boleto
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm font-medium mb-2">Vencimento em 3 dias</p>
                    <p className="text-lg font-bold">R$ {paymentData.amount?.toFixed(2)}</p>
                  </div>

                  {paymentData.ticket_url && (
                    <Button 
                      onClick={() => window.open(paymentData.ticket_url, '_blank')}
                      className="w-full"
                      size="lg"
                    >
                      Visualizar e Imprimir Boleto
                    </Button>
                  )}
                </div>

                <div className="bg-accent/5 p-4 rounded-lg border border-accent/20">
                  <p className="text-sm text-muted-foreground">
                    Após o pagamento, o acesso será liberado automaticamente em até 2 dias úteis.
                  </p>
                </div>

                <Button 
                  variant="outline" 
                  onClick={() => setStep('payment')}
                  className="w-full"
                >
                  Escolher Outra Forma de Pagamento
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground mb-4">
            Problemas? Entre em contato pelo email: <strong>suporte@copytrading.com</strong>
          </p>
          
          {/* Selos de confiança rodapé */}
          <div className="flex items-center justify-center gap-8 py-4 border-t border-border">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Shield className="w-4 h-4 text-success" />
              <span>256-bit SSL</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Award className="w-4 h-4 text-primary" />
              <span>Líder LATAM</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Users className="w-4 h-4 text-primary" />
              <span>+500M usuários</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <CheckCircle className="w-4 h-4 text-success" />
              <span>Garantia 7 dias</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}