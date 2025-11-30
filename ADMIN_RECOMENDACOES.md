# Sistema de Gerenciamento de Recomendações

## 📋 Visão Geral

Sistema completo para gerenciar recomendações de livros, cursos, vídeos e e-books de forma fácil e intuitiva.

## 🚀 Como Usar

### 1. Acessar o Painel Admin

Acesse: `/admin/recomendacoes` (requer autenticação)

### 2. Funcionalidades

#### ✅ Criar Nova Recomendação
- Clique em "Nova Recomendação"
- Preencha os campos obrigatórios (marcados com *)
- Use as abas para organizar as informações:
  - **Básico**: Título, autor, descrição, preço, link
  - **Detalhes**: Duração, nível, idioma, formato
  - **Imagem**: URL ou busca no Unsplash

#### 🔍 Buscar Imagens no Unsplash

1. Vá para a aba "Imagem"
2. Digite termos de busca (ex: "livro investimento", "trading", "criptomoedas")
3. Clique em "Buscar"
4. Selecione uma imagem clicando nela
5. A imagem será automaticamente adicionada

**Nota**: Para usar o Unsplash, você precisa configurar a chave de API:
- Crie uma conta em [Unsplash Developers](https://unsplash.com/developers)
- Adicione `VITE_UNSPLASH_ACCESS_KEY=sua_chave_aqui` no arquivo `.env`

#### ✏️ Editar Recomendação
- Clique no ícone de editar (lápis) no card da recomendação
- Modifique os campos desejados
- Clique em "Salvar"

#### 👁️ Ativar/Desativar
- Use o ícone de olho para ativar/desativar recomendações
- Recomendações desativadas não aparecem na página pública

#### 🗑️ Excluir
- Clique no ícone de lixeira
- Confirme a exclusão
- A recomendação será marcada como inativa (soft delete)

## 📊 Campos Disponíveis

### Campos Obrigatórios (*)
- **Categoria**: Livro, Vídeo, Curso ou E-book
- **Título**: Nome da recomendação
- **Autor**: Nome do autor/criador
- **Avaliação**: De 1 a 5 estrelas
- **Descrição Curta**: Aparece no card
- **Preço**: Ex: "R$ 45,90" ou "Gratuito"

### Campos Opcionais
- **Descrição Completa**: Aparece no modal de detalhes
- **Link**: URL para acessar o conteúdo
- **Badge**: Ex: "Clássico", "Bestseller", "Exclusivo"
- **Duração/Extensão**: Ex: "~400 páginas", "20+ horas"
- **Nível**: Iniciante, Intermediário, Avançado ou Todos
- **Idioma**: Ex: "Português", "Inglês"
- **Formato**: Ex: "Físico/Digital", "PDF", "Online", "YouTube"
- **Ordem de Exibição**: Número para ordenar (menor = primeiro)
- **Em Destaque**: Marque para destacar na página
- **Ativo**: Desmarque para ocultar da página pública

## 🖼️ Imagens

### Opções de Imagem

1. **URL Direta**: Cole qualquer URL de imagem válida
2. **Unsplash**: Busque e selecione imagens gratuitas
3. **Upload**: (Em desenvolvimento) Upload direto para Supabase Storage

### Tamanhos Recomendados
- **Largura**: 400-800px
- **Altura**: 250-500px
- **Formato**: JPG, PNG, WebP
- **Aspect Ratio**: 16:9 ou 4:3 funciona melhor

## 🗄️ Banco de Dados

As recomendações são armazenadas no Supabase na tabela `recommendations`.

### Estrutura da Tabela

```sql
- id (UUID)
- category (Livro, Vídeo, Curso, E-book)
- title
- author
- rating (1-5)
- description
- long_description
- link
- price
- badge
- image_url
- duration
- level
- language
- format
- featured (boolean)
- active (boolean)
- sort_order (integer)
- created_at
- updated_at
```

## 🔐 Segurança

- A página de admin requer autenticação
- Apenas usuários autenticados podem criar/editar/excluir
- Recomendações inativas não aparecem na página pública
- RLS (Row Level Security) configurado no Supabase

## 📝 Dicas

1. **Use descrições atrativas**: A descrição curta aparece no card, então seja conciso
2. **Imagens de qualidade**: Imagens boas aumentam o engajamento
3. **Links válidos**: Sempre teste os links antes de salvar
4. **Ordem de exibição**: Use números baixos (0, 1, 2) para itens em destaque
5. **Badges**: Use badges consistentes para criar categorias visuais

## 🐛 Solução de Problemas

### Imagens não aparecem
- Verifique se a URL está correta e acessível
- Tente usar uma URL do Unsplash ou outro serviço confiável
- Verifique o console do navegador para erros

### Não consigo salvar
- Verifique se todos os campos obrigatórios estão preenchidos
- Verifique sua conexão com o Supabase
- Veja o console para mensagens de erro

### Unsplash não funciona
- Verifique se a chave de API está configurada no `.env`
- A chave deve começar com `VITE_UNSPLASH_ACCESS_KEY=`
- Reinicie o servidor de desenvolvimento após adicionar a chave

## 📚 Próximos Passos

- [ ] Upload de imagens para Supabase Storage
- [ ] Importação em massa via CSV
- [ ] Estatísticas de visualizações
- [ ] Sistema de tags
- [ ] Filtros avançados na página pública




