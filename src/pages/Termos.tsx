import { Link } from "react-router-dom";
import Header from "@/components/navigation/Header";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const Termos = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <Header />
      <div className="container mx-auto px-4 py-8 sm:py-12 max-w-4xl">
        <div className="bg-card rounded-lg shadow-lg p-6 sm:p-8 md:p-10">
          <h1 className="text-3xl sm:text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Termos de Uso
          </h1>
          
          <p className="text-sm text-muted-foreground mb-8">
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </p>

          <Separator className="mb-8" />

          <div className="prose prose-sm sm:prose-base max-w-none space-y-6 text-foreground">
            <section>
              <h2 className="text-xl sm:text-2xl font-semibold mb-4">1. Aceitação dos Termos</h2>
              <p className="text-muted-foreground leading-relaxed">
                Ao acessar e utilizar o site Copytrading Descomplicado, você concorda em cumprir e estar vinculado 
                a estes Termos de Uso. Se você não concorda com qualquer parte destes termos, não deve utilizar 
                nossos serviços.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold mb-4">2. Descrição do Serviço</h2>
              <p className="text-muted-foreground leading-relaxed">
                O Copytrading Descomplicado oferece conteúdo educativo sobre copytrading, ferramentas de análise, 
                recomendações de traders e acesso a uma área VIP exclusiva. Nossos serviços são de natureza 
                educativa e informativa.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold mb-4">3. Acesso à Área VIP</h2>
              <div className="space-y-3 text-muted-foreground">
                <p className="leading-relaxed">
                  <strong>3.1.</strong> O acesso à Área VIP é exclusivo e individual. Cada código de acesso é 
                  vinculado ao e-mail usado no pagamento e liberado em apenas um dispositivo.
                </p>
                <p className="leading-relaxed">
                  <strong>3.2.</strong> O compartilhamento de códigos de acesso não é permitido e pode resultar 
                  em bloqueio automático da conta, sem direito a reembolso.
                </p>
                <p className="leading-relaxed">
                  <strong>3.3.</strong> Você é responsável por manter a confidencialidade do seu código de acesso 
                  e por todas as atividades que ocorram sob sua conta.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold mb-4">4. Uso do Conteúdo</h2>
              <div className="space-y-3 text-muted-foreground">
                <p className="leading-relaxed">
                  <strong>4.1.</strong> Todo o conteúdo disponível no site, incluindo textos, imagens, vídeos, 
                  e-books e ferramentas, é protegido por direitos autorais e é propriedade do Copytrading 
                  Descomplicado ou de seus licenciadores.
                </p>
                <p className="leading-relaxed">
                  <strong>4.2.</strong> Você não pode reproduzir, distribuir, modificar, criar obras derivadas, 
                  exibir publicamente ou usar comercialmente qualquer conteúdo sem autorização prévia por escrito.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold mb-4">5. Recomendações e Conteúdo Educativo</h2>
              <div className="space-y-3 text-muted-foreground">
                <p className="leading-relaxed">
                  <strong>5.1.</strong> As recomendações de traders e todo o conteúdo educativo são fornecidos 
                  apenas para fins informativos e educacionais.
                </p>
                <p className="leading-relaxed">
                  <strong>5.2.</strong> Não garantimos resultados financeiros específicos. Investimentos envolvem 
                  riscos e podem resultar em perdas.
                </p>
                <p className="leading-relaxed">
                  <strong>5.3.</strong> Você é responsável por suas próprias decisões de investimento e deve sempre 
                  consultar um profissional qualificado antes de tomar decisões financeiras.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold mb-4">6. Pagamentos e Reembolsos</h2>
              <div className="space-y-3 text-muted-foreground">
                <p className="leading-relaxed">
                  <strong>6.1.</strong> Os preços dos produtos e serviços são exibidos em reais (R$) e podem ser 
                  alterados a qualquer momento sem aviso prévio.
                </p>
                <p className="leading-relaxed">
                  <strong>6.2.</strong> Oferecemos garantia de reembolso conforme especificado na política de 
                  garantia do produto.
                </p>
                <p className="leading-relaxed">
                  <strong>6.3.</strong> Em caso de violação dos termos de uso, especialmente compartilhamento 
                  não autorizado de códigos, não haverá direito a reembolso.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold mb-4">7. Programa de Afiliados</h2>
              <div className="space-y-3 text-muted-foreground">
                <p className="leading-relaxed">
                  <strong>7.1.</strong> O programa de afiliados está sujeito a termos e condições específicos, 
                  que podem ser consultados na página de afiliados.
                </p>
                <p className="leading-relaxed">
                  <strong>7.2.</strong> Reservamo-nos o direito de encerrar contas de afiliados que violem nossos 
                  termos ou políticas.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold mb-4">8. Limitação de Responsabilidade</h2>
              <p className="text-muted-foreground leading-relaxed">
                O Copytrading Descomplicado não se responsabiliza por perdas financeiras decorrentes do uso de 
                nossas informações, recomendações ou ferramentas. Você reconhece que investimentos envolvem riscos 
                e que resultados passados não garantem resultados futuros.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold mb-4">9. Modificações dos Termos</h2>
              <p className="text-muted-foreground leading-relaxed">
                Reservamo-nos o direito de modificar estes Termos de Uso a qualquer momento. As alterações entrarão 
                em vigor imediatamente após a publicação. É sua responsabilidade revisar periodicamente estes termos.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold mb-4">10. Contato</h2>
              <p className="text-muted-foreground leading-relaxed">
                Para questões sobre estes Termos de Uso, entre em contato através da página de 
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

export default Termos;


