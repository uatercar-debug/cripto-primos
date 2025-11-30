import { Link } from "react-router-dom";
import Header from "@/components/navigation/Header";
import { Button } from "@/components/ui/button";
import { Home, Mail, MessageCircle, HelpCircle, FileText, Shield } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Suporte = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <Header />
      <div className="container mx-auto px-4 py-8 sm:py-12 max-w-6xl">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Central de Suporte
          </h1>
          <p className="text-muted-foreground text-lg">
            Estamos aqui para ajudar você. Escolha uma opção abaixo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <HelpCircle className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Perguntas Frequentes</CardTitle>
              </div>
              <CardDescription>
                Encontre respostas para as dúvidas mais comuns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div>
                  <p className="font-semibold text-foreground mb-1">Como acessar a Área VIP?</p>
                  <p>Após o pagamento, você receberá um código de acesso por e-mail. Use esse código na página de login para acessar a Área VIP.</p>
                </div>
                <Separator />
                <div>
                  <p className="font-semibold text-foreground mb-1">Posso compartilhar meu código de acesso?</p>
                  <p>Não. Cada código é individual e vinculado ao seu e-mail. Compartilhamento pode resultar em bloqueio da conta.</p>
                </div>
                <Separator />
                <div>
                  <p className="font-semibold text-foreground mb-1">Como funciona o programa de afiliados?</p>
                  <p>Você pode se cadastrar como afiliado e ganhar comissões indicando nossos produtos. Veja mais detalhes na página de afiliados.</p>
                </div>
                <Separator />
                <div>
                  <p className="font-semibold text-foreground mb-1">Qual é a política de reembolso?</p>
                  <p>Oferecemos garantia de reembolso conforme especificado na política de garantia de cada produto.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Entre em Contato</CardTitle>
              </div>
              <CardDescription>
                Envie-nos uma mensagem e responderemos o mais rápido possível
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Para questões sobre sua conta, pagamentos, acesso à Área VIP ou qualquer outra dúvida, 
                  envie um e-mail para:
                </p>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="font-mono text-sm break-all text-primary">
                    suporte@copytradingdescomplicado.com
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  Tempo médio de resposta: 24-48 horas úteis
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Documentação</CardTitle>
              </div>
              <CardDescription>
                Acesse nossos documentos legais e políticas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/termos">
                    <FileText className="w-4 h-4 mr-2" />
                    Termos de Uso
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/privacidade">
                    <Shield className="w-4 h-4 mr-2" />
                    Política de Privacidade
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <MessageCircle className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Outros Recursos</CardTitle>
              </div>
              <CardDescription>
                Links úteis e informações adicionais
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/afiliados">
                    Programa de Afiliados
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/recomendacoes">
                    Recomendações de Traders
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/newsletter">
                    Newsletter
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-yellow-50/10 border-2 border-yellow-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-yellow-500" />
              Aviso de Segurança
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong>Importante:</strong> Nunca compartilhe seu código de acesso com terceiros. 
              Nossa equipe de suporte nunca solicitará sua senha ou código de acesso por e-mail ou telefone. 
              Se você receber uma solicitação suspeita, entre em contato conosco imediatamente.
            </p>
          </CardContent>
        </Card>

        <Separator className="my-8" />

        <div className="flex justify-center">
          <Button asChild>
            <Link to="/">
              <Home className="w-4 h-4 mr-2" />
              Voltar ao Início
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Suporte;


