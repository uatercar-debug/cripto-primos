import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Header from "@/components/navigation/Header";
import Logo from "@/components/ui/logo";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <Header />
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="mb-8">
            <div className="flex justify-center mb-6">
                          <Logo size="lg" showText={false} />
            </div>
            <h1 className="text-8xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
              404
            </h1>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Página não encontrada
            </h2>
            <p className="text-muted-foreground mb-8">
              Oops! A página que você está procurando não existe ou foi movida.
            </p>
          </div>
          
          <div className="space-y-4">
            <Button asChild className="w-full">
              <Link to="/">
                <Home className="w-4 h-4 mr-2" />
                Voltar ao Início
              </Link>
            </Button>
            
            <Button variant="outline" onClick={() => window.history.back()} className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Página Anterior
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground mt-8">
            Se você acredita que isso é um erro, entre em contato conosco.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
