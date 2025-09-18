import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, TrendingDown, DollarSign, Target, Calendar, Award, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const PerformanceDashboard = () => {
  const [timeframe, setTimeframe] = useState('30d');
  
  // Mock data - em produção viria de uma API
  const performanceData = [
    { date: '01/01', pnl: 100, equity: 10100 },
    { date: '05/01', pnl: 250, equity: 10350 },
    { date: '10/01', pnl: -150, equity: 10200 },
    { date: '15/01', pnl: 400, equity: 10600 },
    { date: '20/01', pnl: 200, equity: 10800 },
    { date: '25/01', pnl: -100, equity: 10700 },
    { date: '30/01', pnl: 300, equity: 11000 },
  ];

  const stats = [
    {
      title: "P&L Total",
      value: "R$ 1.000,00",
      change: "+10.5%",
      icon: <DollarSign className="w-5 h-5" />,
      color: "text-green-400",
      bgColor: "bg-green-500/20 border-green-500/30"
    },
    {
      title: "Taxa de Acerto",
      value: "68%",
      change: "+5.2%",
      icon: <Target className="w-5 h-5" />,
      color: "text-blue-400",
      bgColor: "bg-blue-500/20 border-blue-500/30"
    },
    {
      title: "Trades Hoje",
      value: "12",
      change: "3 em andamento",
      icon: <Zap className="w-5 h-5" />,
      color: "text-purple-400",
      bgColor: "bg-purple-500/20 border-purple-500/30"
    },
    {
      title: "Melhor Semana",
      value: "R$ 850",
      change: "Semana 3",
      icon: <Award className="w-5 h-5" />,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/20 border-yellow-500/30"
    }
  ];

  const assetAllocation = [
    { name: 'Bitcoin', value: 35, color: '#f7931a' },
    { name: 'Ethereum', value: 25, color: '#627eea' },
    { name: 'BNB', value: 15, color: '#f3ba2f' },
    { name: 'Cardano', value: 10, color: '#0033ad' },
    { name: 'Outros', value: 15, color: '#8884d8' }
  ];

  const recentTrades = [
    { pair: 'BTC/USDT', type: 'Long', entry: '45,230', exit: '46,100', pnl: '+1.92%', status: 'Fechado' },
    { pair: 'ETH/USDT', type: 'Long', entry: '2,650', exit: '-', pnl: '+0.85%', status: 'Aberto' },
    { pair: 'BNB/USDT', type: 'Short', entry: '315', exit: '308', pnl: '+2.22%', status: 'Fechado' },
    { pair: 'ADA/USDT', type: 'Long', entry: '0.48', exit: '-', pnl: '-1.25%', status: 'Aberto' },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-gradient-to-r from-green-500 to-blue-600 rounded-full">
            <BarChart3 className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard de Performance</h1>
        <p className="text-white/70">Acompanhe seus resultados e evolução em tempo real</p>
      </div>

      {/* Timeframe Selector */}
      <div className="flex justify-center mb-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-full p-1 border border-white/20">
          {['7d', '30d', '90d', '1y'].map((period) => (
            <button
              key={period}
              onClick={() => setTimeframe(period)}
              className={`px-6 py-2 rounded-full transition-all duration-300 ${
                timeframe === period
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                  : 'text-white/70 hover:text-white'
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
          <Card key={index} className={`${stat.bgColor} backdrop-blur-sm border`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={stat.color}>
                  {stat.icon}
                </div>
                <Badge className="bg-white/10 text-white/80 border-white/20">
                  {stat.change}
                </Badge>
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-white/70">
                {stat.title}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Equity Curve */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Curva de Equity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
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
                <Area 
                  type="monotone" 
                  dataKey="equity" 
                  stroke="#10b981" 
                  fillOpacity={1} 
                  fill="url(#colorEquity)" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Asset Allocation */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="w-5 h-5" />
              Alocação de Ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={assetAllocation}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {assetAllocation.map((entry, index) => (
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
      </div>

      {/* Recent Trades */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Trades Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left text-white/80 p-3">Par</th>
                  <th className="text-left text-white/80 p-3">Tipo</th>
                  <th className="text-left text-white/80 p-3">Entrada</th>
                  <th className="text-left text-white/80 p-3">Saída</th>
                  <th className="text-left text-white/80 p-3">P&L</th>
                  <th className="text-left text-white/80 p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentTrades.map((trade, index) => (
                  <tr key={index} className="border-b border-white/10 hover:bg-white/5">
                    <td className="text-white p-3 font-medium">{trade.pair}</td>
                    <td className="p-3">
                      <Badge className={trade.type === 'Long' ? 'bg-green-500/20 text-green-300 border-green-500/30' : 'bg-red-500/20 text-red-300 border-red-500/30'}>
                        {trade.type}
                      </Badge>
                    </td>
                    <td className="text-white/80 p-3">{trade.entry}</td>
                    <td className="text-white/80 p-3">{trade.exit}</td>
                    <td className={`p-3 font-medium ${trade.pnl.includes('+') ? 'text-green-400' : 'text-red-400'}`}>
                      {trade.pnl}
                    </td>
                    <td className="p-3">
                      <Badge className={trade.status === 'Fechado' ? 'bg-gray-500/20 text-gray-300 border-gray-500/30' : 'bg-blue-500/20 text-blue-300 border-blue-500/30'}>
                        {trade.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceDashboard;