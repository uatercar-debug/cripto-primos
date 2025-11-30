const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Configurações do produto - TODOS os campos recomendados pelo MercadoPago
const PRODUCT_CONFIG = {
  id: "COPYTRADING-COURSE-001",
  title: "Curso de Copytrading - Método Comprovado",
  description: "Curso completo de copytrading com estratégias testadas e aprovadas para operar no mercado financeiro de forma automatizada.",
  category_id: "services", // Categoria do MercadoPago para serviços digitais
  quantity: 1,
  unit_price: 29.00,
  currency_id: "BRL"
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  try {
    const { 
      email, 
      name, 
      docType, 
      docNumber, 
      amount, 
      payment_method_id,
      external_reference,
      affiliate_code 
    } = await req.json();
    
    console.log('Creating MercadoPago payment for:', { email, name, payment_method_id });
    
    const accessToken = Deno.env.get('MERCADOPAGO_ACCESS_TOKEN');
    if (!accessToken) {
      throw new Error('MercadoPago access token not found');
    }

    // URL base do projeto
    const projectUrl = "https://47432545-ac42-48d7-9a0d-1506bd6170b8.lovableproject.com";
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    
    // Gerar external_reference se não foi fornecido
    const extRef = external_reference || `COPY-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`.toUpperCase();

    // Criar preferência de pagamento no MercadoPago com TODOS os campos obrigatórios/recomendados
    const preference: any = {
      // Items com TODOS os campos recomendados pelo MercadoPago
      items: [
        {
          id: PRODUCT_CONFIG.id,
          title: PRODUCT_CONFIG.title,
          description: PRODUCT_CONFIG.description,
          category_id: PRODUCT_CONFIG.category_id,
          quantity: PRODUCT_CONFIG.quantity,
          unit_price: amount || PRODUCT_CONFIG.unit_price,
          currency_id: PRODUCT_CONFIG.currency_id
        }
      ],
      // Informações do pagador
      payer: {
        name: name,
        email: email,
        identification: {
          type: docType || "CPF",
          number: docNumber?.replace(/\D/g, '') || ""
        }
      },
      // Métodos de pagamento
      payment_methods: {
        excluded_payment_types: [],
        excluded_payment_methods: [],
        installments: 12
      },
      // URLs de retorno
      back_urls: {
        success: `${projectUrl}/area-vip`,
        failure: `${projectUrl}/checkout`,
        pending: `${projectUrl}/checkout`
      },
      auto_return: "approved",
      // Campos OBRIGATÓRIOS do MercadoPago
      external_reference: extRef,
      notification_url: `${supabaseUrl}/functions/v1/mercadopago-webhook`,
      statement_descriptor: "COPYTRADING",
      // Metadados para rastreamento
      metadata: {
        affiliate_code: affiliate_code || null,
        product_id: PRODUCT_CONFIG.id
      },
      // Expiração
      expires: true,
      expiration_date_from: new Date().toISOString(),
      expiration_date_to: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 horas
    };

    // Configurar método de pagamento específico se fornecido
    if (payment_method_id) {
      if (payment_method_id === 'pix') {
        preference.payment_methods.excluded_payment_types = [
          { id: "credit_card" },
          { id: "debit_card" },
          { id: "ticket" }
        ];
      } else if (payment_method_id === 'bolbradesco') {
        preference.payment_methods.excluded_payment_types = [
          { id: "credit_card" },
          { id: "debit_card" },
          { id: "bank_transfer" }
        ];
        preference.payment_methods.excluded_payment_methods = [
          { id: "pix" }
        ];
      }
    }

    console.log('Creating preference with external_reference:', extRef);

    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(preference)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('MercadoPago API error:', response.status, errorText);
      throw new Error(`MercadoPago API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('MercadoPago preference created:', data.id, 'External ref:', extRef);

    return new Response(JSON.stringify({
      preferenceId: data.id,
      init_point: data.init_point,
      sandbox_init_point: data.sandbox_init_point,
      external_reference: extRef
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error creating MercadoPago payment:', error);
    return new Response(JSON.stringify({ 
      error: 'Erro ao criar pagamento',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
