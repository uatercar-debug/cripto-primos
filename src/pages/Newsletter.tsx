import { Newspaper, TrendingUp, Globe, Users, Mail, Calendar, ArrowRight, RefreshCw, AlertCircle, Sparkles, Clock, Eye, BookOpen, Zap, Star, ChevronRight, Shield, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import Header from "@/components/navigation/Header";
import { useNews } from "@/hooks/useNews";
import { useState, useEffect } from "react";

// Componente de imagem com fallback
const NewsImage = ({ src, alt, className }: { src: string; alt: string; className?: string }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  if (imageError || !src || src === '/placeholder.svg') {
    return (
      <div className={`bg-muted/50 rounded-xl flex items-center justify-center ${className}`}>
        <ImageIcon className="w-8 h-8 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {imageLoading && (
        <div className="absolute inset-0 bg-muted rounded-xl animate-pulse flex items-center justify-center">
          <ImageIcon className="w-6 h-6 text-muted-foreground" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        onError={handleImageError}
        onLoad={handleImageLoad}
        className={`w-full h-full object-cover rounded-xl transition-opacity duration-300 ${
          imageLoading ? 'opacity-0' : 'opacity-100'
        }`}
      />
    </div>
  );
};

const Newsletter = () => {
  const { news, loading, error, refetch } = useNews();
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const categories = [
    {
      id: 'all',
      icon: <Sparkles className="w-5 h-5" />,
      title: "Todas",
      description: "Todas as notícias",
      color: "from-purple-500 to-pink-500",
      count: Object.values(news).flat().length
    },
    {
      id: 'Criptomoedas',
      icon: <TrendingUp className="w-5 h-5" />,
      title: "Criptomoedas",
      description: "Bitcoin, altcoins e blockchain",
      color: "from-orange-500 to-red-500",
      count: news.Criptomoedas?.length || 0
    },
    {
      id: 'Mercado Financeiro',
      icon: <Globe className="w-5 h-5" />,
      title: "Mercado",
      description: "Ações, fundos e investimentos",
      color: "from-blue-500 to-cyan-500",
      count: news['Mercado Financeiro']?.length || 0
    },
    {
      id: 'Política Econômica',
      icon: <Users className="w-5 h-5" />,
      title: "Economia",
      description: "Política e economia",
      color: "from-green-500 to-emerald-500",
      count: news['Política Econômica']?.length || 0
    }
  ];

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      "Criptomoedas": "bg-orange-500/10 text-orange-600",
      "Mercado Financeiro": "bg-blue-500/10 text-blue-600", 
      "Política Econômica": "bg-green-500/10 text-green-600"
    };
    return colors[category] || "bg-gray-500/10 text-gray-600";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubscribing(true);
    // Simular envio do e-mail
    await new Promise(resolve => setTimeout(resolve, 2000));
    alert('Inscrição realizada com sucesso! Você receberá nossa newsletter semanal.');
    setEmail('');
    setIsSubscribing(false);
  };

  // Função para remover duplicatas
  const removeDuplicates = (articles: any[]) => {
    const seen = new Set<string>();
    return articles.filter(article => {
      const normalizedTitle = article.title.toLowerCase().trim().substring(0, 50);
      const key = `${article.url}|${normalizedTitle}`;
      
      if (!seen.has(key) && article.url !== '#') {
        seen.add(key);
        return true;
      }
      return false;
    });
  };

  // Combinar todas as notícias em uma lista
  const allArticles = removeDuplicates(
    Object.entries(news).flatMap(([category, articles]) =>
      articles.map(article => ({ ...article, category }))
    )
  ).sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  // Filtrar notícias por categoria ativa
  const filteredArticles = activeCategory === 'all' 
    ? allArticles
    : news[activeCategory] || [];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className={`relative overflow-hidden transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse [animation-delay:1s]"></div>
        </div>
        
        <div className="container mx-auto px-4 pt-40 pb-32 relative z-10">
          <div className="max-w-5xl mx-auto text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-primary/5 border border-primary/10 rounded-full px-5 py-2.5 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold tracking-wide text-primary">Newsletter Semanal</span>
            </div>
            
            <div className="space-y-6">
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold leading-[1.1] tracking-tight">
                <span className="text-foreground">
                  Notícias que
                </span>
                <br />
                <span className="bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent">
                  importam
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-medium">
                Fique por dentro das principais notícias sobre criptomoedas, mercado financeiro 
                e economia. Conteúdo curado semanalmente.
              </p>
            </div>
            
            {/* Newsletter Signup - Premium Card */}
            <div className="max-w-2xl mx-auto pt-8">
              <Card className="border-2 bg-card/50 backdrop-blur-sm shadow-2xl">
                <CardContent className="p-8">
                  <form onSubmit={handleSubscribe} className="space-y-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1 relative group">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                        <Input 
                          type="email" 
                          placeholder="Seu melhor e-mail"
                          className="pl-12 h-14 text-base bg-background border-2 focus:border-primary rounded-xl transition-all duration-300 focus:shadow-lg"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <Button 
                        type="submit" 
                        size="lg"
                        className="h-14 px-10 rounded-xl text-base font-bold shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] bg-primary hover:bg-primary/90"
                        disabled={isSubscribing}
                      >
                        {isSubscribing ? (
                          <>
                            <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                            Inscrevendo...
                          </>
                        ) : (
                          <>
                            <Zap className="w-5 h-5 mr-2" />
                            Inscrever
                          </>
                        )}
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-center flex-wrap gap-6 text-sm text-muted-foreground pt-2">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-primary" />
                        <span className="font-medium">5.000+ leitores</span>
                      </div>
                      <div className="h-1 w-1 rounded-full bg-border" />
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        <span className="font-medium">Semanal</span>
                      </div>
                      <div className="h-1 w-1 rounded-full bg-border" />
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-primary" />
                        <span className="font-medium">Sem spam</span>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
                Explore por categoria
              </h2>
              <p className="text-lg text-muted-foreground font-medium max-w-2xl mx-auto">
                Filtre as notícias por tópico de seu interesse
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {categories.map((category, index) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`group relative p-8 rounded-2xl border-2 transition-all duration-300 ${
                    activeCategory === category.id
                      ? 'border-primary bg-primary/5 shadow-lg scale-[1.02]'
                      : 'border-border bg-card hover:border-primary/30 hover:shadow-md hover:scale-[1.01]'
                  }`}
                >
                  <div className="text-center space-y-3">
                    <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${category.color} mb-2 group-hover:scale-110 transition-transform duration-300 shadow-lg text-white`}>
                      {category.icon}
                    </div>
                    <h3 className="font-bold text-lg text-foreground">
                      {category.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {category.description}
                    </p>
                    <Badge 
                      variant={activeCategory === category.id ? "default" : "secondary"}
                      className="text-xs font-semibold mt-2"
                    >
                      {category.count} notícias
                    </Badge>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16">
              <div className="space-y-3">
                <h2 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
                  Últimas Notícias
                </h2>
                <p className="text-lg text-muted-foreground font-medium">
                  Conteúdo atualizado e relevante para investidores
                </p>
              </div>
              <Button 
                variant="outline" 
                onClick={refetch}
                disabled={loading}
                className="flex items-center gap-2 h-12 px-6 rounded-xl font-semibold border-2 hover:bg-accent hover:border-primary/30 transition-all duration-300 hover:scale-105"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>
            </div>

            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="border-2 shadow-lg">
                    <CardContent className="p-6 space-y-4">
                      <Skeleton className="h-48 w-full rounded-lg" />
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                      <div className="flex items-center gap-2 pt-2">
                        <Skeleton className="h-6 w-20 rounded-full" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredArticles.length > 0 ? (
                  filteredArticles.map((article, index) => (
                    <Card 
                      key={index} 
                      className="group border-2 border-border shadow-md hover:shadow-2xl transition-all duration-300 bg-card overflow-hidden cursor-pointer hover:border-primary/30 hover:scale-[1.02]"
                      onClick={() => window.open(article.url, '_blank')}
                    >
                      <div className="aspect-video overflow-hidden bg-muted">
                        <NewsImage 
                          src={article.urlToImage} 
                          alt={article.title}
                          className="w-full h-full group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <CardContent className="p-6 space-y-4">
                        <div className="flex items-center gap-3">
                          <Badge className={`text-xs font-semibold ${getCategoryColor(article.category)}`}>
                            {article.category}
                          </Badge>
                          <div className="flex items-center text-xs text-muted-foreground gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            <span className="font-medium">{article.readTime}</span>
                          </div>
                        </div>
                        
                        <h3 className="font-bold text-xl text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                          {article.title}
                        </h3>
                        
                        <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
                          {article.description}
                        </p>
                        
                        <div className="flex items-center justify-between pt-4 border-t-2 border-border">
                          <div className="flex items-center gap-2 flex-wrap">
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Globe className="w-3.5 h-3.5" />
                              <span className="font-semibold">{typeof article.source === 'string' ? article.source : article.source?.name || 'Fonte'}</span>
                            </div>
                            <span className="text-border">•</span>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Calendar className="w-3.5 h-3.5" />
                              <span className="font-medium">{formatDate(article.publishedAt)}</span>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-primary group-hover:translate-x-2 transition-transform duration-300" />
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center py-20">
                    <Newspaper className="w-20 h-20 mx-auto mb-6 text-muted-foreground" />
                    <h3 className="text-2xl font-bold text-foreground mb-3">
                      Nenhuma notícia encontrada
                    </h3>
                    <p className="text-muted-foreground mb-6 text-lg">
                      Tente atualizar ou escolher outra categoria
                    </p>
                    <Button variant="outline" onClick={refetch} className="h-12 px-8 rounded-xl font-semibold border-2">
                      Tentar novamente
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary via-primary/90 to-accent relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-grid-white/5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center text-primary-foreground">
            <div className="grid md:grid-cols-3 gap-10 mb-16">
              <div className="text-center space-y-2">
                <div className="text-5xl font-extrabold mb-3">5K+</div>
                <p className="text-primary-foreground/80 font-medium text-lg">Leitores ativos</p>
              </div>
              <div className="text-center space-y-2">
                <div className="text-5xl font-extrabold mb-3">250+</div>
                <p className="text-primary-foreground/80 font-medium text-lg">Artigos publicados</p>
              </div>
              <div className="text-center space-y-2">
                <div className="text-5xl font-extrabold mb-3">98%</div>
                <p className="text-primary-foreground/80 font-medium text-lg">Taxa de satisfação</p>
              </div>
            </div>
            
            <div className="space-y-6 mb-12">
              <h3 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
                Não perca nenhuma oportunidade
              </h3>
              <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed font-medium">
                Receba análises exclusivas, alertas de mercado e insights que podem fazer a diferença nos seus investimentos.
              </p>
            </div>
            
            <div className="max-w-xl mx-auto">
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative group">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <Input 
                    type="email" 
                    placeholder="Seu melhor e-mail"
                    className="pl-12 h-16 text-lg border-0 rounded-2xl bg-background shadow-xl focus:shadow-2xl transition-all duration-300"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  size="lg"
                  className="h-16 px-12 bg-background text-primary hover:bg-background/90 rounded-2xl text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                  disabled={isSubscribing}
                >
                  {isSubscribing ? (
                    <>
                      <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                      Inscrevendo...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 mr-2" />
                      Inscrever
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Newsletter;