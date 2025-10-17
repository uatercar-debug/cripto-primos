import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Star, Users, TrendingUp, Shield, Zap, CheckCircle, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ebookMockup from "@/assets/ebook-mockup.jpg";

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

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
          {/* Left Content */}
          <div className={`space-y-8 text-center lg:text-left transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-success/10 border border-success/20 rounded-full px-4 py-2 mb-6">
              <CheckCircle className="w-4 h-4 text-success" />
              <span className="text-sm font-medium text-success">Método Comprovado</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-foreground">
              Aprenda a investir
              <br />
              <span className="text-primary">Copiando Estratégias</span>
              <br />
              <span className="text-xl md:text-2xl text-muted-foreground font-normal">
                de Traders profissionais
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl">
              Descubra como funciona o <strong className="text-foreground">Copytrading</strong> e aprenda estratégias que realmente uso para investir pela Exness.
            </p>
            
            <div className="flex flex-wrap gap-4 text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-success" />
                <span>Sem falsas promessas</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                <span>Conhecimento prático</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-accent" />
                <span>Resultados reais</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={() => navigate('/checkout')}
                className="w-full sm:w-auto h-14 px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg shadow-lg transition-all duration-300 group"
              >
                Garantir meu acesso por R$29
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" className="w-full sm:w-auto h-14 px-8 border-2 text-lg">
                <Users className="w-5 h-5 mr-2" />
                Ver Depoimentos
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="flex justify-center mb-2">
                    <div className="bg-primary/10 text-primary p-3 rounded-lg group-hover:bg-primary/20 transition-all duration-300">
                      {stat.icon}
                    </div>
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                  <div className="text-muted-foreground text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Right Content */}
          <div className={`flex justify-center lg:justify-end transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="relative group">
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-success text-success-foreground px-4 py-2 rounded-lg text-sm font-semibold shadow-md">
                <TrendingUp className="w-4 h-4 mr-1 inline" />
                +127% Retorno
              </div>
              <div className="absolute -bottom-4 -left-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold shadow-md">
                <Shield className="w-4 h-4 mr-1 inline" />
                Garantia 7 dias
              </div>
              
              <div className="relative">
                <img
                  src={ebookMockup}
                  alt="Ebook Copytrading Descomplicado"
                  className="w-full max-w-md h-auto rounded-lg shadow-xl transform group-hover:scale-[1.02] transition-all duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;