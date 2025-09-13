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
    const { email, name } = await req.json();
    
    console.log('Creating MercadoPago payment for:', { email, name });
    
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
          unit_price: 29.00,
          currency_id: "BRL"
        }
      ],
      payer: {
        name: name,
        email: email
      },
      back_urls: {
        success: `${req.headers.get('origin')}/success`,
        failure: `${req.headers.get('origin')}/failure`,
        pending: `${req.headers.get('origin')}/pending`
      },
      auto_return: "approved",
      notification_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/mercadopago-webhook`,
      statement_descriptor: "COPYTRADING CURSO"
    };

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
      initPoint: data.init_point,
      sandboxInitPoint: data.sandbox_init_point
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