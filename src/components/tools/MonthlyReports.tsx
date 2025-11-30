import { useState } from 'react';
import { FileText, Download, Calendar, TrendingUp, TrendingDown, Award, Target, DollarSign, BarChart3, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Header from '@/components/navigation/Header';
import { useNavigate } from 'react-router-dom';

const MonthlyReports = () => {
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState('2024-01');

  // Mock reports data
  const reports = [
    {
      id: 1,
      month: '2024-01',
      monthName: 'Janeiro 2024',
      status: 'published',
      summary: {
        totalTrades: 156,
        winRate: 68.5,
        totalPnL: 12450,
        bestDay: 2840,
        worstDay: -1230,
        avgTradeSize: 2500,
        sharpeRatio: 1.42,
        maxDrawdown: 8.5
      },
      highlights: [
        'Estratégia de breakout teve excelente performance (78% win rate)',
        'Bitcoin e Ethereum dominaram os melhores trades do mês',
        'Implementação de stop loss dinâmico reduziu perdas em 15%',
        'Identificação precoce de tendência de alta no mercado'
      ],
      topPerformers: [
        { trader: 'Carlos Silva', winRate: 85, pnl: 3200 },
        { trader: 'Ana Costa', winRate: 82, pnl: 2890 },
        { trader: 'Roberto Lima', winRate: 79, pnl: 2650 }
      ],
      marketInsights: 'Janeiro foi marcado por forte recuperação do mercado cripto, com Bitcoin liderando o movimento de alta. A aprovação dos ETFs de Bitcoin trouxe otimismo institucional.'
    },
    {
      id: 2,
      month: '2023-12',
      monthName: 'Dezembro 2023',
      status: 'published',
      summary: {
        totalTrades: 143,
        winRate: 71.2,
        totalPnL: 9850,
        bestDay: 2150,
        worstDay: -980,
        avgTradeSize: 2200,
        sharpeRatio: 1.28,
        maxDrawdown: 6.8
      },
      highlights: [
        'Fim de ano com consolidação positiva',
        'Estratégias defensivas performaram melhor',
        'Altcoins tiveram performance mista',
        'Volume reduzido típico do período de festas'
      ],
      topPerformers: [
        { trader: 'Marina Santos', winRate: 88, pnl: 2950 },
        { trader: 'Pedro Oliveira', winRate: 84, pnl: 2720 },
        { trader: 'Carlos Silva', winRate: 81, pnl: 2580 }
      ],
      marketInsights: 'Dezembro apresentou volatilidade reduzida com movimento lateral. Mercado aguardando definições regulatórias e movimentos institucionais para 2024.'
    },
    {
      id: 3,
      month: '2023-11',
      monthName: 'Novembro 2023',
      status: 'published',
      summary: {
        totalTrades: 167,
        winRate: 64.8,
        totalPnL: 8920,
        bestDay: 1890,
        worstDay: -1450,
        avgTradeSize: 2300,
        sharpeRatio: 1.15,
        maxDrawdown: 11.2
      },
      highlights: [
        'Mercado volátil com oportunidades em ambas direções',
        'Estratégias de scalping tiveram boa performance',
        'Gestão de risco foi fundamental para preservar capital',
        'Diversificação entre diferentes timeframes'
      ],
      topPerformers: [
        { trader: 'Ana Costa', winRate: 87, pnl: 3100 },
        { trader: 'Roberto Lima', winRate: 83, pnl: 2780 },
        { trader: 'Marina Santos', winRate: 80, pnl: 2650 }
      ],
      marketInsights: 'Novembro foi caracterizado por alta volatilidade e incertezas macroeconômicas. Traders mais experientes conseguiram aproveitar as oscilações.'
    }
  ];

  const currentReport = reports.find(r => r.month === selectedMonth) || reports[0];

  const formatCurrency = (value: number) => {
    return `R$ ${value.toLocaleString('pt-BR')}`;
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
              <FileText className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Relatórios Mensais</h1>
          <p className="text-muted-foreground">Análise detalhada da performance e insights do mercado</p>
        </div>

      {/* Month Selector */}
      <div className="flex justify-center mb-8">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-foreground" />
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="min-w-[200px]">
                  <SelectValue placeholder="Selecionar mês" />
                </SelectTrigger>
                <SelectContent>
                  {reports.map(report => (
                    <SelectItem key={report.month} value={report.month}>
                      {report.monthName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Header */}
      <Card className="mb-8 bg-card border-border">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl text-foreground mb-2">{currentReport.monthName}</CardTitle>
              <Badge variant="outline">
                Relatório Publicado
              </Badge>
            </div>
            <Button className="bg-primary hover:bg-primary/90">
              <Download className="w-4 h-4 mr-2" />
              Baixar PDF
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Performance Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-card border-border">
          <CardContent className="p-4 text-center">
            <BarChart3 className="w-6 h-6 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{currentReport.summary.totalTrades}</div>
            <div className="text-muted-foreground text-sm">Total de Trades</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4 text-center">
            <Target className="w-6 h-6 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-primary">{currentReport.summary.winRate}%</div>
            <div className="text-muted-foreground text-sm">Taxa de Acerto</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4 text-center">
            <DollarSign className="w-6 h-6 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(currentReport.summary.totalPnL)}
            </div>
            <div className="text-muted-foreground text-sm">P&L Total</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4 text-center">
            <Award className="w-6 h-6 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-primary">{currentReport.summary.sharpeRatio}</div>
            <div className="text-muted-foreground text-sm">Sharpe Ratio</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Detailed Metrics */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Métricas Detalhadas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-muted/30 rounded-lg border border-border">
                <div className="text-lg font-bold text-primary">
                  {formatCurrency(currentReport.summary.bestDay)}
                </div>
                <div className="text-xs text-muted-foreground">Melhor Dia</div>
              </div>
              
              <div className="text-center p-3 bg-muted/30 rounded-lg border border-border">
                <div className="text-lg font-bold text-destructive">
                  {formatCurrency(currentReport.summary.worstDay)}
                </div>
                <div className="text-xs text-muted-foreground">Pior Dia</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tamanho Médio do Trade:</span>
                <span className="text-foreground font-medium">
                  {formatCurrency(currentReport.summary.avgTradeSize)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Max Drawdown:</span>
                <span className="text-destructive font-medium">
                  {currentReport.summary.maxDrawdown}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Performers */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Award className="w-5 h-5" />
              Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentReport.topPerformers.map((trader, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <div className="text-foreground font-medium">{trader.trader}</div>
                      <div className="text-muted-foreground text-sm">{trader.winRate}% win rate</div>
                    </div>
                  </div>
                  <div className="text-primary font-bold">
                    {formatCurrency(trader.pnl)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Highlights */}
      <Card className="mb-8 bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Destaques do Mês
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {currentReport.highlights.map((highlight, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <p className="text-foreground text-sm">{highlight}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Market Insights */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Insights do Mercado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground leading-relaxed">{currentReport.marketInsights}</p>
        </CardContent>
      </Card>
      </div>
    </div>
  );
};

export default MonthlyReports;