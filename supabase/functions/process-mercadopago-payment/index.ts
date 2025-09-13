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
    const { 
      name, 
      email, 
      cardNumber, 
      expiryDate, 
      cvv, 
      cardholderName, 
      docType, 
      docNumber, 
      amount 
    } = await req.json();
    
    console.log('Processing MercadoPago payment for:', { email, name, amount });
    
    const accessToken = Deno.env.get('MERCADOPAGO_ACCESS_TOKEN');
    if (!accessToken) {
      throw new Error('MercadoPago access token not found');
    }

    // Primeiro, criar o card token
    const [month, year] = expiryDate.split('/');
    
    const cardTokenData = {
      card_number: cardNumber.replace(/\s/g, ''),
      security_code: cvv,
      expiration_month: parseInt(month),
      expiration_year: parseInt(`20${year}`),
      cardholder: {
        name: cardholderName,
        identification: {
          type: docType,
          number: docNumber.replace(/[^\d]/g, '')
        }
      }
    };

    console.log('Creating card token...');
    
    const cardTokenResponse = await fetch('https://api.mercadopago.com/v1/card_tokens', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(cardTokenData)
    });

    if (!cardTokenResponse.ok) {
      const errorText = await cardTokenResponse.text();
      console.error('Card token creation error:', cardTokenResponse.status, errorText);
      throw new Error(`Erro nos dados do cartão: ${cardTokenResponse.status}`);
    }

    const cardToken = await cardTokenResponse.json();
    console.log('Card token created:', cardToken.id);

    // Agora criar o pagamento
    const paymentData = {
      transaction_amount: amount,
      token: cardToken.id,
      description: "Curso de Copytrading - Método Comprovado",
      installments: 1,
      payment_method_id: cardToken.payment_method_id,
      issuer_id: cardToken.issuer_id,
      payer: {
        email: email,
        identification: {
          type: docType,
          number: docNumber.replace(/[^\d]/g, '')
        }
      }
    };

    console.log('Creating payment...');

    const paymentResponse = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Idempotency-Key': crypto.randomUUID()
      },
      body: JSON.stringify(paymentData)
    });

    if (!paymentResponse.ok) {
      const errorText = await paymentResponse.text();
      console.error('Payment creation error:', paymentResponse.status, errorText);
      throw new Error(`Erro ao processar pagamento: ${paymentResponse.status}`);
    }

    const payment = await paymentResponse.json();
    console.log('Payment created:', payment.id, 'Status:', payment.status);

    return new Response(JSON.stringify({
      paymentId: payment.id,
      status: payment.status,
      status_detail: payment.status_detail,
      amount: payment.transaction_amount
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error processing MercadoPago payment:', error);
    return new Response(JSON.stringify({ 
      error: 'Erro ao processar pagamento',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});