# Manual de Manutenção - Site MapleBear SAF

## Visão Geral

Este documento fornece instruções detalhadas para manutenção e atualização do site MapleBear SAF, um sistema de gestão de licenças Canva desenvolvido em React com TypeScript.

## Estrutura do Projeto

### Diretórios Principais

**`/src`** - Código fonte da aplicação
- `/components` - Componentes React reutilizáveis
- `/pages` - Páginas principais da aplicação
- `/utils` - Utilitários e funções auxiliares
- `/stores` - Gerenciamento de estado (Zustand)
- `/types` - Definições de tipos TypeScript

**`/public`** - Arquivos estáticos
- `logo-maplebear.png` - Logo oficial da MapleBear
- `meninas-desenhando.png` - Imagem das estudantes

**`/dist`** - Versão compilada para produção (gerada automaticamente)

### Arquivos de Configuração

- `package.json` - Dependências e scripts do projeto
- `vite.config.ts` - Configuração do bundler Vite
- `tailwind.config.ts` - Configuração do Tailwind CSS
- `tsconfig.json` - Configuração do TypeScript

## Tecnologias Utilizadas

### Framework e Bibliotecas Principais
- **React 18** - Framework principal
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e servidor de desenvolvimento
- **Tailwind CSS** - Framework de CSS utilitário
- **Shadcn/UI** - Componentes de interface
- **React Router** - Roteamento
- **Zustand** - Gerenciamento de estado
- **Lucide React** - Ícones

### Dependências de Segurança
- Sistema de autenticação customizado
- Validação de entrada de dados
- Headers de segurança HTTP
- Gerenciamento seguro de sessões

## Comandos Essenciais

### Desenvolvimento
```bash
npm install          # Instalar dependências
npm run dev         # Iniciar servidor de desenvolvimento
npm run build       # Construir versão de produção
npm run preview     # Visualizar build de produção
npm run lint        # Verificar código
npm run format      # Formatar código
```

### Servidor de Desenvolvimento
O servidor roda em `http://localhost:8080` por padrão.

## Sistema de Autenticação

### Credenciais Válidas
- `admin@mbcentral.com.br` / `maplebear2025`
- `saf@seb.com.br` / `saf2025`
- `coordenador@sebsa.com.br` / `coord2025`

### Domínios Permitidos
- `@mbcentral.com.br`
- `@seb.com.br`
- `@sebsa.com.br`

### Recursos de Segurança
- Bloqueio automático após 5 tentativas de login falhadas
- Sessões com expiração automática
- Validação de domínios corporativos
- Sanitização de dados de entrada

## Manutenção Comum

### Atualizando Credenciais de Login

**Arquivo:** `/src/pages/Login.tsx`

Localize a seção `validCredentials` e modifique conforme necessário:

```typescript
const validCredentials = [
  { email: "admin@mbcentral.com.br", password: "maplebear2025", role: "admin" },
  { email: "saf@seb.com.br", password: "saf2025", role: "user" },
  { email: "coordenador@sebsa.com.br", password: "coord2025", role: "coordinator" }
];
```

### Atualizando Domínios Permitidos

**Arquivo:** `/src/utils/security.ts`

Modifique a constante `ALLOWED_DOMAINS`:

```typescript
ALLOWED_DOMAINS: ['@mbcentral.com.br', '@seb.com.br', '@sebsa.com.br']
```

### Alterando Logos e Imagens

1. Substitua os arquivos em `/public/`
2. Mantenha os mesmos nomes de arquivo para compatibilidade
3. Formatos recomendados: PNG para logos, JPG/PNG para fotos

### Modificando Cores da Marca

**Arquivo:** `tailwind.config.ts`

Atualize as cores no tema:

```typescript
colors: {
  primary: {
    DEFAULT: "#dc2626", // Vermelho principal
    foreground: "#ffffff"
  }
}
```

### Atualizando Estatísticas do Dashboard

**Arquivo:** `/src/components/welcome/WelcomeSection.tsx`

Modifique os valores nos cards de estatísticas:

```typescript
<div className="text-2xl font-bold text-red-600">127</div>
<p className="text-sm text-gray-600 mt-1">+5 este mês</p>
```

## Configurações de Segurança

### Headers HTTP

**Arquivo:** `vite.config.ts`

Os headers de segurança estão configurados no servidor de desenvolvimento:

```typescript
headers: {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin'
}
```

### Configurações de Sessão

**Arquivo:** `/src/utils/security.ts`

Ajuste os tempos de sessão conforme necessário:

```typescript
SESSION_TIMEOUT: 7 * 24 * 60 * 60 * 1000, // 7 dias
MAX_LOGIN_ATTEMPTS: 5,
LOCKOUT_DURATION: 15 * 60 * 1000 // 15 minutos
```

## Deployment

### Build de Produção

1. Execute `npm run build`
2. Os arquivos serão gerados em `/dist`
3. Faça upload dos arquivos para seu servidor web

### Configuração do Servidor

- Configure o servidor para servir `index.html` para todas as rotas (SPA)
- Habilite compressão gzip
- Configure headers de segurança no servidor web

### Variáveis de Ambiente

Para produção, configure as seguintes variáveis se necessário:
- `VITE_API_URL` - URL da API backend (se aplicável)
- `VITE_APP_ENV` - Ambiente da aplicação

## Troubleshooting

### Problemas Comuns

**Erro de Login**
- Verifique se o domínio do email está na lista permitida
- Confirme se as credenciais estão corretas
- Verifique se o usuário não está bloqueado

**Imagens não Carregam**
- Confirme se os arquivos estão em `/public`
- Verifique os nomes dos arquivos
- Limpe o cache do navegador

**Erro de Build**
- Execute `npm install` para garantir dependências atualizadas
- Verifique se não há erros de TypeScript
- Limpe o cache com `rm -rf node_modules package-lock.json && npm install`

### Logs e Debugging

- Use as ferramentas de desenvolvedor do navegador
- Verifique o console para erros JavaScript
- Use `npm run dev` para desenvolvimento com hot reload

## Funcionalidades do Chinook

### Mascote Interativo
O Chinook é o mascote oficial da MapleBear integrado ao sistema com múltiplas funcionalidades:

**Página de Erro 404:**
- Exibe uma imagem aleatória do Chinook a cada acesso
- Mensagens amigáveis e contextualizadas
- Botões de navegação para retornar ao sistema
- Links rápidos para páginas principais

**Assistente Flutuante:**
- Botão flutuante no canto inferior esquerdo
- Dicas rotativas sobre o uso do sistema
- Ações rápidas para navegação
- Mensagens motivacionais

**Boas-vindas Personalizadas:**
- Aparece automaticamente após login
- Sequência de mensagens de apresentação
- Pode ser fechado pelo usuário
- Imagens contextuais do mascote

### Imagens do Chinook Disponíveis
- `chinook.png` - Cabeça básica do mascote
- `Acenando.png` - Chinook acenando
- `TendoIdeia.png` - Chinook com lâmpada (ideias)
- `Escrevendo.png` - Chinook escrevendo
- `Brasil-Canada.png` - Chinook com bandeiras
- `d27976b5-58d9-4be0-8d47-22700dc69cb0.png` - Chinook pensativo

### Configurações do Chinook

**Arquivo:** `/src/components/chinook/ChinookWelcome.tsx`
- Controla as mensagens de boas-vindas
- Tempo entre mensagens: 3 segundos
- Delay inicial: 2 segundos

**Arquivo:** `/src/components/chinook/ChinookFloating.tsx`
- Assistente flutuante de ajuda
- Dicas rotativas sobre funcionalidades
- Ações rápidas de navegação

**Arquivo:** `/src/pages/NotFound.tsx`
- Página de erro personalizada
- Seleção aleatória de imagens do Chinook
- Navegação contextual

Para questões técnicas ou atualizações do sistema, consulte:
- Documentação do React: https://react.dev
- Documentação do Tailwind: https://tailwindcss.com
- Documentação do Vite: https://vitejs.dev

## Backup e Versionamento

### Recomendações
- Mantenha backups regulares do código fonte
- Use controle de versão (Git) para rastrear mudanças
- Teste todas as alterações em ambiente de desenvolvimento antes de aplicar em produção
- Documente todas as modificações importantes

### Estrutura de Versionamento
- Use versionamento semântico (major.minor.patch)
- Mantenha um changelog das alterações
- Crie tags para releases importantes

Este manual deve ser atualizado sempre que modificações significativas forem feitas no sistema.

