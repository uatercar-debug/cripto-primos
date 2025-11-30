import { BookOpen, Play, FileText, GraduationCap, Star, ExternalLink, Image as ImageIcon, Search, Filter, Heart, X, CheckCircle2, Sparkles, TrendingUp, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/navigation/Header";
import { useState, useMemo, useEffect } from "react";
import { RecommendationsService, type Recommendation } from "@/services/recommendationsService";

// Componente de imagem com fallback
const RecommendationImage = ({ src, alt, className }: { src: string; alt: string; className?: string }) => {
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

const Recomendacoes = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("rating");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [selectedItem, setSelectedItem] = useState<Recommendation | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  // Carregar recomendações do banco
  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      const data = await RecommendationsService.getAll();
      setRecommendations(data);
    } catch (error) {
      console.error('Error loading recommendations:', error);
      // Fallback para dados estáticos em caso de erro
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    {
      id: "all",
      icon: <Sparkles className="w-6 h-6" />,
      title: "Todos",
      count: "9 recomendações",
      color: "bg-gradient-to-br from-primary/10 to-accent/10 text-primary"
    },
    {
      id: "Livro",
      icon: <BookOpen className="w-6 h-6" />,
      title: "Livros",
      count: "3 recomendações",
      color: "bg-blue-500/10 text-blue-600"
    },
    {
      id: "Vídeo",
      icon: <Play className="w-6 h-6" />,
      title: "Vídeos",
      count: "2 canais",
      color: "bg-red-500/10 text-red-600"
    },
    {
      id: "Curso",
      icon: <GraduationCap className="w-6 h-6" />,
      title: "Cursos",
      count: "2 cursos",
      color: "bg-green-500/10 text-green-600"
    },
    {
      id: "E-book",
      icon: <FileText className="w-6 h-6" />,
      title: "E-books",
      count: "2 e-books",
      color: "bg-purple-500/10 text-purple-600"
    }
  ];


  const getBadgeColor = (badge: string) => {
    const colors: { [key: string]: string } = {
      "Clássico": "bg-blue-500/10 text-blue-600",
      "Exclusivo": "bg-purple-500/10 text-purple-600",
      "Atualizado": "bg-green-500/10 text-green-600",
      "Recomendado": "bg-orange-500/10 text-orange-600",
      "Bestseller": "bg-red-500/10 text-red-600",
      "Iniciante": "bg-cyan-500/10 text-cyan-600",
      "Técnico": "bg-indigo-500/10 text-indigo-600",
      "Popular": "bg-pink-500/10 text-pink-600",
      "Acadêmico": "bg-emerald-500/10 text-emerald-600"
    };
    return colors[badge] || "bg-gray-500/10 text-gray-600";
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Contar recomendações por categoria
  const categoryCounts = useMemo(() => {
    const counts: { [key: string]: number } = { all: recommendations.length };
    recommendations.forEach(rec => {
      counts[rec.category] = (counts[rec.category] || 0) + 1;
    });
    return counts;
  }, [recommendations]);

  // Atualizar contadores nas categorias
  const categoriesWithCounts = categories.map(cat => ({
    ...cat,
    count: categoryCounts[cat.id] ? `${categoryCounts[cat.id]} ${cat.id === 'all' ? 'recomendações' : cat.id === 'Vídeo' ? 'canais' : cat.id === 'Livro' ? 'livros' : cat.id === 'Curso' ? 'cursos' : 'e-books'}` : '0'
  }));

  // Filtrar e ordenar recomendações
  const filteredAndSortedRecommendations = useMemo(() => {
    let filtered = recommendations;

    // Filtro por categoria
    if (selectedCategory !== "all") {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Filtro por busca
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.author.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
      );
    }

    // Ordenação
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "title":
          return a.title.localeCompare(b.title);
        case "price":
          const priceA = a.price === "Gratuito" ? 0 : parseFloat(a.price.replace(/[^\d,]/g, "").replace(",", "."));
          const priceB = b.price === "Gratuito" ? 0 : parseFloat(b.price.replace(/[^\d,]/g, "").replace(",", "."));
          return priceA - priceB;
        default:
          return 0;
      }
    });

    return sorted;
  }, [searchQuery, selectedCategory, sortBy]);

  const handleItemClick = (item: any) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <Header />
      <div className="container mx-auto px-3 sm:px-4 pt-20 sm:pt-24 pb-8 sm:pb-12 md:pb-16">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4 sm:mb-6">
            Minhas Recomendações
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto mb-6 sm:mb-8 px-2">
            Curadoria especial de livros, cursos, vídeos e e-books que realmente fazem diferença 
            na sua jornada de investimentos e educação financeira.
          </p>
        </div>

        {/* Categories Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8 md:mb-12">
              {categoriesWithCounts.map((category, index) => (
            <button
              key={index}
              onClick={() => setSelectedCategory(category.id)}
              className={`text-left border-0 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 rounded-lg p-4 sm:p-6 ${
                selectedCategory === category.id ? 'ring-2 ring-primary shadow-lg' : ''
              }`}
            >
              <div className={`inline-flex p-2 sm:p-3 rounded-full ${category.color} mb-3 sm:mb-4`}>
                {category.icon}
              </div>
              <h3 className="text-sm sm:text-base md:text-lg font-semibold mb-1 sm:mb-2">{category.title}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">{category.count}</p>
            </button>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="mb-6 sm:mb-8 md:mb-12 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar recomendações..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 sm:pl-10 h-10 sm:h-12"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort Select */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[200px] h-10 sm:h-12">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">⭐ Melhor Avaliação</SelectItem>
                <SelectItem value="title">🔤 Título (A-Z)</SelectItem>
                <SelectItem value="price">💰 Menor Preço</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Active Filters Display */}
          {(searchQuery || selectedCategory !== "all") && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs sm:text-sm text-muted-foreground">Filtros ativos:</span>
              {selectedCategory !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  {categories.find(c => c.id === selectedCategory)?.title}
                  <button onClick={() => setSelectedCategory("all")} className="ml-1">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {searchQuery && (
                <Badge variant="secondary" className="gap-1">
                  "{searchQuery}"
                  <button onClick={() => setSearchQuery("")} className="ml-1">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="text-xs sm:text-sm"
              >
                Limpar todos
              </Button>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Carregando recomendações...</p>
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="mb-4 sm:mb-6">
              <p className="text-sm sm:text-base text-muted-foreground">
                {filteredAndSortedRecommendations.length === 0 ? (
                  <span>Nenhuma recomendação encontrada</span>
                ) : (
                  <span>
                    {filteredAndSortedRecommendations.length} {filteredAndSortedRecommendations.length === 1 ? 'recomendação encontrada' : 'recomendações encontradas'}
                  </span>
                )}
              </p>
            </div>

            {/* Recommendations Grid */}
            {filteredAndSortedRecommendations.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-12 md:mb-16">
            {filteredAndSortedRecommendations.map((item) => (
              <Card 
                key={item.id} 
                className="border-0 bg-card/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group overflow-hidden cursor-pointer h-full flex flex-col"
                onClick={() => handleItemClick(item)}
              >
                {/* Imagem do item */}
                <div className="aspect-video relative">
                  <RecommendationImage 
                    src={item.image_url || '/placeholder.svg'} 
                    alt={item.title}
                    className="w-full h-full"
                  />
                  {/* Favorite Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(item.id);
                    }}
                    className="absolute top-2 right-2 p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background transition-colors z-10"
                  >
                    <Heart 
                      className={`w-4 h-4 sm:w-5 sm:h-5 ${
                        favorites.has(item.id) 
                          ? "fill-red-500 text-red-500" 
                          : "text-muted-foreground"
                      }`}
                    />
                  </button>
                  {/* Category Badge Overlay */}
                  <div className="absolute top-2 left-2">
                    <Badge variant="secondary" className="text-xs backdrop-blur-sm bg-background/80">
                      {item.category}
                    </Badge>
                  </div>
                </div>
                
                <CardHeader className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <Badge className={`text-xs ${getBadgeColor(item.badge || '')}`}>
                      {item.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-base sm:text-lg leading-tight group-hover:text-primary transition-colors mb-1">
                    {item.title}
                  </CardTitle>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-2">{item.author}</p>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 sm:w-4 sm:h-4 ${
                          i < item.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                        }`}
                      />
                    ))}
                    <span className="text-xs sm:text-sm text-muted-foreground ml-1">({item.rating})</span>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3 sm:space-y-4">
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 sm:line-clamp-3">
                    {item.description}
                  </p>
                  
                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-base sm:text-lg font-bold text-primary">{item.price}</span>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors text-xs sm:text-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleItemClick(item);
                      }}
                    >
                      Ver Detalhes
                      <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
              </div>
            ) : (
          <div className="text-center py-12 sm:py-16 md:py-20">
            <div className="inline-flex p-4 bg-muted/50 rounded-full mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2">Nenhum resultado encontrado</h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-4">
              Tente ajustar seus filtros ou busca
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
            >
              Limpar Filtros
            </Button>
          </div>
            )}
          </>
        )}

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center">
          <GraduationCap className="w-10 h-10 sm:w-12 sm:h-12 text-primary mx-auto mb-3 sm:mb-4" />
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-4">
            Tem alguma recomendação?
          </h3>
          <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 max-w-2xl mx-auto">
            Compartilhe conosco materiais que considera valiosos. Analisamos e incluímos as melhores sugestões!
          </p>
          <Button variant="default" size="lg" className="text-sm sm:text-base md:text-lg px-6 sm:px-8 py-4 sm:py-6">
            Enviar Sugestão
          </Button>
        </div>
      </div>

      {/* Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedItem && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {selectedItem.category}
                      </Badge>
                      <Badge className={`text-xs ${getBadgeColor(selectedItem.badge)}`}>
                        {selectedItem.badge}
                      </Badge>
                    </div>
                    <DialogTitle className="text-xl sm:text-2xl mb-2">
                      {selectedItem.title}
                    </DialogTitle>
                    <DialogDescription className="text-sm sm:text-base">
                      por {selectedItem.author}
                    </DialogDescription>
                  </div>
                  <button
                    onClick={() => toggleFavorite(selectedItem.id)}
                    className="p-2 hover:bg-muted rounded-full transition-colors"
                  >
                    <Heart 
                      className={`w-5 h-5 ${
                        favorites.has(selectedItem.id) 
                          ? "fill-red-500 text-red-500" 
                          : "text-muted-foreground"
                      }`}
                    />
                  </button>
                </div>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Image */}
                <div className="aspect-video rounded-lg overflow-hidden">
                  <RecommendationImage 
                    src={selectedItem.image_url || '/placeholder.svg'} 
                    alt={selectedItem.title}
                    className="w-full h-full"
                  />
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < selectedItem.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {selectedItem.rating}/5
                  </span>
                </div>

                {/* Description */}
                <div>
                  <h4 className="font-semibold mb-2 text-sm sm:text-base">Descrição</h4>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {selectedItem.long_description || selectedItem.description}
                  </p>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {selectedItem.duration && (
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-4 h-4 text-primary" />
                        <span className="text-xs font-medium text-muted-foreground">Duração</span>
                      </div>
                      <p className="text-sm font-semibold">{selectedItem.duration}</p>
                    </div>
                  )}
                  {selectedItem.level && (
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="w-4 h-4 text-primary" />
                        <span className="text-xs font-medium text-muted-foreground">Nível</span>
                      </div>
                      <p className="text-sm font-semibold">{selectedItem.level}</p>
                    </div>
                  )}
                  {selectedItem.language && (
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="w-4 h-4 text-primary" />
                        <span className="text-xs font-medium text-muted-foreground">Idioma</span>
                      </div>
                      <p className="text-sm font-semibold">{selectedItem.language}</p>
                    </div>
                  )}
                  {selectedItem.format && (
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="w-4 h-4 text-primary" />
                        <span className="text-xs font-medium text-muted-foreground">Formato</span>
                      </div>
                      <p className="text-sm font-semibold">{selectedItem.format}</p>
                    </div>
                  )}
                </div>

                {/* Price and CTA */}
                <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-1">Preço</p>
                    <p className="text-xl sm:text-2xl font-bold text-primary">{selectedItem.price}</p>
                  </div>
                  <Button
                    onClick={() => {
                      if (selectedItem.link && selectedItem.link !== "#") {
                        window.open(selectedItem.link, '_blank');
                      }
                    }}
                    className="gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    {selectedItem.link === "#" ? "Em Breve" : "Acessar"}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Recomendacoes;