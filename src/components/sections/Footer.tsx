import { Separator } from "@/components/ui/separator";

const Footer = () => {
  return (
    <footer className="bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Links */}
          <div className="flex flex-wrap justify-center gap-8 mb-8">
            <a 
              href="/termos" 
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Termos de uso
            </a>
            <a 
              href="/privacidade" 
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Política de privacidade
            </a>
            <a 
              href="/suporte" 
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Suporte
            </a>
          </div>
          
          <Separator className="mb-8" />
          
          {/* Disclaimer */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground italic leading-relaxed max-w-3xl mx-auto">
              Este material tem caráter educativo. Investimentos envolvem riscos e não garantem retornos financeiros. 
              O copytrading é uma modalidade de investimento que pode resultar em perdas. Sempre consulte um profissional 
              qualificado antes de tomar decisões de investimento.
            </p>
          </div>
          
          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground">
              © 2024 Copytrading Descomplicado. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;