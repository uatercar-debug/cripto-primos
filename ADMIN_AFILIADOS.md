# Guia de Administração de Afiliados

## Segurança Implementada

O painel de administração de afiliados está protegido por múltiplas camadas de segurança:

1. **Proteção de Rota**: A rota `/admin/afiliados` é protegida por `ProtectedRoute`, exigindo autenticação VIP
2. **Validação de Admin**: Apenas emails cadastrados na tabela `admin_users` podem atualizar afiliados
3. **Edge Function Segura**: Todas as atualizações passam por uma Edge Function que valida permissões usando `service_role` key
4. **RLS Protegido**: A política pública de UPDATE foi removida do banco de dados
5. **Código de Acesso para Afiliados**: Afiliados precisam de email + código de acesso único para fazer login (não apenas email)

## Sistema de Código de Acesso para Afiliados

### Como Funciona

1. **Geração Automática**: Quando um afiliado é aprovado, um código de acesso único é gerado automaticamente (formato: `AF` + 8 caracteres)
2. **Envio por Email**: O código é enviado automaticamente por email quando o afiliado é aprovado
3. **Login Seguro**: Afiliados precisam informar email + código de acesso para acessar o painel
4. **Proteção**: Apenas quem possui o código pode acessar a área do afiliado

### Quando um Afiliado é Aprovado

- O sistema gera automaticamente um código de acesso único
- Um email é enviado automaticamente com o código
- O afiliado pode usar email + código para fazer login

## Como Adicionar um Novo Administrador

### Opção 1: Via SQL (Recomendado)

Execute no Supabase SQL Editor:

```sql
INSERT INTO public.admin_users (email, name, active) 
VALUES ('seu-email@exemplo.com', 'Nome do Admin', true)
ON CONFLICT (email) DO UPDATE SET active = true;
```

### Opção 2: Via Supabase Dashboard

1. Acesse o Supabase Dashboard
2. Vá em Table Editor → `admin_users`
3. Clique em "Insert row"
4. Preencha:
   - `email`: Email do administrador
   - `name`: Nome do administrador
   - `active`: `true`
5. Salve

## Como Remover/Desativar um Administrador

```sql
-- Desativar (recomendado - mantém histórico)
UPDATE public.admin_users 
SET active = false 
WHERE email = 'email@exemplo.com';

-- Ou remover completamente
DELETE FROM public.admin_users 
WHERE email = 'email@exemplo.com';
```

## Funcionalidades do Painel

### Visualização
- Lista todos os afiliados cadastrados
- Filtros por status (Pendente, Aprovado, Rejeitado, Bloqueado)
- Busca por nome, email, código ou telefone
- Estatísticas gerais (total, pendentes, aprovados, etc.)

### Ações Disponíveis
- **Aprovar**: Muda status para 'approved' e define `approved_at`
- **Rejeitar**: Muda status para 'rejected'
- **Bloquear**: Muda status para 'blocked'
- **Pendente**: Volta status para 'pending'
- **Notas**: Adicionar/editar notas sobre o afiliado

### Detalhes do Afiliado
- Informações completas (nome, email, telefone, PIX, código)
- Estatísticas (cliques, vendas, taxa de conversão, comissões)
- Histórico de vendas

## Acesso ao Painel

1. Faça login na área VIP (`/login`)
2. Use um email que esteja cadastrado em `admin_users`
3. Acesse `/admin/afiliados`

## Segurança Adicional

- A Edge Function `admin-update-affiliate` valida o email do usuário antes de permitir qualquer atualização
- Todas as operações de UPDATE usam `service_role` key (bypass RLS) apenas após validação
- A política RLS pública de UPDATE foi removida para prevenir acesso não autorizado

## Troubleshooting

### "Acesso negado" ao tentar atualizar
- Verifique se seu email está em `admin_users` com `active = true`
- Verifique se está autenticado na área VIP

### Erro ao carregar afiliados
- Verifique as políticas RLS de SELECT na tabela `affiliates`
- A política "Allow public read by email check" deve estar ativa

