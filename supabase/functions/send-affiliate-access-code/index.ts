// Edge Function para enviar código de acesso do afiliado por email
// É chamada quando um afiliado é aprovado

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SendAccessCodeRequest {
  affiliateId: string;
  email: string;
  name: string;
  accessCode: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { affiliateId, email, name, accessCode }: SendAccessCodeRequest = await req.json();

    if (!email || !name || !accessCode) {
      return new Response(
        JSON.stringify({ error: 'Email, nome e código de acesso são obrigatórios' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Enviar email com código de acesso
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Seu Código de Acesso - Programa de Afiliados</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">🎉 Cadastro Aprovado!</h1>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px;">Olá <strong>${name}</strong>,</p>
            
            <p>Seu cadastro no programa de afiliados foi <strong>aprovado</strong>! 🎊</p>
            
            <p>Agora você pode acessar seu painel de afiliado usando as credenciais abaixo:</p>
            
            <div style="background: white; border: 2px solid #667eea; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
              <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">Email:</p>
              <p style="margin: 0 0 20px 0; font-size: 18px; font-weight: bold; color: #333;">${email}</p>
              
              <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">Código de Acesso:</p>
              <p style="margin: 0; font-size: 24px; font-weight: bold; color: #667eea; font-family: monospace; letter-spacing: 2px;">${accessCode}</p>
            </div>
            
            <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px;">
              <p style="margin: 0; font-size: 14px;">
                <strong>⚠️ Importante:</strong> Guarde este código com segurança. Você precisará dele para acessar seu painel de afiliado.
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://47432545-ac42-48d7-9a0d-1506bd6170b8.lovableproject.com/afiliados" 
                 style="display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                Acessar Painel de Afiliado
              </a>
            </div>
            
            <p style="font-size: 14px; color: #666; margin-top: 30px;">
              Se você não solicitou este cadastro, por favor ignore este email.
            </p>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            
            <p style="font-size: 12px; color: #999; text-align: center; margin: 0;">
              CopyTrade Blueprint - Programa de Afiliados
            </p>
          </div>
        </body>
      </html>
    `;

    const { data, error } = await resend.emails.send({
      from: 'CopyTrade Blueprint <noreply@copytrade-blueprint.com>',
      to: email,
      subject: '🎉 Seu Cadastro Foi Aprovado - Código de Acesso',
      html: emailHtml,
    });

    if (error) {
      console.error('Erro ao enviar email:', error);
      return new Response(
        JSON.stringify({ error: 'Erro ao enviar email', details: error }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Email enviado com sucesso:', data);

    return new Response(
      JSON.stringify({ success: true, message: 'Email enviado com sucesso' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Erro na função:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Erro interno do servidor' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
};

serve(handler);



