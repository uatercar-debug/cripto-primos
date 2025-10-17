import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Lock, Shield, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FinalCTA = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-slate-900 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Comece hoje a aprender sobre <span className="text-primary">Copytrading</span> de forma realista e consciente
            </h2>
            
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Por apenas <span className="font-bold text-3xl">R$29</span>, você garante acesso vitalício à área exclusiva.
            </p>
          </div>
          
          <div className="space-y-6">
            <Button 
              size="lg"
              className="h-14 px-10 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg shadow-lg group"
              onClick={() => navigate('/checkout')}
            >
              <span>Quero meu acesso agora</span>
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <div className="flex items-center justify-center gap-2 text-white/70">
              <Clock className="w-5 h-5" />
              <span className="text-sm">
                Oferta por tempo limitado • Acesso imediato após o pagamento
              </span>
            </div>
          </div>
          
          <div className="mt-12 grid md:grid-cols-3 gap-6 text-center">
            <div className="p-6 bg-white/5 rounded-lg border border-white/10">
              <h4 className="font-bold mb-2 flex items-center justify-center gap-2">
                <Lock className="w-5 h-5" />
                Pagamento Seguro
              </h4>
              <p className="text-sm text-white/70">Mercado Pago com SSL</p>
            </div>
            
            <div className="p-6 bg-white/5 rounded-lg border border-white/10">
              <h4 className="font-bold mb-2 flex items-center justify-center gap-2">
                <Zap className="w-5 h-5" />
                Acesso Imediato
              </h4>
              <p className="text-sm text-white/70">Material disponível na hora</p>
            </div>
            
            <div className="p-6 bg-white/5 rounded-lg border border-white/10">
              <h4 className="font-bold mb-2 flex items-center justify-center gap-2">
                <Shield className="w-5 h-5" />
                Garantia 7 Dias
              </h4>
              <p className="text-sm text-white/70">Reembolso sem perguntas</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;