import { useState } from 'react';
import { Calculator, DollarSign, Percent, TrendingUp, AlertTriangle, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/navigation/Header';
import { useNavigate } from 'react-router-dom';

const RiskCalculator = () => {
  const navigate = useNavigate();
  const [capital, setCapital] = useState('');
  const [riskPercent, setRiskPercent] = useState('2');
  const [entryPrice, setEntryPrice] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [results, setResults] = useState(null);

  const calculateRisk = () => {
    const totalCapital = parseFloat(capital);
    const riskPercentage = parseFloat(riskPercent);
    const entry = parseFloat(entryPrice);
    const stop = parseFloat(stopLoss);

    if (!totalCapital || !riskPercentage || !entry || !stop) {
      return;
    }

    const riskAmount = (totalCapital * riskPercentage) / 100;
    const priceRisk = Math.abs(entry - stop);
    const positionSize = riskAmount / priceRisk;
    const percentageRisk = (priceRisk / entry) * 100;

    setResults({
      riskAmount,
      positionSize,
      percentageRisk,
      maxLoss: riskAmount
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-4xl mx-auto p-6 pt-24">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/area-vip')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Área VIP
          </Button>
        </div>
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20">
              <Calculator className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Calculadora de Risco</h1>
          <p className="text-muted-foreground">Calcule o tamanho ideal das suas posições baseado no seu risco</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Dados da Operação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="capital" className="text-foreground">Capital Total (R$)</Label>
                <Input
                  id="capital"
                  type="number"
                  placeholder="10000"
                  value={capital}
                  onChange={(e) => setCapital(e.target.value)}
                  className="bg-background border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div>
                <Label htmlFor="risk" className="text-foreground">Risco por Trade (%)</Label>
                <Input
                  id="risk"
                  type="number"
                  placeholder="2"
                  value={riskPercent}
                  onChange={(e) => setRiskPercent(e.target.value)}
                  className="bg-background border-border text-foreground placeholder:text-muted-foreground"
                />
                <p className="text-xs text-muted-foreground mt-1">Recomendado: 1-3% por trade</p>
              </div>

              <div>
                <Label htmlFor="entry" className="text-foreground">Preço de Entrada (R$)</Label>
                <Input
                  id="entry"
                  type="number"
                  step="0.01"
                  placeholder="50.00"
                  value={entryPrice}
                  onChange={(e) => setEntryPrice(e.target.value)}
                  className="bg-background border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div>
                <Label htmlFor="stop" className="text-foreground">Stop Loss (R$)</Label>
                <Input
                  id="stop"
                  type="number"
                  step="0.01"
                  placeholder="45.00"
                  value={stopLoss}
                  onChange={(e) => setStopLoss(e.target.value)}
                  className="bg-background border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <Button 
                onClick={calculateRisk}
                className="w-full bg-primary hover:bg-primary/90"
              >
                <Calculator className="w-4 h-4 mr-2" />
                Calcular Posição
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Resultados
              </CardTitle>
            </CardHeader>
            <CardContent>
              {results ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-primary/10 rounded-lg border border-primary/20">
                      <div className="text-2xl font-bold text-primary">
                        R$ {results.positionSize.toFixed(2)}
                      </div>
                      <div className="text-xs text-muted-foreground">Tamanho da Posição</div>
                    </div>
                    
                    <div className="text-center p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                      <div className="text-2xl font-bold text-destructive">
                        R$ {results.maxLoss.toFixed(2)}
                      </div>
                      <div className="text-xs text-muted-foreground">Perda Máxima</div>
                    </div>
                  </div>

                  <div className="text-center p-4 bg-primary/10 rounded-lg border border-primary/20">
                    <div className="text-2xl font-bold text-primary">
                      {results.percentageRisk.toFixed(2)}%
                    </div>
                    <div className="text-xs text-muted-foreground">Risco da Operação</div>
                  </div>

                  <div className="mt-6 p-4 bg-amber-500/10 rounded-lg border border-amber-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      <span className="text-amber-500 font-semibold">Dica de Gerenciamento</span>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {results.percentageRisk > 5 
                        ? "⚠️ Risco alto! Considere reduzir a posição ou ajustar o stop loss."
                        : results.percentageRisk > 3 
                        ? "⚡ Risco moderado. Monitore a operação de perto."
                        : "✅ Risco controlado. Boa gestão de risco!"
                      }
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Calculator className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Preencha os dados para calcular sua posição ideal</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Risk Management Tips */}
        <Card className="mt-8 bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Percent className="w-5 h-5" />
              Dicas de Gerenciamento de Risco
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4">
                <Badge className="bg-primary/20 text-primary border-primary/30 mb-3">
                  Regra dos 2%
                </Badge>
                <p className="text-muted-foreground text-sm">
                  Nunca arrisque mais de 2% do seu capital em uma única operação
                </p>
              </div>
              
              <div className="text-center p-4">
                <Badge className="bg-primary/20 text-primary border-primary/30 mb-3">
                  Stop Loss
                </Badge>
                <p className="text-muted-foreground text-sm">
                  Sempre defina seu stop loss antes de entrar na operação
                </p>
              </div>
              
              <div className="text-center p-4">
                <Badge className="bg-primary/20 text-primary border-primary/30 mb-3">
                  Diversificação
                </Badge>
                <p className="text-muted-foreground text-sm">
                  Diversifique seus investimentos entre diferentes ativos
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RiskCalculator;