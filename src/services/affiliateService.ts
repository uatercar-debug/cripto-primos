import { supabase } from '@/integrations/supabase/client';

// Tipos
export interface Affiliate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  pix_key?: string;
  affiliate_code: string;
  access_code?: string; // Código de acesso para login
  commission_rate: number;
  status: 'pending' | 'approved' | 'rejected' | 'blocked';
  total_sales: number;
  total_earnings: number;
  available_balance: number;
  created_at: string;
  approved_at?: string;
}

export interface AffiliateReferral {
  id: string;
  affiliate_id: string;
  customer_email: string;
  customer_name?: string;
  product_name: string;
  sale_amount: number;
  commission_amount: number;
  status: 'pending' | 'confirmed' | 'paid' | 'cancelled' | 'refunded';
  created_at: string;
  confirmed_at?: string;
}

export interface AffiliateRegistration {
  name: string;
  email: string;
  phone?: string;
  pix_key?: string;
}

// Constantes
const AFFILIATE_REF_KEY = 'affiliate_ref';
const PRODUCT_PRICE = 29.90; // Preço do ebook
const DEFAULT_COMMISSION_RATE = 40; // 40%

// ============================================
// FUNÇÕES DE RASTREAMENTO
// ============================================

/**
 * Captura o código de afiliado da URL e salva no localStorage
 */
export const captureAffiliateRef = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  const urlParams = new URLSearchParams(window.location.search);
  const ref = urlParams.get('ref') || urlParams.get('aff') || urlParams.get('affiliate');
  
  if (ref) {
    localStorage.setItem(AFFILIATE_REF_KEY, ref.toUpperCase());
    // Registrar clique
    trackAffiliateClick(ref.toUpperCase());
    return ref.toUpperCase();
  }
  
  return localStorage.getItem(AFFILIATE_REF_KEY);
};

/**
 * Obtém o código de afiliado salvo
 */
export const getStoredAffiliateRef = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(AFFILIATE_REF_KEY);
};

/**
 * Limpa o código de afiliado (após conversão)
 */
export const clearAffiliateRef = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AFFILIATE_REF_KEY);
  }
};

/**
 * Registra um clique no link do afiliado
 */
export const trackAffiliateClick = async (affiliateCode: string): Promise<void> => {
  try {
    // Primeiro, buscar o afiliado pelo código
    const affiliate = await getAffiliateByCode(affiliateCode);
    if (!affiliate) return;
    
    // Registrar o clique
    await supabase.from('affiliate_clicks').insert({
      affiliate_id: affiliate.id,
      page_url: window.location.href,
      referrer: document.referrer || null,
      user_agent: navigator.userAgent,
    });
  } catch (error) {
    console.error('Erro ao registrar clique:', error);
  }
};

// ============================================
// FUNÇÕES DE AFILIADOS
// ============================================

/**
 * Busca um afiliado pelo código
 */
export const getAffiliateByCode = async (code: string): Promise<Affiliate | null> => {
  try {
    const { data, error } = await supabase
      .from('affiliates')
      .select('*')
      .eq('affiliate_code', code.toUpperCase())
      .eq('status', 'approved')
      .maybeSingle();
    
    if (error) {
      // Se for erro 406 (PGRST116), significa que não encontrou resultado
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('Erro ao buscar afiliado por código:', error);
      return null;
    }
    
    return data as Affiliate | null;
  } catch (error) {
    console.error('Erro ao buscar afiliado por código:', error);
    return null;
  }
};

/**
 * Busca um afiliado pelo email
 */
export const getAffiliateByEmail = async (email: string): Promise<Affiliate | null> => {
  try {
    const { data, error } = await supabase
      .from('affiliates')
      .select('*')
      .eq('email', email.toLowerCase())
      .maybeSingle();
    
    if (error) {
      // Se for erro 406 (PGRST116), significa que não encontrou resultado
      // Isso é esperado quando verificamos se email já existe
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('Erro ao buscar afiliado por email:', error);
      return null;
    }
    
    return data as Affiliate | null;
  } catch (error) {
    console.error('Erro ao buscar afiliado por email:', error);
    return null;
  }
};

/**
 * Registra um novo afiliado
 */
export const registerAffiliate = async (data: AffiliateRegistration): Promise<{
  success: boolean;
  affiliate?: Affiliate;
  error?: string;
}> => {
  try {
    // Verificar se email já existe
    const existing = await getAffiliateByEmail(data.email);
    if (existing) {
      return { success: false, error: 'Este email já está cadastrado no programa de afiliados.' };
    }
    
    const { data: newAffiliate, error } = await supabase
      .from('affiliates')
      .insert({
        name: data.name,
        email: data.email.toLowerCase(),
        phone: data.phone,
        pix_key: data.pix_key,
        status: 'pending',
        commission_rate: DEFAULT_COMMISSION_RATE,
      })
      .select()
      .maybeSingle();
    
    if (error) {
      console.error('Erro ao cadastrar afiliado:', error);
      
      // Erro específico de RLS
      if (error.code === '42501') {
        return { success: false, error: 'Erro de permissão. Verifique as políticas de segurança.' };
      }
      
      // Erro de violação de constraint (email duplicado)
      if (error.code === '23505') {
        return { success: false, error: 'Este email já está cadastrado no programa de afiliados.' };
      }
      
      // Erro de NOT NULL constraint (affiliate_code não foi gerado)
      if (error.code === '23502') {
        console.error('Erro: affiliate_code não foi gerado pelo trigger. Tentando novamente...');
        // Tentar novamente - o trigger deve gerar o código
        return { success: false, error: 'Erro ao gerar código de afiliado. Tente novamente.' };
      }
      
      return { success: false, error: error.message || 'Erro ao cadastrar. Tente novamente.' };
    }
    
    if (!newAffiliate) {
      return { success: false, error: 'Erro ao cadastrar. Nenhum dado retornado.' };
    }
    
    return { success: true, affiliate: newAffiliate as Affiliate };
  } catch (error: any) {
    return { success: false, error: error.message || 'Erro desconhecido.' };
  }
};

/**
 * Login do afiliado (valida email e código de acesso)
 */
export const loginAffiliate = async (
  email: string,
  accessCode: string
): Promise<{
  success: boolean;
  affiliate?: Affiliate;
  error?: string;
}> => {
  try {
    const normalizedEmail = email.toLowerCase().trim();
    const normalizedCode = accessCode.toUpperCase().trim();

    const affiliate = await getAffiliateByEmail(normalizedEmail);
    
    if (!affiliate) {
      return { success: false, error: 'Email não encontrado no programa de afiliados.' };
    }
    
    if (affiliate.status === 'pending') {
      return { success: false, error: 'Seu cadastro ainda está em análise. Aguarde a aprovação.' };
    }
    
    if (affiliate.status === 'rejected') {
      return { success: false, error: 'Seu cadastro foi rejeitado. Entre em contato com o suporte.' };
    }
    
    if (affiliate.status === 'blocked') {
      return { success: false, error: 'Sua conta foi bloqueada. Entre em contato com o suporte.' };
    }

    // Validar código de acesso
    if (!affiliate.access_code) {
      return { success: false, error: 'Código de acesso não configurado. Entre em contato com o suporte.' };
    }

    if (affiliate.access_code.toUpperCase() !== normalizedCode) {
      return { success: false, error: 'Código de acesso inválido.' };
    }
    
    return { success: true, affiliate };
  } catch (error: any) {
    return { success: false, error: error.message || 'Erro ao fazer login.' };
  }
};

// ============================================
// FUNÇÕES DE VENDAS E COMISSÕES
// ============================================

/**
 * Registra uma venda para o afiliado
 */
export const registerAffiliateSale = async (
  affiliateCode: string,
  customerEmail: string,
  customerName: string,
  paymentId: string,
  saleAmount: number = PRODUCT_PRICE
): Promise<boolean> => {
  try {
    const affiliate = await getAffiliateByCode(affiliateCode);
    if (!affiliate) return false;
    
    const commissionAmount = saleAmount * (affiliate.commission_rate / 100);
    
    const { error } = await supabase.from('affiliate_referrals').insert({
      affiliate_id: affiliate.id,
      customer_email: customerEmail,
      customer_name: customerName,
      product_name: 'Ebook CopyTrading',
      sale_amount: saleAmount,
      commission_amount: commissionAmount,
      payment_id: paymentId,
      status: 'pending',
    });
    
    if (error) {
      console.error('Erro ao registrar venda:', error);
      return false;
    }
    
    // Limpar referência após conversão
    clearAffiliateRef();
    
    return true;
  } catch (error) {
    console.error('Erro ao registrar venda:', error);
    return false;
  }
};

/**
 * Busca vendas de um afiliado
 */
export const getAffiliateReferrals = async (affiliateId: string): Promise<AffiliateReferral[]> => {
  try {
    const { data, error } = await supabase
      .from('affiliate_referrals')
      .select('*')
      .eq('affiliate_id', affiliateId)
      .order('created_at', { ascending: false });
    
    if (error) return [];
    return (data || []) as AffiliateReferral[];
  } catch {
    return [];
  }
};

/**
 * Obtém estatísticas do afiliado
 */
export const getAffiliateStats = async (affiliateId: string): Promise<{
  totalClicks: number;
  totalSales: number;
  conversionRate: number;
  pendingCommissions: number;
  paidCommissions: number;
}> => {
  try {
    // Buscar cliques
    const { count: clicksCount } = await supabase
      .from('affiliate_clicks')
      .select('*', { count: 'exact', head: true })
      .eq('affiliate_id', affiliateId);
    
    // Buscar vendas
    const { data: referrals } = await supabase
      .from('affiliate_referrals')
      .select('*')
      .eq('affiliate_id', affiliateId);
    
    const totalClicks = clicksCount || 0;
    const totalSales = referrals?.filter(r => r.status === 'confirmed' || r.status === 'paid').length || 0;
    const conversionRate = totalClicks > 0 ? (totalSales / totalClicks) * 100 : 0;
    
    const pendingCommissions = referrals
      ?.filter(r => r.status === 'confirmed')
      .reduce((sum, r) => sum + Number(r.commission_amount), 0) || 0;
    
    const paidCommissions = referrals
      ?.filter(r => r.status === 'paid')
      .reduce((sum, r) => sum + Number(r.commission_amount), 0) || 0;
    
    return {
      totalClicks,
      totalSales,
      conversionRate,
      pendingCommissions,
      paidCommissions,
    };
  } catch {
    return {
      totalClicks: 0,
      totalSales: 0,
      conversionRate: 0,
      pendingCommissions: 0,
      paidCommissions: 0,
    };
  }
};

// ============================================
// FUNÇÕES DE ADMINISTRAÇÃO
// ============================================

/**
 * Lista todos os afiliados (para administração)
 */
export const getAllAffiliates = async (): Promise<Affiliate[]> => {
  try {
    const { data, error } = await supabase
      .from('affiliates')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Erro ao listar afiliados:', error);
      return [];
    }
    
    return (data || []) as Affiliate[];
  } catch (error) {
    console.error('Erro ao listar afiliados:', error);
    return [];
  }
};

/**
 * Atualiza o status de um afiliado (requer autenticação de admin)
 */
export const updateAffiliateStatus = async (
  affiliateId: string,
  status: 'pending' | 'approved' | 'rejected' | 'blocked',
  notes?: string,
  userEmail?: string | null
): Promise<{ success: boolean; error?: string }> => {
  try {
    if (!userEmail) {
      return { success: false, error: 'Email do usuário é necessário para atualizar afiliados.' };
    }

    const updateData: any = { status };
    
    if (status === 'approved') {
      updateData.approved_at = new Date().toISOString();
    }
    
    if (notes) {
      updateData.notes = notes;
    }

    // Usar edge function segura para atualizar
    const { data, error } = await supabase.functions.invoke('admin-update-affiliate', {
      body: {
        userEmail,
        affiliateId,
        updates: updateData,
      },
    });

    if (error) {
      console.error('Erro ao atualizar status do afiliado:', error);
      return { success: false, error: error.message || 'Erro ao atualizar status.' };
    }

    if (data?.error) {
      return { success: false, error: data.error };
    }
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Erro desconhecido.' };
  }
};

/**
 * Atualiza informações de um afiliado (requer autenticação de admin)
 */
export const updateAffiliate = async (
  affiliateId: string,
  data: Partial<Affiliate>,
  userEmail?: string | null
): Promise<{ success: boolean; error?: string }> => {
  try {
    if (!userEmail) {
      return { success: false, error: 'Email do usuário é necessário para atualizar afiliados.' };
    }

    // Usar edge function segura para atualizar
    const { data: result, error } = await supabase.functions.invoke('admin-update-affiliate', {
      body: {
        userEmail,
        affiliateId,
        updates: data,
      },
    });

    if (error) {
      console.error('Erro ao atualizar afiliado:', error);
      return { success: false, error: error.message || 'Erro ao atualizar afiliado.' };
    }

    if (result?.error) {
      return { success: false, error: result.error };
    }
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Erro desconhecido.' };
  }
};

// ============================================
// FUNÇÕES AUXILIARES (MODO TESTE LOCAL)
// ============================================

// Afiliados de teste para funcionar sem banco de dados
const TEST_AFFILIATES: Affiliate[] = [
  {
    id: 'test-1',
    name: 'Afiliado Teste',
    email: 'afiliado@teste.com',
    phone: '11999999999',
    pix_key: 'afiliado@teste.com',
    affiliate_code: 'TESTE40',
    commission_rate: 40,
    status: 'approved',
    total_sales: 5,
    total_earnings: 59.80,
    available_balance: 47.84,
    created_at: '2024-01-01T00:00:00Z',
    approved_at: '2024-01-02T00:00:00Z',
  },
  {
    id: 'test-2',
    name: 'Demo Partner',
    email: 'demo@partner.com',
    phone: '11888888888',
    pix_key: 'demo@partner.com',
    affiliate_code: 'DEMO40',
    commission_rate: 40,
    status: 'approved',
    total_sales: 12,
    total_earnings: 143.52,
    available_balance: 95.68,
    created_at: '2024-01-01T00:00:00Z',
    approved_at: '2024-01-02T00:00:00Z',
  },
];

/**
 * Busca afiliado de teste (fallback)
 */
export const getTestAffiliateByCode = (code: string): Affiliate | null => {
  return TEST_AFFILIATES.find(a => a.affiliate_code === code.toUpperCase()) || null;
};

/**
 * Busca afiliado de teste por email (fallback)
 */
export const getTestAffiliateByEmail = (email: string): Affiliate | null => {
  return TEST_AFFILIATES.find(a => a.email === email.toLowerCase()) || null;
};

/**
 * Verifica se código é válido (banco ou teste)
 */
export const isValidAffiliateCode = async (code: string): Promise<boolean> => {
  // Primeiro tenta no banco
  const affiliate = await getAffiliateByCode(code);
  if (affiliate) return true;
  
  // Fallback para teste
  return getTestAffiliateByCode(code) !== null;
};


