// Serviço para buscar imagens do Unsplash e gerenciar uploads
import { supabase } from "@/integrations/supabase/client";

const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY || '';
const UNSPLASH_API_URL = 'https://api.unsplash.com';

export interface UnsplashImage {
  id: string;
  urls: {
    thumb: string;
    small: string;
    regular: string;
    full: string;
  };
  alt_description?: string;
  description?: string;
  user: {
    name: string;
    username: string;
  };
  links: {
    html: string;
  };
}

export class ImageService {
  // Buscar imagens do Unsplash
  static async searchUnsplash(query: string, page: number = 1, perPage: number = 20): Promise<UnsplashImage[]> {
    if (!UNSPLASH_ACCESS_KEY) {
      console.warn('Unsplash API key not configured. Using fallback images.');
      return [];
    }

    try {
      const response = await fetch(
        `${UNSPLASH_API_URL}/search/photos?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}&client_id=${UNSPLASH_ACCESS_KEY}`
      );

      if (!response.ok) {
        throw new Error(`Unsplash API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('Error fetching images from Unsplash:', error);
      return [];
    }
  }

  // Gerar URL de imagem do Unsplash com tamanho específico
  static getUnsplashImageUrl(imageId: string, width: number = 400, height: number = 250): string {
    if (!UNSPLASH_ACCESS_KEY) {
      return `https://images.unsplash.com/photo-${imageId}?w=${width}&h=${height}&fit=crop&crop=center`;
    }
    return `https://images.unsplash.com/photo-${imageId}?w=${width}&h=${height}&fit=crop&crop=center&client_id=${UNSPLASH_ACCESS_KEY}`;
  }

  // Upload de imagem para Supabase Storage
  static async uploadImage(file: File, folder: string = 'recommendations'): Promise<string | null> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        return null;
      }

      // Obter URL pública
      const { data } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error in uploadImage:', error);
      return null;
    }
  }

  // Validar URL de imagem
  static isValidImageUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return ['http:', 'https:'].includes(urlObj.protocol);
    } catch {
      return false;
    }
  }

  // Gerar placeholder baseado no título
  static generatePlaceholderUrl(title: string, width: number = 400, height: number = 250): string {
    // Usar um serviço de placeholder ou gerar uma imagem baseada no texto
    const encodedTitle = encodeURIComponent(title.substring(0, 20));
    return `https://via.placeholder.com/${width}x${height}?text=${encodedTitle}`;
  }
}

