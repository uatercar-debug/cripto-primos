import { BookOpen, Play, FileText, GraduationCap, Star, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Recomendacoes = () => {
  const categories = [
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Livros",
      count: "12 recomendações",
      color: "bg-blue-500/10 text-blue-600"
    },
    {
      icon: <Play className="w-6 h-6" />,
      title: "Vídeos",
      count: "8 canais",
      color: "bg-red-500/10 text-red-600"
    },
    {
      icon: <GraduationCap className="w-6 h-6" />,
      title: "Cursos",
      count: "15 cursos",
      color: "bg-green-500/10 text-green-600"
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "E-books",
      count: "20 e-books",
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
      badge: "Clássico"
    },
    {
      category: "Curso",
      title: "Copytrading Avançado",
      author: "Cripto Primos Academy",
      rating: 5,
      description: "Curso completo sobre estratégias avançadas de copytrading na Exness.",
      link: "#",
      price: "R$ 297,00",
      badge: "Exclusivo"
    },
    {
      category: "E-book",
      title: "Guia Completo de Criptomoedas 2024",
      author: "Equipe Cripto Primos",
      rating: 4,
      description: "Manual atualizado sobre investimentos em criptomoedas e DeFi.",
      link: "#",
      price: "R$ 19,90",
      badge: "Atualizado"
    },
    {
      category: "Vídeo",
      title: "Canal Primo Rico",
      author: "Thiago Nigro",
      rating: 5,
      description: "Canal essencial sobre educação financeira e investimentos no Brasil.",
      link: "#",
      price: "Gratuito",
      badge: "Recomendado"
    },
    {
      category: "Livro",
      title: "Pai Rico, Pai Pobre",
      author: "Robert Kiyosaki",
      rating: 4,
      description: "Fundamentos sobre mentalidade financeira e criação de riqueza.",
      link: "#",
      price: "R$ 39,90",
      badge: "Bestseller"
    },
    {
      category: "Curso",
      title: "Trading para Iniciantes",
      author: "Academia do Trader",
      rating: 4,
      description: "Curso básico sobre análise técnica e fundamentos do trading.",
      link: "#",
      price: "R$ 197,00",
      badge: "Iniciante"
    }
  ];

  const getBadgeColor = (badge: string) => {
    const colors: { [key: string]: string } = {
      "Clássico": "bg-blue-500/10 text-blue-600",
      "Exclusivo": "bg-purple-500/10 text-purple-600",
      "Atualizado": "bg-green-500/10 text-green-600",
      "Recomendado": "bg-orange-500/10 text-orange-600",
      "Bestseller": "bg-red-500/10 text-red-600",
      "Iniciante": "bg-cyan-500/10 text-cyan-600"
    };
    return colors[badge] || "bg-gray-500/10 text-gray-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
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
            <Card key={index} className="border-0 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 group">
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