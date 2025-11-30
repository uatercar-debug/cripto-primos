import { supabase } from "@/integrations/supabase/client";

export interface Recommendation {
  id: string;
  category: 'Livro' | 'Vídeo' | 'Curso' | 'E-book';
  title: string;
  author: string;
  rating: number;
  description: string;
  long_description?: string;
  link?: string;
  price: string;
  badge?: string;
  image_url?: string;
  duration?: string;
  level?: 'Iniciante' | 'Intermediário' | 'Avançado' | 'Todos';
  language?: string;
  format?: string;
  featured?: boolean;
  active?: boolean;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
}

export class RecommendationsService {
  // Buscar todas as recomendações ativas
  static async getAll(includeInactive: boolean = false): Promise<Recommendation[]> {
    let query = supabase
      .from('recommendations')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (!includeInactive) {
      query = query.eq('active', true);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching recommendations:', error);
      throw error;
    }

    return (data || []) as Recommendation[];
  }

  // Buscar por ID
  static async getById(id: string): Promise<Recommendation | null> {
    const { data, error } = await supabase
      .from('recommendations')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching recommendation:', error);
      return null;
    }

    return data as Recommendation;
  }

  // Criar nova recomendação
  static async create(recommendation: Omit<Recommendation, 'id' | 'created_at' | 'updated_at'>): Promise<Recommendation> {
    const { data, error } = await supabase
      .from('recommendations')
      .insert(recommendation)
      .select()
      .single();

    if (error) {
      console.error('Error creating recommendation:', error);
      throw error;
    }

    return data as Recommendation;
  }

  // Atualizar recomendação
  static async update(id: string, updates: Partial<Recommendation>): Promise<Recommendation> {
    const { data, error } = await supabase
      .from('recommendations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating recommendation:', error);
      throw error;
    }

    return data as Recommendation;
  }

  // Deletar recomendação (soft delete - marca como inativa)
  static async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('recommendations')
      .update({ active: false })
      .eq('id', id);

    if (error) {
      console.error('Error deleting recommendation:', error);
      throw error;
    }
  }

  // Deletar permanentemente
  static async deletePermanently(id: string): Promise<void> {
    const { error } = await supabase
      .from('recommendations')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error permanently deleting recommendation:', error);
      throw error;
    }
  }

  // Buscar por categoria
  static async getByCategory(category: string): Promise<Recommendation[]> {
    const { data, error } = await supabase
      .from('recommendations')
      .select('*')
      .eq('category', category)
      .eq('active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching recommendations by category:', error);
      throw error;
    }

    return (data || []) as Recommendation[];
  }

  // Buscar recomendações em destaque
  static async getFeatured(): Promise<Recommendation[]> {
    const { data, error } = await supabase
      .from('recommendations')
      .select('*')
      .eq('featured', true)
      .eq('active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching featured recommendations:', error);
      throw error;
    }

    return (data || []) as Recommendation[];
  }
}




