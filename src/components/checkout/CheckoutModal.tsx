import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CreditCard, Shield, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CheckoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CheckoutModal({ open, onOpenChange }: CheckoutModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'info' | 'payment'>('info');
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
  const { toast } = useToast();

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
    document.head.appendChild(script);
    
    return () => {
      document.head.removeChild(script);
    };
  }, []);

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
    
    if (!formData.cardNumber || !formData.expiryDate || !formData.cvv || !formData.cardholderName || !formData.docNumber) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os dados do cartão.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('Processing MercadoPago payment...');
      
      const { data, error } = await supabase.functions.invoke('process-mercadopago-payment', {
        body: {
          ...formData,
          amount: 29.00
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      console.log('Payment processed successfully:', data);

      if (data.status === 'approved') {
        onOpenChange(false);
        toast({
          title: "Pagamento aprovado!",
          description: "Seu acesso foi liberado. Verifique seu email para mais informações.",
        });
      } else if (data.status === 'pending') {
        onOpenChange(false);
        toast({
          title: "Pagamento em análise",
          description: "Seu pagamento está sendo processado. Você receberá um email em breve.",
        });
      } else {
        throw new Error(data.status_detail || 'Pagamento rejeitado');
      }

    } catch (error) {
      console.error('Error processing payment:', error);
      toast({
        title: "Erro ao processar pagamento",
        description: error.message || "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Finalizar Compra - R$ 29,00
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
          <form onSubmit={handlePaymentSubmit} className="space-y-4">
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
                required
              />
            </div>

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

            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Lock className="w-4 h-4" />
                Pagamento 100% seguro
              </div>
              <p className="text-xs text-muted-foreground">
                Seus dados são protegidos pela criptografia MercadoPago.
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
                  "Finalizar Pagamento"
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}