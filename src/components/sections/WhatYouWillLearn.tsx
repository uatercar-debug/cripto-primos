import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Users, Shield, Brain, PlayCircle, BookOpen, Zap, Target, CheckCircle, Star, Award } from "lucide-react";
import { useState, useEffect } from "react";
const learningCards = [{
  icon: TrendingUp,
  title: "Alavancagem",
  description: "O que é e como usar com cautela para maximizar ganhos sem arriscar demais.",
  color: "from-blue-500 to-cyan-500",
  badge: "Fundamental"
}, {
  icon: TrendingDown,
  title: "Drawdown",
  description: "Como medir os riscos de cada estratégia e proteger seu capital.",
  color: "from-red-500 to-pink-500",
  badge: "Crítico"
}, {
  icon: Users,
  title: "Analisar Traders",
  description: "Passo a passo para escolher os melhores traders e evitar golpes.",
  color: "from-green-500 to-emerald-500",
  badge: "Essencial"
}, {
  icon: Shield,
  title: "Stop Loss Automático",
  description: "Proteção garantida na Exness e como configurar corretamente.",
  color: "from-purple-500 to-indigo-500",
  badge: "Segurança"
}, {
  icon: Brain,
  title: "Estratégias Reais",
  description: "As mesmas estratégias que eu aplico no meu portfólio pessoal.",
  color: "from-orange-500 to-yellow-500",
  badge: "Exclusivo"
}, {
  icon: PlayCircle,
  title: "Conta Demo",
  description: "Treine sem arriscar dinheiro de verdade e ganhe experiência.",
  color: "from-pink-500 to-rose-500",
  badge: "Prático"
}];
const WhatYouWillLearn = () => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 400);
    return () => clearTimeout(timer);
  }, []);
  return <section className="py-24 bg-muted/30 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <Badge className="bg-accent/10 border border-accent/20 rounded-full px-4 py-2 mb-6">
              <BookOpen className="w-4 h-4 mr-2 text-accent" />
              <span className="text-sm font-medium text-accent">Conteúdo Exclusivo</span>
            </Badge>
            
            <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-foreground">
              O que você vai
              <br />
              <span className="text-primary">aprender</span>
            </h2>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Conhecimento prático e estratégias reais para copytrading seguro e lucrativo
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {learningCards.map((card, index) => <div key={index} className={`transition-all duration-1000 delay-${index * 100} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <Card className="group hover:shadow-card transition-all duration-500 hover:-translate-y-4 border-border bg-card overflow-hidden">
                  <CardContent className="p-8 text-center relative">
                    <div className="relative z-10">
                      <div className="mb-6 flex justify-center">
                        <div className="p-4 rounded-2xl group-hover:scale-110 transition-all duration-300 shadow-md bg-rose-600">
                          <card.icon className="w-8 h-8 text-primary-foreground" />
                        </div>
                      </div>
                      
                      <div className="flex justify-center mb-4">
                        <Badge className="bg-primary text-primary-foreground border-0">
                          {card.badge}
                        </Badge>
                      </div>
                      
                      <h3 className="text-xl font-bold mb-4 text-foreground group-hover:text-primary transition-colors">
                        {card.title}
                      </h3>
                      
                      <p className="text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors">
                        {card.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>)}
          </div>

          {/* Bottom CTA */}
          <div className={`text-center mt-16 transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="bg-muted/50 rounded-2xl p-8 border border-border">
              <div className="flex justify-center mb-4">
                <div className="bg-primary p-4 rounded-2xl">
                  <Award className="w-8 h-8 text-primary-foreground" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Conteúdo 100% Prático
              </h3>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Tudo que você precisa saber para começar a investir com segurança e lucratividade no copytrading.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default WhatYouWillLearn;