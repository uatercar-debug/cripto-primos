import { useState, useEffect } from 'react';
import { newsService, NewsArticle } from '@/services/newsService';

interface UseNewsReturn {
  news: { [key: string]: NewsArticle[] };
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useNews = (): UseNewsReturn => {
  const [news, setNews] = useState<{ [key: string]: NewsArticle[] }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);
      const newsData = await newsService.getAllNews();
      setNews(newsData);
    } catch (err) {
      setError('Erro ao carregar notícias. Usando conteúdo de exemplo.');
      console.error('Erro ao buscar notícias:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return {
    news,
    loading,
    error,
    refetch: fetchNews
  };
};
