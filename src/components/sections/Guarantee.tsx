import { Card, CardContent } from "@/components/ui/card";
import { Shield, Clock, CheckCircle, RefreshCw } from "lucide-react";

const guaranteeFeatures = [
  {
    icon: Clock,
    title: "7 Dias Completos",
    description: "Tempo suficiente para testar todo o conteúdo"
  },
  {
    icon: CheckCircle,
    title: "Sem Perguntas", 
    description: "Reembolso simples e rápido"
  },
  {
    icon: RefreshCw,
    title: "Risco Zero",
    description: "Seu investimento está protegido"
  }
];

const Guarantee = () => {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-background">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 sm:gap-3 bg-success/10 px-4 sm:px-6 py-2 sm:py-3 rounded-full mb-4 sm:mb-6">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-success" />
              <span className="text-success font-semibold text-sm sm:text-base">GARANTIA TOTAL</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-foreground px-2">
              Garantia de <span className="text-success">7 dias</span> ou seu dinheiro de volta
            </h2>
            
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed px-2">
              Se você aplicar o conteúdo do eBook e não aprender nada novo, ou se por qualquer motivo não ficar satisfeito, 
              eu devolvemos <strong className="text-foreground">100% do seu dinheiro</strong> sem perguntas.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-10 md:mb-12">
            {guaranteeFeatures.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-card transition-all duration-300 border-success/20">
                <CardContent className="p-4 sm:p-6 md:p-8">
                  <div className="mb-3 sm:mb-4 md:mb-6">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                      <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-success" />
                    </div>
                  </div>
                  
                  <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3 md:mb-4 text-foreground">
                    {feature.title}
                  </h3>
                  
                  <p className="text-sm sm:text-base text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Guarantee Badge */}
          <div className="text-center">
            <div className="inline-block p-4 sm:p-6 md:p-8 bg-success/5 rounded-xl sm:rounded-2xl border-2 border-success/20">
              <Shield className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-success mx-auto mb-2 sm:mb-3 md:mb-4" />
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-success mb-1 sm:mb-2">
                100% Garantido
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Sua satisfação é nossa prioridade
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Guarantee;