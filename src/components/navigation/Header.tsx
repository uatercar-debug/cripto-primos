import { Button } from "@/components/ui/button";
import Logo from "@/components/ui/logo";
import { useState, useEffect } from "react";
import { Menu, X, Star } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: "Início", href: "/" },
    { name: "Afiliados", href: "/afiliados" },
    { name: "Área VIP", href: "/area-vip" },
    { name: "Minhas Recomendações", href: "/recomendacoes" },
    { name: "Newsletter", href: "/newsletter" }
  ];

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md border-b border-border shadow-sm' 
        : 'bg-white/80 backdrop-blur-sm border-b border-border/50'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/">
              <Logo size="md" showText={false} />
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`relative px-4 py-2 rounded-lg transition-all duration-200 ${
                  location.pathname === item.href 
                    ? "text-primary font-semibold bg-primary/10" 
                    : "text-foreground hover:text-primary hover:bg-muted"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          
          {/* CTA Button */}
          <div className="hidden md:block">
            <Button 
              onClick={() => navigate('/checkout')}
              size="default"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-md transition-all duration-200"
            >
              <Star className="w-4 h-4 mr-2" />
              Garanta seu acesso
            </Button>
          </div>
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors duration-200"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-6 border-t border-border bg-white/95 backdrop-blur-md">
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`relative px-6 py-3 rounded-lg transition-all duration-200 ${
                    location.pathname === item.href 
                      ? "text-primary font-semibold bg-primary/10" 
                      : "text-foreground hover:text-primary hover:bg-muted"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="px-6 pt-4">
                <Button 
                  onClick={() => {
                    navigate('/checkout');
                    setIsMenuOpen(false);
                  }}
                  size="default" 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-md"
                >
                  <Star className="w-4 h-4 mr-2" />
                  Garanta seu acesso
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;