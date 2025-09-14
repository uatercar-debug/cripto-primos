import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Star, Users, TrendingUp, Shield, Zap, CheckCircle, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import ebookMockup from "@/assets/ebook-mockup.jpg";
import { CheckoutModal } from "@/components/checkout/CheckoutModal";

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const stats = [
    { icon: <Users className="w-5 h-5" />, value: "2.847", label: "Alunos Ativos" },
    { icon: <TrendingUp className="w-5 h-5" />, value: "94.2%", label: "Taxa de Sucesso" },
    { icon: <Star className="w-5 h-5" />, value: "4.9/5", label: "Avaliação" }
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
          {/* Left Content */}
          <div className={`space-y-8 text-center lg:text-left transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400/10 to-orange-500/10 border border-yellow-400/20 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium text-yellow-400">Método Comprovado</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                Aprenda a investir
              </span>
              <br />
              <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                Copiando Estratégias
              </span>
              <br />
              <span className="text-xl md:text-2xl text-white/80 font-normal">
                de Traders profissionais
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed max-w-2xl">
              Descubra como funciona o <strong className="text-yellow-400">Copytrading</strong> e aprenda estratégias que realmente uso para investir pela Exness.
            </p>
            
            <div className="flex flex-wrap gap-4 text-white/80">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>Sem falsas promessas</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-400" />
                <span>Conhecimento prático</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span>Resultados reais</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={() => setCheckoutOpen(true)}
                className="w-full sm:w-auto h-14 px-8 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold text-lg shadow-2xl hover:shadow-yellow-500/25 transition-all duration-300 group"
              >
                <Zap className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                Garantir meu acesso por R$29
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" className="w-full sm:w-auto h-14 px-8 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 text-lg">
                <Users className="w-5 h-5 mr-2" />
                Ver Depoimentos
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="flex justify-center mb-2">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-3 rounded-full group-hover:scale-110 transition-transform duration-300">
                      {stat.icon}
                    </div>
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-white/70 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Right Content */}
          <div className={`flex justify-center lg:justify-end transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="relative group">
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-bounce">
                <TrendingUp className="w-4 h-4 mr-1 inline" />
                +127% Lucro
              </div>
              <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse">
                <Shield className="w-4 h-4 mr-1 inline" />
                Garantia 7 dias
              </div>
              
              <div className="relative">
                <img
                  src={ebookMockup}
                  alt="Ebook Copytrading Descomplicado"
                  className="w-full max-w-md h-auto rounded-2xl shadow-2xl transform group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
              </div>
              
              {/* Glow Effect */}
              <div className="absolute -z-10 top-8 left-8 w-full h-full bg-gradient-to-r from-yellow-400/30 to-orange-500/30 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            </div>
          </div>
        </div>
      </div>
      
      <CheckoutModal 
        open={checkoutOpen} 
        onOpenChange={setCheckoutOpen} 
      />
    </section>
  );
};

export default Hero;