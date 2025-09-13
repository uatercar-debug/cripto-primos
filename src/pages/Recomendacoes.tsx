import { BookOpen, Play, FileText, GraduationCap, Star, ExternalLink, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/navigation/Header";
import { useState } from "react";

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
  const categories = [
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Livros",
      count: "3 recomendações",
      color: "bg-blue-500/10 text-blue-600"
    },
    {
      icon: <Play className="w-6 h-6" />,
      title: "Vídeos",
      count: "2 canais",
      color: "bg-red-500/10 text-red-600"
    },
    {
      icon: <GraduationCap className="w-6 h-6" />,
      title: "Cursos",
      count: "2 cursos",
      color: "bg-green-500/10 text-green-600"
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "E-books",
      count: "2 e-books",
      color: "bg-purple-500/10 text-purple-600"
    }
  ];

  const recommendations = [
    {
      category: "Livro",
      title: "O Investidor Inteligente",
      author: "Benjamin Graham",
      rating: 5,
      description: "Clássico fundamental sobre value investing e análise de investimentos.",
      link: "#",
      price: "R$ 45,90",
      badge: "Clássico",
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=250&fit=crop&crop=center"
    },
    {
      category: "Curso",
      title: "Copytrading Avançado",
      author: "Cripto Primos Academy",
      rating: 5,
      description: "Curso completo sobre estratégias avançadas de copytrading na Exness.",
      link: "#",
      price: "R$ 297,00",
      badge: "Exclusivo",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop&crop=center"
    },
    {
      category: "E-book",
      title: "Guia Completo de Criptomoedas 2024",
      author: "Equipe Cripto Primos",
      rating: 4,
      description: "Manual atualizado sobre investimentos em criptomoedas e DeFi.",
      link: "#",
      price: "R$ 19,90",
      badge: "Atualizado",
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=250&fit=crop&crop=center"
    },
    {
      category: "Vídeo",
      title: "Canal Primo Rico",
      author: "Thiago Nigro",
      rating: 5,
      description: "Canal essencial sobre educação financeira e investimentos no Brasil.",
      link: "#",
      price: "Gratuito",
      badge: "Recomendado",
      image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=250&fit=crop&crop=center"
    },
    {
      category: "Livro",
      title: "Pai Rico, Pai Pobre",
      author: "Robert Kiyosaki",
      rating: 4,
      description: "Fundamentos sobre mentalidade financeira e criação de riqueza.",
      link: "#",
      price: "R$ 39,90",
      badge: "Bestseller",
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=250&fit=crop&crop=center"
    },
    {
      category: "Curso",
      title: "Trading para Iniciantes",
      author: "Academia do Trader",
      rating: 4,
      description: "Curso básico sobre análise técnica e fundamentos do trading.",
      link: "#",
      price: "R$ 197,00",
      badge: "Iniciante",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop&crop=center"
    },
    {
      category: "E-book",
      title: "Análise Técnica Aplicada",
      author: "Trader Profissional",
      rating: 5,
      description: "Guia completo sobre gráficos, indicadores e estratégias de trading.",
      link: "#",
      price: "R$ 29,90",
      badge: "Técnico",
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=250&fit=crop&crop=center"
    },
    {
      category: "Vídeo",
      title: "Canal Investimentos e Cia",
      author: "Bruno Perini",
      rating: 4,
      description: "Análises de mercado e dicas práticas de investimento em criptomoedas.",
      link: "#",
      price: "Gratuito",
      badge: "Popular",
      image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=250&fit=crop&crop=center"
    },
    {
      category: "Livro",
      title: "A Random Walk Down Wall Street",
      author: "Burton Malkiel",
      rating: 5,
      description: "Clássico sobre teoria do mercado eficiente e estratégias de investimento.",
      link: "#",
      price: "R$ 52,90",
      badge: "Acadêmico",
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=250&fit=crop&crop=center"
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <Header />
      <div className="container mx-auto px-4 pt-24 pb-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-6">
            Minhas Recomendações
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Curadoria especial de livros, cursos, vídeos e e-books que realmente fazem diferença 
            na sua jornada de investimentos e educação financeira.
          </p>
        </div>

        {/* Categories Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {categories.map((category, index) => (
            <Card key={index} className="border-0 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className={`inline-flex p-3 rounded-full ${category.color} mb-4`}>
                  {category.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{category.title}</h3>
                <p className="text-sm text-muted-foreground">{category.count}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recommendations Grid */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Recomendações Selecionadas
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Material testado e aprovado pela nossa equipe
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {recommendations.map((item, index) => (
            <Card key={index} className="border-0 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 group overflow-hidden">
              {/* Imagem do item */}
              <div className="aspect-video">
                <RecommendationImage 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full"
                />
              </div>
              
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {item.category}
                  </Badge>
                  <Badge className={`text-xs ${getBadgeColor(item.badge)}`}>
                    {item.badge}
                  </Badge>
                </div>
                <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
                  {item.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground">{item.author}</p>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < item.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                      }`}
                    />
                  ))}
                  <span className="text-sm text-muted-foreground ml-1">({item.rating})</span>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {item.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-primary">{item.price}</span>
                  <Button variant="outline" size="sm" className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    Ver Mais
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 text-center">
          <GraduationCap className="w-12 h-12 text-primary mx-auto mb-4" />
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Tem alguma recomendação?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Compartilhe conosco materiais que considera valiosos. Analisamos e incluímos as melhores sugestões!
          </p>
          <Button variant="cta" size="lg" className="text-lg px-8 py-6">
            Enviar Sugestão
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Recomendacoes;