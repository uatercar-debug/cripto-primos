-- ============================================
-- SISTEMA DE AFILIADOS - CopyTrade Blueprint
-- ============================================

-- Tabela de Afiliados
CREATE TABLE IF NOT EXISTS public.affiliates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50),
    pix_key VARCHAR(255), -- Chave PIX para receber comissões
    affiliate_code VARCHAR(50) NOT NULL UNIQUE, -- Código único do afiliado
    commission_rate DECIMAL(5,2) DEFAULT 40.00, -- Taxa de comissão (40% padrão)
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'blocked')),
    total_sales INTEGER DEFAULT 0,
    total_earnings DECIMAL(10,2) DEFAULT 0.00,
    available_balance DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    approved_at TIMESTAMP WITH TIME ZONE,
    notes TEXT
);

-- Tabela de Vendas/Referências dos Afiliados
CREATE TABLE IF NOT EXISTS public.affiliate_referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    affiliate_id UUID NOT NULL REFERENCES public.affiliates(id) ON DELETE CASCADE,
    customer_email VARCHAR(255) NOT NULL,
    customer_name VARCHAR(255),
    product_name VARCHAR(255) DEFAULT 'Ebook CopyTrading',
    sale_amount DECIMAL(10,2) NOT NULL,
    commission_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'paid', 'cancelled', 'refunded')),
    payment_id VARCHAR(255), -- ID do pagamento MercadoPago
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    confirmed_at TIMESTAMP WITH TIME ZONE,
    paid_at TIMESTAMP WITH TIME ZONE
);

-- Tabela de Pagamentos aos Afiliados
CREATE TABLE IF NOT EXISTS public.affiliate_payouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    affiliate_id UUID NOT NULL REFERENCES public.affiliates(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    pix_key VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    transaction_id VARCHAR(255), -- ID da transação PIX
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE,
    notes TEXT
);

-- Tabela de Cliques nos Links de Afiliados (para analytics)
CREATE TABLE IF NOT EXISTS public.affiliate_clicks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    affiliate_id UUID NOT NULL REFERENCES public.affiliates(id) ON DELETE CASCADE,
    ip_address VARCHAR(50),
    user_agent TEXT,
    referrer TEXT,
    page_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_affiliates_code ON public.affiliates(affiliate_code);
CREATE INDEX IF NOT EXISTS idx_affiliates_email ON public.affiliates(email);
CREATE INDEX IF NOT EXISTS idx_affiliates_status ON public.affiliates(status);
CREATE INDEX IF NOT EXISTS idx_referrals_affiliate ON public.affiliate_referrals(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_referrals_status ON public.affiliate_referrals(status);
CREATE INDEX IF NOT EXISTS idx_clicks_affiliate ON public.affiliate_clicks(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_clicks_created ON public.affiliate_clicks(created_at);

-- Função para gerar código de afiliado único
CREATE OR REPLACE FUNCTION generate_affiliate_code()
RETURNS VARCHAR(50) AS $$
DECLARE
    new_code VARCHAR(50);
    code_exists BOOLEAN;
BEGIN
    LOOP
        -- Gera código com prefixo CT + 6 caracteres alfanuméricos
        new_code := 'CT' || upper(substring(md5(random()::text) from 1 for 6));
        
        -- Verifica se já existe
        SELECT EXISTS(SELECT 1 FROM public.affiliates WHERE affiliate_code = new_code) INTO code_exists;
        
        EXIT WHEN NOT code_exists;
    END LOOP;
    
    RETURN new_code;
END;
$$ LANGUAGE plpgsql;

-- Trigger para gerar código automaticamente se não fornecido
CREATE OR REPLACE FUNCTION set_affiliate_code()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.affiliate_code IS NULL OR NEW.affiliate_code = '' THEN
        NEW.affiliate_code := generate_affiliate_code();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_affiliate_code
    BEFORE INSERT ON public.affiliates
    FOR EACH ROW
    EXECUTE FUNCTION set_affiliate_code();

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_affiliate_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_affiliate_timestamp
    BEFORE UPDATE ON public.affiliates
    FOR EACH ROW
    EXECUTE FUNCTION update_affiliate_updated_at();

-- Função para atualizar totais do afiliado após confirmação de venda
CREATE OR REPLACE FUNCTION update_affiliate_totals()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'confirmed' AND (OLD.status IS NULL OR OLD.status != 'confirmed') THEN
        UPDATE public.affiliates
        SET 
            total_sales = total_sales + 1,
            total_earnings = total_earnings + NEW.commission_amount,
            available_balance = available_balance + NEW.commission_amount
        WHERE id = NEW.affiliate_id;
        
        NEW.confirmed_at := NOW();
    END IF;
    
    IF NEW.status = 'cancelled' AND OLD.status = 'confirmed' THEN
        UPDATE public.affiliates
        SET 
            total_sales = GREATEST(0, total_sales - 1),
            total_earnings = GREATEST(0, total_earnings - NEW.commission_amount),
            available_balance = GREATEST(0, available_balance - NEW.commission_amount)
        WHERE id = NEW.affiliate_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_affiliate_totals
    AFTER INSERT OR UPDATE ON public.affiliate_referrals
    FOR EACH ROW
    EXECUTE FUNCTION update_affiliate_totals();

-- RLS (Row Level Security)
ALTER TABLE public.affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_clicks ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso público para leitura (para validar códigos)
CREATE POLICY "Allow public read affiliate codes" ON public.affiliates
    FOR SELECT USING (status = 'approved');

-- Políticas para inserção pública (cadastro de afiliados)
CREATE POLICY "Allow public insert affiliates" ON public.affiliates
    FOR INSERT WITH CHECK (true);

-- Políticas para inserção de cliques (tracking)
CREATE POLICY "Allow public insert clicks" ON public.affiliate_clicks
    FOR INSERT WITH CHECK (true);

-- Inserir alguns afiliados de teste
INSERT INTO public.affiliates (name, email, phone, pix_key, affiliate_code, status, approved_at) VALUES
    ('Afiliado Teste', 'afiliado@teste.com', '11999999999', 'afiliado@teste.com', 'TESTE40', 'approved', NOW()),
    ('Demo Partner', 'demo@partner.com', '11888888888', 'demo@partner.com', 'DEMO40', 'approved', NOW())
ON CONFLICT (email) DO NOTHING;




