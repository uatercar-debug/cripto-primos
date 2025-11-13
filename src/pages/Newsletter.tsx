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
      <div className={`bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-lg flex items-center justify-center ${className}`}>
        <ImageIcon className="w-8 h-8 text-slate-400" />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {imageLoading && (
        <div className="absolute inset-0 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse flex items-center justify-center">
          <ImageIcon className="w-6 h-6 text-slate-400" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        onError={handleImageError}
        onLoad={handleImageLoad}
        className={`w-full h-full object-cover rounded-lg transition-opacity duration-300 ${
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

  // Combinar todas as notícias em uma lista
  const allArticles = Object.entries(news).flatMap(([category, articles]) =>
    articles.map(article => ({ ...article, category }))
  ).sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  // Filtrar notícias por categoria ativa
  const filteredArticles = activeCategory === 'all' 
    ? Object.entries(news).flatMap(([category, articles]) =>
        articles.map(article => ({ ...article, category }))
      ).sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    : news[activeCategory] || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Header />
      
      {/* Hero Section */}
      <section className={`relative overflow-hidden transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-pink-400 to-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        </div>
        
        <div className="container mx-auto px-4 pt-32 pb-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200/20 rounded-full px-4 py-2 mb-8">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Newsletter Semanal</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 dark:from-white dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent">
                Notícias que
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                importam
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Fique por dentro das principais notícias sobre criptomoedas, mercado financeiro 
              e economia. Conteúdo curado semanalmente.
            </p>
            
            {/* Newsletter Signup */}
            <div className="max-w-lg mx-auto">
              <form onSubmit={handleSubscribe} className="flex gap-3 mb-4">
                <div className="flex-1 relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input 
                    type="email" 
                    placeholder="Seu melhor e-mail"
                    className="pl-12 h-14 text-lg border-2 border-slate-200 focus:border-blue-500 rounded-2xl"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="h-14 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-2xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  disabled={isSubscribing}
                >
                  {isSubscribing ? (
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    <Zap className="w-5 h-5 mr-2" />
                  )}
                  {isSubscribing ? 'Inscrevendo...' : 'Inscrever'}
                </Button>
              </form>
              
              <div className="flex items-center justify-center gap-6 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>5.000+ leitores</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Semanal</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>Sem spam</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                Explore por categoria
              </h2>
              <p className="text-slate-600 dark:text-slate-300">
                Filtre as notícias por tópico de seu interesse
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              {categories.map((category, index) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 ${
                    activeCategory === category.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <div className="text-center">
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${category.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      {category.icon}
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                      {category.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                      {category.description}
                    </p>
                    <Badge 
                      variant={activeCategory === category.id ? "default" : "secondary"}
                      className="text-xs"
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
      <section className="py-16 bg-slate-50/50 dark:bg-slate-800/50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
                  Últimas Notícias
                </h2>
                <p className="text-slate-600 dark:text-slate-300">
                  Conteúdo atualizado e relevante para investidores
                </p>
              </div>
              <Button 
                variant="outline" 
                onClick={refetch}
                disabled={loading}
                className="flex items-center gap-2 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>
            </div>

            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="border-0 shadow-sm">
                    <CardContent className="p-6">
                      <Skeleton className="h-4 w-3/4 mb-4" />
                      <Skeleton className="h-3 w-full mb-2" />
                      <Skeleton className="h-3 w-2/3 mb-4" />
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-6 w-16 rounded-full" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.length > 0 ? (
                  filteredArticles.map((article, index) => (
                    <Card 
                      key={index} 
                      className="group border-0 shadow-sm hover:shadow-xl transition-all duration-300 bg-white dark:bg-slate-800 overflow-hidden"
                      onClick={() => window.open(article.url, '_blank')}
                    >
                      <div className="aspect-video overflow-hidden">
                        <NewsImage 
                          src={article.urlToImage} 
                          alt={article.title}
                          className="w-full h-full group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <Badge className={`text-xs ${getCategoryColor(article.category)}`}>
                            {article.category}
                          </Badge>
                          <div className="flex items-center text-xs text-slate-500 gap-1">
                            <Clock className="w-3 h-3" />
                            {article.readTime}
                          </div>
                        </div>
                        
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-3 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                          {article.title}
                        </h3>
                        
                        <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 mb-4 leading-relaxed">
                          {article.description}
                        </p>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                              <Globe className="w-3.5 h-3.5" />
                              <span className="font-medium">{typeof article.source === 'string' ? article.source : article.source?.name || 'Fonte'}</span>
                            </div>
                            <span className="text-slate-300 dark:text-slate-600">•</span>
                            <div className="flex items-center gap-1 text-xs text-slate-500">
                              <Calendar className="w-3 h-3" />
                              <span>{formatDate(article.publishedAt)}</span>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <Newspaper className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                      Nenhuma notícia encontrada
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 mb-4">
                      Tente atualizar ou escolher outra categoria
                    </p>
                    <Button variant="outline" onClick={refetch}>
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
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">5K+</div>
                <p className="text-blue-100">Leitores ativos</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">250+</div>
                <p className="text-blue-100">Artigos publicados</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">98%</div>
                <p className="text-blue-100">Taxa de satisfação</p>
              </div>
            </div>
            
            <h3 className="text-3xl md:text-5xl font-bold mb-6">
              Não perca nenhuma oportunidade
            </h3>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Receba análises exclusivas, alertas de mercado e insights que podem fazer a diferença nos seus investimentos.
            </p>
            
            <div className="max-w-md mx-auto">
              <form onSubmit={handleSubscribe} className="flex gap-3">
                <div className="flex-1 relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input 
                    type="email" 
                    placeholder="Seu melhor e-mail"
                    className="pl-12 h-14 text-lg border-0 rounded-2xl"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="h-14 px-8 bg-white text-blue-600 hover:bg-blue-50 rounded-2xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  disabled={isSubscribing}
                >
                  {isSubscribing ? (
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    <Zap className="w-5 h-5 mr-2" />
                  )}
                  {isSubscribing ? 'Inscrevendo...' : 'Inscrever'}
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