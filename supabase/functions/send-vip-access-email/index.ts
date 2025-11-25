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

interface SendEmailRequest {
  email: string;
  code: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, code }: SendEmailRequest = await req.json();

    console.log('Enviando email de acesso VIP para:', email);

    const emailResponse = await resend.emails.send({
      from: 'Cripto Primos <onboarding@resend.dev>',
      to: [email],
      subject: 'Seu acesso VIP está liberado 🎉',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
              .code-box { background: white; border: 2px solid #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
              .code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 4px; font-family: monospace; }
              .button { display: inline-block; background: #667eea; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: bold; }
              .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
              .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎉 Seu Pagamento foi Confirmado!</h1>
                <p>Bem-vindo à Área VIP Cripto Primos</p>
              </div>
              <div class="content">
                <p>Olá!</p>
                <p>Seu pagamento foi aprovado com sucesso. Aqui está seu código exclusivo de acesso à Área VIP:</p>
                
                <div class="code-box">
                  <p style="margin: 0; font-size: 14px; color: #666;">Seu código de acesso:</p>
                  <div class="code">${code}</div>
                </div>

                <p><strong>E-mail vinculado:</strong> ${email}</p>

                <div style="text-align: center;">
                  <a href="${supabaseUrl.replace('https://kwkbkwtlhtzrjktlntjx.supabase.co', 'https://copytradinguide.lovable.app')}/login" class="button">
                    🔐 Acessar Área VIP
                  </a>
                </div>

                <div class="warning">
                  <strong>⚠️ Aviso Importante sobre Segurança:</strong>
                  <p style="margin: 10px 0 0 0;">
                    Este acesso é <strong>individual e exclusivo</strong>. Por motivos de segurança:
                  </p>
                  <ul style="margin: 10px 0;">
                    <li>Seu código só funciona no primeiro dispositivo usado</li>
                    <li>Não compartilhe este código com outras pessoas</li>
                    <li>Tentativas de acesso de diferentes dispositivos/IPs resultarão em bloqueio automático</li>
                  </ul>
                  <p style="margin: 10px 0 0 0;">
                    Isso garante a segurança do conteúdo e mantém a plataforma protegida para todos os usuários.
                  </p>
                </div>

                <p>Aproveite todo o conteúdo exclusivo disponível!</p>
                
                <div class="footer">
                  <p>Este é um email automático, não responda.</p>
                  <p>Se você não realizou esta compra, ignore este email.</p>
                  <p>&copy; ${new Date().getFullYear()} Cripto Primos. Todos os direitos reservados.</p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    console.log('Email enviado com sucesso:', emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Erro ao enviar email:', error);
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
