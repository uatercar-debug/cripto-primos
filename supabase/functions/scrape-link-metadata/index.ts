// Edge Function para extrair metadados de links
// Usa Open Graph, Twitter Cards e meta tags HTML

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 204,
      headers: corsHeaders 
    });
  }

  try {
    const { url } = await req.json();

    if (!url || typeof url !== 'string') {
      return new Response(
        JSON.stringify({ error: 'URL é obrigatória' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Validar URL
    try {
      new URL(url);
    } catch {
      return new Response(
        JSON.stringify({ error: 'URL inválida' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Fazer requisição para a URL
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();

    // Extrair metadados usando regex (simples mas eficaz)
    const metadata: any = {};

    // Open Graph tags
    const ogTitle = html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i);
    const ogDescription = html.match(/<meta\s+property=["']og:description["']\s+content=["']([^"']+)["']/i);
    const ogImage = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i);
    const ogSiteName = html.match(/<meta\s+property=["']og:site_name["']\s+content=["']([^"']+)["']/i);

    // Twitter Cards
    const twitterTitle = html.match(/<meta\s+name=["']twitter:title["']\s+content=["']([^"']+)["']/i);
    const twitterDescription = html.match(/<meta\s+name=["']twitter:description["']\s+content=["']([^"']+)["']/i);
    const twitterImage = html.match(/<meta\s+name=["']twitter:image["']\s+content=["']([^"']+)["']/i);

    // Meta tags padrão
    const metaTitle = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const metaDescription = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);

    // Extrair título
    metadata.title = ogTitle?.[1] || twitterTitle?.[1] || metaTitle?.[1] || '';

    // Extrair descrição
    metadata.description = ogDescription?.[1] || twitterDescription?.[1] || metaDescription?.[1] || '';

    // Extrair imagem
    metadata.image = ogImage?.[1] || twitterImage?.[1] || '';

    // Site name
    metadata.siteName = ogSiteName?.[1] || '';

    // Tentar extrair preço (Amazon, etc.)
    const pricePatterns = [
      /R\$\s*[\d.,]+/gi,
      /[\d.,]+\s*R\$/gi,
      /price["']\s*:\s*["']([^"']+)["']/i,
      /<span[^>]*class=["'][^"']*price[^"']*["'][^>]*>([^<]+)<\/span>/i,
    ];

    for (const pattern of pricePatterns) {
      const match = html.match(pattern);
      if (match) {
        metadata.price = match[0] || match[1];
        break;
      }
    }

    // Tentar extrair autor (Amazon, etc.)
    const authorPatterns = [
      /<meta\s+name=["']author["']\s+content=["']([^"']+)["']/i,
      /<span[^>]*class=["'][^"']*author[^"']*["'][^>]*>([^<]+)<\/span>/i,
      /por\s+([^<]+)/i,
    ];

    for (const pattern of authorPatterns) {
      const match = html.match(pattern);
      if (match) {
        metadata.author = match[1]?.trim();
        break;
      }
    }

    // Limpar e decodificar HTML entities
    if (metadata.title) {
      metadata.title = decodeHtmlEntities(metadata.title);
    }
    if (metadata.description) {
      metadata.description = decodeHtmlEntities(metadata.description);
    }
    if (metadata.author) {
      metadata.author = decodeHtmlEntities(metadata.author);
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

    return new Response(
      JSON.stringify(metadata),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Erro ao extrair metadados',
        details: error.toString()
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

// Função para decodificar HTML entities
function decodeHtmlEntities(text: string): string {
  const entities: { [key: string]: string } = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&nbsp;': ' ',
  };

  return text.replace(/&[#\w]+;/g, (entity) => {
    return entities[entity] || entity;
  });
}

