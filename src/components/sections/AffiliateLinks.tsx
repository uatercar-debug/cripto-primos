import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Copy, CheckCircle, Users, Heart, Gift, Zap, Star } from "lucide-react";
import { useState, useEffect } from "react";

const AffiliateLinks = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [copiedExness, setCopiedExness] = useState(false);
  const [copiedBinance, setCopiedBinance] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 600);
    return () => clearTimeout(timer);
  }, []);

  const platforms = [
    {
      name: "Exness",
      description: "Corretora regulamentada e confiável para copytrading",
      link: "https://one.exnesstrack.org/a/4tbg0vx3jn",
      mobileLink: "https://social-trading.exness.com/a/4tbg0vx3jn/?platform=mobile",
      code: "4tbg0vx3jn",
      color: "from-blue-500 to-cyan-500",
      icon: (
        <img 
          src="/exness-logo.png" 
          alt="Exness Logo" 
          className="w-96 h-96 object-contain"
        />
      ),
      benefits: ["Regulamentada", "Baixas taxas", "Suporte 24/7"]
    },
    {
      name: "Binance",
      description: "Maior exchange de criptomoedas do mundo",
      link: "https://www.binance.com/referral/earn-together/refer-in-hotsummer/claim?hl=pt-BR&ref=GRO_20338_VSPUM&utm_source=default",
      code: "GRO_20338_VSPUM",
      color: "from-yellow-500 to-orange-500",
      icon: (
        <img 
          src="/binance-logo.png" 
          alt="Binance Logo" 
          className="w-96 h-96 object-contain"
        />
      ),
      benefits: ["Maior volume", "Criptomoedas", "Futuros"]
    }
  ];

  const copyToClipboard = async (text: string, type: 'exness' | 'binance') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'exness') {
        setCopiedExness(true);
        setTimeout(() => setCopiedExness(false), 2000);
      } else {
        setCopiedBinance(true);
        setTimeout(() => setCopiedBinance(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <section className="py-24 bg-muted/30 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <Badge className="bg-success/10 border border-success/20 rounded-full px-4 py-2 mb-6">
              <Heart className="w-4 h-4 mr-2 text-success" />
              <span className="text-sm font-medium text-success">Apoie o Projeto</span>
            </Badge>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-foreground">
              Já tem experiência?
              <br />
              <span className="text-primary">
                Que ótimo! 🚀
              </span>
            </h2>
            
            <div className="max-w-4xl mx-auto space-y-6">
              <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
                Conhece os termos técnicos e sabe por onde começar? 
                <strong className="text-green-600 dark:text-green-400"> Desejamos sucesso na sua jornada!</strong>
              </p>
              
              <div className="bg-muted/50 rounded-2xl p-8 border border-border">
                <div className="flex items-start gap-4">
                  <div className="bg-primary p-3 rounded-2xl">
                    <Gift className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-2">
                      Nos Apoie Utilizando Nossos Códigos de Afiliado
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Assim você nos apoia a manter esse projeto, ajuda a levar educação financeira a mais pessoas 
                      e ainda garante <strong className="text-success">isenção de taxas extras</strong>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Platforms Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {platforms.map((platform, index) => (
              <div
                key={index}
                className={`transition-all duration-1000 delay-${(index + 1) * 200} ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
              >
                <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm overflow-hidden">
                            <CardHeader className="text-center pb-4">
                              <div className="flex justify-center mb-6">
                                <div className="group-hover:scale-110 transition-all duration-300">
                                  {platform.icon}
                                </div>
                              </div>
                              <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                                {platform.name}
                              </CardTitle>
                              <p className="text-slate-600 dark:text-slate-300">
                                {platform.description}
                              </p>
                            </CardHeader>
                  
                  <CardContent className="space-y-6">
                    {/* Benefits */}
                    <div className="flex flex-wrap gap-2 justify-center">
                      {platform.benefits.map((benefit, idx) => (
                        <Badge key={idx} className="bg-primary text-primary-foreground border-0">
                          {benefit}
                        </Badge>
                      ))}
                    </div>

                    {/* Code Display */}
                    <div className="bg-slate-100 dark:bg-slate-700 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Código de Afiliado:</p>
                          <p className="font-mono text-lg font-bold text-slate-900 dark:text-white">
                            {platform.code}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(platform.code, platform.name.toLowerCase() as 'exness' | 'binance')}
                          className="ml-4"
                        >
                          {platform.name.toLowerCase() === 'exness' ? (copiedExness ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />) : 
                           (copiedBinance ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />)}
                        </Button>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      <Button
                        className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg shadow-md hover:shadow-lg transition-all duration-300 group"
                        onClick={() => window.open(platform.link, '_blank')}
                      >
                        <ExternalLink className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                        Acessar {platform.name}
                      </Button>
                      
                      {platform.name === "Exness" && (
                        <Button
                          variant="outline"
                          className="w-full h-12 border-primary text-primary hover:bg-primary/10 font-semibold text-lg shadow-sm hover:shadow-md transition-all duration-300 group"
                          onClick={() => window.open((platform as any).mobileLink, '_blank')}
                        >
                          <ExternalLink className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                          Acessar Mobile
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {/* Platform Benefits */}
          <div className={`grid md:grid-cols-2 gap-8 mb-16 transition-all duration-1000 delay-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="bg-muted/50 rounded-2xl p-6 border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary p-3 rounded-xl">
                  <Zap className="w-6 h-6 text-primary-foreground" />
                </div>
                <h4 className="text-lg font-bold text-foreground">Por que Exness?</h4>
              </div>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span>Regulamentada pela CySEC e FCA</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span>Spreads a partir de 0.0 pips</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span>Execução instantânea</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span>Suporte 24/7 em português</span>
                </li>
              </ul>
            </div>

            <div className="bg-muted/50 rounded-2xl p-6 border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-accent p-3 rounded-xl">
                  <Star className="w-6 h-6 text-accent-foreground" />
                </div>
                <h4 className="text-lg font-bold text-foreground">Por que Binance?</h4>
              </div>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span>Maior volume de negociação mundial</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span>Mais de 600 criptomoedas</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span>Taxas competitivas (0.1%)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span>Plataforma segura e confiável</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Message */}
          <div className={`text-center transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="bg-muted/50 rounded-2xl p-8 border border-border">
              <div className="flex justify-center mb-4">
                <div className="bg-success p-4 rounded-2xl">
                  <Users className="w-8 h-8 text-success-foreground" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Obrigado pelo Apoio! 🙏
              </h3>
              <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
                Com seu apoio, podemos continuar criando conteúdo de qualidade e ajudando mais pessoas 
                a investirem com segurança e conhecimento.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AffiliateLinks;
