import { Button } from "@/components/ui/button";
import Logo from "@/components/ui/logo";
import { useState, useEffect } from "react";
import { Menu, X, Sparkles, Star } from "lucide-react";
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
        ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-700/50 shadow-lg' 
        : 'bg-gradient-to-r from-white/90 via-slate-50/90 to-white/90 dark:from-slate-900/90 dark:via-slate-800/90 dark:to-slate-900/90 backdrop-blur-sm border-b border-slate-200/30 dark:border-slate-700/30'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="group">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Logo size="md" showText={false} />
                  <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Sparkles className="w-5 h-5 text-yellow-500 animate-pulse" />
                  </div>
                </div>
              </div>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`relative px-4 py-2 rounded-lg transition-all duration-300 group ${
                  location.pathname === item.href 
                    ? "text-primary font-semibold bg-primary/10" 
                    : "text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <span className="relative z-10">{item.name}</span>
                {location.pathname === item.href && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg animate-pulse"></div>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            ))}
          </nav>
          
          {/* CTA Button */}
          <div className="hidden md:block">
            <Button 
              onClick={() => navigate('/checkout')}
              variant="cta" 
              size="default"
              className="relative overflow-hidden group bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Star className="w-4 h-4" />
                Garanta seu acesso
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Button>
          </div>
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-3 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors duration-200"
          >
            {isMenuOpen ? <X className="w-6 h-6 text-slate-700 dark:text-slate-300" /> : <Menu className="w-6 h-6 text-slate-700 dark:text-slate-300" />}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-6 border-t border-slate-200/50 dark:border-slate-700/50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`relative px-6 py-3 rounded-lg transition-all duration-300 ${
                    location.pathname === item.href 
                      ? "text-primary font-semibold bg-primary/10" 
                      : "text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="relative z-10">{item.name}</span>
                  {location.pathname === item.href && (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg"></div>
                  )}
                </Link>
              ))}
              <div className="px-6 pt-4">
                <Button 
                  onClick={() => {
                    navigate('/checkout');
                    setIsMenuOpen(false);
                  }}
                  variant="cta" 
                  size="default" 
                  className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg"
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