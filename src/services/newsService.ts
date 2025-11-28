// Serviço para buscar notícias usando RSS feeds
// API completamente gratuita sem limitações

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    name: string;
  };
  category: string;
  readTime: string;
}

interface NewsResponse {
  articles: NewsArticle[];
  totalArticles: number;
}

// Fontes RSS em português brasileiro - Feeds testados e funcionais
const RSS_FEEDS = {
  CRYPTO: [
    'https://www.criptofacil.com/feed/',
    'https://beincrypto.com/br/feed/',
    'https://livecoins.com.br/feed/',
    'https://www.criptomoedasfacil.com/feed/',
    'https://www.moneytimes.com.br/category/mercados/criptomoedas/feed/'
  ],
  FINANCE: [
    'https://www.infomoney.com.br/feed/',
    'https://www.valor.com.br/rss',
    'https://www.moneytimes.com.br/feed/',
    'https://investnews.com.br/feed/',
    'https://www.suno.com.br/feed/'
  ],
  ECONOMY: [
    'https://www.valor.com.br/rss',
    'https://www.infomoney.com.br/feed/',
    'https://www.moneytimes.com.br/category/economia/feed/',
    'https://investnews.com.br/categoria/economia/feed/'
  ]
};

// Palavras-chave em português para filtrar notícias relevantes
const RELEVANT_KEYWORDS = [
  'bitcoin', 'criptomoeda', 'cryptocurrency', 'crypto',
  'investimento', 'investment', 'trading', 'copytrading',
  'mercado financeiro', 'financial market', 'economia',
  'economy', 'fintech', 'blockchain', 'exness',
  'forex', 'bolsa de valores', 'stock market', 'bolsa',
  'ações', 'fundos', 'renda fixa', 'renda variável'
];

class NewsService {
  private rss2jsonUrl: string = 'https://api.rss2json.com/v1/api.json';

  constructor() {
    // RSS2JSON é completamente gratuito, sem necessidade de chave
  }

  // Buscar notícias por categoria usando RSS feeds
  async getNewsByCategory(category: string, pageSize: number = 10): Promise<NewsArticle[]> {
    try {
      const feeds = this.getFeedsForCategory(category);
      const allArticles: NewsArticle[] = [];

      // Buscar de múltiplas fontes em paralelo
      const promises = feeds.map(feed => this.fetchRSSFeed(feed, category));
      const results = await Promise.allSettled(promises);

      // Combinar resultados
      results.forEach(result => {
        if (result.status === 'fulfilled') {
          allArticles.push(...result.value);
        }
      });

      // Remover duplicatas, filtrar, processar e limitar resultados
      const processedArticles = this.removeDuplicates(allArticles)
        .filter(article => this.isRelevantArticle(article))
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
        .slice(0, pageSize);

      return processedArticles;
    } catch (error) {
      console.error('Erro ao buscar notícias:', error);
      return this.getFallbackNews(category);
    }
  }

  // Remover artigos duplicados baseado em URL e título similar
  private removeDuplicates(articles: NewsArticle[]): NewsArticle[] {
    const seen = new Set<string>();
    const unique: NewsArticle[] = [];

    for (const article of articles) {
      // Criar chave única baseada em URL e título normalizado
      const normalizedTitle = article.title.toLowerCase().trim().substring(0, 50);
      const key = `${article.url}|${normalizedTitle}`;

      if (!seen.has(key) && article.url !== '#') {
        seen.add(key);
        unique.push(article);
      }
    }

    return unique;
  }

  // Buscar notícias de criptomoedas
  async getCryptoNews(pageSize: number = 10): Promise<NewsArticle[]> {
    return this.getNewsByCategory('Criptomoedas', pageSize);
  }

  // Buscar notícias de todas as categorias
  async getAllNews(): Promise<{ [key: string]: NewsArticle[] }> {
    try {
      const [cryptoNews, financeNews, economyNews] = await Promise.all([
        this.getCryptoNews(8),
        this.getNewsByCategory('Mercado Financeiro', 8),
        this.getNewsByCategory('Política Econômica', 8)
      ]);

      return {
        'Criptomoedas': cryptoNews,
        'Mercado Financeiro': financeNews,
        'Política Econômica': economyNews
      };
    } catch (error) {
      console.error('Erro ao buscar todas as notícias:', error);
      return {
        'Criptomoedas': this.getFallbackNews('Criptomoedas'),
        'Mercado Financeiro': this.getFallbackNews('Mercado Financeiro'),
        'Política Econômica': this.getFallbackNews('Política Econômica')
      };
    }
  }

  // Obter feeds RSS para uma categoria
  private getFeedsForCategory(category: string): string[] {
    const categoryMap: { [key: string]: string[] } = {
      'Criptomoedas': RSS_FEEDS.CRYPTO,
      'Mercado Financeiro': RSS_FEEDS.FINANCE,
      'Política Econômica': RSS_FEEDS.ECONOMY
    };
    return categoryMap[category] || RSS_FEEDS.FINANCE;
  }

  // Buscar feed RSS
  private async fetchRSSFeed(feedUrl: string, category: string): Promise<NewsArticle[]> {
    try {
      const response = await fetch(
        `${this.rss2jsonUrl}?rss_url=${encodeURIComponent(feedUrl)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.items || !Array.isArray(data.items)) {
        return [];
      }

      return data.items.map((item: any) => this.processRSSItem(item, category));
    } catch (error) {
      console.error(`Erro ao buscar feed ${feedUrl}:`, error);
      return [];
    }
  }

  // Processar item RSS
  private processRSSItem(item: any, category: string): NewsArticle {
    const rawDescription = item.description || item.content || 'Descrição não disponível';
    const cleanDescription = this.cleanHtmlAndUrls(rawDescription);
    
    // Tentar extrair imagem de várias fontes possíveis
    const imageUrl = this.extractImageUrl(item);
    
    return {
      title: item.title || 'Título não disponível',
      description: cleanDescription,
      url: item.link || '#',
      urlToImage: this.getValidImageUrl(imageUrl),
      publishedAt: item.pubDate || new Date().toISOString(),
      source: {
        name: this.extractSourceName(item.link) || 'Fonte desconhecida'
      },
      category: this.mapCategory(category),
      readTime: this.calculateReadTime(cleanDescription)
    };
  }

  // Extrair URL de imagem de várias fontes possíveis
  private extractImageUrl(item: any): string | undefined {
    // 1. Tentar thumbnail direto
    if (item.thumbnail && item.thumbnail !== '') {
      return item.thumbnail;
    }

    // 2. Tentar enclosure (usado pelo Valor e outros)
    if (item.enclosure?.link) {
      return item.enclosure.link;
    }

    // 3. Extrair do HTML do content
    if (item.content) {
      const imgMatch = item.content.match(/<img[^>]+src=["']([^"']+)["']/i);
      if (imgMatch && imgMatch[1]) {
        return imgMatch[1];
      }
    }

    // 4. Extrair do HTML do description
    if (item.description) {
      const imgMatch = item.description.match(/<img[^>]+src=["']([^"']+)["']/i);
      if (imgMatch && imgMatch[1]) {
        return imgMatch[1];
      }
    }

    return undefined;
  }

  // Limpar HTML e URLs da descrição
  private cleanHtmlAndUrls(text: string): string {
    // Remover todas as tags HTML
    let cleaned = text.replace(/<[^>]*>/g, ' ');
    
    // Remover URLs de imagens
    cleaned = cleaned.replace(/https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp|svg)[^\s]*/gi, '');
    
    // Remover outras URLs
    cleaned = cleaned.replace(/https?:\/\/[^\s]+/g, '');
    
    // Remover múltiplos espaços
    cleaned = cleaned.replace(/\s+/g, ' ');
    
    // Remover espaços no início e fim
    cleaned = cleaned.trim();
    
    // Limitar tamanho
    if (cleaned.length > 200) {
      cleaned = cleaned.substring(0, 200) + '...';
    }
    
    return cleaned || 'Descrição não disponível';
  }

  // Obter URL de imagem válida ou placeholder
  private getValidImageUrl(imageUrl?: string): string {
    if (!imageUrl || imageUrl === '/placeholder.svg') {
      return this.getPlaceholderImage();
    }
    
    // Verificar se é uma URL válida
    try {
      new URL(imageUrl);
      return imageUrl;
    } catch {
      return this.getPlaceholderImage();
    }
  }

  // Gerar imagem placeholder baseada na categoria
  private getPlaceholderImage(): string {
    const placeholders = [
      'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=250&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=250&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=250&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=250&fit=crop&crop=center'
    ];
    
    return placeholders[Math.floor(Math.random() * placeholders.length)];
  }

  // Extrair nome da fonte da URL
  private extractSourceName(url: string): string {
    try {
      const domain = new URL(url).hostname;
      return domain.replace('www.', '').split('.')[0];
    } catch {
      return 'Fonte desconhecida';
    }
  }

  // Verificar se o artigo é relevante
  private isRelevantArticle(article: NewsArticle): boolean {
    if (!article.title || !article.description) return false;
    
    const text = `${article.title} ${article.description}`.toLowerCase();
    return RELEVANT_KEYWORDS.some(keyword => text.includes(keyword.toLowerCase()));
  }

  // Mapear categoria da API para categoria do site
  private mapCategory(apiCategory: string): string {
    const categoryMap: { [key: string]: string } = {
      'Criptomoedas': 'Criptomoedas',
      'Mercado Financeiro': 'Mercado Financeiro',
      'Política Econômica': 'Política Econômica'
    };
    return categoryMap[apiCategory] || 'Geral';
  }

  // Calcular tempo de leitura estimado
  private calculateReadTime(text: string): string {
    const wordsPerMinute = 200;
    const wordCount = text.split(' ').length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min`;
  }

  // Notícias de fallback caso a API falhe
  private getFallbackNews(category: string): NewsArticle[] {
    const fallbackNews: { [key: string]: NewsArticle[] } = {
      'Criptomoedas': [
        {
          title: 'Bitcoin atinge nova máxima histórica após aprovação de ETFs',
          description: 'A aprovação dos ETFs de Bitcoin nos EUA impulsionou o preço da criptomoeda para novos patamares históricos, com investidores institucionais aumentando suas posições.',
          url: '#',
          urlToImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=250&fit=crop&crop=center',
          publishedAt: new Date().toISOString(),
          source: { name: 'Cripto Primos' },
          category: 'Criptomoedas',
          readTime: '5 min'
        },
        {
          title: 'Altcoins promissoras para Q4 2024',
          description: 'Análise das principais criptomoedas alternativas com potencial de crescimento nos próximos meses, incluindo Ethereum, Solana e Cardano.',
          url: '#',
          urlToImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop&crop=center',
          publishedAt: new Date().toISOString(),
          source: { name: 'Cripto Primos' },
          category: 'Criptomoedas',
          readTime: '7 min'
        },
        {
          title: 'Copytrading: Estratégia para iniciantes em criptomoedas',
          description: 'Como o copytrading pode ser uma forma segura e eficiente para iniciantes começarem a investir em criptomoedas seguindo traders experientes.',
          url: '#',
          urlToImage: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=250&fit=crop&crop=center',
          publishedAt: new Date().toISOString(),
          source: { name: 'Cripto Primos' },
          category: 'Criptomoedas',
          readTime: '6 min'
        }
      ],
      'Mercado Financeiro': [
        {
          title: 'Fed sinaliza possível corte na taxa de juros',
          description: 'O Federal Reserve americano indica possibilidade de redução nas taxas de juros, o que pode impactar significativamente os mercados globais e estratégias de investimento.',
          url: '#',
          urlToImage: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=250&fit=crop&crop=center',
          publishedAt: new Date().toISOString(),
          source: { name: 'Cripto Primos' },
          category: 'Mercado Financeiro',
          readTime: '4 min'
        },
        {
          title: 'Ibovespa fecha em alta com foco em resultados corporativos',
          description: 'A bolsa brasileira registrou alta significativa impulsionada por resultados positivos de grandes empresas e expectativas de melhora na economia.',
          url: '#',
          urlToImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop&crop=center',
          publishedAt: new Date().toISOString(),
          source: { name: 'Cripto Primos' },
          category: 'Mercado Financeiro',
          readTime: '3 min'
        }
      ],
      'Política Econômica': [
        {
          title: 'Eleições 2024: Impactos no mercado brasileiro',
          description: 'Análise dos cenários políticos e seus reflexos no Ibovespa, dólar e principais setores da economia brasileira.',
          url: '#',
          urlToImage: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=250&fit=crop&crop=center',
          publishedAt: new Date().toISOString(),
          source: { name: 'Cripto Primos' },
          category: 'Política Econômica',
          readTime: '6 min'
        },
        {
          title: 'Inflação brasileira: Tendências e perspectivas',
          description: 'Análise do comportamento da inflação no Brasil e suas implicações para investidores e consumidores.',
          url: '#',
          urlToImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop&crop=center',
          publishedAt: new Date().toISOString(),
          source: { name: 'Cripto Primos' },
          category: 'Política Econômica',
          readTime: '5 min'
        }
      ]
    };

    return fallbackNews[category] || [];
  }
}

export const newsService = new NewsService();
export type { NewsArticle };