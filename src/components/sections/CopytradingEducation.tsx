import traderImage from "@/assets/trader-computer.jpg";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, AlertTriangle, Shield, Target, Users, BarChart3 } from "lucide-react";
import { useState, useEffect } from "react";

const CopytradingEducation = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    { icon: <Users className="w-6 h-6" />, value: "95%", label: "Perdem Dinheiro", color: "text-red-500" },
    { icon: <Target className="w-6 h-6" />, value: "5%", label: "São Lucrativos", color: "text-green-500" },
    { icon: <BarChart3 className="w-6 h-6" />, value: "3-6 meses", label: "Tempo Médio", color: "text-blue-500" }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <Badge className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200/20 rounded-full px-4 py-2 mb-6">
              <TrendingUp className="w-4 h-4 mr-2 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Educação Financeira</span>
            </Badge>
            
            <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 dark:from-white dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent">
                O que é
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Copytrading?
              </span>
            </h2>
            
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed">
              Entenda como funciona essa estratégia de investimento e os riscos envolvidos
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Image */}
            <div className={`order-2 lg:order-1 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
                <img
                  src={traderImage}
                  alt="Trader copiando sinais no computador"
                  className="relative w-full h-auto rounded-2xl shadow-2xl transform group-hover:scale-105 transition-all duration-500"
                />
                
                {/* Floating Stats */}
                <div className="absolute -top-6 -right-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-bounce">
                  <TrendingUp className="w-4 h-4 mr-1 inline" />
                  +127% ROI
                </div>
                <div className="absolute -bottom-6 -left-6 bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse">
                  <Shield className="w-4 h-4 mr-1 inline" />
                  Seguro
                </div>
              </div>
            </div>
            
            {/* Right Content */}
            <div className={`order-1 lg:order-2 space-y-8 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-2xl border border-blue-200/20">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Copytrading é quando você copia automaticamente
                    </span>
                  </h3>
                  <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                    operações de traders experientes, replicando suas estratégias em sua própria conta.
                  </p>
                </div>
                
                <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 p-6 rounded-2xl border border-red-200/20">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-6 h-6 text-red-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-lg font-bold text-red-700 dark:text-red-300 mb-2">
                        Realidade Cruel
                      </h4>
                      <p className="text-slate-600 dark:text-slate-300">
                        <strong className="text-red-600 dark:text-red-400">Apenas 5% dos traders em todo o mundo realmente são lucrativos.</strong> A maioria perde dinheiro.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-2xl border border-green-200/20">
                  <div className="flex items-start gap-3">
                    <Shield className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-lg font-bold text-green-700 dark:text-green-300 mb-2">
                        Nossa Abordagem
                      </h4>
                      <p className="text-slate-600 dark:text-slate-300">
                        <strong className="text-green-600 dark:text-green-400">Entender os riscos e escolher bem é essencial.</strong> Te ensinamos como fazer isso.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4">
                {stats.map((stat, index) => (
                  <Card key={index} className="text-center group hover:shadow-lg transition-all duration-300 border-0 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
                    <CardContent className="p-4">
                      <div className="flex justify-center mb-2">
                        <div className={`p-3 rounded-full bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 group-hover:scale-110 transition-transform duration-300 ${stat.color}`}>
                          {stat.icon}
                        </div>
                      </div>
                      <div className={`text-2xl font-bold mb-1 ${stat.color}`}>{stat.value}</div>
                      <div className="text-sm text-slate-600 dark:text-slate-300">{stat.label}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CopytradingEducation;