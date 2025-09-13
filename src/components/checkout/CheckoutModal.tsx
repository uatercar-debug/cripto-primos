import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CreditCard, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CheckoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CheckoutModal({ open, onOpenChange }: CheckoutModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: ""
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha nome e email.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('Creating MercadoPago payment...');
      
      const { data, error } = await supabase.functions.invoke('create-mercadopago-payment', {
        body: {
          name: formData.name,
          email: formData.email
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      console.log('Payment created successfully:', data);

      // Redirecionar para o MercadoPago
      if (data.initPoint) {
        window.open(data.initPoint, '_blank');
        onOpenChange(false);
        toast({
          title: "Redirecionamento para pagamento",
          description: "Você será redirecionado para o MercadoPago para finalizar o pagamento.",
        });
      }

    } catch (error) {
      console.error('Error creating payment:', error);
      toast({
        title: "Erro ao processar pagamento",
        description: "Tente novamente em alguns instantes.",
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
        
        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Shield className="w-4 h-4" />
              Pagamento 100% seguro
            </div>
            <p className="text-xs text-muted-foreground">
              Você será redirecionado para o MercadoPago para finalizar o pagamento com total segurança.
            </p>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processando...
              </>
            ) : (
              "Pagar com MercadoPago"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}