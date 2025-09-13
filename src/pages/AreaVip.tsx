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
      action: "Baixar Ebook",
      link: "#",
      isDownload: true,
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
      icon: <Calculator className="w-6 h-6" />,
      title: "Calculadora de Risco",
      description: "Calcule o risco ideal para suas operações",
      action: "Abrir Calculadora",
      isNew: true
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Dashboard de Performance",
      description: "Acompanhe seus resultados em tempo real",
      action: "Ver Dashboard",
      isNew: false
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Relatórios Mensais",
      description: "Análises detalhadas do mercado",
      action: "Baixar Relatório",
      isNew: false
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Agenda de Eventos",
      description: "Webinars e calls exclusivos",
      action: "Ver Agenda",
      isNew: true
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Metas Personalizadas",
      description: "Defina e acompanhe seus objetivos",
      action: "Configurar Metas",
      isNew: false
    },
    {
      icon: <Gift className="w-6 h-6" />,
      title: "Bônus Surpresa",
      description: "Conteúdo exclusivo liberado mensalmente",
      action: "Ver Bônus",
      isNew: true
    }
  ];

  const stats = [
    { label: "Membros Ativos", value: "2,847", icon: <Users className="w-5 h-5" /> },
    { label: "Taxa de Sucesso", value: "94.2%", icon: <TrendingUp className="w-5 h-5" /> },
    { label: "Lucro Médio", value: "R$ 3,240", icon: <DollarSign className="w-5 h-5" /> },
    { label: "Tempo Online", value: "24/7", icon: <Clock className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <Header />
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
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent animate-pulse">
              Área VIP
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto mb-8 leading-relaxed">
            🎉 <strong>Parabéns!</strong> Você agora tem acesso completo a todo o conteúdo exclusivo, 
            ferramentas avançadas e suporte premium para dominar o copytrading.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 text-lg">
              <Award className="w-5 h-5 mr-2" />
              Membro VIP Ativo
            </Badge>
            <Badge className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-6 py-2 text-lg">
              <Shield className="w-5 h-5 mr-2" />
              Acesso Vitalício
            </Badge>
          </div>
          
          <Button 
            variant="outline" 
            onClick={handleLogout} 
            className="group bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
          >
            <LogOut className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
            Sair da Área VIP
          </Button>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 text-center group hover:bg-white/20 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex justify-center mb-3">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-3 rounded-full">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-white/70 text-sm">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <div className="mb-12">
          <div className="flex justify-center mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-full p-2 border border-white/20">
              <Button
                variant={activeTab === 'overview' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('overview')}
                className={`rounded-full px-6 ${activeTab === 'overview' ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' : 'text-white hover:bg-white/20'}`}
              >
                <Star className="w-4 h-4 mr-2" />
                Visão Geral
              </Button>
              <Button
                variant={activeTab === 'tools' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('tools')}
                className={`rounded-full px-6 ml-2 ${activeTab === 'tools' ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' : 'text-white hover:bg-white/20'}`}
              >
                <Calculator className="w-4 h-4 mr-2" />
                Ferramentas
              </Button>
            </div>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Exclusive Content Cards */}
            <div className="grid md:grid-cols-3 gap-8 mb-20">
              {exclusiveContent.map((content, index) => (
                <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 group">
                  <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                      <div className={`bg-gradient-to-r ${content.gradient} p-6 rounded-2xl group-hover:scale-110 transition-transform duration-300`}>
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
                        if (content.isExternal) {
                          window.open(content.link, '_blank');
                        } else if (content.isDownload) {
                          alert('Download do ebook será implementado em breve!');
                        }
                      }}
                    >
                      {content.isDownload && <Download className="w-4 h-4 mr-2" />}
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
              
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-6">
                  📚 O que é Copy Trading?
                </h3>
                <div className="flex justify-center">
                  <iframe 
                    src="https://gamma.app/embed/xp6g1ejuvho4gzk" 
                    style={{width: '700px', maxWidth: '100%', height: '450px'}} 
                    allow="fullscreen" 
                    title="O que é Copy Trading?"
                    className="rounded-2xl shadow-2xl"
                  />
                </div>
                <p className="text-white/60 mt-4 text-sm">
                  ✨ Material educativo exclusivo para membros VIP
                </p>
              </div>
            </div>
          </>
        )}

        {/* Tools Tab */}
        {activeTab === 'tools' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {bonusContent.map((bonus, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 group">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl">
                        {bonus.icon}
                      </div>
                      <CardTitle className="text-white text-lg">{bonus.title}</CardTitle>
                    </div>
                    {bonus.isNew && (
                      <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                        <Zap className="w-3 h-3 mr-1" />
                        Novo
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-white/80 mb-4">{bonus.description}</p>
                  <Button 
                    variant="outline" 
                    className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
                    onClick={() => alert(`${bonus.action} - Funcionalidade em desenvolvimento!`)}
                  >
                    {bonus.action}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Support Section */}
        <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm rounded-3xl p-8 text-center border border-white/20">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-2xl">
              <HelpCircle className="w-12 h-12 text-white" />
            </div>
          </div>
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
            🆘 Precisa de Ajuda?
          </h3>
          <p className="text-white/80 mb-8 max-w-3xl mx-auto text-lg">
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
    </div>
  );
};

export default AreaVip;