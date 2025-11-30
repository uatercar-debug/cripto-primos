import { Crown, MessageCircle, BookOpen, HelpCircle, Users, LogOut, Download, ExternalLink, Mail, Phone, TrendingUp, Calculator, FileText, Calendar, Star, Award, Target, Zap, Shield, Clock, Gift, BarChart3, PieChart, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Header from "@/components/navigation/Header";

const AreaVip = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const exclusiveContent = [
    {
      icon: <BookOpen className="w-8 h-8 text-primary" />,
      title: "Ebook Exclusivo",
      description: "Copytrading Descomplicado - Guia Completo",
      action: "Ler Ebook",
      onClick: () => navigate('/area-vip/ebook'),
      gradient: "from-blue-500 to-purple-600"
    },
    {
      icon: <MessageCircle className="w-8 h-8 text-primary" />,
      title: "Comunidade VIP",
      description: "Grupo Telegram exclusivo com traders experientes",
      action: "Entrar no Grupo",
      link: "https://t.me/+KaPCWjOtpn5lNmYx",
      isExternal: true,
      gradient: "from-green-500 to-teal-600"
    },
    {
      icon: <HelpCircle className="w-8 h-8 text-primary" />,
      title: "Suporte Especializado",
      description: "Tire suas dúvidas com nossa equipe de especialistas",
      action: "Falar com Suporte",
      link: "mailto:contato@criptoprimos.com",
      isExternal: true,
      gradient: "from-orange-500 to-red-600"
    }
  ];

  const bonusContent = [
    {
      icon: <Calculator className="w-8 h-8 text-primary" />,
      title: "Calculadora de Risco",
      description: "Calcule o tamanho ideal das suas posições",
      isNew: true
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-primary" />,
      title: "Dashboard de Performance",
      description: "Acompanhe seus resultados em tempo real",
      isNew: false
    },
    {
      icon: <PieChart className="w-8 h-8 text-primary" />,
      title: "Análise de Portfólio",
      description: "Visualize a distribuição dos seus investimentos",
      isNew: true
    },
    {
      icon: <FileText className="w-8 h-8 text-primary" />,
      title: "Relatórios Mensais",
      description: "Relatórios detalhados da sua performance",
      isNew: false
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-primary" />,
      title: "Sinais Premium",
      description: "Receba sinais exclusivos dos nossos analistas",
      isNew: true
    },
    {
      icon: <Calendar className="w-8 h-8 text-primary" />,
      title: "Calendário Econômico",
      description: "Fique por dentro dos eventos que impactam o mercado",
      isNew: false
    }
  ];

  const stats = [
    { label: "Membros Ativos", value: "2,847", icon: <Users className="w-5 h-5" /> },
    { label: "Taxa de Sucesso", value: "89%", icon: <Target className="w-5 h-5" /> },
    { label: "Lucro Médio Mensal", value: "15.2%", icon: <DollarSign className="w-5 h-5" /> },
    { label: "Traders Certificados", value: "127", icon: <Award className="w-5 h-5" /> },
    { label: "Suporte Disponível", value: "24/7", icon: <Shield className="w-5 h-5" /> },
    { label: "Tempo Online", value: "24/7", icon: <Clock className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Header />
      
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-background to-background"></div>

          <div className="container mx-auto px-3 sm:px-4 pt-20 sm:pt-24 pb-8 sm:pb-12 md:pb-16 relative z-10">
            {/* Security Warning Banner */}
            <div className="mb-4 sm:mb-6 md:mb-8">
              <Card className="border-2 border-yellow-500/50 bg-yellow-50/10">
                <CardContent className="p-3 sm:p-4 md:p-6">
                  <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                    <div className="p-2 bg-yellow-500/20 rounded-lg flex-shrink-0">
                      <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1 sm:mb-2">
                        ⚠️ Aviso Importante sobre Seu Acesso
                      </h3>
                      <p className="text-muted-foreground text-sm sm:text-base mb-2 sm:mb-3">
                        Este acesso é <strong>individual e vinculado ao seu e-mail</strong>.
                      </p>
                      <p className="text-muted-foreground text-xs sm:text-sm">
                        Por motivos de segurança, seu código só funciona no primeiro dispositivo usado. 
                        Se forem detectados acessos de diferentes dispositivos ou IPs, 
                        o sistema <strong>bloqueia automaticamente</strong> o código.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Hero Section */}
            <div className="text-center mb-8 sm:mb-12 md:mb-20">
              <div className="flex justify-center mb-4 sm:mb-6">
                <div className="p-3 sm:p-4 bg-primary/10 rounded-xl sm:rounded-2xl border border-primary/20">
                  <Crown className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-primary" />
                </div>
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-3 sm:mb-4 md:mb-6 tracking-tight">
                Área <span className="text-primary">VIP</span>
              </h1>
              
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mb-4 sm:mb-6 md:mb-8 px-2">
                Bem-vindo à nossa comunidade exclusiva! Aqui você tem acesso aos melhores conteúdos, 
                ferramentas avançadas e suporte dedicado para maximizar seus resultados no Copy Trading.
              </p>
              
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 mb-6 sm:mb-8 md:mb-12">
                <Badge variant="outline" className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs sm:text-sm">
                  <Zap className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  VIP Ativo
                </Badge>
                <Badge variant="outline" className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs sm:text-sm">
                  <Shield className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Vitalício
                </Badge>
                <Badge variant="outline" className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs sm:text-sm">
                  <Gift className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Exclusivo
                </Badge>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4 md:gap-6 mb-8 sm:mb-12 md:mb-20">
              {stats.map((stat, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-2 sm:p-3 md:p-4">
                    <div className="flex justify-center mb-1 sm:mb-2 text-primary">
                      <div className="w-4 h-4 sm:w-5 sm:h-5">{stat.icon}</div>
                    </div>
                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-[10px] sm:text-xs text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Tab Navigation */}
            <div className="flex justify-center mb-6 sm:mb-8 md:mb-12">
              <div className="bg-muted rounded-full p-1">
                <Button
                  variant={activeTab === 'overview' ? 'default' : 'ghost'}
                  onClick={() => setActiveTab('overview')}
                  className="rounded-full px-4 sm:px-6 md:px-8 py-2 sm:py-3 text-xs sm:text-sm"
                >
                  Visão Geral
                </Button>
                <Button
                  variant={activeTab === 'tools' ? 'default' : 'ghost'}
                  onClick={() => setActiveTab('tools')}
                  className="rounded-full px-4 sm:px-6 md:px-8 py-2 sm:py-3 text-xs sm:text-sm"
                >
                  Ferramentas
                </Button>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <>
                {/* Exclusive Content Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-12 md:mb-20">
                  {exclusiveContent.map((content, index) => (
                    <Card key={index} className="hover:shadow-xl transition-all duration-300 hover:transform hover:scale-[1.02] sm:hover:scale-105">
                      <CardHeader className="text-center pb-2 sm:pb-4">
                        <div className="flex justify-center mb-3 sm:mb-4">
                          <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-primary/10 border border-primary/20">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 text-primary">{content.icon}</div>
                          </div>
                        </div>
                        <CardTitle className="text-lg sm:text-xl font-bold">{content.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3 sm:space-y-4">
                        <p className="text-muted-foreground text-center text-sm sm:text-base">{content.description}</p>
                        <Button 
                          className="w-full text-sm sm:text-base"
                          onClick={() => {
                            if (content.onClick) {
                              content.onClick();
                            } else if (content.isExternal) {
                              window.open(content.link, '_blank');
                            }
                          }}
                        >
                          {content.isExternal && <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />}
                          {content.action}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Educational Content - Copy Trading Iframe */}
                <div className="text-center mb-8 sm:mb-12 md:mb-20">
                  <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2 sm:mb-4">
                    🎓 Material Educativo Exclusivo
                  </h2>
                  <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-3xl mx-auto mb-4 sm:mb-6 md:mb-8 px-2">
                    Aprenda tudo sobre Copy Trading com nosso conteúdo educativo premium e interativo
                  </p>
                  
                  <div className="max-w-4xl mx-auto">
                    <Card className="overflow-hidden shadow-lg">
                      <CardContent className="p-0">
                        <div className="aspect-video">
                          <iframe
                            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                            title="Copy Trading - Tutorial Completo"
                            className="w-full h-full"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'tools' && (
              <>
                {/* Tools and Features Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-8 sm:mb-12 md:mb-20">
                  {bonusContent.map((tool, index) => (
                    <Card key={index} className="hover:shadow-lg transition-all duration-300 relative cursor-pointer">
                      {tool.isNew && (
                        <Badge className="absolute -top-2 -right-2 bg-primary text-[10px] sm:text-xs">
                          NOVO
                        </Badge>
                      )}
                      <CardContent className="p-3 sm:p-4 md:p-6">
                        <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                          <div className="p-2 sm:p-3 bg-primary/10 rounded-lg border border-primary/20 flex-shrink-0">
                            <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-primary">{tool.icon}</div>
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-sm sm:text-base md:text-lg font-semibold truncate">{tool.title}</h3>
                            <p className="text-muted-foreground text-xs sm:text-sm line-clamp-2">{tool.description}</p>
                          </div>
                        </div>
                        <Button 
                          className="w-full text-xs sm:text-sm"
                          onClick={() => {
                            const toolRoutes = {
                              'Calculadora de Risco': 'risk-calculator',
                              'Dashboard de Performance': 'performance-dashboard',
                              'Análise de Portfólio': 'portfolio-analysis',
                              'Relatórios Mensais': 'monthly-reports',
                              'Sinais Premium': 'premium-signals',
                              'Calendário Econômico': 'economic-calendar'
                            };
                            const route = toolRoutes[tool.title as keyof typeof toolRoutes];
                            if (route) {
                              navigate(`/area-vip/${route}`);
                            }
                          }}
                        >
                          Acessar Ferramenta
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}

            {/* Support Section */}
            <div className="text-center mb-8 sm:mb-12 md:mb-16">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2 sm:mb-4">
                🤝 Suporte Dedicado
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-3xl mx-auto mb-4 sm:mb-6 md:mb-8 px-2">
                Nossa equipe está pronta para ajudar você com qualquer dúvida sobre copytrading, 
                configuração de contas ou uso das ferramentas.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6 max-w-4xl mx-auto">
                <Button 
                  className="w-full h-12 sm:h-14 md:h-16 text-sm sm:text-base md:text-lg"
                  variant="outline"
                  onClick={() => window.open('mailto:contato@criptoprimos.com', '_blank')}
                >
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 flex-shrink-0" />
                  <span className="truncate">contato@criptoprimos.com</span>
                </Button>
                <Button 
                  className="w-full h-12 sm:h-14 md:h-16 text-sm sm:text-base md:text-lg"
                  onClick={() => window.open('https://t.me/+KaPCWjOtpn5lNmYx', '_blank')}
                >
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
                  Telegram VIP
                </Button>
              </div>
            </div>
          </div>
    </div>
  );
};

export default AreaVip;