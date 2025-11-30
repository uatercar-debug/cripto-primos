# 🔐 Guia: Configuração de Variáveis de Ambiente

Este guia explica como configurar as variáveis de ambiente necessárias para o projeto funcionar corretamente.

## 📋 Variáveis Necessárias

### Frontend (Vite) - Configurar no Netlify

Essas variáveis devem ser configuradas no painel do Netlify e começam com `VITE_`:

1. **VITE_SUPABASE_URL**
   - URL do seu projeto Supabase
   - Exemplo: `https://kwkbkwtlhtzrjktlntjx.supabase.co`

2. **VITE_SUPABASE_ANON_KEY**
   - Chave pública (anon) do Supabase
   - Encontre em: Supabase Dashboard > Project Settings > API

3. **VITE_MERCADOPAGO_PUBLIC_KEY**
   - Chave pública do MercadoPago
   - Encontre em: MercadoPago Dashboard > Credenciais

4. **VITE_UNSPLASH_ACCESS_KEY** (Opcional)
   - Chave de API do Unsplash
   - Necessária apenas se usar busca de imagens

### Supabase Edge Functions - Configurar no Supabase

Essas variáveis devem ser configuradas no painel do Supabase:

1. **SUPABASE_URL**
   - URL do seu projeto Supabase
   - Exemplo: `https://kwkbkwtlhtzrjktlntjx.supabase.co`

2. **SUPABASE_SERVICE_ROLE_KEY**
   - Chave de serviço (service role) do Supabase
   - ⚠️ **ATENÇÃO**: Esta chave tem acesso total ao banco de dados
   - Encontre em: Supabase Dashboard > Project Settings > API > service_role key

3. **RESEND_API_KEY**
   - Chave de API do Resend (para envio de emails)
   - Crie uma conta em: https://resend.com
   - Encontre em: Resend Dashboard > API Keys

4. **MERCADOPAGO_ACCESS_TOKEN**
   - Access Token do MercadoPago (para criar pagamentos)
   - Encontre em: MercadoPago Dashboard > Credenciais > Access Token

---

## 🚀 Como Configurar no Netlify

### Passo 1: Acesse as Configurações do Site

1. Acesse [Netlify Dashboard](https://app.netlify.com)
2. Selecione seu site
3. Vá em **Site configuration** > **Environment variables**

### Passo 2: Adicione as Variáveis

Clique em **Add a variable** e adicione cada uma das variáveis do frontend:

```
VITE_SUPABASE_URL = https://kwkbkwtlhtzrjktlntjx.supabase.co
VITE_SUPABASE_ANON_KEY = sua_chave_aqui
VITE_MERCADOPAGO_PUBLIC_KEY = sua_chave_aqui
VITE_UNSPLASH_ACCESS_KEY = sua_chave_aqui (opcional)
```

### Passo 3: Faça um Novo Deploy

Após adicionar as variáveis:
1. Vá em **Deploys**
2. Clique em **Trigger deploy** > **Deploy site**
3. Ou faça um novo push no Git

---

## 🔧 Como Configurar no Supabase (Edge Functions)

### Passo 1: Acesse as Configurações do Projeto

1. Acesse [Supabase Dashboard](https://app.supabase.com)
2. Selecione seu projeto
3. Vá em **Project Settings** > **Edge Functions** > **Secrets**

### Passo 2: Adicione os Secrets

Clique em **Add secret** e adicione cada uma das variáveis:

```
SUPABASE_URL = https://kwkbkwtlhtzrjktlntjx.supabase.co
SUPABASE_SERVICE_ROLE_KEY = sua_service_role_key_aqui
RESEND_API_KEY = sua_resend_api_key_aqui
MERCADOPAGO_ACCESS_TOKEN = sua_access_token_aqui
```

---

## 💻 Como Configurar Localmente (Desenvolvimento)

### Passo 1: Crie o arquivo .env

Na raiz do projeto, crie um arquivo `.env` (copie do `.env.example`):

```bash
cp .env.example .env
```

### Passo 2: Preencha as Variáveis

Edite o arquivo `.env` e preencha com suas chaves reais:

```env
VITE_SUPABASE_URL=https://kwkbkwtlhtzrjktlntjx.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_aqui
VITE_MERCADOPAGO_PUBLIC_KEY=sua_chave_aqui
VITE_UNSPLASH_ACCESS_KEY=sua_chave_aqui
```

### Passo 3: Reinicie o Servidor

Após criar/editar o `.env`, reinicie o servidor de desenvolvimento:

```bash
npm run dev
```

---

## 📝 Onde Encontrar as Chaves

### Supabase
1. Acesse: https://app.supabase.com
2. Selecione seu projeto
3. Vá em **Project Settings** > **API**
4. Copie:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** → `VITE_SUPABASE_ANON_KEY`
   - **service_role** → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ secreta!)

### MercadoPago
1. Acesse: https://www.mercadopago.com.br/developers
2. Vá em **Suas integrações** > Selecione sua aplicação
3. Vá em **Credenciais de produção** ou **Credenciais de teste**
4. Copie:
   - **Chave pública** → `VITE_MERCADOPAGO_PUBLIC_KEY`
   - **Access token** → `MERCADOPAGO_ACCESS_TOKEN`

### Resend
1. Acesse: https://resend.com
2. Faça login e vá em **API Keys**
3. Crie uma nova chave ou copie uma existente
4. Copie a chave → `RESEND_API_KEY`

### Unsplash (Opcional)
1. Acesse: https://unsplash.com/developers
2. Crie uma aplicação
3. Copie a **Access Key** → `VITE_UNSPLASH_ACCESS_KEY`

---

## ⚠️ Importante

- **NUNCA** commite o arquivo `.env` no Git (já está no `.gitignore`)
- Use o `.env.example` como referência
- As variáveis do frontend (`VITE_*`) são públicas no bundle final
- As variáveis do Supabase Edge Functions são privadas e seguras
- Mantenha suas chaves seguras e não as compartilhe

---

## ✅ Verificação

Após configurar, verifique se tudo está funcionando:

1. **Frontend**: Abra o console do navegador e verifique se não há erros de variáveis não definidas
2. **Edge Functions**: Teste as funções no Supabase Dashboard
3. **Netlify**: Verifique os logs de deploy para erros

---

## 🆘 Problemas Comuns

### "Variável não definida" no console
- Verifique se a variável está no Netlify com o prefixo `VITE_`
- Faça um novo deploy após adicionar variáveis

### Edge Function retorna erro
- Verifique se os secrets estão configurados no Supabase
- Verifique se os nomes das variáveis estão corretos

### Pagamentos não funcionam
- Verifique se `VITE_MERCADOPAGO_PUBLIC_KEY` está configurada
- Verifique se `MERCADOPAGO_ACCESS_TOKEN` está no Supabase
- Use credenciais de teste primeiro

