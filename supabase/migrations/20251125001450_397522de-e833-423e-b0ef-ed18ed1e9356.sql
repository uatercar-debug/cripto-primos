-- Corrigir função para incluir search_path por segurança
CREATE OR REPLACE FUNCTION generate_short_code()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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