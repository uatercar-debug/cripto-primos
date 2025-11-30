import { Link } from "react-router-dom";
import Header from "@/components/navigation/Header";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const Privacidade = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <Header />
      <div className="container mx-auto px-4 py-8 sm:py-12 max-w-4xl">
        <div className="bg-card rounded-lg shadow-lg p-6 sm:p-8 md:p-10">
          <h1 className="text-3xl sm:text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Política de Privacidade
          </h1>
          
          <p className="text-sm text-muted-foreground mb-8">
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </p>

          <Separator className="mb-8" />

          <div className="prose prose-sm sm:prose-base max-w-none space-y-6 text-foreground">
            <section>
              <h2 className="text-xl sm:text-2xl font-semibold mb-4">1. Introdução</h2>
              <p className="text-muted-foreground leading-relaxed">
                O Copytrading Descomplicado está comprometido em proteger sua privacidade. Esta Política de 
                Privacidade descreve como coletamos, usamos, armazenamos e protegemos suas informações pessoais 
                quando você utiliza nossos serviços.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold mb-4">2. Informações que Coletamos</h2>
              <div className="space-y-3 text-muted-foreground">
                <p className="leading-relaxed">
                  <strong>2.1. Informações Fornecidas por Você:</strong>
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Nome completo</li>
                  <li>Endereço de e-mail</li>
                  <li>Informações de pagamento (processadas por terceiros seguros como Mercado Pago)</li>
                  <li>Informações de conta e preferências</li>
                </ul>
                
                <p className="leading-relaxed mt-4">
                  <strong>2.2. Informações Coletadas Automaticamente:</strong>
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Endereço IP</li>
                  <li>Tipo de navegador e dispositivo</li>
                  <li>Páginas visitadas e tempo de permanência</li>
                  <li>Cookies e tecnologias similares</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold mb-4">3. Como Usamos suas Informações</h2>
              <div className="space-y-3 text-muted-foreground">
                <p className="leading-relaxed">Utilizamos suas informações para:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Fornecer e melhorar nossos serviços</li>
                  <li>Processar pagamentos e gerenciar sua conta</li>
                  <li>Enviar comunicações relacionadas ao serviço (e-mails de confirmação, atualizações, etc.)</li>
                  <li>Personalizar sua experiência</li>
                  <li>Detectar e prevenir fraudes</li>
                  <li>Cumprir obrigações legais</li>
                  <li>Enviar newsletters e comunicações de marketing (com seu consentimento)</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold mb-4">4. Compartilhamento de Informações</h2>
              <div className="space-y-3 text-muted-foreground">
                <p className="leading-relaxed">
                  Não vendemos suas informações pessoais. Podemos compartilhar suas informações apenas nas 
                  seguintes situações:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>
                    <strong>Prestadores de Serviços:</strong> Com empresas que nos ajudam a operar nosso negócio 
                    (processamento de pagamentos, hospedagem, análise de dados), sujeitos a acordos de confidencialidade.
                  </li>
                  <li>
                    <strong>Obrigações Legais:</strong> Quando exigido por lei, ordem judicial ou processo legal.
                  </li>
                  <li>
                    <strong>Proteção de Direitos:</strong> Para proteger nossos direitos, propriedade ou segurança, 
                    ou de nossos usuários.
                  </li>
                  <li>
                    <strong>Com seu Consentimento:</strong> Em outras situações, com seu consentimento explícito.
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold mb-4">5. Cookies e Tecnologias Similares</h2>
              <div className="space-y-3 text-muted-foreground">
                <p className="leading-relaxed">
                  Utilizamos cookies e tecnologias similares para melhorar sua experiência, analisar o uso do site 
                  e personalizar conteúdo. Você pode gerenciar suas preferências de cookies através das configurações 
                  do seu navegador.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold mb-4">6. Segurança dos Dados</h2>
              <p className="text-muted-foreground leading-relaxed">
                Implementamos medidas de segurança técnicas e organizacionais apropriadas para proteger suas informações 
                pessoais contra acesso não autorizado, alteração, divulgação ou destruição. No entanto, nenhum método 
                de transmissão pela internet ou armazenamento eletrônico é 100% seguro.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold mb-4">7. Seus Direitos</h2>
              <div className="space-y-3 text-muted-foreground">
                <p className="leading-relaxed">De acordo com a LGPD, você tem direito a:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Acessar suas informações pessoais</li>
                  <li>Corrigir dados incompletos, inexatos ou desatualizados</li>
                  <li>Solicitar a exclusão de dados desnecessários ou tratados em desconformidade</li>
                  <li>Solicitar a portabilidade dos dados</li>
                  <li>Revogar seu consentimento</li>
                  <li>Ser informado sobre compartilhamento de dados</li>
                </ul>
                <p className="leading-relaxed mt-4">
                  Para exercer esses direitos, entre em contato conosco através da página de 
                  <Link to="/suporte" className="text-primary hover:underline ml-1">Suporte</Link>.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold mb-4">8. Retenção de Dados</h2>
              <p className="text-muted-foreground leading-relaxed">
                Mantemos suas informações pessoais apenas pelo tempo necessário para cumprir os propósitos descritos 
                nesta política, a menos que um período de retenção mais longo seja exigido ou permitido por lei.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold mb-4">9. Privacidade de Menores</h2>
              <p className="text-muted-foreground leading-relaxed">
                Nossos serviços não são direcionados a menores de 18 anos. Não coletamos intencionalmente informações 
                pessoais de menores. Se tomarmos conhecimento de que coletamos informações de um menor, tomaremos 
                medidas para excluir essas informações.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold mb-4">10. Alterações nesta Política</h2>
              <p className="text-muted-foreground leading-relaxed">
                Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você sobre mudanças 
                significativas publicando a nova política nesta página e atualizando a data de "Última atualização".
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold mb-4">11. Contato</h2>
              <p className="text-muted-foreground leading-relaxed">
                Se você tiver dúvidas ou preocupações sobre esta Política de Privacidade ou sobre como tratamos 
                suas informações pessoais, entre em contato através da página de 
                <Link to="/suporte" className="text-primary hover:underline ml-1">Suporte</Link>.
              </p>
            </section>
          </div>

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
    </div>
  );
};

export default Privacidade;


