import { Crown, MessageCircle, BarChart3, Shield, Users, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const AreaVip = () => {
  const plans = [
    {
      name: "VIP Essential",
      price: "R$ 97",
      period: "/mês",
      popular: false,
      features: [
        "Análises semanais de traders",
        "Grupo Telegram exclusivo",
        "Alertas de oportunidades",
        "Material educativo premium",
        "Suporte por mensagem"
      ]
    },
    {
      name: "VIP Premium",
      price: "R$ 197",
      period: "/mês",
      popular: true,
      features: [
        "Tudo do VIP Essential",
        "Análises diárias detalhadas",
        "Call mensal ao vivo",
        "Sinais de copytrading",
        "Suporte prioritário",
        "Dashboard personalizado"
      ]
    },
    {
      name: "VIP Elite",
      price: "R$ 397",
      period: "/mês",
      popular: false,
      features: [
        "Tudo do VIP Premium",
        "Consultoria personalizada",
        "Acesso antecipado a novidades",
        "Grupo VIP restrito (max 50 pessoas)",
        "Contato direto via WhatsApp",
        "Estratégias exclusivas"
      ]
    }
  ];

  const benefits = [
    {
      icon: <BarChart3 className="w-8 h-8 text-primary" />,
      title: "Análises Profissionais",
      description: "Receba análises detalhadas dos melhores traders de copytrading com métricas avançadas"
    },
    {
      icon: <MessageCircle className="w-8 h-8 text-primary" />,
      title: "Comunidade Exclusiva",
      description: "Faça parte de grupos Telegram com investidores sérios e troque experiências"
    },
    {
      icon: <Shield className="w-8 h-8 text-primary" />,
      title: "Suporte Prioritário",
      description: "Tire suas dúvidas diretamente com nossa equipe de especialistas"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="container mx-auto px-4 pt-24 pb-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <Crown className="w-16 h-16 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-6">
            Área VIP
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Acesso exclusivo a análises premium, grupos restritos e suporte personalizado 
            para investidores que levam copytrading a sério.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <Card key={index} className="border-0 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 text-center">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  {benefit.icon}
                </div>
                <CardTitle className="text-xl">{benefit.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pricing Plans */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Escolha seu Plano
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Planos flexíveis para diferentes níveis de investimento
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative border-2 hover:shadow-xl transition-all duration-300 ${
              plan.popular ? 'border-primary bg-primary/5' : 'border-border bg-card/50'
            }`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground px-4 py-1">
                    <Star className="w-4 h-4 mr-1" />
                    Mais Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <div className="flex items-baseline justify-center mt-4">
                  <span className="text-4xl font-bold text-primary">{plan.price}</span>
                  <span className="text-muted-foreground ml-1">{plan.period}</span>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <div className="bg-primary/20 text-primary rounded-full p-1 mt-0.5">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                      </div>
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  variant={plan.popular ? "cta" : "outline"} 
                  className="w-full mt-6"
                  size="lg"
                >
                  {plan.popular ? "Escolher Premium" : "Escolher Plano"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Testimonial Section */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 text-center">
          <Users className="w-12 h-12 text-primary mx-auto mb-4" />
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            +500 Membros VIP Satisfeitos
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            "A área VIP transformou completamente minha forma de investir. As análises são precisas e o suporte é excepcional."
          </p>
          <p className="text-sm font-medium text-primary">- João Silva, Membro VIP Premium</p>
        </div>
      </div>
    </div>
  );
};

export default AreaVip;