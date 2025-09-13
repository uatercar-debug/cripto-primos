import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Logo from '@/components/ui/logo';
import { Lock, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Login = () => {
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/area-vip';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simular delay de validação
    await new Promise(resolve => setTimeout(resolve, 1000));

    const isValid = login(accessCode);
    
    if (isValid) {
      navigate(from, { replace: true });
    } else {
      setError('Código de acesso inválido. Verifique e tente novamente.');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao início
          </Link>
          <div className="flex justify-center mb-4">
                        <Logo size="lg" showText={false} />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Acesso à Área VIP
          </h1>
          <p className="text-muted-foreground">
            Digite seu código de acesso para continuar
          </p>
        </div>

        {/* Login Form */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Verificação de Acesso</CardTitle>
            <CardDescription>
              Insira o código que você recebeu após a compra do produto
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="accessCode" className="block text-sm font-medium text-foreground mb-2">
                  Código de Acesso
                </label>
                <Input
                  id="accessCode"
                  type="text"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                  placeholder="Digite seu código de acesso"
                  className="text-center text-lg font-mono tracking-wider"
                  required
                  disabled={isLoading}
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={isLoading || !accessCode.trim()}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Verificando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Acessar Área VIP
                  </>
                )}
              </Button>
            </form>

            {/* Help Section */}
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <h3 className="font-medium text-sm text-foreground mb-2">
                Não tem seu código de acesso?
              </h3>
              <p className="text-xs text-muted-foreground mb-3">
                O código foi enviado para seu e-mail após a confirmação do pagamento.
              </p>
              <div className="space-y-2 text-xs text-muted-foreground">
                <p>• Verifique sua caixa de entrada e spam</p>
                <p>• O código tem formato: ABC123456</p>
                <p>• Entre em contato se não recebeu</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            Problemas com o acesso?{' '}
            <a href="mailto:suporte@criptoprimos.com" className="text-primary hover:underline">
              Entre em contato
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
