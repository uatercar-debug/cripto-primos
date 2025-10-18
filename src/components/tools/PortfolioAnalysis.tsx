import { useState } from 'react';
import { TrendingUp, RefreshCw, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { useToast } from '@/hooks/use-toast';

const PortfolioAnalysis = () => {
  const { toast } = useToast();
  const [assetA, setAssetA] = useState('BTC-USD');
  const [assetB, setAssetB] = useState('^NDX');
  const [timeFrame, setTimeFrame] = useState('1d');
  const [period, setPeriod] = useState('12mo');
  const [loading, setLoading] = useState(false);
  const [correlationData, setCorrelationData] = useState<any[]>([]);
  const [currentCorrelation, setCurrentCorrelation] = useState<number | null>(null);

  const assets = [
    { label: 'Ouro', value: 'GC=F' },
    { label: 'Bitcoin', value: 'BTC-USD' },
    { label: 'DAX 40', value: '^GDAXI' },
    { label: 'Nasdaq 100', value: '^NDX' },
  ];

  const timeFrames = [
    { label: 'Diário', value: '1d' },
    { label: '4 Horas', value: '1h' },
    { label: 'Semanal', value: '1wk' },
  ];

  const periods = [
    { label: '3 meses', value: '3mo' },
    { label: '6 meses', value: '6mo' },
    { label: '12 meses', value: '12mo' },
    { label: '18 meses', value: '18mo' },
  ];

  // Função para calcular retornos percentuais
  const calculateReturns = (prices: number[]) => {
    const returns = [];
    for (let i = 1; i < prices.length; i++) {
      returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
    }
    return returns;
  };

  // Função para calcular correlação de Pearson
  const calculateCorrelation = (x: number[], y: number[]) => {
    const n = Math.min(x.length, y.length);
    const meanX = x.slice(0, n).reduce((a, b) => a + b, 0) / n;
    const meanY = y.slice(0, n).reduce((a, b) => a + b, 0) / n;
    
    let numerator = 0;
    let sumSquareX = 0;
    let sumSquareY = 0;
    
    for (let i = 0; i < n; i++) {
      const diffX = x[i] - meanX;
      const diffY = y[i] - meanY;
      numerator += diffX * diffY;
      sumSquareX += diffX * diffX;
      sumSquareY += diffY * diffY;
    }
    
    const denominator = Math.sqrt(sumSquareX * sumSquareY);
    return denominator === 0 ? 0 : numerator / denominator;
  };

  // Função para calcular correlação móvel
  const calculateRollingCorrelation = (returnsA: number[], returnsB: number[], window: number = 30) => {
    const rollingCorr = [];
    
    for (let i = window - 1; i < returnsA.length; i++) {
      const windowA = returnsA.slice(i - window + 1, i + 1);
      const windowB = returnsB.slice(i - window + 1, i + 1);
      const corr = calculateCorrelation(windowA, windowB);
      rollingCorr.push(corr);
    }
    
    return rollingCorr;
  };

  const fetchDataAndCalculate = async () => {
    setLoading(true);
    
    try {
      // Usando Yahoo Finance API alternativa (pode usar outras como Alpha Vantage)
      const baseUrl = 'https://query1.finance.yahoo.com/v8/finance/chart/';
      
      const fetchAssetData = async (symbol: string) => {
        const url = `${baseUrl}${symbol}?interval=${timeFrame}&range=${period}`;
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch data for ${symbol}`);
        }
        
        const data = await response.json();
        const quotes = data.chart.result[0];
        const timestamps = quotes.timestamp;
        const prices = quotes.indicators.quote[0].close;
        
        return { timestamps, prices: prices.filter((p: number) => p !== null) };
      };

      // Buscar dados para ambos os ativos
      const [dataA, dataB] = await Promise.all([
        fetchAssetData(assetA),
        fetchAssetData(assetB)
      ]);

      // Calcular retornos
      const returnsA = calculateReturns(dataA.prices);
      const returnsB = calculateReturns(dataB.prices);

      // Calcular correlação móvel
      const rollingCorr = calculateRollingCorrelation(returnsA, returnsB, 30);

      // Preparar dados para o gráfico
      const chartData = rollingCorr.map((corr, idx) => ({
        date: new Date(dataA.timestamps[idx + 30] * 1000).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit'
        }),
        correlation: parseFloat(corr.toFixed(4))
      }));

      setCorrelationData(chartData);
      setCurrentCorrelation(rollingCorr[rollingCorr.length - 1]);

      toast({
        title: "Correlação calculada!",
        description: `Dados processados com sucesso para ${assets.find(a => a.value === assetA)?.label} e ${assets.find(a => a.value === assetB)?.label}`,
      });

    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Erro ao buscar dados",
        description: "Não foi possível buscar os dados. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getAssetLabel = (value: string) => assets.find(a => a.value === value)?.label || value;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-primary rounded-2xl">
            <TrendingUp className="w-8 h-8 text-primary-foreground" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Análise de Correlação Móvel</h1>
        <p className="text-muted-foreground">Visualize a correlação móvel entre dois ativos financeiros</p>
      </div>

      {/* Controles */}
      <Card className="mb-8 bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Configurações de Análise</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Ativo A */}
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Ativo A
              </label>
              <Select value={assetA} onValueChange={setAssetA}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {assets.map((asset) => (
                    <SelectItem key={asset.value} value={asset.value}>
                      {asset.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Ativo B */}
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Ativo B
              </label>
              <Select value={assetB} onValueChange={setAssetB}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {assets.map((asset) => (
                    <SelectItem key={asset.value} value={asset.value}>
                      {asset.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Time Frame */}
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Time Frame
              </label>
              <Select value={timeFrame} onValueChange={setTimeFrame}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeFrames.map((tf) => (
                    <SelectItem key={tf.value} value={tf.value}>
                      {tf.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Período */}
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Período
              </label>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {periods.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={fetchDataAndCalculate}
            disabled={loading}
            className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Calculando...
              </>
            ) : (
              <>
                <RefreshCw className="w-5 h-5 mr-2" />
                Calcular Correlação
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Valor da Correlação Atual */}
      {currentCorrelation !== null && (
        <Card className="mb-8 bg-card border-border">
          <CardContent className="p-6 text-center">
            <div className="text-sm text-muted-foreground mb-2">Correlação Mais Recente</div>
            <div className="text-5xl font-bold text-foreground mb-2">
              {currentCorrelation.toFixed(4)}
            </div>
            <div className="text-sm text-muted-foreground">
              {currentCorrelation > 0.7 ? '🟢 Forte correlação positiva' : 
               currentCorrelation > 0.3 ? '🟡 Correlação positiva moderada' :
               currentCorrelation > -0.3 ? '⚪ Correlação fraca ou neutra' :
               currentCorrelation > -0.7 ? '🟡 Correlação negativa moderada' :
               '🔴 Forte correlação negativa'}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Gráfico */}
      {correlationData.length > 0 && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">
              Correlação Móvel (30 períodos) entre {getAssetLabel(assetA)} e {getAssetLabel(assetB)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={correlationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="date" 
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis 
                  domain={[-1, 1]}
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  ticks={[-1, -0.5, 0, 0.5, 1]}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))'
                  }} 
                />
                <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" />
                <ReferenceLine y={0.7} stroke="hsl(var(--success))" strokeDasharray="2 2" opacity={0.3} />
                <ReferenceLine y={-0.7} stroke="hsl(var(--destructive))" strokeDasharray="2 2" opacity={0.3} />
                <Line 
                  type="monotone" 
                  dataKey="correlation" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
            
            <div className="mt-6 p-4 bg-muted/30 rounded-lg">
              <h4 className="font-semibold text-foreground mb-2">Como interpretar:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>+1.0</strong>: Correlação perfeita positiva (ativos se movem juntos)</li>
                <li>• <strong>0.0</strong>: Sem correlação (movimentos independentes)</li>
                <li>• <strong>-1.0</strong>: Correlação perfeita negativa (ativos se movem em direções opostas)</li>
                <li>• <strong>Janela de 30 períodos</strong>: A correlação é calculada usando os últimos 30 dados do time frame selecionado</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mensagem inicial */}
      {correlationData.length === 0 && !loading && (
        <Card className="bg-muted/30 border-border">
          <CardContent className="p-12 text-center">
            <TrendingUp className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Selecione os ativos e clique em "Calcular Correlação"
            </h3>
            <p className="text-muted-foreground">
              A análise mostrará como dois ativos se movem em relação um ao outro ao longo do tempo
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PortfolioAnalysis;
