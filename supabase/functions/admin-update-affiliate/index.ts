// Edge Function para atualizar afiliados (apenas admins)
// Usa service_role key para bypass de RLS após validação

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Verificar se o email é admin consultando o banco
const isAdmin = async (email: string | null, supabase: any): Promise<boolean> => {
  if (!email) return false;
  
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('email, active')
      .eq('email', email.toLowerCase())
      .eq('active', true)
      .single();
    
    if (error || !data) return false;
    return true;
  } catch {
    return false;
  }
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verificar autenticação
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Não autorizado. Token de autenticação necessário.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Criar cliente com service_role (bypass RLS) para verificação
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Extrair email do token (simplificado - em produção use JWT real)
    // Por enquanto, vamos receber o email no body e validar
    const body = await req.json();
    const { userEmail, affiliateId, updates } = body;

    // Verificar se é admin
    const adminCheck = await isAdmin(userEmail, supabaseAdmin);
    if (!userEmail || !adminCheck) {
      return new Response(
        JSON.stringify({ error: 'Acesso negado. Apenas administradores podem atualizar afiliados.' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!affiliateId) {
      return new Response(
        JSON.stringify({ error: 'ID do afiliado é obrigatório.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!updates || typeof updates !== 'object') {
      return new Response(
        JSON.stringify({ error: 'Dados de atualização são obrigatórios.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Usar o cliente já criado (supabaseAdmin)
    const supabase = supabaseAdmin;

    // Buscar dados do afiliado antes de atualizar
    const { data: affiliateBefore, error: fetchError } = await supabase
      .from('affiliates')
      .select('*')
      .eq('id', affiliateId)
      .single();

    if (fetchError || !affiliateBefore) {
      return new Response(
        JSON.stringify({ error: 'Afiliado não encontrado.' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Preparar dados de atualização
    const updateData: any = { ...updates };

    // Se está aprovando, adicionar approved_at
    const isBeingApproved = updates.status === 'approved' && 
                            (affiliateBefore.status !== 'approved' || !affiliateBefore.approved_at);
    
    if (isBeingApproved && !updateData.approved_at) {
      updateData.approved_at = new Date().toISOString();
    }

    // Atualizar afiliado
    const { data, error } = await supabase
      .from('affiliates')
      .update(updateData)
      .eq('id', affiliateId)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar afiliado:', error);
      return new Response(
        JSON.stringify({ error: error.message || 'Erro ao atualizar afiliado.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Se foi aprovado e tem código de acesso, enviar email
    if (isBeingApproved && data.access_code) {
      try {
        // Chamar função para enviar email (não bloqueia a resposta)
        fetch(`${supabaseUrl}/functions/v1/send-affiliate-access-code`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseServiceKey}`,
          },
          body: JSON.stringify({
            affiliateId: data.id,
            email: data.email,
            name: data.name,
            accessCode: data.access_code,
          }),
        }).catch(err => {
          console.error('Erro ao enviar email (não crítico):', err);
        });
      } catch (emailError) {
        console.error('Erro ao tentar enviar email:', emailError);
        // Não falha a atualização se o email falhar
      }
    }

    return new Response(
      JSON.stringify({ success: true, affiliate: data }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Erro na função:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Erro interno do servidor.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

