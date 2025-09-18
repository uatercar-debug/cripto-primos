import { useState } from 'react';
import { PieChart as PieChartIcon, TrendingUp, AlertTriangle, Target, DollarSign, Percent } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from 'recharts';

const PortfolioAnalysis = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  // Mock portfolio data
  const portfolioData = [
    { name: 'Bitcoin', symbol: 'BTC', value: 35000, percentage: 45, color: '#f7931a', risk: 'Alto', allocation: 45 },
    { name: 'Ethereum', symbol: 'ETH', value: 20000, percentage: 26, color: '#627eea', risk: 'Alto', allocation: 26 },
    { name: 'Binance Coin', symbol: 'BNB', value: 12000, percentage: 15, color: '#f3ba2f', risk: 'Médio', allocation: 15 },
    { name: 'Cardano', symbol: 'ADA', value: 8000, percentage: 10, color: '#0033ad', risk: 'Médio', allocation: 10 },
    { name: 'Stablecoins', symbol: 'USDT/USDC', value: 3000, percentage: 4, color: '#26a17b', risk: 'Baixo', allocation: 4 }
  ];

  const totalValue = portfolioData.reduce((sum, asset) => sum + asset.value, 0);

  const riskAnalysis = {
    overall: 'Médio-Alto',
    volatility: '18.5%',
    sharpe: '1.42',
    maxDrawdown: '12.3%',
    beta: '1.15'
  };

  const performanceHistory = [
    { date: '01/01', value: 70000 },
    { date: '05/01', value: 72500 },
    { date: '10/01', value: 68000 },
    { date: '15/01', value: 75000 },
    { date: '20/01', value: 77000 },
    { date: '25/01', value: 74000 },
    { date: '30/01', value: 78000 }
  ];

  const idealAllocation = [
    { category: 'Bitcoin', recommended: 35, current: 45, diff: 10 },
    { category: 'Altcoins', recommended: 40, current: 51, diff: 11 },
    { category: 'Stablecoins', recommended: 25, current: 4, diff: -21 }
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Alto': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'Médio': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'Baixo': return 'bg-green-500/20 text-green-300 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full">
            <PieChartIcon className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Análise de Portfólio</h1>
        <p className="text-white/70">Visualize e otimize a distribuição dos seus investimentos</p>
      </div>

      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-6 text-center">
            <DollarSign className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <div className="text-3xl font-bold text-white mb-1">
              R$ {totalValue.toLocaleString()}
            </div>
            <div className="text-white/70">Valor Total</div>
            <Badge className="mt-2 bg-green-500/20 text-green-300 border-green-500/30">
              +12.5% (30d)
            </Badge>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-6 text-center">
            <Target className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <div className="text-3xl font-bold text-white mb-1">
              {portfolioData.length}
            </div>
            <div className="text-white/70">Ativos</div>
            <Badge className="mt-2 bg-blue-500/20 text-blue-300 border-blue-500/30">
              Diversificado
            </Badge>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-6 text-center">
            <TrendingUp className="w-8 h-8 text-purple-400 mx-auto mb-3" />
            <div className="text-3xl font-bold text-white mb-1">
              {riskAnalysis.overall}
            </div>
            <div className="text-white/70">Nível de Risco</div>
            <Badge className="mt-2 bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
              Balanceado
            </Badge>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Portfolio Distribution */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <PieChartIcon className="w-5 h-5" />
              Distribuição do Portfólio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={portfolioData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="percentage"
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                >
                  {portfolioData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    color: 'white'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Performance Chart */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Performance (30 dias)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.6)" />
                <YAxis stroke="rgba(255,255,255,0.6)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    color: 'white'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#8b5cf6" 
                  strokeWidth={3}
                  dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Asset Breakdown */}
      <Card className="mb-8 bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Detalhamento por Ativo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left text-white/80 p-3">Ativo</th>
                  <th className="text-left text-white/80 p-3">Valor</th>
                  <th className="text-left text-white/80 p-3">Percentual</th>
                  <th className="text-left text-white/80 p-3">Risco</th>
                  <th className="text-left text-white/80 p-3">Alocação</th>
                </tr>
              </thead>
              <tbody>
                {portfolioData.map((asset, index) => (
                  <tr key={index} className="border-b border-white/10 hover:bg-white/5">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: asset.color }}
                        ></div>
                        <div>
                          <div className="text-white font-medium">{asset.name}</div>
                          <div className="text-white/60 text-sm">{asset.symbol}</div>
                        </div>
                      </div>
                    </td>
                    <td className="text-white p-3">R$ {asset.value.toLocaleString()}</td>
                    <td className="text-white p-3">{asset.percentage}%</td>
                    <td className="p-3">
                      <Badge className={getRiskColor(asset.risk)}>
                        {asset.risk}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="w-20">
                        <Progress value={asset.allocation} className="h-2" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Risk Metrics */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Métricas de Risco
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
              <span className="text-white/80">Volatilidade</span>
              <span className="text-white font-medium">{riskAnalysis.volatility}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
              <span className="text-white/80">Sharpe Ratio</span>
              <span className="text-white font-medium">{riskAnalysis.sharpe}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
              <span className="text-white/80">Max Drawdown</span>
              <span className="text-red-400 font-medium">{riskAnalysis.maxDrawdown}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
              <span className="text-white/80">Beta</span>
              <span className="text-white font-medium">{riskAnalysis.beta}</span>
            </div>
          </CardContent>
        </Card>

        {/* Rebalancing Suggestions */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="w-5 h-5" />
              Sugestões de Rebalanceamento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {idealAllocation.map((item, index) => (
              <div key={index} className="p-3 bg-white/5 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white font-medium">{item.category}</span>
                  <Badge className={item.diff > 0 ? 'bg-red-500/20 text-red-300 border-red-500/30' : 'bg-green-500/20 text-green-300 border-green-500/30'}>
                    {item.diff > 0 ? `+${item.diff}%` : `${item.diff}%`}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm text-white/70">
                  <span>Atual: {item.current}%</span>
                  <span>Recomendado: {item.recommended}%</span>
                </div>
                <Progress value={item.current} className="h-2 mt-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PortfolioAnalysis;