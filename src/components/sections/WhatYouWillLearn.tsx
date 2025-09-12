import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Users, Shield, Brain, PlayCircle } from "lucide-react";

const learningCards = [
  {
    icon: TrendingUp,
    title: "Alavancagem",
    description: "O que é e como usar com cautela."
  },
  {
    icon: TrendingDown,
    title: "Drawdown",
    description: "Como medir os riscos de cada estratégia."
  },
  {
    icon: Users,
    title: "Analisar Traders",
    description: "Passo a passo para escolher os melhores."
  },
  {
    icon: Shield,
    title: "Stop Loss Automático",
    description: "Proteção garantida na Exness."
  },
  {
    icon: Brain,
    title: "Estratégias Reais",
    description: "As mesmas que eu aplico no meu portfólio."
  },
  {
    icon: PlayCircle,
    title: "Conta Demo",
    description: "Treine sem arriscar dinheiro de verdade."
  }
];

const WhatYouWillLearn = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              O que você vai <span className="text-primary">aprender</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Conhecimento prático e estratégias reais para copytrading seguro
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {learningCards.map((card, index) => (
              <Card key={index} className="group hover:shadow-card transition-all duration-300 hover:-translate-y-2 border-border/50">
                <CardContent className="p-8 text-center">
                  <div className="mb-6 flex justify-center">
                    <div className="p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <card.icon className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-4 text-foreground">
                    {card.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    {card.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatYouWillLearn;