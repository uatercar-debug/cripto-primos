import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

const Footer = () => {
  return (
    <footer className="bg-background py-4 sm:py-6">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="max-w-4xl mx-auto">
          {/* Links */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-4">
            <Link 
              to="/termos" 
              className="text-muted-foreground hover:text-primary transition-colors text-sm"
            >
              Termos de uso
            </Link>
            <Link 
              to="/privacidade" 
              className="text-muted-foreground hover:text-primary transition-colors text-sm"
            >
              Privacidade
            </Link>
            <Link 
              to="/suporte" 
              className="text-muted-foreground hover:text-primary transition-colors text-sm"
            >
              Suporte
            </Link>
          </div>
          
          <Separator className="mb-4" />
          
          {/* Disclaimer */}
          <div className="text-center mb-3">
            <p className="text-[10px] sm:text-xs text-muted-foreground italic leading-relaxed max-w-3xl mx-auto px-2">
              Este material tem caráter educativo. Investimentos envolvem riscos e não garantem retornos financeiros. 
              O copytrading é uma modalidade de investimento que pode resultar em perdas. Sempre consulte um profissional 
              qualificado antes de tomar decisões de investimento.
            </p>
          </div>
          
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              © 2024 Copytrading Descomplicado. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;