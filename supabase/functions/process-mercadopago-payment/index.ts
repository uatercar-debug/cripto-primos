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
      amount,
      payment_method_id,
      paymentMethod
    } = await req.json();
    
    console.log('Processing MercadoPago payment for:', { email, name, amount, paymentMethod: paymentMethod || payment_method_id });
    
    const accessToken = Deno.env.get('MERCADOPAGO_ACCESS_TOKEN');
    if (!accessToken) {
      throw new Error('MercadoPago access token not found');
    }

    // Verificar se é PIX ou boleto
    const isPixOrBoleto = payment_method_id === 'pix' || payment_method_id === 'bolbradesco' || paymentMethod === 'pix' || paymentMethod === 'boleto';
    
    if (isPixOrBoleto) {
      // Para PIX e boleto, criar pagamento direto
      const paymentData = {
        transaction_amount: amount || 29.00,
        description: "Curso de Copytrading - Método Comprovado",
        payment_method_id: payment_method_id === 'pix' || paymentMethod === 'pix' ? 'pix' : 'bolbradesco',
        payer: {
          email: email,
          identification: {
            type: docType,
            number: docNumber.replace(/[^\d]/g, '')
          }
        }
      };

      console.log('Creating PIX/Boleto payment...');
      
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
        const errorObj = JSON.parse(errorText);
        console.error('PIX/Boleto payment creation error:', paymentResponse.status, errorText);
        
        // Verificar se é erro de configuração do PIX
        if (errorObj.message && errorObj.message.includes('key enabled for QR')) {
          console.log('PIX not configured, falling back to preference creation...');
          
          // Fallback para criar preferência e redirecionar para MercadoPago
          const preferenceData = {
            items: [{
              title: "Curso de Copytrading - Método Comprovado",
              quantity: 1,
              unit_price: amount || 29.00
            }],
            payer: {
              email: email,
              identification: {
                type: docType,
                number: docNumber.replace(/[^\d]/g, '')
              }
            },
            back_urls: {
              success: "https://47432545-ac42-48d7-9a0d-1506bd6170b8.lovableproject.com/area-vip",
              failure: "https://47432545-ac42-48d7-9a0d-1506bd6170b8.lovableproject.com/checkout",
              pending: "https://47432545-ac42-48d7-9a0d-1506bd6170b8.lovableproject.com/checkout"
            },
            auto_return: "approved",
            payment_methods: {
              excluded_payment_types: payment_method_id === 'pix' || paymentMethod === 'pix' ? 
                [{ id: "credit_card" }, { id: "debit_card" }, { id: "ticket" }] : 
                [{ id: "credit_card" }, { id: "debit_card" }, { id: "bank_transfer" }],
              excluded_payment_methods: [],
              installments: 1
            }
          };

          const preferenceResponse = await fetch('https://api.mercadopago.com/checkout/preferences', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(preferenceData)
          });

          if (!preferenceResponse.ok) {
            throw new Error(`Erro ao criar preferência: ${preferenceResponse.status}`);
          }

          const preference = await preferenceResponse.json();
          
          return new Response(JSON.stringify({
            paymentId: preference.id,
            status: 'redirect_required',
            init_point: preference.init_point,
            sandbox_init_point: preference.sandbox_init_point
          }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
        
        throw new Error(`Erro ao processar pagamento: ${paymentResponse.status}`);
      }

      const payment = await paymentResponse.json();
      console.log('PIX/Boleto payment created:', payment.id, 'Status:', payment.status);

      return new Response(JSON.stringify({
        paymentId: payment.id,
        status: payment.status,
        status_detail: payment.status_detail,
        amount: payment.transaction_amount,
        qr_code: payment.point_of_interaction?.transaction_data?.qr_code,
        qr_code_base64: payment.point_of_interaction?.transaction_data?.qr_code_base64,
        ticket_url: payment.point_of_interaction?.transaction_data?.ticket_url
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Para cartão de crédito - fluxo original
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