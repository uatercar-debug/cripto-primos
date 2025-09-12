import { Button } from "@/components/ui/button";
import ebookMockup from "@/assets/ebook-mockup.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-hero overflow-hidden">
      <div className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          {/* Left Content */}
          <div className="space-y-8 text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white">
              Aprenda a investir{" "}
              <span className="text-accent-lime">Copiando Estratégias</span>{" "}
              de Traders profissionais de forma segura e sem falsas promessas
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed max-w-2xl">
              Descubra como funciona o Copytrading e aprenda estratégias que realmente uso para investir pela Exness. 
              Sou um dos primeiros brasileiros a divulgar essa plataforma, que muito renomada no exterior.
            </p>
            
            <p className="text-lg text-white/80 max-w-2xl">
              Nada de promessas irreais, apenas conhecimento prático e transparente.
            </p>
            
            <Button variant="cta" size="xl" className="w-full sm:w-auto">
              Garantir meu acesso à Área VIP + Ebook por R$29
            </Button>
          </div>
          
          {/* Right Content */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <img
                src={ebookMockup}
                alt="Ebook Copytrading Descomplicado"
                className="w-full max-w-md h-auto rounded-xl shadow-cta transform hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute -z-10 top-8 left-8 w-full h-full bg-accent-lime/20 rounded-xl blur-xl"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-accent-lime/20 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
    </section>
  );
};

export default Hero;