import { Button } from "@/components/ui/button";
import { ArrowRight, Clock } from "lucide-react";

const FinalCTA = () => {
  return (
    <section className="py-20 bg-gradient-dark text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Comece hoje a aprender sobre <span className="text-accent-lime">Copytrading</span> de forma realista e consciente
            </h2>
            
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Por apenas <span className="text-accent-lime font-bold text-2xl">R$29</span>, você garante acesso vitalício à área exclusiva.
            </p>
          </div>
          
          <div className="space-y-6">
            <Button 
              variant="cta" 
              size="xl" 
              className="w-full sm:w-auto group"
            >
              <span>Quero meu acesso agora</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <div className="flex items-center justify-center gap-2 text-white/70">
              <Clock className="w-5 h-5" />
              <span className="text-sm">
                Oferta por tempo limitado • Acesso imediato após o pagamento
              </span>
            </div>
          </div>
          
          <div className="mt-12 grid md:grid-cols-3 gap-6 text-center">
            <div className="p-6 bg-white/10 rounded-xl backdrop-blur">
              <h4 className="font-bold mb-2">🔒 Pagamento Seguro</h4>
              <p className="text-sm text-white/80">Mercado Pago com SSL</p>
            </div>
            
            <div className="p-6 bg-white/10 rounded-xl backdrop-blur">
              <h4 className="font-bold mb-2">⚡ Acesso Imediato</h4>
              <p className="text-sm text-white/80">Material disponível na hora</p>
            </div>
            
            <div className="p-6 bg-white/10 rounded-xl backdrop-blur">
              <h4 className="font-bold mb-2">🛡️ Garantia 7 Dias</h4>
              <p className="text-sm text-white/80">Reembolso sem perguntas</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;