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
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 bg-success/10 px-6 py-3 rounded-full mb-6">
              <Shield className="w-6 h-6 text-success" />
              <span className="text-success font-semibold">GARANTIA TOTAL</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              Garantia de <span className="text-success">7 dias</span> ou seu dinheiro de volta
            </h2>
            
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Se você aplicar o conteúdo do eBook e não aprender nada novo, ou se por qualquer motivo não ficar satisfeito, 
              eu devolvemos <strong className="text-foreground">100% do seu dinheiro</strong> sem perguntas.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {guaranteeFeatures.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-card transition-all duration-300 border-success/20">
                <CardContent className="p-8">
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                      <feature.icon className="w-8 h-8 text-success" />
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-4 text-foreground">
                    {feature.title}
                  </h3>
                  
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Guarantee Badge */}
          <div className="text-center">
            <div className="inline-block p-8 bg-success/5 rounded-2xl border-2 border-success/20">
              <Shield className="w-20 h-20 text-success mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-success mb-2">
                100% Garantido
              </h3>
              <p className="text-muted-foreground">
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