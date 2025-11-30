-- ============================================
-- SISTEMA DE RECOMENDAÇÕES - CopyTrade Blueprint
-- ============================================

-- Tabela de Recomendações
CREATE TABLE IF NOT EXISTS public.recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category VARCHAR(50) NOT NULL CHECK (category IN ('Livro', 'Vídeo', 'Curso', 'E-book')),
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    description TEXT NOT NULL,
    long_description TEXT,
    link VARCHAR(500),
    price VARCHAR(50) NOT NULL,
    badge VARCHAR(50),
    image_url TEXT,
    duration VARCHAR(100),
    level VARCHAR(50) CHECK (level IN ('Iniciante', 'Intermediário', 'Avançado', 'Todos')),
    language VARCHAR(50),
    format VARCHAR(100),
    featured BOOLEAN DEFAULT false,
    active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_recommendations_category ON public.recommendations(category);
CREATE INDEX IF NOT EXISTS idx_recommendations_active ON public.recommendations(active);
CREATE INDEX IF NOT EXISTS idx_recommendations_featured ON public.recommendations(featured);
CREATE INDEX IF NOT EXISTS idx_recommendations_sort_order ON public.recommendations(sort_order);

-- RLS (Row Level Security) - Permitir leitura pública, escrita apenas para admins
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;

-- Política: Todos podem ler recomendações ativas
CREATE POLICY "Public can view active recommendations"
    ON public.recommendations
    FOR SELECT
    USING (active = true);

-- Política: Apenas autenticados podem inserir (será ajustada depois com roles)
CREATE POLICY "Authenticated users can insert recommendations"
    ON public.recommendations
    FOR INSERT
    WITH CHECK (true);

-- Política: Apenas autenticados podem atualizar
CREATE POLICY "Authenticated users can update recommendations"
    ON public.recommendations
    FOR UPDATE
    USING (true);

-- Política: Apenas autenticados podem deletar
CREATE POLICY "Authenticated users can delete recommendations"
    ON public.recommendations
    FOR DELETE
    USING (true);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_recommendations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at
CREATE TRIGGER update_recommendations_updated_at
    BEFORE UPDATE ON public.recommendations
    FOR EACH ROW
    EXECUTE FUNCTION update_recommendations_updated_at();

-- Inserir dados iniciais
INSERT INTO public.recommendations (
    category, title, author, rating, description, long_description, link, price, badge, 
    image_url, duration, level, language, format, featured, sort_order
) VALUES
('Livro', 'O Investidor Inteligente', 'Benjamin Graham', 5,
 'Clássico fundamental sobre value investing e análise de investimentos. Considerado a bíblia dos investidores de valor, este livro ensina princípios atemporais de análise fundamentalista e construção de portfólio.',
 'Publicado pela primeira vez em 1949, ''O Investidor Inteligente'' continua sendo um dos livros mais influentes sobre investimentos. Benjamin Graham, conhecido como o pai do value investing, apresenta estratégias comprovadas para identificar ações subvalorizadas e construir uma carteira sólida. O livro é essencial tanto para iniciantes quanto para investidores experientes que buscam fundamentos sólidos.',
 'https://www.amazon.com.br/Investidor-Inteligente-Benjamin-Graham/dp/8595081009',
 'R$ 45,90', 'Clássico',
 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=250&fit=crop&crop=center',
 '~400 páginas', 'Intermediário', 'Português', 'Físico/Digital', true, 1),

('Curso', 'Copytrading Avançado', 'Cripto Primos Academy', 5,
 'Curso completo sobre estratégias avançadas de copytrading na Exness. Aprenda a selecionar traders, gerenciar riscos e otimizar seus resultados.',
 'Este curso avançado cobre desde os fundamentos até estratégias profissionais de copytrading. Inclui análise detalhada de perfis de traders, técnicas de diversificação, gestão de risco avançada e como interpretar métricas de performance. Com mais de 20 horas de conteúdo prático e estudos de caso reais.',
 '#', 'R$ 297,00', 'Exclusivo',
 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop&crop=center',
 '20+ horas', 'Avançado', 'Português', 'Online', true, 2),

('E-book', 'Guia Completo de Criptomoedas 2024', 'Equipe Cripto Primos', 4,
 'Manual atualizado sobre investimentos em criptomoedas e DeFi. Tudo que você precisa saber sobre o mercado cripto atualizado para 2024.',
 'Um guia completo e atualizado sobre o ecossistema de criptomoedas. Cobre desde os fundamentos de blockchain até estratégias avançadas de DeFi, NFTs e staking. Inclui análises de projetos promissores e como construir uma carteira diversificada em cripto.',
 '#', 'R$ 19,90', 'Atualizado',
 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=250&fit=crop&crop=center',
 '~150 páginas', 'Iniciante', 'Português', 'PDF', false, 3);




