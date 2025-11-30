const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Configurações do produto
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
    const requestBody = await req.json();
    const { 
      name, 
      email, 
      docType, 
      docNumber, 
      amount,
      payment_method_id,
      paymentMethod,
      // Campos PCI-Compliant (token do Secure Fields)
      token,
      issuer_id,
      installments,
      transaction_amount,
      payer,
      isSecurePayment,
      // Campos obrigatórios MercadoPago
      external_reference,
      device_id,
      affiliate_code
    } = requestBody;
    
    console.log('Processing MercadoPago payment for:', { 
      email, 
      name, 
      amount: amount || transaction_amount, 
      paymentMethod: paymentMethod || payment_method_id,
      isSecurePayment: !!isSecurePayment,
      external_reference,
      device_id: device_id ? 'present' : 'not present'
    });
    
    const accessToken = Deno.env.get('MERCADOPAGO_ACCESS_TOKEN');
    if (!accessToken) {
      throw new Error('MercadoPago access token not found');
    }

    // URL base do projeto (para webhooks e redirect)
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const projectUrl = "https://47432545-ac42-48d7-9a0d-1506bd6170b8.lovableproject.com";
    
    // URL do webhook para notificações
    const notificationUrl = `${supabaseUrl}/functions/v1/mercadopago-webhook`;
    
    // Gerar external_reference se não foi fornecido
    const extRef = external_reference || `COPY-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`.toUpperCase();

    // ===== FLUXO PCI-COMPLIANT: Pagamento com Token Seguro =====
    // Os dados do cartão são tokenizados pelo SDK do MercadoPago no frontend
    // Apenas o token é enviado para o backend - dados sensíveis nunca tocam nosso servidor
    if (isSecurePayment && token) {
      console.log('Processing SECURE card payment with token (PCI Compliant)...');
      console.log('Token:', token);
      console.log('Payment method:', payment_method_id);
      console.log('External reference:', extRef);
      
      const paymentData: any = {
        transaction_amount: transaction_amount || amount || PRODUCT_CONFIG.unit_price,
        token: token,
        description: PRODUCT_CONFIG.description,
        installments: installments || 1,
        payment_method_id: payment_method_id,
        issuer_id: issuer_id,
        // Campos obrigatórios MercadoPago
        external_reference: extRef,
        notification_url: notificationUrl,
        statement_descriptor: "COPYTRADING",
        // Informações do pagador
        payer: payer || {
          email: email,
          first_name: name?.split(' ')[0] || '',
          last_name: name?.split(' ').slice(1).join(' ') || '',
          identification: docType && docNumber ? {
            type: docType,
            number: docNumber.replace(/[^\d]/g, '')
          } : undefined
        },
        // Informações adicionais do item (melhoram aprovação)
        additional_info: {
          items: [{
            id: PRODUCT_CONFIG.id,
            title: PRODUCT_CONFIG.title,
            description: PRODUCT_CONFIG.description,
            category_id: PRODUCT_CONFIG.category_id,
            quantity: PRODUCT_CONFIG.quantity,
            unit_price: transaction_amount || amount || PRODUCT_CONFIG.unit_price
          }],
          payer: {
            first_name: name?.split(' ')[0] || '',
            last_name: name?.split(' ').slice(1).join(' ') || ''
          }
        },
        // Metadados (para rastreamento)
        metadata: {
          affiliate_code: affiliate_code || null,
          product_id: PRODUCT_CONFIG.id
        }
      };

      // Adicionar device_id se disponível (para prevenção de fraude)
      if (device_id) {
        paymentData.additional_info.payer.device_id = device_id;
      }

      console.log('Creating SECURE payment with tokenized card data...');

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
        console.error('Secure payment creation error:', paymentResponse.status, errorText);
        
        let errorMessage = 'Erro ao processar pagamento';
        try {
          const errorObj = JSON.parse(errorText);
          if (errorObj.message) {
            errorMessage = errorObj.message;
          } else if (errorObj.cause && errorObj.cause[0]?.description) {
            errorMessage = errorObj.cause[0].description;
          }
        } catch (e) {
          // Ignore JSON parse error
        }
        
        throw new Error(errorMessage);
      }

      const payment = await paymentResponse.json();
      console.log('SECURE payment created:', payment.id, 'Status:', payment.status, 'External ref:', extRef);

      return new Response(JSON.stringify({
        payment_id: payment.id,
        paymentId: payment.id,
        status: payment.status,
        status_detail: payment.status_detail,
        amount: payment.transaction_amount,
        external_reference: extRef
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // ===== FLUXO PIX/BOLETO =====
    const isPixOrBoleto = payment_method_id === 'pix' || payment_method_id === 'bolbradesco' || paymentMethod === 'pix' || paymentMethod === 'boleto';
    
    if (isPixOrBoleto) {
      console.log('Creating PIX/Boleto payment...');
      console.log('External reference:', extRef);
      
      // Para PIX e boleto, criar pagamento direto com todos os campos obrigatórios
      const paymentData: any = {
        transaction_amount: amount || PRODUCT_CONFIG.unit_price,
        description: PRODUCT_CONFIG.description,
        payment_method_id: payment_method_id === 'pix' || paymentMethod === 'pix' ? 'pix' : 'bolbradesco',
        // Campos obrigatórios MercadoPago
        external_reference: extRef,
        notification_url: notificationUrl,
        statement_descriptor: "COPYTRADING",
        // Informações do pagador
        payer: {
          email: email,
          first_name: name?.split(' ')[0] || '',
          last_name: name?.split(' ').slice(1).join(' ') || '',
          identification: {
            type: docType,
            number: docNumber.replace(/[^\d]/g, '')
          }
        },
        // Informações adicionais do item
        additional_info: {
          items: [{
            id: PRODUCT_CONFIG.id,
            title: PRODUCT_CONFIG.title,
            description: PRODUCT_CONFIG.description,
            category_id: PRODUCT_CONFIG.category_id,
            quantity: PRODUCT_CONFIG.quantity,
            unit_price: amount || PRODUCT_CONFIG.unit_price
          }],
          payer: {
            first_name: name?.split(' ')[0] || '',
            last_name: name?.split(' ').slice(1).join(' ') || ''
          }
        },
        // Metadados
        metadata: {
          affiliate_code: affiliate_code || null,
          product_id: PRODUCT_CONFIG.id
        }
      };

      // Adicionar device_id se disponível
      if (device_id) {
        paymentData.additional_info.payer.device_id = device_id;
      }
      
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
        let errorObj;
        try {
          errorObj = JSON.parse(errorText);
        } catch (e) {
          errorObj = { message: errorText };
        }
        console.error('PIX/Boleto payment creation error:', paymentResponse.status, errorText);
        
        // Verificar se é erro de configuração do PIX
        if (errorObj.message && errorObj.message.includes('key enabled for QR')) {
          console.log('PIX not configured, falling back to preference creation...');
          
          // Fallback para criar preferência e redirecionar para MercadoPago
          // Incluindo TODOS os campos obrigatórios/recomendados
          const preferenceData = {
            // Items com todos os campos recomendados
            items: [{
              id: PRODUCT_CONFIG.id,
              title: PRODUCT_CONFIG.title,
              description: PRODUCT_CONFIG.description,
              category_id: PRODUCT_CONFIG.category_id,
              quantity: PRODUCT_CONFIG.quantity,
              unit_price: amount || PRODUCT_CONFIG.unit_price,
              currency_id: PRODUCT_CONFIG.currency_id
            }],
            // Informações do pagador
            payer: {
              name: name,
              email: email,
              identification: {
                type: docType,
                number: docNumber.replace(/[^\d]/g, '')
              }
            },
            // URLs de retorno
            back_urls: {
              success: `${projectUrl}/area-vip`,
              failure: `${projectUrl}/checkout`,
              pending: `${projectUrl}/checkout`
            },
            auto_return: "approved",
            // Campos obrigatórios
            external_reference: extRef,
            notification_url: notificationUrl,
            statement_descriptor: "COPYTRADING",
            // Métodos de pagamento
            payment_methods: {
              excluded_payment_types: payment_method_id === 'pix' || paymentMethod === 'pix' ? 
                [{ id: "credit_card" }, { id: "debit_card" }, { id: "ticket" }] : 
                [{ id: "credit_card" }, { id: "debit_card" }, { id: "bank_transfer" }],
              excluded_payment_methods: [],
              installments: 1
            },
            // Metadados
            metadata: {
              affiliate_code: affiliate_code || null,
              product_id: PRODUCT_CONFIG.id
            },
            // Expiração
            expires: true,
            expiration_date_from: new Date().toISOString(),
            expiration_date_to: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
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
            const prefError = await preferenceResponse.text();
            console.error('Preference creation error:', prefError);
            throw new Error(`Erro ao criar preferência: ${preferenceResponse.status}`);
          }

          const preference = await preferenceResponse.json();
          console.log('Preference created:', preference.id, 'External ref:', extRef);
          
          return new Response(JSON.stringify({
            paymentId: preference.id,
            status: 'redirect_required',
            init_point: preference.init_point,
            sandbox_init_point: preference.sandbox_init_point,
            external_reference: extRef
          }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
        
        throw new Error(`Erro ao processar pagamento: ${paymentResponse.status}`);
      }

      const payment = await paymentResponse.json();
      console.log('PIX/Boleto payment created:', payment.id, 'Status:', payment.status, 'External ref:', extRef);

      return new Response(JSON.stringify({
        paymentId: payment.id,
        status: payment.status,
        status_detail: payment.status_detail,
        amount: payment.transaction_amount,
        qr_code: payment.point_of_interaction?.transaction_data?.qr_code,
        qr_code_base64: payment.point_of_interaction?.transaction_data?.qr_code_base64,
        ticket_url: payment.point_of_interaction?.transaction_data?.ticket_url,
        external_reference: extRef
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Se chegou aqui sem token e sem ser PIX/boleto, retornar erro
    throw new Error('Método de pagamento inválido. Use Secure Fields para cartão de crédito.');

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
