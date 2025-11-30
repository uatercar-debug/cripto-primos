import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Star, Users, TrendingUp, Shield, Zap, CheckCircle, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ebookMockup from "@/assets/ebook-cover-new.png";

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const stats = [
    { icon: <Users className="w-5 h-5" />, value: "2.847", label: "Alunos Ativos" },
    { icon: <TrendingUp className="w-5 h-5" />, value: "94.2%", label: "Taxa de Sucesso" },
    { icon: <Star className="w-5 h-5" />, value: "4.9/5", label: "Avaliação" }
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16 lg:py-20 pt-24 sm:pt-28 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center max-w-7xl mx-auto">
          {/* Left Content */}
          <div className={`space-y-8 text-center lg:text-left transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-success/10 border border-success/20 rounded-full px-4 py-2 mb-6">
              <CheckCircle className="w-4 h-4 text-success" />
              <span className="text-sm font-medium text-success">Método Comprovado</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight text-foreground">
              Aprenda a investir
              <br />
              <span className="text-primary">Copiando Estratégias</span>
              <br />
              <span className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground font-normal">
                de Traders profissionais
              </span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-2xl">
              Descubra como funciona o <strong className="text-foreground">Copytrading</strong> e aprenda estratégias que realmente uso para investir pela Exness.
            </p>
            
            <div className="flex flex-wrap gap-3 sm:gap-4 text-muted-foreground justify-center lg:justify-start">
              <div className="flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-success flex-shrink-0" />
                <span>Sem falsas promessas</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                <span>Conhecimento prático</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-accent flex-shrink-0" />
                <span>Resultados reais</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button 
                onClick={() => navigate('/checkout')}
                className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base sm:text-lg shadow-lg transition-all duration-300 group"
              >
                <span className="hidden sm:inline">Garantir meu acesso por R$29</span>
                <span className="sm:hidden">Garantir acesso - R$29</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-8 border-2 text-base sm:text-lg">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Ver Depoimentos
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6 pt-6 sm:pt-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="flex justify-center mb-1 sm:mb-2">
                    <div className="bg-primary/10 text-primary p-2 sm:p-3 rounded-lg group-hover:bg-primary/20 transition-all duration-300">
                      <div className="w-4 h-4 sm:w-5 sm:h-5">{stat.icon}</div>
                    </div>
                  </div>
                  <div className="text-lg sm:text-2xl md:text-3xl font-bold text-foreground mb-0.5 sm:mb-1">{stat.value}</div>
                  <div className="text-muted-foreground text-xs sm:text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Right Content */}
          <div className={`flex justify-center lg:justify-end transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="relative group max-w-xs sm:max-w-sm md:max-w-md">
              {/* Floating Elements - Hidden on very small screens, adjusted on others */}
              <div className="hidden sm:block absolute -top-2 sm:-top-4 -right-2 sm:-right-4 bg-success text-success-foreground px-2 sm:px-4 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold shadow-md z-10">
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1 inline" />
                +127% Retorno
              </div>
              <div className="hidden sm:block absolute -bottom-2 sm:-bottom-4 -left-2 sm:-left-4 bg-primary text-primary-foreground px-2 sm:px-4 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold shadow-md z-10">
                <Shield className="w-3 h-3 sm:w-4 sm:h-4 mr-1 inline" />
                Garantia 7 dias
              </div>
              
              <div className="relative">
                <img
                  src={ebookMockup}
                  alt="Ebook Copytrading Descomplicado"
                  className="w-full h-auto rounded-lg shadow-xl transform group-hover:scale-[1.02] transition-all duration-300"
                />
              </div>
              
              {/* Mobile badges below image */}
              <div className="flex sm:hidden justify-center gap-2 mt-4">
                <div className="bg-success text-success-foreground px-3 py-1.5 rounded-lg text-xs font-semibold shadow-md">
                  <TrendingUp className="w-3 h-3 mr-1 inline" />
                  +127% Retorno
                </div>
                <div className="bg-primary text-primary-foreground px-3 py-1.5 rounded-lg text-xs font-semibold shadow-md">
                  <Shield className="w-3 h-3 mr-1 inline" />
                  Garantia 7 dias
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;