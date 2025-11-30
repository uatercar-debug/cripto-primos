// Binance Public API Service
// Documentação: https://binance-docs.github.io/apidocs/spot/en/

const BINANCE_API_BASE = 'https://api.binance.com/api/v3';

export interface KlineData {
  openTime: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  closeTime: number;
  quoteAssetVolume: string;
  numberOfTrades: number;
}

export interface TickerPrice {
  symbol: string;
  price: string;
}

export interface Ticker24h {
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  weightedAvgPrice: string;
  prevClosePrice: string;
  lastPrice: string;
  lastQty: string;
  bidPrice: string;
  askPrice: string;
  openPrice: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  quoteVolume: string;
  openTime: number;
  closeTime: number;
  count: number;
}

// Símbolos populares de criptomoedas na Binance
export const CRYPTO_SYMBOLS = {
  BTC: 'BTCUSDT',
  ETH: 'ETHUSDT',
  BNB: 'BNBUSDT',
  SOL: 'SOLUSDT',
  ADA: 'ADAUSDT',
  XRP: 'XRPUSDT',
  DOGE: 'DOGEUSDT',
  DOT: 'DOTUSDT',
  MATIC: 'MATICUSDT',
  AVAX: 'AVAXUSDT',
};

// Obter preço atual de um símbolo
export const getPrice = async (symbol: string): Promise<TickerPrice> => {
  const response = await fetch(`${BINANCE_API_BASE}/ticker/price?symbol=${symbol}`);
  if (!response.ok) throw new Error(`Failed to fetch price for ${symbol}`);
  return response.json();
};

// Obter preços de múltiplos símbolos
export const getPrices = async (symbols: string[]): Promise<TickerPrice[]> => {
  const symbolsParam = JSON.stringify(symbols);
  const response = await fetch(`${BINANCE_API_BASE}/ticker/price?symbols=${encodeURIComponent(symbolsParam)}`);
  if (!response.ok) throw new Error('Failed to fetch prices');
  return response.json();
};

// Obter estatísticas 24h de um símbolo
export const get24hTicker = async (symbol: string): Promise<Ticker24h> => {
  const response = await fetch(`${BINANCE_API_BASE}/ticker/24hr?symbol=${symbol}`);
  if (!response.ok) throw new Error(`Failed to fetch 24h ticker for ${symbol}`);
  return response.json();
};

// Obter estatísticas 24h de múltiplos símbolos
export const get24hTickers = async (symbols: string[]): Promise<Ticker24h[]> => {
  const symbolsParam = JSON.stringify(symbols);
  const response = await fetch(`${BINANCE_API_BASE}/ticker/24hr?symbols=${encodeURIComponent(symbolsParam)}`);
  if (!response.ok) throw new Error('Failed to fetch 24h tickers');
  return response.json();
};

// Obter dados históricos (Klines/Candlesticks)
export const getKlines = async (
  symbol: string,
  interval: '1m' | '5m' | '15m' | '30m' | '1h' | '4h' | '1d' | '1w' | '1M' = '1d',
  limit: number = 100
): Promise<KlineData[]> => {
  const response = await fetch(
    `${BINANCE_API_BASE}/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`
  );
  if (!response.ok) throw new Error(`Failed to fetch klines for ${symbol}`);
  
  const data = await response.json();
  
  // Transformar array em objeto
  return data.map((kline: any[]) => ({
    openTime: kline[0],
    open: kline[1],
    high: kline[2],
    low: kline[3],
    close: kline[4],
    volume: kline[5],
    closeTime: kline[6],
    quoteAssetVolume: kline[7],
    numberOfTrades: kline[8],
  }));
};

// Calcular retornos percentuais de uma série de preços
export const calculateReturns = (prices: number[]): number[] => {
  const returns: number[] = [];
  for (let i = 1; i < prices.length; i++) {
    returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
  }
  return returns;
};

// Calcular correlação de Pearson entre duas séries
export const calculateCorrelation = (x: number[], y: number[]): number => {
  const n = Math.min(x.length, y.length);
  if (n === 0) return 0;
  
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

// Calcular correlação móvel (rolling correlation)
export const calculateRollingCorrelation = (
  returnsA: number[],
  returnsB: number[],
  window: number = 20
): number[] => {
  const rollingCorr: number[] = [];
  const minLength = Math.min(returnsA.length, returnsB.length);
  
  for (let i = window - 1; i < minLength; i++) {
    const windowA = returnsA.slice(i - window + 1, i + 1);
    const windowB = returnsB.slice(i - window + 1, i + 1);
    const corr = calculateCorrelation(windowA, windowB);
    rollingCorr.push(corr);
  }
  
  return rollingCorr;
};

// Buscar dados de correlação entre dois ativos
export const getCorrelationData = async (
  symbolA: string,
  symbolB: string,
  interval: '1h' | '4h' | '1d' | '1w' = '1d',
  limit: number = 100
): Promise<{
  correlationData: { date: string; correlation: number }[];
  currentCorrelation: number;
  assetAData: { prices: number[]; returns: number[] };
  assetBData: { prices: number[]; returns: number[] };
}> => {
  // Buscar klines para ambos os ativos
  const [klinesA, klinesB] = await Promise.all([
    getKlines(symbolA, interval, limit),
    getKlines(symbolB, interval, limit),
  ]);
  
  // Extrair preços de fechamento
  const pricesA = klinesA.map(k => parseFloat(k.close));
  const pricesB = klinesB.map(k => parseFloat(k.close));
  
  // Calcular retornos
  const returnsA = calculateReturns(pricesA);
  const returnsB = calculateReturns(pricesB);
  
  // Calcular correlação móvel
  const window = Math.min(20, Math.floor(returnsA.length / 3));
  const rollingCorr = calculateRollingCorrelation(returnsA, returnsB, window);
  
  // Preparar dados para o gráfico
  const correlationData = rollingCorr.map((corr, idx) => {
    const timestamp = klinesA[idx + window]?.openTime || Date.now();
    return {
      date: new Date(timestamp).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
      }),
      correlation: parseFloat(corr.toFixed(4)),
    };
  });
  
  return {
    correlationData,
    currentCorrelation: rollingCorr[rollingCorr.length - 1] || 0,
    assetAData: { prices: pricesA, returns: returnsA },
    assetBData: { prices: pricesB, returns: returnsB },
  };
};

// Formatar preço para exibição
export const formatPrice = (price: number | string, decimals: number = 2): string => {
  const num = typeof price === 'string' ? parseFloat(price) : price;
  if (num >= 1000) {
    return num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  return num.toFixed(decimals);
};

// Formatar variação percentual
export const formatPercent = (percent: number | string): string => {
  const num = typeof percent === 'string' ? parseFloat(percent) : percent;
  const sign = num >= 0 ? '+' : '';
  return `${sign}${num.toFixed(2)}%`;
};




