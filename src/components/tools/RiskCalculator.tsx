import { useState } from 'react';
import { Calculator, DollarSign, Percent, TrendingUp, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const RiskCalculator = () => {
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
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
            <Calculator className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Calculadora de Risco</h1>
        <p className="text-white/70">Calcule o tamanho ideal das suas posições baseado no seu risco</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Input Form */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
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
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>

            <div>
              <Label htmlFor="risk" className="text-white">Risco por Trade (%)</Label>
              <Input
                id="risk"
                type="number"
                placeholder="2"
                value={riskPercent}
                onChange={(e) => setRiskPercent(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
              <p className="text-xs text-white/60 mt-1">Recomendado: 1-3% por trade</p>
            </div>

            <div>
              <Label htmlFor="entry" className="text-white">Preço de Entrada (R$)</Label>
              <Input
                id="entry"
                type="number"
                step="0.01"
                placeholder="50.00"
                value={entryPrice}
                onChange={(e) => setEntryPrice(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>

            <div>
              <Label htmlFor="stop" className="text-white">Stop Loss (R$)</Label>
              <Input
                id="stop"
                type="number"
                step="0.01"
                placeholder="45.00"
                value={stopLoss}
                onChange={(e) => setStopLoss(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>

            <Button 
              onClick={calculateRisk}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90"
            >
              <Calculator className="w-4 h-4 mr-2" />
              Calcular Posição
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Resultados
            </CardTitle>
          </CardHeader>
          <CardContent>
            {results ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-green-500/20 rounded-lg border border-green-500/30">
                    <div className="text-2xl font-bold text-green-400">
                      R$ {results.positionSize.toFixed(2)}
                    </div>
                    <div className="text-xs text-green-300">Tamanho da Posição</div>
                  </div>
                  
                  <div className="text-center p-4 bg-red-500/20 rounded-lg border border-red-500/30">
                    <div className="text-2xl font-bold text-red-400">
                      R$ {results.maxLoss.toFixed(2)}
                    </div>
                    <div className="text-xs text-red-300">Perda Máxima</div>
                  </div>
                </div>

                <div className="text-center p-4 bg-blue-500/20 rounded-lg border border-blue-500/30">
                  <div className="text-2xl font-bold text-blue-400">
                    {results.percentageRisk.toFixed(2)}%
                  </div>
                  <div className="text-xs text-blue-300">Risco da Operação</div>
                </div>

                <div className="mt-6 p-4 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-400" />
                    <span className="text-yellow-400 font-semibold">Dica de Gerenciamento</span>
                  </div>
                  <p className="text-yellow-200 text-sm">
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
              <div className="text-center py-12 text-white/60">
                <Calculator className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Preencha os dados para calcular sua posição ideal</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Risk Management Tips */}
      <Card className="mt-8 bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Percent className="w-5 h-5" />
            Dicas de Gerenciamento de Risco
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4">
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30 mb-3">
                Regra dos 2%
              </Badge>
              <p className="text-white/70 text-sm">
                Nunca arrisque mais de 2% do seu capital em uma única operação
              </p>
            </div>
            
            <div className="text-center p-4">
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 mb-3">
                Stop Loss
              </Badge>
              <p className="text-white/70 text-sm">
                Sempre defina seu stop loss antes de entrar na operação
              </p>
            </div>
            
            <div className="text-center p-4">
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 mb-3">
                Diversificação
              </Badge>
              <p className="text-white/70 text-sm">
                Diversifique seus investimentos entre diferentes ativos
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RiskCalculator;