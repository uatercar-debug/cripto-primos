import { CheckCircle, TrendingUp, Users, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Afiliados = () => {
  const benefits = [
    {
      icon: <DollarSign className="w-6 h-6 text-primary" />,
      title: "40% de Comissão",
      description: "Comissão fixa de 40% em todas as vendas realizadas através do seu link"
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-primary" />,
      title: "Material Promocional",
      description: "Banners, textos e conteúdos prontos para suas redes sociais"
    },
    {
      icon: <Users className="w-6 h-6 text-primary" />,
      title: "Suporte Exclusivo",
      description: "Grupo Telegram para afiliados com suporte e estratégias"
    }
  ];

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
            <Card key={index} className="border-0 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  {benefit.icon}
                  <CardTitle className="text-xl">{benefit.title}</CardTitle>
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

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Pronto para Começar?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Não perca tempo! Comece a ganhar comissões hoje mesmo compartilhando conteúdo de qualidade sobre criptomoedas.
          </p>
          <Button variant="cta" size="lg" className="text-lg px-8 py-6">
            Cadastrar como Afiliado
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Afiliados;