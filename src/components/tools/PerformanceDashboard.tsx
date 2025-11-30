import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, TrendingDown, DollarSign, Target, Calendar, Award, Zap, ArrowLeft, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Header from '@/components/navigation/Header';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  CRYPTO_SYMBOLS, 
  get24hTickers, 
  getKlines,
  formatPrice, 
  formatPercent,
  type Ticker24h,
  type KlineData
} from '@/services/binanceService';

const PerformanceDashboard = () => {
  const navigate = useNavigate();
  const [timeframe, setTimeframe] = useState('30d');
  const [marketData, setMarketData] = useState<Ticker24h[]>([]);
  const [btcKlines, setBtcKlines] = useState<KlineData[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  
  // Carregar dados de mercado
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const symbols = Object.values(CRYPTO_SYMBOLS).slice(0, 8);
        
        const [tickers, klines] = await Promise.all([
          get24hTickers(symbols),
          getKlines('BTCUSDT', '1d', 30)
        ]);
        
        setMarketData(tickers);
        setBtcKlines(klines);
        setLastUpdate(new Date());
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
    const interval = setInterval(loadData, 60000); // Atualizar a cada minuto
    return () => clearInterval(interval);
  }, []);

  // Preparar dados para o gráfico de equity baseado em BTC
  const performanceData = btcKlines.map((kline, index) => {
    const baseEquity = 10000;
    const btcChange = (parseFloat(kline.close) - parseFloat(btcKlines[0].close)) / parseFloat(btcKlines[0].close);
    return {
      date: new Date(kline.openTime).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      equity: Math.round(baseEquity * (1 + btcChange * 0.5)), // 50% exposição ao BTC
      pnl: Math.round(baseEquity * btcChange * 0.5)
    };
  });

  // Calcular estatísticas do portfólio
  const calculateStats = () => {
    if (marketData.length === 0) return null;
    
    const totalChange = marketData.reduce((sum, t) => sum + parseFloat(t.priceChangePercent), 0) / marketData.length;
    const positiveCount = marketData.filter(t => parseFloat(t.priceChangePercent) > 0).length;
    const winRate = (positiveCount / marketData.length) * 100;
    
    return {
      totalPnL: totalChange,
      winRate: winRate,
      tradesCount: marketData.length,
      bestAsset: marketData.reduce((best, t) => 
        parseFloat(t.priceChangePercent) > parseFloat(best.priceChangePercent) ? t : best
      )
    };
  };

  const portfolioStats = calculateStats();

  const stats = [
    {
      title: "Variação 24h (Média)",
      value: portfolioStats ? formatPercent(portfolioStats.totalPnL) : "...",
      change: "Últimas 24h",
      icon: <DollarSign className="w-5 h-5" />,
      color: portfolioStats && portfolioStats.totalPnL >= 0 ? "text-green-400" : "text-red-400",
      bgColor: "bg-green-500/20 border-green-500/30"
    },
    {
      title: "Ativos em Alta",
      value: portfolioStats ? `${Math.round(portfolioStats.winRate)}%` : "...",
      change: `${marketData.filter(t => parseFloat(t.priceChangePercent) > 0).length}/${marketData.length}`,
      icon: <Target className="w-5 h-5" />,
      color: "text-blue-400",
      bgColor: "bg-blue-500/20 border-blue-500/30"
    },
    {
      title: "Ativos Monitorados",
      value: marketData.length.toString(),
      change: "Em tempo real",
      icon: <Zap className="w-5 h-5" />,
      color: "text-purple-400",
      bgColor: "bg-purple-500/20 border-purple-500/30"
    },
    {
      title: "Melhor Performance",
      value: portfolioStats?.bestAsset ? portfolioStats.bestAsset.symbol.replace('USDT', '') : "...",
      change: portfolioStats?.bestAsset ? formatPercent(portfolioStats.bestAsset.priceChangePercent) : "",
      icon: <Award className="w-5 h-5" />,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/20 border-yellow-500/30"
    }
  ];

  const assetAllocation = marketData.slice(0, 5).map((ticker, index) => {
    const colors = ['#f7931a', '#627eea', '#f3ba2f', '#00ffa3', '#0033ad'];
    const allocations = [35, 25, 20, 12, 8];
    return {
      name: ticker.symbol.replace('USDT', ''),
      value: allocations[index] || 10,
      color: colors[index] || '#8884d8'
    };
  });

  const recentTrades = marketData.slice(0, 6).map((ticker) => {
    const isPositive = parseFloat(ticker.priceChangePercent) >= 0;
    return {
      pair: ticker.symbol,
      type: isPositive ? 'Long' : 'Short',
      price: formatPrice(ticker.lastPrice),
      high: formatPrice(ticker.highPrice),
      low: formatPrice(ticker.lowPrice),
      pnl: formatPercent(ticker.priceChangePercent),
      volume: `$${(parseFloat(ticker.quoteVolume) / 1000000).toFixed(1)}M`,
      status: 'Ativo'
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
              <BarChart3 className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard de Performance</h1>
          <p className="text-muted-foreground">Dados em tempo real da Binance</p>
          <div className="flex items-center justify-center gap-4 mt-2">
            <Badge variant="outline">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              API Binance Conectada
            </Badge>
            <Badge variant="outline">
              <RefreshCw className="w-3 h-3 mr-1" />
              Atualizado: {lastUpdate.toLocaleTimeString('pt-BR')}
            </Badge>
          </div>
        </div>

        {/* Timeframe Selector */}
        <div className="flex justify-center mb-8">
          <div className="bg-muted rounded-full p-1">
            {['7d', '30d', '90d', '1y'].map((period) => (
              <button
                key={period}
                onClick={() => setTimeframe(period)}
                className={`px-6 py-2 rounded-full transition-all duration-300 ${
                  timeframe === period
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {period === '7d' ? '7 dias' : period === '30d' ? '30 dias' : period === '90d' ? '90 dias' : '1 ano'}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-primary">
                    {stat.icon}
                  </div>
                  <Badge variant="outline">
                    {stat.change}
                  </Badge>
                </div>
                <div className={`text-2xl font-bold ${stat.color} mb-1`}>
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.title}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Equity Curve */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Curva de Equity (Baseado em BTC)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-[300px]">
                  <RefreshCw className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={performanceData}>
                    <defs>
                      <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        color: 'hsl(var(--foreground))'
                      }}
                      formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Equity']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="equity" 
                      stroke="hsl(var(--primary))" 
                      fillOpacity={1} 
                      fill="url(#colorEquity)" 
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Asset Allocation */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Target className="w-5 h-5" />
                Alocação de Ativos
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-[300px]">
                  <RefreshCw className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie
                        data={assetAllocation}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {assetAllocation.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          color: 'hsl(var(--foreground))'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-wrap justify-center gap-2 mt-2">
                    {assetAllocation.map((asset, index) => (
                      <Badge key={index} variant="outline" className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: asset.color }} />
                        {asset.name}
                      </Badge>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Market Data Table */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Dados de Mercado em Tempo Real
              <Badge variant="outline" className="ml-2">Binance</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left text-muted-foreground p-3">Par</th>
                      <th className="text-left text-muted-foreground p-3">Preço</th>
                      <th className="text-left text-muted-foreground p-3">Máxima 24h</th>
                      <th className="text-left text-muted-foreground p-3">Mínima 24h</th>
                      <th className="text-left text-muted-foreground p-3">Variação 24h</th>
                      <th className="text-left text-muted-foreground p-3">Volume</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTrades.map((trade, index) => {
                      const isPositive = trade.pnl.startsWith('+');
                      return (
                        <tr key={index} className="border-b border-border hover:bg-muted/30">
                          <td className="text-foreground p-3 font-medium">
                            <div className="flex items-center gap-2">
                              {isPositive ? 
                                <TrendingUp className="w-4 h-4 text-green-500" /> : 
                                <TrendingDown className="w-4 h-4 text-red-500" />
                              }
                              {trade.pair}
                            </div>
                          </td>
                          <td className="text-foreground p-3 font-mono">${trade.price}</td>
                          <td className="text-muted-foreground p-3 font-mono">${trade.high}</td>
                          <td className="text-muted-foreground p-3 font-mono">${trade.low}</td>
                          <td className={`p-3 font-bold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                            {trade.pnl}
                          </td>
                          <td className="text-muted-foreground p-3">{trade.volume}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PerformanceDashboard;
