import { Newspaper, TrendingUp, Globe, Users, Mail, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const Newsletter = () => {
  const categories = [
    {
      icon: <TrendingUp className="w-5 h-5" />,
      title: "Criptomoedas",
      description: "Análises de mercado, novos projetos e oportunidades",
      color: "bg-orange-500/10 text-orange-600 border-orange-200"
    },
    {
      icon: <Globe className="w-5 h-5" />,
      title: "Mercado Financeiro",
      description: "Notícias sobre ações, fundos e economia mundial",
      color: "bg-blue-500/10 text-blue-600 border-blue-200"
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Política Econômica",
      description: "Impactos políticos nos investimentos",
      color: "bg-green-500/10 text-green-600 border-green-200"
    }
  ];

  const recentArticles = [
    {
      title: "Bitcoin atinge nova máxima histórica após aprovação de ETFs",
      category: "Criptomoedas",
      date: "12 Set 2024",
      readTime: "5 min",
      summary: "Análise completa sobre o impacto da aprovação dos ETFs de Bitcoin no preço e adoção da criptomoeda.",
      trending: true
    },
    {
      title: "Fed sinaliza possível corte na taxa de juros",
      category: "Mercado Financeiro", 
      date: "11 Set 2024",
      readTime: "4 min",
      summary: "Como as decisões do Federal Reserve americano podem impactar os mercados globais e suas estratégias.",
      trending: false
    },
    {
      title: "Eleições 2024: Impactos no mercado brasileiro",
      category: "Política Econômica",
      date: "10 Set 2024", 
      readTime: "6 min",
      summary: "Cenários políticos e seus reflexos no Ibovespa, dólar e principais setores da economia.",
      trending: false
    },
    {
      title: "Altcoins promissoras para Q4 2024",
      category: "Criptomoedas",
      date: "09 Set 2024",
      readTime: "7 min", 
      summary: "Seleção de criptomoedas alternativas com potencial de crescimento nos próximos meses.",
      trending: true
    },
    {
      title: "Inflação global: oportunidades em commodities",
      category: "Mercado Financeiro",
      date: "08 Set 2024",
      readTime: "5 min",
      summary: "Como a inflação mundial está criando oportunidades no mercado de commodities.",
      trending: false
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="container mx-auto px-4 pt-24 pb-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <Newspaper className="w-16 h-16 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-6">
            Newsletter Cripto Primos
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Fique por dentro das principais notícias sobre criptomoedas, mercado financeiro 
            e política econômica. Análises semanais direto no seu e-mail.
          </p>
          
          {/* Newsletter Signup */}
          <div className="max-w-md mx-auto flex gap-2">
            <Input 
              type="email" 
              placeholder="Seu melhor e-mail"
              className="flex-1"
            />
            <Button variant="cta" size="default">
              <Mail className="w-4 h-4 mr-2" />
              Inscrever
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            📧 Mais de 5.000 leitores • 🎯 Conteúdo semanal • 🚫 Sem spam
          </p>
        </div>

        {/* Categories */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {categories.map((category, index) => (
            <Card key={index} className={`border-2 hover:shadow-lg transition-all duration-300 ${category.color}`}>
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-3">
                  {category.icon}
                </div>
                <CardTitle className="text-lg">{category.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground">{category.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Articles */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Últimas Notícias
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Acompanhe as análises e notícias mais relevantes
          </p>
        </div>

        <div className="space-y-6 mb-16">
          {recentArticles.map((article, index) => (
            <Card key={index} className="border-0 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 group cursor-pointer">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge className={`text-xs ${getCategoryColor(article.category)}`}>
                        {article.category}
                      </Badge>
                      {article.trending && (
                        <Badge variant="destructive" className="text-xs">
                          🔥 Trending
                        </Badge>
                      )}
                      <div className="flex items-center text-sm text-muted-foreground gap-2">
                        <Calendar className="w-4 h-4" />
                        {article.date}
                        <span>•</span>
                        {article.readTime}
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>
                    
                    <p className="text-muted-foreground text-sm line-clamp-2">
                      {article.summary}
                    </p>
                  </div>
                  
                  <div className="flex items-center">
                    <Button variant="ghost" size="sm" className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      Ler mais
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats & CTA */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 text-center">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">5K+</div>
              <p className="text-muted-foreground">Leitores ativos</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">250+</div>
              <p className="text-muted-foreground">Artigos publicados</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">98%</div>
              <p className="text-muted-foreground">Taxa de satisfação</p>
            </div>
          </div>
          
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Não perca nenhuma oportunidade
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Receba análises exclusivas, alertas de mercado e insights que podem fazer a diferença nos seus investimentos.
          </p>
          <Button variant="cta" size="lg" className="text-lg px-8 py-6">
            <Mail className="w-5 h-5 mr-2" />
            Assinar Newsletter Gratuita
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;