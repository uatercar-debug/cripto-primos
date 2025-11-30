import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Lock, Shield, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FinalCTA = () => {
  const navigate = useNavigate();

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-slate-900 text-white">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 px-2">
              Comece hoje a aprender sobre <span className="text-primary">Copytrading</span> de forma realista e consciente
            </h2>
            
            <p className="text-base sm:text-lg md:text-xl text-white/90 mb-6 sm:mb-8 leading-relaxed px-2">
              Por apenas <span className="font-bold text-xl sm:text-2xl md:text-3xl">R$29</span>, você garante acesso vitalício à área exclusiva.
            </p>
          </div>
          
          <div className="space-y-4 sm:space-y-6">
            <Button 
              size="lg"
              className="h-12 sm:h-14 px-6 sm:px-8 md:px-10 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base sm:text-lg shadow-lg group w-full sm:w-auto"
              onClick={() => navigate('/checkout')}
            >
              <span className="hidden sm:inline">Quero meu acesso agora</span>
              <span className="sm:hidden">Quero meu acesso</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-white/70">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-sm text-center">
                Oferta por tempo limitado • Acesso imediato após o pagamento
              </span>
            </div>
          </div>
          
          <div className="mt-8 sm:mt-10 md:mt-12 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6 text-center">
            <div className="p-4 sm:p-5 md:p-6 bg-white/5 rounded-lg border border-white/10">
              <h4 className="font-bold mb-1 sm:mb-2 flex items-center justify-center gap-1.5 sm:gap-2 text-sm sm:text-base">
                <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
                Pagamento Seguro
              </h4>
              <p className="text-xs sm:text-sm text-white/70">Mercado Pago com SSL</p>
            </div>
            
            <div className="p-4 sm:p-5 md:p-6 bg-white/5 rounded-lg border border-white/10">
              <h4 className="font-bold mb-1 sm:mb-2 flex items-center justify-center gap-1.5 sm:gap-2 text-sm sm:text-base">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                Acesso Imediato
              </h4>
              <p className="text-xs sm:text-sm text-white/70">Material disponível na hora</p>
            </div>
            
            <div className="p-4 sm:p-5 md:p-6 bg-white/5 rounded-lg border border-white/10">
              <h4 className="font-bold mb-1 sm:mb-2 flex items-center justify-center gap-1.5 sm:gap-2 text-sm sm:text-base">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
                Garantia 7 Dias
              </h4>
              <p className="text-xs sm:text-sm text-white/70">Reembolso sem perguntas</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;