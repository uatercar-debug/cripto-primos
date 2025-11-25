import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const mercadoPagoToken = Deno.env.get('MERCADOPAGO_ACCESS_TOKEN')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const body = await req.json();

    console.log('Webhook recebido do Mercado Pago:', JSON.stringify(body, null, 2));

    // Verificar se é uma notificação de pagamento
    if (body.type !== 'payment') {
      console.log('Tipo de notificação não é payment, ignorando');
      return new Response(JSON.stringify({ message: 'Notification type not handled' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Buscar dados do pagamento na API do Mercado Pago
    const paymentId = body.data?.id;
    if (!paymentId) {
      throw new Error('Payment ID not found in webhook');
    }

    console.log('Buscando dados do pagamento:', paymentId);
    
    const paymentResponse = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: {
          'Authorization': `Bearer ${mercadoPagoToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!paymentResponse.ok) {
      throw new Error(`Failed to fetch payment data: ${paymentResponse.statusText}`);
    }

    const paymentData = await paymentResponse.json();
    console.log('Dados do pagamento:', JSON.stringify(paymentData, null, 2));

    // Verificar se o pagamento foi aprovado
    if (paymentData.status !== 'approved') {
      console.log('Pagamento não aprovado ainda, status:', paymentData.status);
      return new Response(JSON.stringify({ message: 'Payment not approved yet' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Extrair email do comprador
    const email = paymentData.payer?.email;
    if (!email) {
      throw new Error('Payer email not found in payment data');
    }

    console.log('Email do comprador:', email);

    // Verificar se já existe um código para este email
    const { data: existingCode } = await supabase
      .from('vip_access_codes')
      .select('code')
      .eq('email', email.toLowerCase())
      .eq('payment_id', paymentId)
      .single();

    if (existingCode) {
      console.log('Código já existe para este pagamento, ignorando');
      return new Response(JSON.stringify({ message: 'Code already generated for this payment' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Gerar código único usando a função do banco
    const { data: codeData, error: codeError } = await supabase
      .rpc('generate_short_code');

    if (codeError || !codeData) {
      throw new Error(`Failed to generate code: ${codeError?.message}`);
    }

    const code = codeData;
    console.log('Código gerado:', code);

    // Inserir código no banco
    const { error: insertError } = await supabase
      .from('vip_access_codes')
      .insert({
        email: email.toLowerCase(),
        code: code,
        payment_id: paymentId,
        blocked: false,
      });

    if (insertError) {
      throw new Error(`Failed to insert code: ${insertError.message}`);
    }

    console.log('Código inserido no banco com sucesso');

    // Enviar email com o código
    const emailResponse = await supabase.functions.invoke('send-vip-access-email', {
      body: {
        email: email.toLowerCase(),
        code: code,
      },
    });

    if (emailResponse.error) {
      console.error('Erro ao enviar email:', emailResponse.error);
      // Não falhar o webhook se o email falhar, apenas logar
    } else {
      console.log('Email enviado com sucesso');
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Code generated and email sent',
        code: code,
        email: email.toLowerCase(),
      }), 
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error: any) {
    console.error('Erro no webhook do Mercado Pago:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};

serve(handler);
