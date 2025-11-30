# 🚀 Guia: Extração Automática de Dados por Link

## Como Funciona

O sistema agora permite extrair automaticamente todos os dados de uma recomendação apenas colando o link do produto!

## 📋 Passo a Passo

### 1. Acesse o Admin
- Vá para `/admin/recomendacoes`
- Clique em "Nova Recomendação"

### 2. Cole o Link
- No topo do formulário, você verá a seção **"Extrair Dados do Link"**
- Cole o link do produto (Amazon, YouTube, Udemy, etc.)
- Exemplos:
  - `https://www.amazon.com.br/Investidor-Inteligente-Benjamin-Graham/dp/8595081009`
  - `https://www.youtube.com/@PrimoRico`
  - `https://www.udemy.com/course/copytrading-avancado/`

### 3. Clique em "Extrair"
- O sistema irá:
  - ✅ Validar a URL
  - ✅ Detectar a categoria automaticamente
  - ✅ Buscar título, descrição, imagem, autor e preço
  - ✅ Preencher todos os campos automaticamente

### 4. Revise e Ajuste
- Revise os dados extraídos
- Ajuste o que for necessário
- Adicione informações adicionais se quiser
- Clique em "Salvar"

## 🎯 Sites Suportados

### ✅ Totalmente Suportados
- **Amazon** (livros, e-books)
- **YouTube** (canais e vídeos)
- **Udemy** (cursos)
- **Coursera** (cursos)
- **Sites com Open Graph** (maioria dos sites modernos)

### ⚠️ Suporte Parcial
- Sites sem metadados Open Graph (extrai apenas informações básicas)
- Sites com proteção anti-bot (pode falhar)

## 🔧 Como Funciona Tecnicamente

1. **Validação de URL**: Verifica se o link é válido
2. **Detecção de Categoria**: Analisa a URL para determinar o tipo (Livro, Vídeo, Curso, E-book)
3. **Extração de Metadados**: 
   - Usa Edge Function do Supabase para fazer scraping
   - Extrai Open Graph tags (og:title, og:description, og:image)
   - Extrai meta tags padrão (title, description)
   - Tenta extrair preço e autor quando disponível
4. **Preenchimento Automático**: Preenche todos os campos do formulário

## 🛠️ Configuração

### Edge Function (Opcional mas Recomendado)

A Edge Function `scrape-link-metadata` já está criada. Para usá-la:

1. **Deploy da Function**:
```bash
supabase functions deploy scrape-link-metadata
```

2. **Testar localmente**:
```bash
supabase functions serve scrape-link-metadata
```

### Fallback

Se a Edge Function não estiver disponível, o sistema usa:
- Proxy CORS público (allorigins.win)
- Extração básica da URL

## 💡 Dicas

1. **Links da Amazon**: Funcionam muito bem! Extrai título, autor, preço e imagem
2. **YouTube**: Detecta como "Vídeo" automaticamente
3. **Cursos Online**: Udemy, Coursera, etc. são detectados como "Curso"
4. **E-books**: Se o link contém "ebook" ou "kindle", detecta como "E-book"

## 🐛 Solução de Problemas

### "Erro ao extrair dados"
- Verifique se o link está correto e acessível
- Alguns sites bloqueiam scraping
- Tente preencher manualmente

### "URL inválida"
- Certifique-se de que o link começa com `http://` ou `https://`
- Verifique se não há espaços no link

### "Nenhum dado extraído"
- O site pode não ter metadados Open Graph
- Preencha manualmente os campos obrigatórios
- A imagem pode ser extraída separadamente usando Unsplash

## 📝 Exemplo de Uso

1. Cole: `https://www.amazon.com.br/Investidor-Inteligente-Benjamin-Graham/dp/8595081009`
2. Clique em "Extrair"
3. Sistema preenche:
   - **Título**: "O Investidor Inteligente"
   - **Autor**: "Benjamin Graham"
   - **Categoria**: "Livro" (detectado automaticamente)
   - **Imagem**: Capa do livro
   - **Preço**: "R$ 45,90" (se disponível)
   - **Descrição**: Descrição do produto
4. Revise e salve!

## 🎉 Benefícios

- ⚡ **Rápido**: Preenche tudo em segundos
- 🎯 **Preciso**: Extrai dados reais do site
- 🖼️ **Imagens**: Pega a imagem oficial do produto
- 💰 **Preço**: Extrai o preço atual quando disponível
- 🔄 **Atualizado**: Sempre busca dados mais recentes




