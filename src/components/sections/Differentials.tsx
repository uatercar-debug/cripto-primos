import { Card, CardContent } from "@/components/ui/card";
import { Check, Shield } from "lucide-react";

const differentials = [
  "Sem promessas irreais",
  "Acesso vitalício ao material", 
  "Explicações claras e traduzidas para o dia a dia",
  "Pagamento 100% seguro via Mercado Pago"
];

const Differentials = () => {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-background">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-foreground">
              Por que escolher nosso <span className="text-primary">conteúdo?</span>
            </h2>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 items-start">
            {/* Left - Differentials */}
            <div className="lg:col-span-2 space-y-3 sm:space-y-4 md:space-y-6">
              {differentials.map((differential, index) => (
                <div key={index} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-success flex items-center justify-center">
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                  </div>
                  <p className="text-sm sm:text-base md:text-lg font-medium text-foreground">
                    {differential}
                  </p>
                </div>
              ))}
            </div>
            
            {/* Right - Price Box */}
            <div className="lg:col-span-1 mt-4 lg:mt-0">
              <Card className="border-primary/20 shadow-card">
                <CardContent className="p-4 sm:p-6 md:p-8 text-center">
                  <div className="mb-4 sm:mb-6">
                    <Shield className="w-10 h-10 sm:w-12 sm:h-12 text-primary mx-auto mb-3 sm:mb-4" />
                    <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-1 sm:mb-2">
                      Preço único
                    </h3>
                    <div className="text-3xl sm:text-4xl font-bold text-primary mb-1 sm:mb-2">
                      R$29
                    </div>
                  </div>
                  
                  <div className="space-y-2 sm:space-y-3 text-left">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 text-success flex-shrink-0" />
                      <span className="text-sm sm:text-base text-muted-foreground">Sem mensalidades</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 text-success flex-shrink-0" />
                      <span className="text-sm sm:text-base text-muted-foreground">Sem taxas escondidas</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Differentials;