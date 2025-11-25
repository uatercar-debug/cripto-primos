-- Criar tabela para códigos de acesso VIP
CREATE TABLE IF NOT EXISTS public.vip_access_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  device_fingerprint TEXT,
  ip_address TEXT,
  blocked BOOLEAN DEFAULT false,
  first_access_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  payment_id TEXT,
  CONSTRAINT email_lowercase CHECK (email = lower(email))
);

-- Criar índice para buscas rápidas
CREATE INDEX idx_vip_access_codes_email ON public.vip_access_codes(email);
CREATE INDEX idx_vip_access_codes_code ON public.vip_access_codes(code);

-- Habilitar RLS
ALTER TABLE public.vip_access_codes ENABLE ROW LEVEL SECURITY;

-- Política: usuários podem ver apenas seus próprios códigos
CREATE POLICY "Users can view their own access codes"
ON public.vip_access_codes
FOR SELECT
USING (email = current_setting('request.jwt.claims', true)::json->>'email');

-- Função para gerar código curto e único
CREATE OR REPLACE FUNCTION generate_short_code()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  new_code TEXT;
  code_exists BOOLEAN;
BEGIN
  LOOP
    -- Gerar código de 8 caracteres alfanuméricos
    new_code := upper(substring(md5(random()::text || clock_timestamp()::text) from 1 for 8));
    
    -- Verificar se já existe
    SELECT EXISTS(SELECT 1 FROM public.vip_access_codes WHERE code = new_code) INTO code_exists;
    
    -- Se não existe, retornar
    IF NOT code_exists THEN
      RETURN new_code;
    END IF;
  END LOOP;
END;
$$;