import { CheckCircle, TrendingUp, Users, DollarSign, Image as ImageIcon, Star, Award, Target, Zap, Shield, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/navigation/Header";
import { useState } from "react";

// Componente de imagem com fallback
const AffiliateImage = ({ src, alt, className }: { src: string; alt: string; className?: string }) => {
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

const Afiliados = () => {
  const benefits = [
    {
      icon: <DollarSign className="w-6 h-6 text-primary" />,
      title: "40% de Comissão",
      description: "Comissão fixa de 40% em todas as vendas realizadas através do seu link",
      image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=250&fit=crop&crop=center"
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-primary" />,
      title: "Material Promocional",
      description: "Banners, textos e conteúdos prontos para suas redes sociais",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop&crop=center"
    },
    {
      icon: <Users className="w-6 h-6 text-primary" />,
      title: "Suporte Exclusivo",
      description: "Grupo Telegram para afiliados com suporte e estratégias",
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=250&fit=crop&crop=center"
    }
  ];

  const successStories = [
    {
      name: "Maria Silva",
      earnings: "R$ 2.847",
      period: "Último mês",
      description: "Influenciadora de finanças que aumentou sua renda em 300%",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=250&fit=crop&crop=center",
      badge: "Top Performer"
    },
    {
      name: "João Santos",
      earnings: "R$ 1.920",
      period: "Último mês",
      description: "Youtuber de investimentos que encontrou uma nova fonte de renda",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop&crop=center",
      badge: "Crescimento"
    },
    {
      name: "Ana Costa",
      earnings: "R$ 3.156",
      period: "Último mês",
      description: "Blogueira de criptomoedas que maximizou seus ganhos",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=250&fit=crop&crop=center",
      badge: "Estrela"
    }
  ];

  const materials = [
    {
      title: "Banners para Instagram",
      description: "Coleção de 20+ banners otimizados para stories e posts",
      image: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=400&h=250&fit=crop&crop=center",
      type: "Design",
      count: "20+ arquivos"
    },
    {
      title: "Textos Prontos",
      description: "Copywriting testado e aprovado para diferentes plataformas",
      image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=250&fit=crop&crop=center",
      type: "Copy",
      count: "50+ textos"
    },
    {
      title: "Vídeos Explicativos",
      description: "Conteúdo audiovisual para YouTube e TikTok",
      image: "https://images.unsplash.com/photo-1611162616305-c69c4d9bbbc0?w=400&h=250&fit=crop&crop=center",
      type: "Vídeo",
      count: "15+ vídeos"
    },
    {
      title: "E-books Gratuitos",
      description: "Materiais de lead magnet para capturar leads",
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=250&fit=crop&crop=center",
      type: "E-book",
      count: "5 e-books"
    }
  ];

  const getBadgeColor = (badge: string) => {
    const colors: { [key: string]: string } = {
      "Top Performer": "bg-yellow-500/10 text-yellow-600",
      "Crescimento": "bg-green-500/10 text-green-600",
      "Estrela": "bg-purple-500/10 text-purple-600",
      "Design": "bg-blue-500/10 text-blue-600",
      "Copy": "bg-orange-500/10 text-orange-600",
      "Vídeo": "bg-red-500/10 text-red-600",
      "E-book": "bg-indigo-500/10 text-indigo-600"
    };
    return colors[badge] || "bg-gray-500/10 text-gray-600";
  };

  const steps = [
    {
      number: "01",
      title: "Inscreva-se",
      description: "Cadastre-se no programa de afiliados gratuito"
    },
    {
      number: "02", 
      title: "Receba seu Link",
      description: "Obtenha seu link único de rastreamento"
    },
    {
      number: "03",
      title: "Divulgue",
      description: "Compartilhe usando nossos materiais prontos"
    },
    {
      number: "04",
      title: "Receba",
      description: "Ganhe 40% de comissão em cada venda"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <Header />
      <div className="container mx-auto px-4 pt-24 pb-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-6">
            Programa de Afiliados
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Ganhe 40% de comissão compartilhando conhecimento sobre copytrading e criptomoedas. 
            Junte-se aos nossos parceiros e monetize sua audiência.
          </p>
          <Button variant="cta" size="lg" className="text-lg px-8 py-6">
            Quero ser Afiliado
          </Button>
        </div>

        {/* Benefits */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <Card key={index} className="border-0 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 group overflow-hidden">
              {/* Imagem do benefício */}
              <div className="aspect-video">
                <AffiliateImage 
                  src={benefit.image} 
                  alt={benefit.title}
                  className="w-full h-full"
                />
              </div>
              
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  {benefit.icon}
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">{benefit.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* How it Works */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Como Funciona
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Processo simples em 4 etapas para começar a ganhar hoje mesmo
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8 mb-16">
          {steps.map((step, index) => (
            <div key={index} className="text-center group">
              <div className="bg-primary/10 text-primary text-2xl font-bold w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                {step.number}
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>

        {/* Success Stories */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Histórias de Sucesso
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Conheça alguns dos nossos afiliados que estão faturando alto
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {successStories.map((story, index) => (
            <Card key={index} className="border-0 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 group overflow-hidden">
              {/* Imagem da pessoa */}
              <div className="aspect-video">
                <AffiliateImage 
                  src={story.image} 
                  alt={story.name}
                  className="w-full h-full"
                />
              </div>
              
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <CardTitle className="text-lg">{story.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{story.period}</p>
                  </div>
                  <Badge className={`text-xs ${getBadgeColor(story.badge)}`}>
                    {story.badge}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="text-2xl font-bold text-primary mb-2">{story.earnings}</div>
                <p className="text-sm text-muted-foreground">{story.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Materials Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Materiais Promocionais
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Tudo que você precisa para começar a promover hoje mesmo
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {materials.map((material, index) => (
            <Card key={index} className="border-0 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 group overflow-hidden">
              {/* Imagem do material */}
              <div className="aspect-video">
                <AffiliateImage 
                  src={material.image} 
                  alt={material.title}
                  className="w-full h-full"
                />
              </div>
              
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge className={`text-xs ${getBadgeColor(material.type)}`}>
                    {material.type}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{material.count}</span>
                </div>
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  {material.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{material.description}</p>
                <Button variant="outline" size="sm" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  Baixar
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-8 mb-16">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">R$ 847K+</div>
              <p className="text-muted-foreground">Pagos em comissões</p>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">1.2K+</div>
              <p className="text-muted-foreground">Afiliados ativos</p>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">40%</div>
              <p className="text-muted-foreground">Comissão fixa</p>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">24h</div>
              <p className="text-muted-foreground">Suporte disponível</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-primary to-accent p-4 rounded-full">
              <Award className="w-8 h-8 text-white" />
            </div>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Pronto para Começar?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Não perca tempo! Comece a ganhar comissões hoje mesmo compartilhando conteúdo de qualidade sobre criptomoedas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="cta" size="lg" className="text-lg px-8 py-6">
              <Zap className="w-5 h-5 mr-2" />
              Cadastrar como Afiliado
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6">
              <Shield className="w-5 h-5 mr-2" />
              Ver Termos e Condições
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Afiliados;