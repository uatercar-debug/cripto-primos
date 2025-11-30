// Serviço para extrair metadados de links (Open Graph, Twitter Cards, etc.)

export interface LinkMetadata {
  title?: string;
  description?: string;
  image?: string;
  author?: string;
  price?: string;
  siteName?: string;
  url?: string;
}

export class LinkScraperService {
  // Extrair metadados de uma URL usando Open Graph e meta tags
  static async extractMetadata(url: string): Promise<LinkMetadata> {
    // Primeiro, validar a URL
    if (!this.isValidUrl(url)) {
      throw new Error('URL inválida');
    }

    try {
      // Tentar extrair via API pública ou proxy CORS
      const metadata = await this.fetchMetadata(url);
      
      // Garantir que sempre retornamos algo útil
      if (!metadata.title && !metadata.description && !metadata.image) {
        console.log('No metadata extracted, using URL-based fallback');
        const fallback = this.extractFromUrl(url);
        return {
          ...fallback,
          url: url
        };
      }
      
      return {
        ...metadata,
        url: url // Sempre retornar URL original, não a resolvida
      };
    } catch (error) {
      console.error('Error extracting metadata:', error);
      // Mesmo em caso de erro, retornar informações básicas
      const fallback = this.extractFromUrl(url);
      return {
        ...fallback,
        url: url
      };
    }
  }

  // Validar URL
  static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  // Resolver link encurtado
  static async resolveShortUrl(url: string): Promise<string> {
    try {
      // Se não parece ser um link encurtado, retornar como está
      if (!url.includes('bit.ly') && !url.includes('amzn.to') && !url.includes('tinyurl') && 
          !url.includes('t.co') && !url.includes('goo.gl') && !url.includes('ow.ly')) {
        return url;
      }

      // Tentar resolver o link encurtado fazendo uma requisição HEAD
      const response = await fetch(url, {
        method: 'HEAD',
        redirect: 'follow',
      });

      // Se redirecionou, pegar a URL final
      if (response.url && response.url !== url) {
        return response.url;
      }
    } catch (error) {
      console.log('Could not resolve short URL, using original:', error);
    }

    return url;
  }

  // Buscar metadados via API ou proxy
  static async fetchMetadata(url: string): Promise<LinkMetadata> {
    // Primeiro, resolver link encurtado se necessário
    const resolvedUrl = await this.resolveShortUrl(url);
    console.log('Resolved URL:', resolvedUrl);
    // Tentar usar Edge Function do Supabase primeiro (mas não bloquear se falhar)
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
      // Usar timeout para não esperar muito
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 5000)
      );
      
      const functionPromise = supabase.functions.invoke('scrape-link-metadata', {
        body: { url: resolvedUrl } // Usar URL resolvida para melhor resultado
      });
      
      const result = await Promise.race([functionPromise, timeoutPromise]) as any;
      
      if (result?.data && (result.data.title || result.data.description || result.data.image)) {
        console.log('Successfully extracted metadata from Edge Function:', result.data);
        return {
          title: result.data.title || '',
          description: result.data.description || '',
          image: result.data.image || '',
          author: result.data.author || '',
          price: result.data.price || '',
          siteName: result.data.siteName || '',
          url: url // Sempre retornar URL original
        };
      }
    } catch (error) {
      // Silenciosamente falhar e usar fallback
      console.log('Edge Function not available, using fallback:', error);
    }

    // Fallback: tentar usar API pública de preview de links
    try {
      console.log('Trying link preview APIs and proxies...');
      
      // Primeiro, tentar APIs de link preview (mais confiáveis)
      const linkPreviewApis = [
        // Microlink API (gratuita, limitada mas funciona bem)
        {
          url: `https://api.microlink.io/data?url=${encodeURIComponent(resolvedUrl)}`,
          parser: (data: any) => {
            if (data.data) {
              return {
                title: data.data.title || '',
                description: data.data.description || '',
                image: data.data.image?.url || data.data.image || '',
                author: data.data.author || '',
                siteName: data.data.publisher || '',
              };
            }
            return null;
          }
        },
      ];

      for (const api of linkPreviewApis) {
        try {
          const response = await fetch(api.url, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
            },
            signal: AbortSignal.timeout(10000),
          });

          if (response.ok) {
            const data = await response.json();
            const parsed = api.parser(data);
            
            if (parsed && (parsed.title || parsed.description || parsed.image)) {
              console.log('Successfully extracted from link preview API:', parsed);
              return {
                ...parsed,
                url: url // Sempre retornar URL original
              };
            }
          }
        } catch (apiError: any) {
          if (apiError.name !== 'AbortError') {
            console.log('Link preview API failed, trying next...', apiError.message);
          }
          continue;
        }
      }
      
      // Se APIs falharam, tentar proxies CORS
      console.log('Trying CORS proxies...');
      const proxies = [
        {
          url: `https://api.allorigins.win/get?url=${encodeURIComponent(resolvedUrl)}`,
          parser: (data: any) => data.contents || data
        },
        {
          url: `https://corsproxy.io/?${encodeURIComponent(resolvedUrl)}`,
          parser: (data: any) => typeof data === 'string' ? data : data.html || data
        },
      ];
      
      for (const proxy of proxies) {
        try {
          const response = await fetch(proxy.url, {
            method: 'GET',
            headers: {
              'Accept': 'text/html,application/json',
            },
            // Timeout de 15 segundos
            signal: AbortSignal.timeout(15000),
          });
          
          if (response.ok) {
            const contentType = response.headers.get('content-type') || '';
            let html = '';
            
            // Verificar se é JSON ou HTML
            if (contentType.includes('application/json')) {
              try {
                const proxyData = await response.json();
                html = proxy.parser(proxyData);
              } catch (jsonError) {
                console.log('Failed to parse JSON response:', jsonError);
                continue;
              }
            } else {
              // É HTML direto
              html = await response.text();
            }
            
            if (html && html.length > 100) { // Garantir que temos HTML válido
              const parsed = this.parseHtmlMetadata(html, resolvedUrl);
              
              // Se conseguiu extrair pelo menos título ou descrição, retornar
              if (parsed.title || parsed.description || parsed.image) {
                console.log('Successfully extracted metadata from proxy:', parsed);
                return {
                  ...parsed,
                  url: url // Manter URL original
                };
              }
            }
          }
        } catch (proxyError: any) {
          // Ignorar erros específicos e continuar
          if (proxyError.name !== 'AbortError') {
            console.log(`Proxy ${proxy.url} failed, trying next...`, proxyError.message);
          }
          continue; // Tentar próximo proxy
        }
      }
    } catch (error) {
      console.warn('All proxy scraping failed:', error);
    }

    // Último fallback: extrair informações básicas da URL
    console.log('Using URL-based fallback');
    const fallback = this.extractFromUrl(url);
    // Sempre retornar algo, mesmo que mínimo
    return {
      ...fallback,
      url: url
    };
  }

  // Parsear HTML para extrair metadados
  static parseHtmlMetadata(html: string, url: string): LinkMetadata {
    const metadata: LinkMetadata = { url };

    // Open Graph tags (suporta aspas simples e duplas)
    const ogTitle = html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i) ||
                    html.match(/<meta\s+content=["']([^"']+)["']\s+property=["']og:title["']/i);
    const ogDescription = html.match(/<meta\s+property=["']og:description["']\s+content=["']([^"']+)["']/i) ||
                          html.match(/<meta\s+content=["']([^"']+)["']\s+property=["']og:description["']/i);
    const ogImage = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i) ||
                    html.match(/<meta\s+content=["']([^"']+)["']\s+property=["']og:image["']/i);
    const ogSiteName = html.match(/<meta\s+property=["']og:site_name["']\s+content=["']([^"']+)["']/i) ||
                       html.match(/<meta\s+content=["']([^"']+)["']\s+property=["']og:site_name["']/i);

    // Twitter Cards
    const twitterTitle = html.match(/<meta\s+name=["']twitter:title["']\s+content=["']([^"']+)["']/i);
    const twitterDescription = html.match(/<meta\s+name=["']twitter:description["']\s+content=["']([^"']+)["']/i);
    const twitterImage = html.match(/<meta\s+name=["']twitter:image["']\s+content=["']([^"']+)["']/i);

    // Meta tags padrão
    const metaTitle = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const metaDescription = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);

    metadata.title = ogTitle?.[1] || twitterTitle?.[1] || metaTitle?.[1] || '';
    metadata.description = ogDescription?.[1] || twitterDescription?.[1] || metaDescription?.[1] || '';
    metadata.image = ogImage?.[1] || twitterImage?.[1] || '';
    metadata.siteName = ogSiteName?.[1] || '';

    // Tentar extrair preço (Amazon, etc.) - padrões mais flexíveis
    const pricePatterns = [
      /R\$\s*[\d.,]+/gi,
      /[\d.,]+\s*R\$/gi,
      /price["']\s*:\s*["']([^"']+)["']/i,
      /<span[^>]*class=["'][^"']*price[^"']*["'][^>]*>([^<]+)<\/span>/i,
      /<span[^>]*id=["'][^"']*price[^"']*["'][^>]*>([^<]+)<\/span>/i,
    ];

    for (const pattern of pricePatterns) {
      const match = html.match(pattern);
      if (match) {
        metadata.price = match[0] || match[1];
        break;
      }
    }

    // Tentar extrair autor (Amazon, etc.) - padrões mais flexíveis
    const authorPatterns = [
      /<meta\s+name=["']author["']\s+content=["']([^"']+)["']/i,
      /<span[^>]*class=["'][^"']*author[^"']*["'][^>]*>([^<]+)<\/span>/i,
      /<a[^>]*class=["'][^"']*author[^"']*["'][^>]*>([^<]+)<\/a>/i,
      /por\s+([^<\n]+)/i,
      /author["']\s*:\s*["']([^"']+)["']/i,
    ];

    for (const pattern of authorPatterns) {
      const match = html.match(pattern);
      if (match) {
        metadata.author = match[1]?.trim();
        break;
      }
    }

    // Decodificar HTML entities
    if (metadata.title) {
      metadata.title = this.decodeHtmlEntities(metadata.title).trim();
    }
    if (metadata.description) {
      metadata.description = this.decodeHtmlEntities(metadata.description).trim();
    }
    if (metadata.author) {
      metadata.author = this.decodeHtmlEntities(metadata.author).trim();
    }

    // Normalizar URLs de imagem
    if (metadata.image && !metadata.image.startsWith('http')) {
      try {
        const baseUrl = new URL(url);
        metadata.image = new URL(metadata.image, baseUrl.origin).href;
      } catch {
        // Ignorar se não conseguir normalizar
      }
    }

    return metadata;
  }

  // Decodificar HTML entities
  static decodeHtmlEntities(text: string): string {
    const entities: { [key: string]: string } = {
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      '&#39;': "'",
      '&nbsp;': ' ',
      '&apos;': "'",
    };

    return text.replace(/&[#\w]+;/g, (entity) => {
      return entities[entity] || entity;
    });
  }

  // Extrair informações básicas da URL (fallback)
  static extractFromUrl(url: string): LinkMetadata {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname;

      // Detectar tipo de site e extrair informações básicas
      let siteName = '';
      if (hostname.includes('amazon')) {
        siteName = 'Amazon';
      } else if (hostname.includes('youtube')) {
        siteName = 'YouTube';
      } else if (hostname.includes('udemy')) {
        siteName = 'Udemy';
      } else if (hostname.includes('coursera')) {
        siteName = 'Coursera';
      } else {
        siteName = hostname.replace('www.', '').split('.')[0];
      }

      return {
        url: url,
        siteName: siteName,
        title: '',
        description: '',
        image: '',
        author: '',
        price: ''
      };
    } catch {
      return { url: url };
    }
  }

  // Detectar categoria baseado na URL
  static detectCategory(url: string): 'Livro' | 'Vídeo' | 'Curso' | 'E-book' {
    const lowerUrl = url.toLowerCase();
    
    if (lowerUrl.includes('youtube') || lowerUrl.includes('youtu.be') || lowerUrl.includes('vimeo')) {
      return 'Vídeo';
    }
    
    if (lowerUrl.includes('udemy') || lowerUrl.includes('coursera') || lowerUrl.includes('pluralsight') || lowerUrl.includes('alura')) {
      return 'Curso';
    }
    
    if (lowerUrl.includes('amazon') || lowerUrl.includes('saraiva') || lowerUrl.includes('livraria')) {
      // Tentar detectar se é livro ou e-book
      if (lowerUrl.includes('ebook') || lowerUrl.includes('kindle') || lowerUrl.includes('digital')) {
        return 'E-book';
      }
      return 'Livro';
    }
    
    if (lowerUrl.includes('pdf') || lowerUrl.includes('ebook') || lowerUrl.includes('epub')) {
      return 'E-book';
    }
    
    // Default
    return 'Livro';
  }

  // Formatar preço de diferentes formatos
  static formatPrice(priceText: string): string {
    if (!priceText) return '';
    
    // Remover espaços e caracteres especiais
    const cleaned = priceText.trim();
    
    // Se já está formatado como "R$ XX,XX", retornar como está
    if (cleaned.includes('R$') || cleaned.includes('USD') || cleaned.includes('€')) {
      return cleaned;
    }
    
    // Tentar extrair números e formatar
    const numbers = cleaned.replace(/[^\d,.]/g, '');
    if (numbers) {
      // Se tem vírgula, provavelmente é formato brasileiro
      if (numbers.includes(',')) {
        return `R$ ${numbers}`;
      }
      // Se tem ponto, pode ser formato americano
      if (numbers.includes('.')) {
        const parts = numbers.split('.');
        if (parts.length === 2 && parts[1].length === 2) {
          return `R$ ${parts[0]},${parts[1]}`;
        }
      }
      // Apenas números
      if (numbers.length > 0) {
        return `R$ ${numbers}`;
      }
    }
    
    return cleaned;
  }
}

