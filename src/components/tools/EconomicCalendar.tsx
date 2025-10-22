import { useState } from 'react';
import { Calendar as CalendarIcon, Clock, TrendingUp, AlertTriangle, Star, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const EconomicCalendar = () => {
  const [selectedImpact, setSelectedImpact] = useState('all');
  const [selectedCountry, setSelectedCountry] = useState('all');

  // Mock economic events data
  const economicEvents = [
    {
      date: '2024-01-25',
      time: '10:30',
      country: 'USA',
      flag: '🇺🇸',
      event: 'GDP Preliminar Q4',
      impact: 'high',
      forecast: '2.8%',
      previous: '2.6%',
      actual: null,
      description: 'Produto Interno Bruto trimestral - indicador chave da economia'
    },
    {
      date: '2024-01-25',
      time: '14:00',
      country: 'EUR',
      flag: '🇪🇺',
      event: 'Decisão da Taxa de Juros BCE',
      impact: 'high',
      forecast: '4.50%',
      previous: '4.50%',
      actual: null,
      description: 'Decisão de política monetária do Banco Central Europeu'
    },
    {
      date: '2024-01-25',
      time: '16:00',
      country: 'USA',
      flag: '🇺🇸',
      event: 'Vendas de Casas Existentes',
      impact: 'medium',
      forecast: '4.10M',
      previous: '3.97M',
      actual: '4.15M',
      description: 'Número de residências existentes vendidas'
    },
    {
      date: '2024-01-26',
      time: '09:00',
      country: 'GBP',
      flag: '🇬🇧',
      event: 'CPI Mensal',
      impact: 'high',
      forecast: '0.2%',
      previous: '0.3%',
      actual: null,
      description: 'Índice de Preços ao Consumidor - inflação'
    },
    {
      date: '2024-01-26',
      time: '11:00',
      country: 'BRA',
      flag: '🇧🇷',
      event: 'IPCA-15',
      impact: 'medium',
      forecast: '0.25%',
      previous: '0.28%',
      actual: null,
      description: 'Índice Nacional de Preços ao Consumidor Amplo-15'
    },
    {
      date: '2024-01-26',
      time: '15:30',
      country: 'USA',
      flag: '🇺🇸',
      event: 'Pedidos de Auxílio Desemprego',
      impact: 'low',
      forecast: '215K',
      previous: '218K',
      actual: null,
      description: 'Número semanal de pedidos iniciais de seguro-desemprego'
    },
    {
      date: '2024-01-27',
      time: '10:00',
      country: 'EUR',
      flag: '🇪🇺',
      event: 'Confiança do Consumidor',
      impact: 'medium',
      forecast: '-16.0',
      previous: '-16.9',
      actual: null,
      description: 'Índice de confiança do consumidor da Eurozona'
    }
  ];

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-300 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getImpactStars = (impact: string) => {
    switch (impact) {
      case 'high': return '⭐⭐⭐';
      case 'medium': return '⭐⭐';
      case 'low': return '⭐';
      default: return '';
    }
  };

  const filteredEvents = economicEvents.filter(event => {
    const impactMatch = selectedImpact === 'all' || event.impact === selectedImpact;
    const countryMatch = selectedCountry === 'all' || event.country === selectedCountry;
    return impactMatch && countryMatch;
  });

  const groupedEvents = filteredEvents.reduce((acc, event) => {
    const date = event.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(event);
    return acc;
  }, {} as Record<string, typeof economicEvents>);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-primary rounded-2xl">
            <CalendarIcon className="w-8 h-8 text-primary-foreground" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Calendário Econômico</h1>
        <p className="text-muted-foreground">Fique por dentro dos eventos que impactam o mercado</p>
      </div>

      {/* Filters */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Filter className="w-5 h-5 text-foreground" />
              <Select value={selectedImpact} onValueChange={setSelectedImpact}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por impacto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Impactos</SelectItem>
                  <SelectItem value="high">Alto Impacto ⭐⭐⭐</SelectItem>
                  <SelectItem value="medium">Médio Impacto ⭐⭐</SelectItem>
                  <SelectItem value="low">Baixo Impacto ⭐</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-foreground" />
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por país/região" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Países</SelectItem>
                  <SelectItem value="USA">🇺🇸 Estados Unidos</SelectItem>
                  <SelectItem value="EUR">🇪🇺 Zona do Euro</SelectItem>
                  <SelectItem value="GBP">🇬🇧 Reino Unido</SelectItem>
                  <SelectItem value="BRA">🇧🇷 Brasil</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Events by Date */}
      <div className="space-y-6">
        {Object.entries(groupedEvents).map(([date, events]) => (
          <Card key={date} className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <CalendarIcon className="w-5 h-5" />
                {formatDate(date)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {events.map((event, index) => (
                  <div key={index} className="bg-muted/30 rounded-lg p-4 hover:bg-muted/50 transition-all duration-300">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                      {/* Time & Country */}
                      <div className="lg:col-span-2">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="text-foreground font-medium">{event.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{event.flag}</span>
                          <span className="text-muted-foreground text-sm">{event.country}</span>
                        </div>
                      </div>

                      {/* Event Details */}
                      <div className="lg:col-span-4">
                        <h3 className="text-foreground font-semibold mb-1">{event.event}</h3>
                        <p className="text-muted-foreground text-sm">{event.description}</p>
                      </div>

                      {/* Impact */}
                      <div className="lg:col-span-2">
                        <Badge variant="outline">
                          {getImpactStars(event.impact)} {event.impact.toUpperCase()}
                        </Badge>
                      </div>

                      {/* Data */}
                      <div className="lg:col-span-4">
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">Anterior</div>
                            <div className="text-foreground font-medium">{event.previous}</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">Previsão</div>
                            <div className="text-primary font-medium">{event.forecast}</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">Atual</div>
                            <div className={`font-medium ${
                              event.actual 
                                ? event.actual > event.forecast 
                                  ? 'text-primary' 
                                  : 'text-destructive'
                                : 'text-muted-foreground'
                            }`}>
                              {event.actual || '-'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Legend */}
      <Card className="mt-8 bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Como Interpretar os Dados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-foreground font-semibold mb-3">Níveis de Impacto:</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Badge variant="outline">⭐⭐⭐ ALTO</Badge>
                  <span className="text-muted-foreground text-sm">Pode causar alta volatilidade no mercado</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline">⭐⭐ MÉDIO</Badge>
                  <span className="text-muted-foreground text-sm">Impacto moderado nos preços</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline">⭐ BAIXO</Badge>
                  <span className="text-muted-foreground text-sm">Impacto limitado no mercado</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-foreground font-semibold mb-3">Interpretação dos Dados:</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p><strong className="text-foreground">Anterior:</strong> Resultado do período anterior</p>
                <p><strong className="text-foreground">Previsão:</strong> Expectativa dos analistas</p>
                <p><strong className="text-foreground">Atual:</strong> Resultado real divulgado</p>
                <p className="text-primary">Verde: Resultado acima da previsão</p>
                <p className="text-destructive">Vermelho: Resultado abaixo da previsão</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EconomicCalendar;