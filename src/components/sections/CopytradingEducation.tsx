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
  const stats = [{
    icon: <Users className="w-6 h-6" />,
    value: "95%",
    label: "Perdem Dinheiro",
    color: "text-red-500"
  }, {
    icon: <Target className="w-6 h-6" />,
    value: "5%",
    label: "São Lucrativos",
    color: "text-green-500"
  }, {
    icon: <BarChart3 className="w-6 h-6" />,
    value: "3-6 meses",
    label: "Tempo Médio",
    color: "text-blue-500"
  }];
  return <section className="py-24 bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <Badge className="bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
              <TrendingUp className="w-4 h-4 mr-2 text-primary" />
              <span className="text-sm font-medium text-primary">Educação Financeira</span>
            </Badge>
            
            <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-foreground">
              O que é
              <br />
              <span className="text-primary">Copytrading?</span>
            </h2>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Entenda como funciona essa estratégia de investimento e os riscos envolvidos
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Image */}
            <div className={`order-2 lg:order-1 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              <div className="relative group">
                <img src={traderImage} alt="Trader copiando sinais no computador" className="relative w-full h-auto rounded-2xl shadow-lg transform group-hover:scale-105 transition-all duration-500" />
                
                {/* Floating Stats */}
                <div className="absolute -top-6 -right-6 bg-success text-success-foreground px-4 py-2 rounded-full text-sm font-bold shadow-md animate-bounce">
                  <TrendingUp className="w-4 h-4 mr-1 inline" />
                  +127% ROI
                </div>
                <div className="absolute -bottom-6 -left-6 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-bold shadow-md animate-pulse">
                  <Shield className="w-4 h-4 mr-1 inline" />
                  Seguro
                </div>
              </div>
            </div>
            
            {/* Right Content */}
            <div className={`order-1 lg:order-2 space-y-8 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <div className="space-y-6">
                <div className="p-6 rounded-2xl border border-border bg-transparent">
                  <h3 className="text-2xl font-bold text-foreground mb-4">
                    Copytrading é quando você copia automaticamente
                  </h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    operações de traders experientes, replicando suas estratégias em sua própria conta.
                  </p>
                </div>
                
                <div className="p-6 rounded-2xl border border-destructive/20 bg-transparent">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-6 h-6 text-destructive mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-lg font-bold text-destructive mb-2">
                        Realidade Cruel
                      </h4>
                      <p className="text-muted-foreground">
                        <strong className="text-destructive">Apenas 5% dos traders em todo o mundo realmente são lucrativos.</strong> A maioria perde dinheiro.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 rounded-2xl border border-success/20 bg-transparent">
                  <div className="flex items-start gap-3">
                    <Shield className="w-6 h-6 text-success mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-lg font-bold text-success mb-2">
                        Nossa Abordagem
                      </h4>
                      <p className="text-muted-foreground">
                        <strong className="text-success">Entender os riscos e escolher bem é essencial.</strong> Te ensinamos como fazer isso.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4">
                {stats.map((stat, index) => <Card key={index} className="text-center group hover:shadow-card transition-all duration-300 border-border bg-card">
                    <CardContent className="p-4">
                      <div className="flex justify-center mb-2">
                        <div className={`p-3 rounded-full bg-muted group-hover:scale-110 transition-transform duration-300 ${stat.color}`}>
                          {stat.icon}
                        </div>
                      </div>
                      <div className={`text-2xl font-bold mb-1 ${stat.color}`}>{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </CardContent>
                  </Card>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default CopytradingEducation;