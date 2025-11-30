import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Clock, Target, DollarSign, AlertTriangle, Star, Filter, Bell, ArrowLeft, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Header from '@/components/navigation/Header';
import { useNavigate } from 'react-router-dom';
import { 
  get24hTickers, 
  formatPrice, 
  formatPercent,
  type Ticker24h 
} from '@/services/binanceService';

interface Signal {
  id: number;
  pair: string;
  type: 'Long' | 'Short';
  price: number;
  targetPrice: number;
  stopLoss: number;
  status: 'active' | 'pending' | 'closed';
  confidence: number;
  timeframe: string;
  analyst: string;
  timestamp: string;
  description: string;
  riskReward: string;
  potentialGain: number;
  result?: 'win' | 'loss';
  actualGain?: number;
  currentPrice?: number;
  pnlPercent?: number;
}

const PremiumSignals = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [marketData, setMarketData] = useState<Ticker24h[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Sinais base (serão atualizados com preços reais)
  const baseSignals: Signal[] = [
    {
      id: 1,
      pair: 'BTCUSDT',
      type: 'Long',
      price: 42500,
      targetPrice: 45000,
      stopLoss: 41000,
      status: 'active',
      confidence: 85,
      timeframe: '4h',
      analyst: 'Carlos Silva',
      timestamp: new Date().toISOString(),
      description: 'Rompimento de resistência importante com volume crescente. Indicadores técnicos mostram força compradora.',
      riskReward: '1:2.8',
      potentialGain: 5.9
    },
    {
      id: 2,
      pair: 'ETHUSDT',
      type: 'Long',
      price: 2450,
      targetPrice: 2650,
      stopLoss: 2350,
      status: 'active',
      confidence: 82,
      timeframe: '1h',
      analyst: 'Ana Costa',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      description: 'ETH mostrando força após correção. Suporte em $2,400 sendo respeitado com volume.',
      riskReward: '1:2.0',
      potentialGain: 8.2
    },
    {
      id: 3,
      pair: 'BNBUSDT',
      type: 'Long',
      price: 310,
      targetPrice: 340,
      stopLoss: 295,
      status: 'active',
      confidence: 78,
      timeframe: '1d',
      analyst: 'Roberto Lima',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      description: 'Padrão de triângulo ascendente em formação. Fundamentos fortes da Binance.',
      riskReward: '1:2.0',
      potentialGain: 9.7
    },
    {
      id: 4,
      pair: 'SOLUSDT',
      type: 'Short',
      price: 105,
      targetPrice: 95,
      stopLoss: 110,
      status: 'pending',
      confidence: 71,
      timeframe: '4h',
      analyst: 'Marina Santos',
      timestamp: new Date(Date.now() - 10800000).toISOString(),
      description: 'SOL em zona de resistência forte. Divergência bearish no RSI sugere correção.',
      riskReward: '1:2.0',
      potentialGain: 9.5
    },
    {
      id: 5,
      pair: 'ADAUSDT',
      type: 'Long',
      price: 0.58,
      targetPrice: 0.68,
      stopLoss: 0.54,
      status: 'closed',
      confidence: 88,
      timeframe: '2h',
      analyst: 'Pedro Oliveira',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      description: 'ADA rompeu canal de baixa com volume. Alvo atingido com sucesso.',
      riskReward: '1:2.5',
      potentialGain: 17.2,
      result: 'win',
      actualGain: 15.8
    },
    {
      id: 6,
      pair: 'XRPUSDT',
      type: 'Long',
      price: 0.62,
      targetPrice: 0.70,
      stopLoss: 0.58,
      status: 'closed',
      confidence: 75,
      timeframe: '4h',
      analyst: 'Carlos Silva',
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      description: 'XRP em zona de acumulação. Stop loss acionado por volatilidade.',
      riskReward: '1:2.0',
      potentialGain: 12.9,
      result: 'loss',
      actualGain: -6.5
    }
  ];

  const [signals, setSignals] = useState<Signal[]>(baseSignals);

  // Carregar dados de mercado
  useEffect(() => {
    const loadMarketData = async () => {
      try {
        setLoading(true);
        const symbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'ADAUSDT', 'XRPUSDT', 'DOGEUSDT', 'AVAXUSDT'];
        const tickers = await get24hTickers(symbols);
        setMarketData(tickers);
        setLastUpdate(new Date());

        // Atualizar sinais com preços reais
        const updatedSignals = baseSignals.map(signal => {
          const ticker = tickers.find(t => t.symbol === signal.pair);
          if (ticker && signal.status === 'active') {
            const currentPrice = parseFloat(ticker.lastPrice);
            const pnlPercent = ((currentPrice - signal.price) / signal.price) * 100 * (signal.type === 'Long' ? 1 : -1);
            return {
              ...signal,
              currentPrice,
              pnlPercent
            };
          }
          return signal;
        });
        setSignals(updatedSignals);

      } catch (error) {
        console.error('Error loading market data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMarketData();
    const interval = setInterval(loadMarketData, 30000); // Atualizar a cada 30s
    return () => clearInterval(interval);
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">ATIVO</Badge>;
      case 'pending': return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">PENDENTE</Badge>;
      case 'closed': return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">FECHADO</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredSignals = signals.filter(signal => {
    const typeMatch = selectedType === 'all' || signal.type.toLowerCase() === selectedType;
    const statusMatch = selectedStatus === 'all' || signal.status === selectedStatus;
    return typeMatch && statusMatch;
  });

  const stats = {
    totalSignals: signals.length,
    activeSignals: signals.filter(s => s.status === 'active').length,
    winRate: ((signals.filter(s => s.result === 'win').length / signals.filter(s => s.result).length) * 100 || 0).toFixed(1),
    avgGain: (signals.filter(s => s.actualGain && s.actualGain > 0).reduce((sum, s) => sum + (s.actualGain || 0), 0) / 
              signals.filter(s => s.actualGain && s.actualGain > 0).length || 0).toFixed(1)
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
              <TrendingUp className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Sinais Premium</h1>
          <p className="text-muted-foreground">Sinais com preços em tempo real da Binance</p>
          <div className="flex items-center justify-center gap-4 mt-2">
            <Badge variant="outline">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              API Binance Conectada
            </Badge>
            <Badge variant="outline">
              <RefreshCw className="w-3 h-3 mr-1" />
              {lastUpdate.toLocaleTimeString('pt-BR')}
            </Badge>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-card border-border">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-foreground">{stats.totalSignals}</div>
              <div className="text-muted-foreground text-sm">Total de Sinais</div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-border">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{stats.activeSignals}</div>
              <div className="text-muted-foreground text-sm">Sinais Ativos</div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-border">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-500">{stats.winRate}%</div>
              <div className="text-muted-foreground text-sm">Taxa de Acerto</div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-border">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-500">+{stats.avgGain}%</div>
              <div className="text-muted-foreground text-sm">Ganho Médio</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Filter className="w-5 h-5 text-foreground" />
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo de sinal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Tipos</SelectItem>
                    <SelectItem value="long">Long (Compra)</SelectItem>
                    <SelectItem value="short">Short (Venda)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-foreground" />
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Status</SelectItem>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="closed">Fechado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <Button className="w-full bg-primary hover:bg-primary/90">
                <Bell className="w-4 h-4 mr-2" />
                Configurar Alertas
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Signals List */}
        <div className="space-y-6">
          {loading ? (
            <Card className="bg-card border-border">
              <CardContent className="p-12 text-center">
                <RefreshCw className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">Carregando dados da Binance...</p>
              </CardContent>
            </Card>
          ) : (
            filteredSignals.map((signal) => (
              <Card key={signal.id} className="bg-card border-border hover:bg-muted/30 transition-all duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl font-bold text-foreground">{signal.pair.replace('USDT', '/USDT')}</div>
                      <Badge variant={signal.type === 'Long' ? 'default' : 'destructive'}>
                        {signal.type === 'Long' ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                        {signal.type}
                      </Badge>
                      {getStatusBadge(signal.status)}
                    </div>
                    <div className="text-right">
                      <div className="text-muted-foreground text-sm">Confiança</div>
                      <div className={`text-2xl font-bold ${signal.confidence >= 80 ? 'text-green-500' : signal.confidence >= 70 ? 'text-yellow-500' : 'text-red-500'}`}>
                        {signal.confidence}%
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-4 gap-6">
                    {/* Price Info */}
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Entrada:</span>
                        <span className="text-foreground font-medium">${formatPrice(signal.price)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Target:</span>
                        <span className="text-green-500 font-medium">${formatPrice(signal.targetPrice)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Stop Loss:</span>
                        <span className="text-red-500 font-medium">${formatPrice(signal.stopLoss)}</span>
                      </div>
                    </div>

                    {/* Current Price (Live) */}
                    {signal.status === 'active' && signal.currentPrice && (
                      <div className="space-y-3">
                        <div className="text-center p-3 bg-muted/30 rounded-lg">
                          <div className="text-muted-foreground text-sm mb-1">Preço Atual</div>
                          <div className="text-xl font-bold text-foreground">${formatPrice(signal.currentPrice)}</div>
                          <div className={`text-sm font-medium ${(signal.pnlPercent || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {(signal.pnlPercent || 0) >= 0 ? '+' : ''}{(signal.pnlPercent || 0).toFixed(2)}%
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Analysis Info */}
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Timeframe:</span>
                        <span className="text-foreground font-medium">{signal.timeframe}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">R/R:</span>
                        <span className="text-primary font-medium">{signal.riskReward}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Potencial:</span>
                        <span className="text-green-500 font-medium">+{signal.potentialGain}%</span>
                      </div>
                    </div>

                    {/* Analyst Info */}
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Analista:</span>
                        <span className="text-foreground font-medium">{signal.analyst}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Horário:</span>
                        <span className="text-muted-foreground text-sm">{formatTimestamp(signal.timestamp)}</span>
                      </div>
                      {signal.result && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Resultado:</span>
                          <span className={`font-bold ${signal.result === 'win' ? 'text-green-500' : 'text-red-500'}`}>
                            {(signal.actualGain || 0) > 0 ? '+' : ''}{signal.actualGain}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-muted/30 rounded-lg p-4">
                    <div className="flex items-start gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5" />
                      <span className="text-amber-500 font-semibold text-sm">Análise do Sinal:</span>
                    </div>
                    <p className="text-foreground text-sm">{signal.description}</p>
                  </div>

                  {signal.status === 'active' && (
                    <div className="flex gap-3">
                      <Button className="flex-1 bg-primary hover:bg-primary/90">
                        <Target className="w-4 h-4 mr-2" />
                        Seguir Sinal
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Bell className="w-4 h-4 mr-2" />
                        Criar Alerta
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Disclaimer */}
        <Card className="mt-8 bg-muted/30 border-border">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-500 mt-1" />
              <div>
                <h3 className="text-amber-500 font-semibold mb-2">Aviso Importante</h3>
                <p className="text-muted-foreground text-sm">
                  Os sinais são baseados em análise técnica e dados em tempo real da Binance, mas não constituem recomendação de investimento. 
                  Trading envolve riscos e você pode perder parte ou todo seu capital. Sempre faça sua 
                  própria análise e gerencie seus riscos adequadamente.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PremiumSignals;
