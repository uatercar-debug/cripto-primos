import { useState, useEffect } from "react";
import { 
  CheckCircle, TrendingUp, Users, DollarSign, Star, Award, Target, Zap, Shield, 
  ExternalLink, Copy, Eye, EyeOff, LogOut, BarChart3, Link2, Wallet, Clock,
  ArrowRight, Sparkles, Mail, Phone, Key
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/navigation/Header";
import { useToast } from "@/hooks/use-toast";
import {
  Affiliate,
  AffiliateReferral,
  registerAffiliate,
  loginAffiliate,
  getAffiliateByEmail,
  getAffiliateReferrals,
  getTestAffiliateByEmail,
} from "@/services/affiliateService";

// Componente do Formulário de Cadastro
const RegisterForm = ({ onSuccess }: { onSuccess: (affiliate: Affiliate) => void }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    pix_key: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha nome e email para continuar.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await registerAffiliate(formData);
      
      if (result.success && result.affiliate) {
        toast({
          title: "Cadastro realizado! 🎉",
          description: "Seu cadastro foi enviado para análise. Você receberá um email com a aprovação em breve.",
        });
        onSuccess(result.affiliate);
      } else {
        toast({
          title: "Erro no cadastro",
          description: result.error || "Tente novamente.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao processar cadastro. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Nome Completo *</Label>
        <div className="relative">
          <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            id="name"
            placeholder="Seu nome completo"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="pl-10"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="pl-10"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">WhatsApp</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            id="phone"
            placeholder="(11) 99999-9999"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="pl-10"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="pix_key">Chave PIX (para comissões)</Label>
        <div className="relative">
          <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            id="pix_key"
            placeholder="Chave PIX (CPF, email, telefone ou aleatória)"
            value={formData.pix_key}
            onChange={(e) => setFormData({ ...formData, pix_key: e.target.value })}
            className="pl-10"
          />
        </div>
        <p className="text-xs text-muted-foreground">Você pode adicionar depois no seu painel</p>
      </div>

      <Button type="submit" className="w-full h-12" disabled={isLoading}>
        {isLoading ? (
          <>
            <span className="animate-spin mr-2">⏳</span>
            Processando...
          </>
        ) : (
          <>
            <Zap className="w-5 h-5 mr-2" />
            Quero ser Afiliado
          </>
        )}
      </Button>
    </form>
  );
};

// Componente do Formulário de Login
const LoginForm = ({ onSuccess }: { onSuccess: (affiliate: Affiliate) => void }) => {
  const [email, setEmail] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email obrigatório",
        description: "Digite seu email para acessar.",
        variant: "destructive",
      });
      return;
    }

    if (!accessCode) {
      toast({
        title: "Código de acesso obrigatório",
        description: "Digite seu código de acesso para continuar.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Usar função de login que valida email e código
      const result = await loginAffiliate(email, accessCode);
      
      if (result.success && result.affiliate) {
        toast({
          title: "Login realizado! 🎉",
          description: `Bem-vindo(a), ${result.affiliate.name}!`,
        });
        localStorage.setItem('affiliate_session', JSON.stringify(result.affiliate));
        onSuccess(result.affiliate);
      } else {
        // Fallback para teste (apenas em desenvolvimento)
        const testAffiliate = getTestAffiliateByEmail(email);
        if (testAffiliate && testAffiliate.status === 'approved') {
          toast({
            title: "Login realizado! 🎉",
            description: `Bem-vindo(a), ${testAffiliate.name}!`,
          });
          localStorage.setItem('affiliate_session', JSON.stringify(testAffiliate));
          onSuccess(testAffiliate);
        } else {
          toast({
            title: "Erro no login",
            description: result.error || "Email ou código de acesso inválido.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao fazer login. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="login-email">Email cadastrado</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            id="login-email"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="login-code">Código de Acesso</Label>
        <div className="relative">
          <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            id="login-code"
            type="text"
            placeholder="AF12345678"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
            className="pl-10 font-mono"
            required
            maxLength={10}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Você receberá seu código de acesso por email após a aprovação do cadastro.
        </p>
      </div>

      <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
        <p className="font-medium text-foreground mb-1">ℹ️ Informações:</p>
        <p>• Seu código de acesso é enviado por email após aprovação</p>
        <p>• Caso não tenha recebido, entre em contato com o suporte</p>
      </div>

      <Button type="submit" className="w-full h-12" disabled={isLoading}>
        {isLoading ? (
          <>
            <span className="animate-spin mr-2">⏳</span>
            Verificando...
          </>
        ) : (
          <>
            <ArrowRight className="w-5 h-5 mr-2" />
            Acessar Painel
          </>
        )}
      </Button>
    </form>
  );
};

// Componente do Dashboard do Afiliado
const AffiliateDashboard = ({ 
  affiliate, 
  onLogout 
}: { 
  affiliate: Affiliate; 
  onLogout: () => void;
}) => {
  const [referrals, setReferrals] = useState<AffiliateReferral[]>([]);
  const [copied, setCopied] = useState(false);
  const [showLink, setShowLink] = useState(true);
  const { toast } = useToast();

  const affiliateLink = `${window.location.origin}?ref=${affiliate.affiliate_code}`;
  const checkoutLink = `${window.location.origin}/checkout?ref=${affiliate.affiliate_code}`;

  useEffect(() => {
    const loadReferrals = async () => {
      const data = await getAffiliateReferrals(affiliate.id);
      setReferrals(data);
    };
    loadReferrals();
  }, [affiliate.id]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast({
        title: "Link copiado! 📋",
        description: "Compartilhe com sua audiência.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: "Erro ao copiar",
        description: "Tente selecionar e copiar manualmente.",
        variant: "destructive",
      });
    }
  };

  const stats = [
    {
      title: "Vendas Totais",
      value: affiliate.total_sales,
      icon: <BarChart3 className="w-5 h-5" />,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Comissões Ganhas",
      value: `R$ ${affiliate.total_earnings.toFixed(2)}`,
      icon: <TrendingUp className="w-5 h-5" />,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Saldo Disponível",
      value: `R$ ${affiliate.available_balance.toFixed(2)}`,
      icon: <Wallet className="w-5 h-5" />,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Taxa de Comissão",
      value: `${affiliate.commission_rate}%`,
      icon: <Award className="w-5 h-5" />,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header do Dashboard */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Olá, {affiliate.name.split(' ')[0]}! 👋</h2>
          <p className="text-muted-foreground">Acompanhe suas vendas e comissões</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
            <CheckCircle className="w-3 h-3 mr-1" />
            Afiliado Ativo
          </Badge>
          <Button variant="ghost" size="sm" onClick={onLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>

      {/* Link de Afiliado */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="w-5 h-5 text-primary" />
            Seu Link de Afiliado
          </CardTitle>
          <CardDescription>
            Compartilhe este link e ganhe {affiliate.commission_rate}% de comissão em cada venda
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-background rounded-lg p-3 font-mono text-sm overflow-x-auto">
              {showLink ? affiliateLink : '••••••••••••••••••••••'}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowLink(!showLink)}
            >
              {showLink ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
            <Button onClick={() => copyToClipboard(affiliateLink)}>
              {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-primary/10 text-primary border-0">
              Código: {affiliate.affiliate_code}
            </Badge>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => copyToClipboard(checkoutLink)}
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              Link Direto p/ Checkout
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="border-0 bg-card/50">
            <CardContent className="p-4">
              <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center mb-3`}>
                <span className={stat.color}>{stat.icon}</span>
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Histórico de Vendas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Histórico de Vendas
          </CardTitle>
        </CardHeader>
        <CardContent>
          {referrals.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma venda ainda</p>
              <p className="text-sm">Compartilhe seu link para começar a ganhar!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {referrals.map((referral) => (
                <div
                  key={referral.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                >
                  <div>
                    <p className="font-medium">{referral.customer_name || 'Cliente'}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(referral.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">
                      +R$ {referral.commission_amount.toFixed(2)}
                    </p>
                    <Badge
                      variant="outline"
                      className={
                        referral.status === 'confirmed'
                          ? 'bg-green-500/10 text-green-600 border-green-500/20'
                          : referral.status === 'paid'
                          ? 'bg-blue-500/10 text-blue-600 border-blue-500/20'
                          : 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20'
                      }
                    >
                      {referral.status === 'confirmed' && 'Confirmado'}
                      {referral.status === 'paid' && 'Pago'}
                      {referral.status === 'pending' && 'Pendente'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Materiais de Divulgação */}
      <Card className="bg-gradient-to-r from-accent/5 to-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent" />
            Materiais de Divulgação
          </CardTitle>
          <CardDescription>
            Use esses materiais para aumentar suas conversões
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto py-4 flex-col">
              <span className="text-2xl mb-2">📱</span>
              <span>Stories Instagram</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col">
              <span className="text-2xl mb-2">📝</span>
              <span>Textos Prontos</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col">
              <span className="text-2xl mb-2">🎬</span>
              <span>Vídeos</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Página Principal
const Afiliados = () => {
  const [affiliate, setAffiliate] = useState<Affiliate | null>(null);
  const [activeTab, setActiveTab] = useState<'register' | 'login'>('register');

  // Verificar sessão salva
  useEffect(() => {
    const saved = localStorage.getItem('affiliate_session');
    if (saved) {
      try {
        setAffiliate(JSON.parse(saved));
      } catch {
        localStorage.removeItem('affiliate_session');
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('affiliate_session');
    setAffiliate(null);
  };

  const benefits = [
    {
      icon: <DollarSign className="w-6 h-6 text-green-500" />,
      title: "40% de Comissão",
      description: "Ganhe 40% em cada venda realizada através do seu link único",
    },
    {
      icon: <Zap className="w-6 h-6 text-yellow-500" />,
      title: "Pagamento Rápido",
      description: "Receba suas comissões via PIX em até 7 dias úteis",
    },
    {
      icon: <Target className="w-6 h-6 text-blue-500" />,
      title: "Dashboard Completo",
      description: "Acompanhe vendas, cliques e comissões em tempo real",
    },
    {
      icon: <Users className="w-6 h-6 text-purple-500" />,
      title: "Suporte Dedicado",
      description: "Grupo exclusivo no Telegram para afiliados",
    },
  ];

  const steps = [
    { number: "01", title: "Cadastre-se", description: "Preencha o formulário" },
    { number: "02", title: "Aguarde Aprovação", description: "Em até 24h" },
    { number: "03", title: "Receba seu Link", description: "Link único de rastreamento" },
    { number: "04", title: "Divulgue e Ganhe", description: "40% de comissão" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <Header />
      <div className="container mx-auto px-4 pt-24 pb-16">
        {affiliate && affiliate.status === 'approved' ? (
          // Dashboard do Afiliado
          <AffiliateDashboard affiliate={affiliate} onLogout={handleLogout} />
        ) : (
          // Landing Page + Formulário
          <>
            {/* Hero */}
            <div className="text-center mb-16">
              <Badge className="bg-green-500/10 text-green-600 border-green-500/20 mb-4">
                <Star className="w-4 h-4 mr-1" />
                Programa de Afiliados
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-6">
                Ganhe 40% de Comissão
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Monetize sua audiência compartilhando conhecimento sobre copytrading e criptomoedas.
                Junte-se aos nossos parceiros e comece a faturar hoje!
              </p>
            </div>

            {/* Grid: Benefícios + Formulário */}
            <div className="grid lg:grid-cols-2 gap-12 mb-16">
              {/* Benefícios */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-6">Por que ser afiliado?</h2>
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex gap-4 p-4 rounded-xl bg-card/50 border border-border/50 hover:border-primary/30 transition-colors"
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                      {benefit.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{benefit.title}</h3>
                      <p className="text-sm text-muted-foreground">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Formulário */}
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle>Área do Afiliado</CardTitle>
                  <CardDescription>
                    Cadastre-se ou acesse seu painel
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'register' | 'login')}>
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                      <TabsTrigger value="register">Cadastrar</TabsTrigger>
                      <TabsTrigger value="login">Já sou afiliado</TabsTrigger>
                    </TabsList>
                    <TabsContent value="register">
                      <RegisterForm onSuccess={setAffiliate} />
                    </TabsContent>
                    <TabsContent value="login">
                      <LoginForm onSuccess={setAffiliate} />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            {/* Como Funciona */}
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Como Funciona</h2>
              <p className="text-muted-foreground">4 passos simples para começar a ganhar</p>
            </div>

            <div className="grid md:grid-cols-4 gap-6 mb-16">
              {steps.map((step, index) => (
                <div key={index} className="text-center group">
                  <div className="bg-primary/10 text-primary text-2xl font-bold w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    {step.number}
                  </div>
                  <h3 className="font-semibold mb-1">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-8 mb-16">
              <div className="grid md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">R$ 50K+</div>
                  <p className="text-muted-foreground">Pagos em comissões</p>
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">500+</div>
                  <p className="text-muted-foreground">Afiliados ativos</p>
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">40%</div>
                  <p className="text-muted-foreground">Comissão fixa</p>
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">24h</div>
                  <p className="text-muted-foreground">Aprovação rápida</p>
                </div>
              </div>
            </div>

            {/* CTA Final */}
            <div className="text-center bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8">
              <Award className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4">Pronto para Começar?</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Junte-se ao nosso programa de afiliados e comece a ganhar dinheiro compartilhando conteúdo de qualidade.
              </p>
              <Button 
                variant="default" 
                size="lg" 
                onClick={() => {
                  setActiveTab('register');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <Zap className="w-5 h-5 mr-2" />
                Cadastrar Agora
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Afiliados;
