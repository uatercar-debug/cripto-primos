import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CreditCard, Shield, Lock, QrCode, Receipt } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import SecureCardPayment, { CardPaymentFormData } from "./SecureCardPayment";
import { useNavigate } from "react-router-dom";

// Gerar ID único para referência externa
const generateExternalReference = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `COPY-${timestamp}-${random}`.toUpperCase();
};

interface CheckoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CheckoutModal({ open, onOpenChange }: CheckoutModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'info' | 'payment'>('info');
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'pix' | 'boleto'>('credit_card');
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    docType: "CPF",
    docNumber: ""
  });
  const externalReference = useRef(generateExternalReference());
  const { toast } = useToast();
  const navigate = useNavigate();

  // Formatação de documento
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
  // O Device ID é gerado automaticamente pelo Card Payment Brick
  const handleSecureCardPayment = async (cardFormData: CardPaymentFormData) => {
    try {
      console.log('Processing SECURE card payment via MercadoPago Brick...');
      console.log('External reference:', externalReference.current);
      
      const { data, error } = await supabase.functions.invoke('process-mercadopago-payment', {
        body: {
          token: cardFormData.token,
          payment_method_id: cardFormData.payment_method_id,
          issuer_id: cardFormData.issuer_id,
          installments: cardFormData.installments,
          transaction_amount: cardFormData.transaction_amount,
          name: formData.name,
          email: formData.email,
          payer: cardFormData.payer,
          isSecurePayment: true,
          // Campos obrigatórios MercadoPago
          external_reference: externalReference.current
        }
      });

      if (error) throw new Error(error.message);

      if (data.status === 'approved') {
        onOpenChange(false);
        toast({
          title: "Pagamento aprovado! 🎉",
          description: "Seu acesso foi liberado. Redirecionando...",
        });
        setTimeout(() => navigate('/area-vip'), 2000);
      } else if (data.status === 'pending' || data.status === 'in_process') {
        toast({
          title: "Pagamento em análise",
          description: "Você receberá um email em breve.",
        });
      } else {
        throw new Error(data.status_detail || 'Pagamento rejeitado');
      }
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "Erro ao processar",
        description: error.message || "Tente novamente.",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Handler para PIX/Boleto
  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.docNumber) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, preencha o documento.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const docClean = formData.docNumber.replace(/\D/g, '');
      console.log('Processing PIX/Boleto payment...');
      console.log('External reference:', externalReference.current);
      
      const { data, error } = await supabase.functions.invoke('process-mercadopago-payment', {
        body: {
          name: formData.name,
          email: formData.email,
          docType: formData.docType,
          docNumber: docClean,
          amount: 29.00,
          paymentMethod: paymentMethod,
          payment_method_id: paymentMethod === 'pix' ? 'pix' : 'bolbradesco',
          // Campos obrigatórios MercadoPago
          external_reference: externalReference.current
        }
      });

      if (error) throw error;

      if (data.status === 'approved') {
        onOpenChange(false);
        toast({
          title: "Pagamento aprovado!",
          description: "Seu acesso foi liberado.",
        });
        navigate('/area-vip');
      } else if (data.status === 'redirect_required' && data.init_point) {
        window.location.href = data.init_point;
      } else if (data.status === 'pending') {
        toast({
          title: paymentMethod === 'pix' ? "PIX gerado!" : "Boleto gerado!",
          description: "Complete o pagamento para liberar seu acesso.",
        });
      } else {
        throw new Error(data.status_detail || 'Pagamento rejeitado');
      }

    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full mx-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
            <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Finalizar Compra - R$ 29,00</span>
            <span className="sm:hidden">Compra - R$ 29,00</span>
          </DialogTitle>
        </DialogHeader>
        
        {step === 'info' ? (
          <form onSubmit={handleInfoSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Seu nome completo"
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
                required
              />
            </div>

            <Button type="submit" className="w-full" size="lg">
              Continuar para Pagamento
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            {/* Seleção de método */}
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('credit_card')}
                className={`p-2 sm:p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-0.5 sm:gap-1 ${
                  paymentMethod === 'credit_card' 
                    ? 'border-primary bg-primary/10' 
                    : 'border-muted hover:border-primary/50'
                }`}
              >
                <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-[10px] sm:text-xs font-medium">Cartão</span>
              </button>
              
              <button
                type="button"
                onClick={() => setPaymentMethod('pix')}
                className={`p-2 sm:p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-0.5 sm:gap-1 ${
                  paymentMethod === 'pix' 
                    ? 'border-primary bg-primary/10' 
                    : 'border-muted hover:border-primary/50'
                }`}
              >
                <QrCode className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-[10px] sm:text-xs font-medium">PIX</span>
              </button>
              
              <button
                type="button"
                onClick={() => setPaymentMethod('boleto')}
                className={`p-2 sm:p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-0.5 sm:gap-1 ${
                  paymentMethod === 'boleto' 
                    ? 'border-primary bg-primary/10' 
                    : 'border-muted hover:border-primary/50'
                }`}
              >
                <Receipt className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-[10px] sm:text-xs font-medium">Boleto</span>
              </button>
            </div>

            {/* Cartão - Secure Fields */}
            {paymentMethod === 'credit_card' && (
              <div className="space-y-4">
                <div className="bg-success/5 p-2 rounded-lg border border-success/20 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-success" />
                  <span className="text-xs text-success font-medium">
                    Formulário seguro PCI-DSS
                  </span>
                </div>
                
                <SecureCardPayment
                  amount={29.00}
                  onSubmit={handleSecureCardPayment}
                  onError={(error) => {
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
                      number: formData.docNumber.replace(/\D/g, '') || '00000000000',
                    },
                  }}
                />
                
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

            {/* PIX/Boleto */}
            {(paymentMethod === 'pix' || paymentMethod === 'boleto') && (
              <form onSubmit={handlePaymentSubmit} className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label htmlFor="docType">Documento</Label>
                    <select
                      id="docType"
                      value={formData.docType}
                      onChange={(e) => setFormData(prev => ({ ...prev, docType: e.target.value }))}
                      className="w-full px-3 py-2 border border-input rounded-md text-sm"
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
                      maxLength={formData.docType === 'CPF' ? 14 : 18}
                      required
                    />
                  </div>
                </div>

                <div className="bg-muted/50 p-3 sm:p-4 rounded-lg">
                  <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground mb-1.5 sm:mb-2">
                    <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    Pagamento 100% seguro
                  </div>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">
                    Seus dados são protegidos pelo MercadoPago.
                  </p>
                </div>

                <div className="flex gap-2">
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
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processando...
                      </>
                    ) : (
                      "Finalizar"
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
