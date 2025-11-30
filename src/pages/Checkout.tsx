import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, CreditCard, Lock, ArrowLeft, Shield, CheckCircle, QrCode, Receipt, Award, Users, Gift } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { 
  captureAffiliateRef, 
  getStoredAffiliateRef, 
  registerAffiliateSale,
  isValidAffiliateCode 
} from "@/services/affiliateService";
import SecureCardPayment, { CardPaymentFormData } from "@/components/checkout/SecureCardPayment";

// Gerar ID único para referência externa
const generateExternalReference = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `COPY-${timestamp}-${random}`.toUpperCase();
};

export default function Checkout() {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'info' | 'payment' | 'pix_pending' | 'boleto_pending'>('info');
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'pix' | 'boleto'>('credit_card');
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    docType: "CPF",
    docNumber: ""
  });
  const [paymentData, setPaymentData] = useState<any>(null);
  const [affiliateCode, setAffiliateCode] = useState<string | null>(null);
  const [affiliateValid, setAffiliateValid] = useState(false);
  const externalReference = useRef(generateExternalReference());
  const { toast } = useToast();
  const navigate = useNavigate();

  // Capturar código de afiliado da URL
  useEffect(() => {
    const capturedRef = captureAffiliateRef();
    const storedRef = getStoredAffiliateRef();
    const ref = capturedRef || storedRef;
    
    if (ref) {
      setAffiliateCode(ref);
      // Verificar se é um código válido
      isValidAffiliateCode(ref).then(valid => {
        setAffiliateValid(valid);
        if (valid) {
          console.log('Código de afiliado válido:', ref);
        }
      });
    }
  }, []);

  // Formatação de documento (CPF/CNPJ)
  const formatDocument = (value: string, type: string) => {
    const numbers = value.replace(/\D/g, '');
    if (type === 'CPF') {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else {
      return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
  };

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

  // Handler para pagamento com cartão via Secure Fields (PCI Compliant)
  // Os dados do cartão são tokenizados pelo SDK do MercadoPago - NUNCA passam pelo nosso código
  // O Device ID é gerado automaticamente pelo Card Payment Brick
  const handleSecureCardPayment = async (cardFormData: CardPaymentFormData) => {
    try {
      console.log('Processing SECURE card payment via MercadoPago Brick...');
      console.log('Token received:', cardFormData.token);
      console.log('External reference:', externalReference.current);
      
      // Enviar apenas o TOKEN para o backend - dados sensíveis do cartão nunca tocam nosso servidor
      const { data, error } = await supabase.functions.invoke('process-mercadopago-payment', {
        body: {
          // Token seguro gerado pelo SDK do MercadoPago
          token: cardFormData.token,
          payment_method_id: cardFormData.payment_method_id,
          issuer_id: cardFormData.issuer_id,
          installments: cardFormData.installments,
          transaction_amount: cardFormData.transaction_amount,
          // Dados do pagador
          name: formData.name,
          email: formData.email,
          payer: cardFormData.payer,
          // Flag para indicar que é pagamento com token (PCI compliant)
          isSecurePayment: true,
          // Campos obrigatórios MercadoPago
          external_reference: externalReference.current,
          // Código de afiliado (se houver)
          affiliate_code: affiliateCode
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Erro na comunicação com o servidor');
      }

      console.log('Secure card payment processed:', data);

      if (data.status === 'approved') {
        // Registrar venda do afiliado se houver código
        if (affiliateCode && affiliateValid) {
          await registerAffiliateSale(
            affiliateCode,
            formData.email,
            formData.name,
            data.payment_id || data.id || 'unknown',
            29.90
          );
          console.log('Venda registrada para afiliado:', affiliateCode);
        }
        
        toast({
          title: "Pagamento aprovado! 🎉",
          description: "Seu acesso foi liberado. Redirecionando para área VIP...",
        });
        setTimeout(() => navigate('/area-vip'), 2000);
      } else if (data.status === 'pending' || data.status === 'in_process') {
        toast({
          title: "Pagamento em análise",
          description: "Seu pagamento está sendo processado. Você receberá um email em breve.",
        });
        setTimeout(() => navigate('/'), 3000);
      } else if (data.status === 'rejected') {
        toast({
          title: "Pagamento rejeitado",
          description: data.status_detail || "Tente novamente com outros dados ou escolha outro método de pagamento.",
          variant: "destructive",
        });
      } else {
        throw new Error(data.status_detail || 'Status de pagamento desconhecido');
      }
    } catch (error: any) {
      console.error('Error in secure card payment:', error);
      toast({
        title: "Erro ao processar pagamento",
        description: error.message || "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Handler para pagamento com PIX ou Boleto
  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar campos obrigatórios
    if (!formData.name || !formData.email || !formData.docNumber) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
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
      console.log('Processing PIX/Boleto payment...');
      console.log('External reference:', externalReference.current);
      
      // Para PIX e boleto - incluindo todos os campos obrigatórios do MercadoPago
      const pixBoletoPaymentData = {
        name: formData.name,
        email: formData.email,
        docType: formData.docType,
        docNumber: docClean,
        amount: 29.00,
        paymentMethod: paymentMethod,
        payment_method_id: paymentMethod === 'pix' ? 'pix' : 'bolbradesco',
        // Campos obrigatórios MercadoPago
        external_reference: externalReference.current,
        // Código de afiliado (se houver)
        affiliate_code: affiliateCode
      };

      const { data, error } = await supabase.functions.invoke('process-mercadopago-payment', {
        body: pixBoletoPaymentData
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Erro na comunicação com o servidor');
      }

      console.log('Payment processed successfully:', data);

      // Tratar resposta
      if (data.status === 'approved') {
        if (affiliateCode && affiliateValid) {
          await registerAffiliateSale(
            affiliateCode,
            formData.email,
            formData.name,
            data.payment_id || data.id || 'unknown',
            29.90
          );
        }
        
        toast({
          title: "Pagamento aprovado! 🎉",
          description: "Seu acesso foi liberado. Redirecionando para área VIP...",
        });
        setTimeout(() => navigate('/area-vip'), 2000);
      } else if (data.status === 'redirect_required') {
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

    } catch (error: any) {
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
    <div className="min-h-screen bg-background py-4 sm:py-6 md:py-8">
      <div className="container max-w-2xl mx-auto px-3 sm:px-4">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          
          <div className="text-center mb-4 sm:mb-6 md:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Finalizar Compra</h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Curso Completo de Copytrading - Apenas R$ 29,00
            </p>
            
            {/* Badge de Afiliado */}
            {affiliateCode && affiliateValid && (
              <div className="mt-4 flex items-center justify-center">
                <Badge className="bg-green-500/10 text-green-600 border-green-500/20 px-4 py-2">
                  <Gift className="w-4 h-4 mr-2" />
                  Indicação: {affiliateCode}
                </Badge>
              </div>
            )}
          </div>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              {step === 'info' ? 'Seus Dados' : 'Pagamento Seguro'}
            </CardTitle>
            
            {/* Selo MercadoPago */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 py-3 sm:py-4 px-3 sm:px-4 bg-muted/30 rounded-lg border border-border mt-4">
              <img src="/mercadopago-logo.png" alt="MercadoPago" className="h-5 sm:h-6" />
              <div className="flex items-center gap-3 sm:gap-6 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Shield className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-success" />
                  <span>Seguro</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary" />
                  <span className="hidden xs:inline">+500M usuários</span>
                  <span className="xs:hidden">500M+</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-success" />
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
              <div className="space-y-6">
                {/* Seleção do método de pagamento */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 sm:mb-3 block">Escolha a forma de pagamento</label>
                    <div className="grid grid-cols-3 gap-2 sm:gap-3">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('credit_card')}
                        className={`p-2 sm:p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-1 sm:gap-2 ${
                          paymentMethod === 'credit_card' 
                            ? 'border-primary bg-primary/10' 
                            : 'border-muted hover:border-primary/50'
                        }`}
                      >
                        <CreditCard className="w-5 h-5 sm:w-6 sm:h-6" />
                        <span className="text-xs sm:text-sm font-medium">Cartão</span>
                        <span className="text-[10px] sm:text-xs text-muted-foreground hidden sm:block">Instantâneo</span>
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('pix')}
                        className={`p-2 sm:p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-1 sm:gap-2 ${
                          paymentMethod === 'pix' 
                            ? 'border-primary bg-primary/10' 
                            : 'border-muted hover:border-primary/50'
                        }`}
                      >
                        <QrCode className="w-5 h-5 sm:w-6 sm:h-6" />
                        <span className="text-xs sm:text-sm font-medium">PIX</span>
                        <span className="text-[10px] sm:text-xs text-muted-foreground hidden sm:block">Instantâneo</span>
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('boleto')}
                        className={`p-2 sm:p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-1 sm:gap-2 ${
                          paymentMethod === 'boleto' 
                            ? 'border-primary bg-primary/10' 
                            : 'border-muted hover:border-primary/50'
                        }`}
                      >
                        <Receipt className="w-5 h-5 sm:w-6 sm:h-6" />
                        <span className="text-xs sm:text-sm font-medium">Boleto</span>
                        <span className="text-[10px] sm:text-xs text-muted-foreground hidden sm:block">1-3 dias</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* CARTÃO DE CRÉDITO - Usando Secure Fields (PCI Compliant) */}
                {paymentMethod === 'credit_card' && (
                  <div className="space-y-4">
                    {/* Aviso de segurança PCI */}
                    <div className="bg-success/5 p-3 rounded-lg border border-success/20 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-success" />
                      <span className="text-sm text-success font-medium">
                        Formulário seguro PCI-DSS - Dados protegidos pelo MercadoPago
                      </span>
                    </div>
                    
                    {/* Secure Card Payment Brick - Os dados do cartão são capturados via iframe do MercadoPago */}
                    {/* Isso garante conformidade PCI pois os dados sensíveis nunca passam pelo nosso código */}
                    <SecureCardPayment
                      amount={29.00}
                      onSubmit={handleSecureCardPayment}
                      onError={(error) => {
                        console.error('Card payment error:', error);
                        toast({
                          title: "Erro no formulário",
                          description: "Verifique os dados e tente novamente.",
                          variant: "destructive",
                        });
                      }}
                      payer={{
                        email: formData.email,
                        identification: {
                          type: formData.docType,
                          number: formData.docNumber.replace(/\D/g, ''),
                        },
                      }}
                    />
                    
                    {/* Botão voltar para cartão */}
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setStep('info')}
                      className="w-full"
                    >
                      Voltar
                    </Button>
                  </div>
                )}

                {/* PIX e Boleto - Formulário próprio */}
                {(paymentMethod === 'pix' || paymentMethod === 'boleto') && (
                  <form onSubmit={handlePaymentSubmit} className="space-y-6">
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

                    {/* Documento obrigatório para PIX e Boleto */}
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
                    <div className="bg-success/5 p-3 sm:p-4 rounded-lg border border-success/20">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                        <img src="/mercadopago-logo.png" alt="MercadoPago" className="h-4 sm:h-5" />
                        <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-success font-medium">
                          <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          <span>Pagamento 100% seguro</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 sm:gap-3 text-[10px] sm:text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <Lock className="w-3 h-3 text-success flex-shrink-0" />
                          <span>SSL 256-bit</span>
                        </div>
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <CheckCircle className="w-3 h-3 text-success flex-shrink-0" />
                          <span>PCI DSS</span>
                        </div>
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <Award className="w-3 h-3 text-primary flex-shrink-0" />
                          <span>Líder LATAM</span>
                        </div>
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <Users className="w-3 h-3 text-primary flex-shrink-0" />
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
                            {paymentMethod === 'pix' && <QrCode className="w-4 h-4 mr-2" />}
                            {paymentMethod === 'boleto' && <Receipt className="w-4 h-4 mr-2" />}
                            Finalizar Pagamento
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                )}
              </div>
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
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 md:gap-8 py-4 border-t border-border">
            <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-muted-foreground">
              <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-success" />
              <span>256-bit SSL</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-muted-foreground">
              <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
              <span>Líder LATAM</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-muted-foreground">
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
              <span>+500M</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-muted-foreground">
              <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-success" />
              <span>Garantia 7 dias</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}