import { useState } from 'react';
import { TrendingUp, TrendingDown, Clock, Target, DollarSign, AlertTriangle, Star, Filter, Bell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const PremiumSignals = () => {
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Mock signals data
  const signals = [
    {
      id: 1,
      pair: 'BTC/USDT',
      type: 'Long',
      price: 43250,
      targetPrice: 45500,
      stopLoss: 41800,
      status: 'active',
      confidence: 85,
      timeframe: '4h',
      analyst: 'Carlos Silva',
      timestamp: '2024-01-25 14:30',
      description: 'Rompimento de resistência importante com volume crescente. Indicadores técnicos mostram força compradora.',
      riskReward: '1:2.8',
      potentialGain: 5.2
    },
    {
      id: 2,
      pair: 'ETH/USDT',
      type: 'Short',
      price: 2580,
      targetPrice: 2420,
      stopLoss: 2650,
      status: 'closed',
      confidence: 78,
      timeframe: '1h',
      analyst: 'Ana Costa',
      timestamp: '2024-01-25 12:15',
      description: 'Divergência bearish no RSI em resistência chave. Volume de venda aumentando.',
      riskReward: '1:2.3',
      potentialGain: 6.2,
      result: 'win',
      actualGain: 5.8
    },
    {
      id: 3,
      pair: 'BNB/USDT',
      type: 'Long',
      price: 315,
      targetPrice: 330,
      stopLoss: 308,
      status: 'active',
      confidence: 92,
      timeframe: '1d',
      analyst: 'Roberto Lima',
      timestamp: '2024-01-25 09:00',
      description: 'Padrão de triângulo ascendente próximo ao rompimento. Fundamentos fortes da Binance.',
      riskReward: '1:2.1',
      potentialGain: 4.8
    },
    {
      id: 4,
      pair: 'ADA/USDT',
      type: 'Long',
      price: 0.485,
      targetPrice: 0.520,
      stopLoss: 0.465,
      status: 'pending',
      confidence: 71,
      timeframe: '4h',
      analyst: 'Marina Santos',
      timestamp: '2024-01-25 16:45',
      description: 'Aguardando rompimento da EMA 50. Setup em formação com bom potencial.',
      riskReward: '1:1.8',
      potentialGain: 7.2
    },
    {
      id: 5,
      pair: 'SOL/USDT',
      type: 'Short',
      price: 98.5,
      targetPrice: 92.0,
      stopLoss: 102.0,
      status: 'closed',
      confidence: 88,
      timeframe: '2h',
      analyst: 'Pedro Oliveira',
      timestamp: '2024-01-24 18:20',
      description: 'Rejeição em resistência histórica com formação de shooting star.',
      riskReward: '1:1.9',
      potentialGain: 6.6,
      result: 'loss',
      actualGain: -3.5
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'closed': return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'Long' 
      ? 'bg-green-500/20 text-green-300 border-green-500/30'
      : 'bg-red-500/20 text-red-300 border-red-500/30';
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return 'text-green-400';
    if (confidence >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const filteredSignals = signals.filter(signal => {
    const typeMatch = selectedType === 'all' || signal.type.toLowerCase() === selectedType;
    const statusMatch = selectedStatus === 'all' || signal.status === selectedStatus;
    return typeMatch && statusMatch;
  });

  const stats = {
    totalSignals: signals.length,
    activeSignals: signals.filter(s => s.status === 'active').length,
    winRate: ((signals.filter(s => s.result === 'win').length / signals.filter(s => s.result).length) * 100).toFixed(1),
    avgGain: (signals.filter(s => s.actualGain).reduce((sum, s) => sum + s.actualGain, 0) / signals.filter(s => s.actualGain).length).toFixed(1)
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-primary rounded-2xl">
            <TrendingUp className="w-8 h-8 text-primary-foreground" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Sinais Premium</h1>
        <p className="text-muted-foreground">Receba sinais exclusivos dos nossos analistas especialistas</p>
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
            <div className="text-2xl font-bold text-primary">{stats.winRate}%</div>
            <div className="text-muted-foreground text-sm">Taxa de Acerto</div>
          </CardContent>
        </Card>
        
        <Card className="bg-card border-border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{stats.avgGain}%</div>
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
        {filteredSignals.map((signal) => (
          <Card key={signal.id} className="bg-card border-border hover:bg-muted/30 transition-all duration-300">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="text-2xl font-bold text-foreground">{signal.pair}</div>
                  <Badge variant={signal.type === 'Long' ? 'default' : 'destructive'}>
                    {signal.type === 'Long' ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                    {signal.type}
                  </Badge>
                  <Badge variant="outline">
                    {signal.status.toUpperCase()}
                  </Badge>
                </div>
                <div className="text-right">
                  <div className="text-muted-foreground text-sm">Confiança</div>
                  <div className="text-2xl font-bold text-primary">
                    {signal.confidence}%
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-6">
                {/* Price Info */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Preço de Entrada:</span>
                    <span className="text-foreground font-medium">${signal.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Target:</span>
                    <span className="text-primary font-medium">${signal.targetPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Stop Loss:</span>
                    <span className="text-destructive font-medium">${signal.stopLoss}</span>
                  </div>
                </div>

                {/* Analysis Info */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Timeframe:</span>
                    <span className="text-foreground font-medium">{signal.timeframe}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Risco/Retorno:</span>
                    <span className="text-primary font-medium">{signal.riskReward}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Potencial:</span>
                    <span className="text-primary font-medium">+{signal.potentialGain}%</span>
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
                    <span className="text-muted-foreground text-sm">{signal.timestamp}</span>
                  </div>
                  {signal.result && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Resultado:</span>
                      <span className={`font-medium ${signal.result === 'win' ? 'text-primary' : 'text-destructive'}`}>
                        {signal.actualGain > 0 ? '+' : ''}{signal.actualGain}%
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
        ))}
      </div>

      {/* Disclaimer */}
      <Card className="mt-8 bg-muted/30 border-border">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-500 mt-1" />
            <div>
              <h3 className="text-amber-500 font-semibold mb-2">Aviso Importante</h3>
              <p className="text-muted-foreground text-sm">
                Os sinais são baseados em análise técnica e não constituem recomendação de investimento. 
                Trading envolve riscos e você pode perder parte ou todo seu capital. Sempre faça sua 
                própria análise e gerencie seus riscos adequadamente.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PremiumSignals;