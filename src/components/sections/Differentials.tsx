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
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              Por que escolher nosso <span className="text-primary">conteúdo?</span>
            </h2>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            {/* Left - Differentials */}
            <div className="lg:col-span-2 space-y-6">
              {differentials.map((differential, index) => (
                <div key={index} className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-success flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <p className="text-lg font-medium text-foreground">
                    {differential}
                  </p>
                </div>
              ))}
            </div>
            
            {/* Right - Price Box */}
            <div className="lg:col-span-1">
              <Card className="border-primary/20 shadow-card">
                <CardContent className="p-8 text-center">
                  <div className="mb-6">
                    <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-foreground mb-2">
                      Preço único
                    </h3>
                    <div className="text-4xl font-bold text-primary mb-2">
                      R$29
                    </div>
                  </div>
                  
                  <div className="space-y-3 text-left">
                    <div className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-success" />
                      <span className="text-muted-foreground">Sem mensalidades</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-success" />
                      <span className="text-muted-foreground">Sem taxas escondidas</span>
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