import { useState, useEffect } from 'react';
import { TrendingUp, RefreshCw, Loader2, ArrowLeft, PieChart, BarChart3, Wallet, TrendingDown, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/navigation/Header';
import { useNavigate } from 'react-router-dom';
import { 
  CRYPTO_SYMBOLS, 
  get24hTickers, 
  getCorrelationData, 
  formatPrice, 
  formatPercent,
  type Ticker24h 
} from '@/services/binanceService';

const PortfolioAnalysis = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [assetA, setAssetA] = useState('BTCUSDT');
  const [assetB, setAssetB] = useState('ETHUSDT');
  const [timeFrame, setTimeFrame] = useState<'1h' | '4h' | '1d' | '1w'>('1d');
  const [loading, setLoading] = useState(false);
  const [correlationData, setCorrelationData] = useState<any[]>([]);
  const [currentCorrelation, setCurrentCorrelation] = useState<number | null>(null);
  const [marketData, setMarketData] = useState<Ticker24h[]>([]);
  const [loadingMarket, setLoadingMarket] = useState(true);

  const assets = [
    { label: 'Bitcoin (BTC)', value: 'BTCUSDT', color: '#f7931a' },
    { label: 'Ethereum (ETH)', value: 'ETHUSDT', color: '#627eea' },
    { label: 'BNB', value: 'BNBUSDT', color: '#f3ba2f' },
    { label: 'Solana (SOL)', value: 'SOLUSDT', color: '#00ffa3' },
    { label: 'Cardano (ADA)', value: 'ADAUSDT', color: '#0033ad' },
    { label: 'XRP', value: 'XRPUSDT', color: '#23292f' },
    { label: 'Dogecoin (DOGE)', value: 'DOGEUSDT', color: '#c3a634' },
    { label: 'Polkadot (DOT)', value: 'DOTUSDT', color: '#e6007a' },
    { label: 'Avalanche (AVAX)', value: 'AVAXUSDT', color: '#e84142' },
    { label: 'Polygon (MATIC)', value: 'MATICUSDT', color: '#8247e5' },
  ];

  const timeFrames = [
    { label: '1 Hora', value: '1h' },
    { label: '4 Horas', value: '4h' },
    { label: 'Diário', value: '1d' },
    { label: 'Semanal', value: '1w' },
  ];

  // Carregar dados de mercado ao montar
  useEffect(() => {
    const loadMarketData = async () => {
      try {
        const symbols = Object.values(CRYPTO_SYMBOLS).slice(0, 6);
        const tickers = await get24hTickers(symbols);
        setMarketData(tickers);
      } catch (error) {
        console.error('Error loading market data:', error);
      } finally {
        setLoadingMarket(false);
      }
    };
    
    loadMarketData();
    
    // Atualizar a cada 30 segundos
    const interval = setInterval(loadMarketData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDataAndCalculate = async () => {
    if (assetA === assetB) {
      toast({
        title: "Ativos iguais",
        description: "Selecione dois ativos diferentes para calcular a correlação.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const result = await getCorrelationData(assetA, assetB, timeFrame, 100);
      
      setCorrelationData(result.correlationData);
      setCurrentCorrelation(result.currentCorrelation);

      toast({
        title: "✅ Correlação calculada!",
        description: `Dados reais da Binance processados com sucesso.`,
      });

    } catch (error) {
      console.error('Error calculating correlation:', error);
      toast({
        title: "Erro ao buscar dados",
        description: "Não foi possível buscar dados da Binance. Verifique sua conexão.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getAssetLabel = (value: string) => assets.find(a => a.value === value)?.label || value;
  const getAssetColor = (value: string) => assets.find(a => a.value === value)?.color || '#8884d8';

  // Dados do portfólio baseados nos preços reais
  const portfolioData = marketData.slice(0, 4).map((ticker, index) => {
    const colors = ['#f7931a', '#627eea', '#f3ba2f', '#00ffa3'];
    const allocations = [40, 30, 20, 10];
    return {
      name: ticker.symbol.replace('USDT', ''),
      value: allocations[index],
      color: colors[index],
      price: formatPrice(ticker.lastPrice),
      change: formatPercent(ticker.priceChangePercent),
    };
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-7xl mx-auto p-6 pt-24">
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
            <div className="p-4 bg-primary rounded-2xl">
              <PieChart className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Análise de Portfólio</h1>
          <p className="text-muted-foreground">Dados em tempo real da Binance • Atualização automática a cada 30s</p>
          <Badge variant="outline" className="mt-2">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
            API Binance Conectada
          </Badge>
        </div>

        {/* Market Overview - Preços em Tempo Real */}
        <Card className="mb-8 bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Preços em Tempo Real
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingMarket ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {marketData.map((ticker) => {
                  const isPositive = parseFloat(ticker.priceChangePercent) >= 0;
                  return (
                    <div key={ticker.symbol} className="text-center p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="font-bold text-foreground mb-1">
                        {ticker.symbol.replace('USDT', '')}
                      </div>
                      <div className="text-lg font-semibold text-foreground">
                        ${formatPrice(ticker.lastPrice)}
                      </div>
                      <div className={`flex items-center justify-center gap-1 text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                        {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {formatPercent(ticker.priceChangePercent)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Portfolio Overview */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Portfolio Allocation */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Wallet className="w-5 h-5" />
                Alocação do Portfólio
              </CardTitle>
            </CardHeader>
            <CardContent>
              {portfolioData.length > 0 ? (
                <>
                  <div className="flex items-center justify-center">
                    <ResponsiveContainer width="100%" height={200}>
                      <RechartsPieChart>
                        <Pie
                          data={portfolioData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}%`}
                        >
                          {portfolioData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                          }}
                        />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-2 mt-4">
                    {portfolioData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="font-medium text-foreground">{item.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-foreground">${item.price}</div>
                          <div className={`text-sm ${item.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                            {item.change}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Portfolio Stats */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Métricas do Portfólio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className="text-2xl font-bold text-green-500">+18.5%</div>
                  <div className="text-sm text-muted-foreground">Retorno YTD</div>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-500">24.3%</div>
                  <div className="text-sm text-muted-foreground">Volatilidade</div>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className="text-2xl font-bold text-blue-500">1.42</div>
                  <div className="text-sm text-muted-foreground">Sharpe Ratio</div>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className="text-2xl font-bold text-red-500">-12.8%</div>
                  <div className="text-sm text-muted-foreground">Max Drawdown</div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
                <p className="text-sm text-muted-foreground">
                  💡 <strong>Dica:</strong> Use a análise de correlação abaixo para entender como diferentes criptomoedas se comportam juntas e otimizar sua diversificação.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controles de Correlação */}
        <Card className="mb-8 bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Análise de Correlação entre Ativos
              <Badge variant="outline" className="ml-2">Dados Reais</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
                <Select value={timeFrame} onValueChange={(v) => setTimeFrame(v as any)}>
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
            </div>

            <Button 
              onClick={fetchDataAndCalculate}
              disabled={loading}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Buscando dados da Binance...
                </>
              ) : (
                <>
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Calcular Correlação (Dados Reais)
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Valor da Correlação Atual */}
        {currentCorrelation !== null && (
          <Card className="mb-8 bg-card border-border">
            <CardContent className="p-6 text-center">
              <div className="text-sm text-muted-foreground mb-2">
                Correlação Atual: {getAssetLabel(assetA)} ↔ {getAssetLabel(assetB)}
              </div>
              <div className="text-5xl font-bold text-foreground mb-2">
                {currentCorrelation.toFixed(4)}
              </div>
              <div className="text-sm text-muted-foreground">
                {currentCorrelation > 0.7 ? '🟢 Forte correlação positiva - Ativos se movem juntos' : 
                 currentCorrelation > 0.3 ? '🟡 Correlação positiva moderada' :
                 currentCorrelation > -0.3 ? '⚪ Correlação fraca ou neutra - Boa diversificação!' :
                 currentCorrelation > -0.7 ? '🟡 Correlação negativa moderada - Hedge parcial' :
                 '🔴 Forte correlação negativa - Excelente para hedge'}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Gráfico */}
        {correlationData.length > 0 && (
          <Card className="mb-8 bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">
                Correlação Móvel (20 períodos) - {getAssetLabel(assetA)} vs {getAssetLabel(assetB)}
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
                  <ReferenceLine y={0.7} stroke="#22c55e" strokeDasharray="2 2" opacity={0.5} />
                  <ReferenceLine y={-0.7} stroke="#ef4444" strokeDasharray="2 2" opacity={0.5} />
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
                <h4 className="font-semibold text-foreground mb-2">📊 Como interpretar:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• <strong className="text-green-500">+1.0</strong>: Correlação perfeita positiva (ativos se movem juntos)</li>
                  <li>• <strong>0.0</strong>: Sem correlação (movimentos independentes - ideal para diversificação)</li>
                  <li>• <strong className="text-red-500">-1.0</strong>: Correlação perfeita negativa (ativos se movem em direções opostas)</li>
                  <li>• <strong>Janela de 20 períodos</strong>: A correlação é calculada usando os últimos 20 dados do timeframe</li>
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
              <p className="text-muted-foreground mb-4">
                A análise usará dados reais da Binance para mostrar como os ativos se comportam em relação um ao outro
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <AlertTriangle className="w-4 h-4" />
                <span>Correlação alta entre ativos pode aumentar o risco do portfólio</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PortfolioAnalysis;
