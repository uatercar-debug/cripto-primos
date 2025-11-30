import { useEffect, useState, useCallback } from "react";
import { initMercadoPago, CardPayment } from "@mercadopago/sdk-react";
import { Loader2 } from "lucide-react";

// Tipos para o Card Payment Brick
interface CardPaymentProps {
  amount: number;
  onSubmit: (formData: CardPaymentFormData) => Promise<void>;
  onError?: (error: Error) => void;
  onReady?: () => void;
  payer: {
    email: string;
    identification: {
      type: string;
      number: string;
    };
  };
}

export interface CardPaymentFormData {
  token: string;
  issuer_id: string;
  payment_method_id: string;
  transaction_amount: number;
  installments: number;
  payer: {
    email: string;
    identification: {
      type: string;
      number: string;
    };
  };
}

// Inicialização do MercadoPago SDK
// A PUBLIC_KEY DEVE ser configurada em VITE_MERCADOPAGO_PUBLIC_KEY
const MERCADOPAGO_PUBLIC_KEY = import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY;

// Armazenar a chave usada para detectar mudanças
let sdkInitialized = false;
let initializedWithKey: string | null = null;

export function SecureCardPayment({
  amount,
  onSubmit,
  onError,
  onReady,
  payer,
}: CardPaymentProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Inicializar o SDK apenas uma vez
  useEffect(() => {
    // Verificar se a PUBLIC_KEY está configurada
    if (!MERCADOPAGO_PUBLIC_KEY) {
      console.error("VITE_MERCADOPAGO_PUBLIC_KEY não está configurada no .env");
      setError("Chave do MercadoPago não configurada. Configure VITE_MERCADOPAGO_PUBLIC_KEY no arquivo .env");
      setIsLoading(false);
      return;
    }

    // Inicializar apenas se não foi inicializado ou se a chave mudou
    if (!sdkInitialized || initializedWithKey !== MERCADOPAGO_PUBLIC_KEY) {
      try {
        initMercadoPago(MERCADOPAGO_PUBLIC_KEY, {
          locale: "pt-BR",
        });
        sdkInitialized = true;
        initializedWithKey = MERCADOPAGO_PUBLIC_KEY;
        console.log("MercadoPago SDK initialized with key:", MERCADOPAGO_PUBLIC_KEY.substring(0, 20) + "...");
      } catch (err) {
        console.error("Error initializing MercadoPago SDK:", err);
        setError("Erro ao inicializar sistema de pagamento. Verifique se a PUBLIC_KEY está correta.");
        if (onError) onError(err as Error);
      }
    }
  }, [onError]);

  // Callback quando o Card Payment Brick está pronto
  const handleReady = useCallback(() => {
    setIsLoading(false);
    console.log("Card Payment Brick ready - PCI Compliant");
    if (onReady) onReady();
  }, [onReady]);

  // Callback quando ocorre erro no Brick
  const handleError = useCallback(
    (error: Error) => {
      console.error("Card Payment Brick error:", error);
      setError("Erro no formulário de pagamento");
      setIsLoading(false);
      if (onError) onError(error);
    },
    [onError]
  );

  // Callback quando o formulário é submetido
  // Os dados do cartão são tokenizados pelo SDK - NUNCA passam pelo nosso código
  const handleSubmit = useCallback(
    async (formData: CardPaymentFormData) => {
      try {
        setIsProcessing(true);
        setError(null);
        
        console.log("Card Payment submitted - Token received:", formData.token);
        console.log("Payment method:", formData.payment_method_id);
        
        // O formData já contém o TOKEN seguro - dados do cartão nunca tocam nosso código
        await onSubmit(formData);
      } catch (err) {
        console.error("Error processing card payment:", err);
        setError((err as Error).message || "Erro ao processar pagamento");
        if (onError) onError(err as Error);
      } finally {
        setIsProcessing(false);
      }
    },
    [onSubmit, onError]
  );

  if (error && !isLoading) {
    return (
      <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
        <p className="text-sm text-destructive">{error}</p>
        <button
          onClick={() => {
            setError(null);
            setIsLoading(true);
          }}
          className="mt-2 text-sm underline text-muted-foreground hover:text-foreground"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10 rounded-lg">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Carregando formulário seguro...</span>
          </div>
        </div>
      )}

      {/* Processing state */}
      {isProcessing && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/90 z-20 rounded-lg">
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="font-medium">Processando pagamento seguro...</span>
            <span className="text-xs">Não feche esta página</span>
          </div>
        </div>
      )}

      {/* Card Payment Brick - Secure Fields do MercadoPago */}
      {/* Os campos de cartão são renderizados via iframe diretamente do MercadoPago */}
      {/* Isso garante conformidade PCI DSS pois os dados sensíveis nunca tocam nosso código */}
      <div className={`min-h-[400px] ${isLoading ? "opacity-0" : "opacity-100"} transition-opacity`}>
        <CardPayment
          initialization={{
            amount: amount,
            payer: {
              email: payer.email,
              identification: {
                type: payer.identification.type,
                number: payer.identification.number,
              },
            },
          }}
          customization={{
            visual: {
              style: {
                theme: "default",
              },
              hideFormTitle: true,
              hidePaymentButton: false,
            },
            paymentMethods: {
              maxInstallments: 12,
              minInstallments: 1,
            },
          }}
          onSubmit={handleSubmit}
          onReady={handleReady}
          onError={handleError}
        />
      </div>
    </div>
  );
}

export default SecureCardPayment;

