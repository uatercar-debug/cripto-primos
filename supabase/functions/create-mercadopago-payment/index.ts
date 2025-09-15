const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

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
    const { email, name, docType, docNumber, amount, payment_method_id } = await req.json();
    
    console.log('Creating MercadoPago payment for:', { email, name, payment_method_id });
    
    const accessToken = Deno.env.get('MERCADOPAGO_ACCESS_TOKEN');
    if (!accessToken) {
      throw new Error('MercadoPago access token not found');
    }

    // Criar preferência de pagamento no MercadoPago
    const preference = {
      items: [
        {
          title: "Curso de Copytrading - Método Comprovado",
          quantity: 1,
          unit_price: amount || 29.00,
          currency_id: "BRL"
        }
      ],
      payer: {
        name: name,
        email: email,
        identification: {
          type: docType || "CPF",
          number: docNumber?.replace(/\D/g, '') || ""
        }
      },
      payment_methods: {
        excluded_payment_types: [],
        excluded_payment_methods: [],
        installments: 12
      },
      back_urls: {
        success: `${req.headers.get('origin')}/area-vip`,
        failure: `${req.headers.get('origin')}/checkout`,
        pending: `${req.headers.get('origin')}/checkout`
      },
      auto_return: "approved",
      notification_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/mercadopago-webhook`,
      statement_descriptor: "COPYTRADING CURSO",
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

    console.log('Creating preference with data:', preference);

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
    console.log('MercadoPago preference created:', data.id);

    return new Response(JSON.stringify({
      preferenceId: data.id,
      init_point: data.init_point,
      sandbox_init_point: data.sandbox_init_point
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