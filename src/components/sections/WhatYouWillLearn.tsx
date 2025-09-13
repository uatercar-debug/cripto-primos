import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Users, Shield, Brain, PlayCircle, BookOpen, Zap, Target, CheckCircle, Star, Award } from "lucide-react";
import { useState, useEffect } from "react";

const learningCards = [
  {
    icon: TrendingUp,
    title: "Alavancagem",
    description: "O que é e como usar com cautela para maximizar ganhos sem arriscar demais.",
    color: "from-blue-500 to-cyan-500",
    badge: "Fundamental"
  },
  {
    icon: TrendingDown,
    title: "Drawdown",
    description: "Como medir os riscos de cada estratégia e proteger seu capital.",
    color: "from-red-500 to-pink-500",
    badge: "Crítico"
  },
  {
    icon: Users,
    title: "Analisar Traders",
    description: "Passo a passo para escolher os melhores traders e evitar golpes.",
    color: "from-green-500 to-emerald-500",
    badge: "Essencial"
  },
  {
    icon: Shield,
    title: "Stop Loss Automático",
    description: "Proteção garantida na Exness e como configurar corretamente.",
    color: "from-purple-500 to-indigo-500",
    badge: "Segurança"
  },
  {
    icon: Brain,
    title: "Estratégias Reais",
    description: "As mesmas estratégias que eu aplico no meu portfólio pessoal.",
    color: "from-orange-500 to-yellow-500",
    badge: "Exclusivo"
  },
  {
    icon: PlayCircle,
    title: "Conta Demo",
    description: "Treine sem arriscar dinheiro de verdade e ganhe experiência.",
    color: "from-pink-500 to-rose-500",
    badge: "Prático"
  }
];

const WhatYouWillLearn = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="py-24 bg-gradient-to-br from-slate-50 via-white to-purple-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <Badge className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-200/20 rounded-full px-4 py-2 mb-6">
              <BookOpen className="w-4 h-4 mr-2 text-purple-600" />
              <span className="text-sm font-medium text-purple-700">Conteúdo Exclusivo</span>
            </Badge>
            
            <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-slate-900 via-purple-900 to-pink-900 dark:from-white dark:via-purple-100 dark:to-pink-100 bg-clip-text text-transparent">
                O que você vai
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent">
                aprender
              </span>
            </h2>
            
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed">
              Conhecimento prático e estratégias reais para copytrading seguro e lucrativo
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {learningCards.map((card, index) => (
              <div
                key={index}
                className={`transition-all duration-1000 delay-${index * 100} ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
              >
                <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm overflow-hidden">
                  <CardContent className="p-8 text-center relative">
                    {/* Background Gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-5 group-hover:opacity-10 transition-opacity duration-500`}></div>
                    
                    <div className="relative z-10">
                      <div className="mb-6 flex justify-center">
                        <div className={`p-4 rounded-2xl bg-gradient-to-r ${card.color} group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                          <card.icon className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      
                      <div className="flex justify-center mb-4">
                        <Badge className={`bg-gradient-to-r ${card.color} text-white border-0`}>
                          {card.badge}
                        </Badge>
                      </div>
                      
                      <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {card.title}
                      </h3>
                      
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">
                        {card.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className={`text-center mt-16 transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-8 border border-purple-200/20">
              <div className="flex justify-center mb-4">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-2xl">
                  <Award className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Conteúdo 100% Prático
                </span>
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-lg max-w-2xl mx-auto">
                Tudo que você precisa saber para começar a investir com segurança e lucratividade no copytrading.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatYouWillLearn;