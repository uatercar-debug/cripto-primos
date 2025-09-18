import { Crown, MessageCircle, BookOpen, HelpCircle, Users, LogOut, Download, ExternalLink, Mail, Phone, TrendingUp, Calculator, FileText, Calendar, Star, Award, Target, Zap, Shield, Clock, Gift, BarChart3, PieChart, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Header from "@/components/navigation/Header";
import EbookReader from "@/components/ebook/EbookReader";

const AreaVip = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [showEbook, setShowEbook] = useState(false);

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
      onClick: () => setShowEbook(true),
      gradient: "from-blue-500 to-purple-600"
    },
    {
      icon: <MessageCircle className="w-8 h-8 text-primary" />,
      title: "Comunidade VIP",
      description: "Grupo Telegram exclusivo com traders experientes",
      action: "Entrar no Grupo",
      link: "https://t.me/criptoprimosvip",
      isExternal: true,
      gradient: "from-green-500 to-teal-600"
    },
    {
      icon: <HelpCircle className="w-8 h-8 text-primary" />,
      title: "Suporte Especializado",
      description: "Tire suas dúvidas com nossa equipe de especialistas",
      action: "Falar com Suporte",
      link: "mailto:suporte@criptoprimos.com",
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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      <Header />
      
      {/* Conditional Rendering - Show Ebook or Main Content */}
      {showEbook ? (
        <div className="container mx-auto px-4 py-20">
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={() => setShowEbook(false)}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              ← Voltar para Área VIP
            </Button>
          </div>
          <EbookReader />
        </div>
      ) : (
        <>
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
            <div className="absolute top-40 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          </div>

          <div className="container mx-auto px-4 pt-24 pb-16 relative z-10">
            {/* Hero Section */}
            <div className="text-center mb-20">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-lg opacity-75 animate-pulse"></div>
                  <div className="relative bg-gradient-to-r from-yellow-400 to-orange-500 p-6 rounded-full">
                    <Crown className="w-16 h-16 text-white" />
                  </div>
                </div>
              </div>
              
              <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                Área <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">VIP</span>
              </h1>
              
              <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8">
                Bem-vindo à nossa comunidade exclusiva! Aqui você tem acesso aos melhores conteúdos, 
                ferramentas avançadas e suporte dedicado para maximizar seus resultados no Copy Trading.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4 mb-12">
                <Badge className="bg-green-500/20 text-green-300 border-green-500/30 px-4 py-2 text-sm">
                  <Zap className="w-4 h-4 mr-2" />
                  Membro VIP Ativo
                </Badge>
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 px-4 py-2 text-sm">
                  <Shield className="w-4 h-4 mr-2" />
                  Acesso Vitalício
                </Badge>
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 px-4 py-2 text-sm">
                  <Gift className="w-4 h-4 mr-2" />
                  Conteúdo Exclusivo
                </Badge>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-20">
              {stats.map((stat, index) => (
                <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 text-center hover:bg-white/15 transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="flex justify-center mb-2 text-primary">
                      {stat.icon}
                    </div>
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-xs text-white/70">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Tab Navigation */}
            <div className="flex justify-center mb-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-full p-2 border border-white/20">
                <Button
                  variant={activeTab === 'overview' ? 'default' : 'ghost'}
                  onClick={() => setActiveTab('overview')}
                  className={`rounded-full px-8 py-3 transition-all duration-300 ${
                    activeTab === 'overview' 
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg' 
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Visão Geral
                </Button>
                <Button
                  variant={activeTab === 'tools' ? 'default' : 'ghost'}
                  onClick={() => setActiveTab('tools')}
                  className={`rounded-full px-8 py-3 transition-all duration-300 ${
                    activeTab === 'tools' 
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg' 
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Ferramentas
                </Button>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <>
                {/* Exclusive Content Grid */}
                <div className="grid md:grid-cols-3 gap-8 mb-20">
                  {exclusiveContent.map((content, index) => (
                    <Card key={index} className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border-white/10 hover:border-white/20 transition-all duration-500 hover:transform hover:scale-105 overflow-hidden">
                      <CardHeader className="text-center pb-4">
                        <div className="flex justify-center mb-4">
                          <div className={`p-4 rounded-full bg-gradient-to-r ${content.gradient} shadow-lg`}>
                            {content.icon}
                          </div>
                        </div>
                        <CardTitle className="text-xl font-bold text-white">{content.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-white/80 text-center">{content.description}</p>
                        <Button 
                          className={`w-full bg-gradient-to-r ${content.gradient} hover:opacity-90 text-white border-0`}
                          onClick={() => {
                            if (content.onClick) {
                              content.onClick();
                            } else if (content.isExternal) {
                              window.open(content.link, '_blank');
                            }
                          }}
                        >
                          {content.isExternal && <ExternalLink className="w-4 h-4 mr-2" />}
                          {content.action}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Educational Content - Copy Trading Iframe */}
                <div className="text-center mb-20">
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    🎓 Material Educativo Exclusivo
                  </h2>
                  <p className="text-white/80 text-lg max-w-3xl mx-auto mb-8">
                    Aprenda tudo sobre Copy Trading com nosso conteúdo educativo premium e interativo
                  </p>
                  
                  <div className="max-w-4xl mx-auto">
                    <Card className="bg-white/10 backdrop-blur-sm border-white/20 overflow-hidden">
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
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
                  {bonusContent.map((tool, index) => (
                    <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300 relative cursor-pointer">
                      {tool.isNew && (
                        <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
                          NOVO
                        </Badge>
                      )}
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
                            {tool.icon}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-white">{tool.title}</h3>
                            <p className="text-white/70 text-sm">{tool.description}</p>
                          </div>
                        </div>
                        <Button 
                          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90 text-white border-0"
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
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                🤝 Suporte Dedicado
              </h2>
              <p className="text-white/80 text-lg max-w-3xl mx-auto mb-8">
                Nossa equipe de especialistas está pronta para ajudar você com qualquer dúvida sobre copytrading, 
                configuração de contas, estratégias de investimento ou uso das ferramentas.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                <Button 
                  className="w-full h-16 bg-gradient-to-r from-blue-500 to-cyan-600 hover:opacity-90 text-white border-0 text-lg"
                  onClick={() => window.open('mailto:suporte@criptoprimos.com', '_blank')}
                >
                  <Mail className="w-5 h-5 mr-3" />
                  E-mail: suporte@criptoprimos.com
                </Button>
                <Button 
                  className="w-full h-16 bg-gradient-to-r from-green-500 to-teal-600 hover:opacity-90 text-white border-0 text-lg"
                  onClick={() => window.open('https://t.me/criptoprimosvip', '_blank')}
                >
                  <MessageCircle className="w-5 h-5 mr-3" />
                  Telegram: @criptoprimosvip
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AreaVip;