Este arquivo do Figma Make inclui componentes de [shadcn/ui](https://ui.shadcn.com/) usados sob [licença MIT](https://github.com/shadcn-ui/ui/blob/main/LICENSE.md).

Este arquivo do Figma Make inclui fotos do [Unsplash](https://unsplash.com) utilizadas sob [licença](https://unsplash.com/license).

# 📊 Guia Completo: SQLite + Backend

## 🎯 O Que Foi Implementado

✅ **Banco de Dados SQLite** - Persistência local  
✅ **Prisma ORM** - Acesso aos dados  
✅ **Backend Express** - API RESTful  
✅ **Rotas CRUD** - Completas para tickets, usuários, comentários  
✅ **Auditoria** - Log de todas as ações  
✅ **Hooks React** - Integração frontend/backend  

---

## 📋 Pré-Requisitos

- Node.js 18+
- npm ou yarn
- Git

---

## 🚀 Setup Passo a Passo

### Passo 1: Estrutura de Pastas

```bash
projeto/
├── src/                    # Frontend React
├── backend/               # ✨ NOVO Backend
│   ├── src/
│   │   ├── index.ts       # Servidor principal
│   │   ├── routes/
│   │   │   └── api.routes.ts
│   │   ├── services/
│   │   │   ├── database.service.ts
│   │   │   └── logger.service.ts
│   │   └── middleware/
│   │       └── auth.middleware.ts
│   ├── prisma/
│   │   ├── schema.prisma   # Schema do banco
│   │   └── seed.ts         # Dados iniciais
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
└── package.json            # Frontend
```

### Passo 2: Criar Pasta Backend

```bash
# Na raiz do projeto
mkdir backend
cd backend

# Copie os arquivos necessários:
# - package.json
# - .env.example
# - src/index.ts
# - src/routes/api.routes.ts
# - src/services/database.service.ts
# - prisma/schema.prisma
```

### Passo 3: Instalar Dependências

```bash
cd backend

# Copie para .env
cp .env.example .env

# Instale Prisma primeiro
npm install @prisma/client
npm install -D prisma

# Instale outras dependências
npm install

# Gere cliente Prisma
npx prisma generate
```

### Passo 4: Configurar Banco de Dados

```bash
# Na pasta backend

# Crie diretório de dados
mkdir -p data

# Crie ou resete o banco
npx prisma migrate reset --force

# Seed com dados iniciais
npx prisma db seed
```

### Passo 5: Verificar Setup

```bash
# Abra Prisma Studio (UI do banco)
npx prisma studio

# Deve abrir em http://localhost:5555
# Veja as tabelas e dados criados
```

### Passo 6: Iniciar Backend

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Deve mostrar:
# ✓ Banco de dados conectado
# ✓ Servidor rodando em http://localhost:3001
```

### Passo 7: Iniciar Frontend

```bash
# Terminal 2: Frontend
npm run dev

# Deve mostrar:
# ✓ VITE v5.x.x ready in xxx ms
# ✓ http://localhost:5173
```

---

## 📊 Estrutura do Banco de Dados

### Tabelas Criadas

```
users              # Usuários da aplicação
├── id
├── email (único)
├── name
├── picture
├── role (user, admin, manager)
└── createdAt

tickets            # Chamados
├── id
├── title
├── description
├── category
├── priority
├── status
├── createdById
├── assignedToId
└── createdAt

comments           # Comentários nos tickets
├── id
├── content
├── ticketId
├── authorId
└── createdAt

attachments        # Arquivos anexados
├── id
├── filename
├── ticketId
├── commentId
└── uploadedById

auditLogs         # Log de ações
├── id
├── action
├── entityType
├── entityId
├── userId
└── createdAt

settings          # Configurações da app
├── id
├── key (único)
└── value
```

---

## 🔌 Endpoints da API

### Autenticação
```
POST /api/users/register        # Registrar/Login
GET  /api/users/me              # Dados do usuário logado
```

### Tickets
```
GET    /api/tickets             # Listar tickets (com filtros)
GET    /api/tickets/:id         # Obter ticket específico
POST   /api/tickets             # Criar novo ticket
PUT    /api/tickets/:id         # Atualizar ticket
POST   /api/tickets/:id/close   # Fechar ticket
DELETE /api/tickets/:id         # Deletar ticket
GET    /api/tickets/stats/overview  # Estatísticas
```

### Comentários
```
GET    /api/tickets/:id/comments       # Listar comentários
POST   /api/tickets/:id/comments       # Criar comentário
DELETE /api/comments/:id               # Deletar comentário
```

### Usuários
```
GET    /api/users               # Listar usuários
```

### Auditoria
```
GET    /api/audit/logs          # Ver todos os logs
GET    /api/audit/logs/user/:id # Logs de um usuário
```

---

## 💻 Como Usar no Frontend

### Exemplo: Buscar Tickets

```tsx
import { useTickets } from '../hooks/useDatabase';

export function TicketsPage() {
  const { tickets, loading, error, fetchTickets } = useTickets();

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <div>
      {loading && <p>Carregando...</p>}
      {error && <p>Erro: {error}</p>}
      {tickets.map(ticket => (
        <div key={ticket.id}>{ticket.title}</div>
      ))}
    </div>
  );
}
```

### Exemplo: Criar Ticket

```tsx
const { createTicket } = useTickets();

async function handleCreateTicket() {
  const ticket = await createTicket({
    title: 'Novo problema',
    description: 'Descrição do problema',
    category: 'technical',
    priority: 'high',
    requesterName: 'João',
    requesterEmail: 'joao@grupolgh.com.br',
  });
  
  console.log('Ticket criado:', ticket);
}
```

### Exemplo: Adicionar Comentário

```tsx
import { useComments } from '../hooks/useDatabase';

export function TicketDetail({ ticketId }) {
  const { comments, addComment } = useComments(ticketId);

  async function handleAddComment(content: string) {
    const comment = await addComment(content);
    console.log('Comentário adicionado:', comment);
  }

  return (
    <div>
      {comments.map(c => (
        <div key={c.id}>{c.content}</div>
      ))}
      <button onClick={() => handleAddComment('Novo comentário')}>
        Adicionar
      </button>
    </div>
  );
}
```

---

## 🔒 Segurança

### Implementado
✅ Auditoria de todas as ações  
✅ Validação no backend  
✅ CORS configurado  
✅ Não expõe dados sensíveis  

### Recomendado
⏭️ Adicionar autenticação JWT  
⏭️ Rate limiting  
⏭️ Validação com Joi/Zod  
⏭️ Criptografia de senhas (bcrypt)  

---

## 🧪 Testes da API

### Com curl

```bash
# Health check
curl http://localhost:3001/api/health

# Buscar tickets
curl http://localhost:3001/api/tickets

# Criar ticket
curl -X POST http://localhost:3001/api/tickets \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Problema",
    "description": "Descrição",
    "requesterName": "João",
    "requesterEmail": "joao@grupolgh.com.br"
  }'
```

### Com Postman/Insomnia
1. Importe as rotas do backend
2. Configure variáveis de ambiente
3. Teste cada endpoint

---

## 📁 Estrutura de Arquivos Criados

```
backend/
├── src/
│   ├── index.ts                    # ✨ NOVO
│   ├── routes/
│   │   └── api.routes.ts           # ✨ NOVO
│   ├── services/
│   │   ├── database.service.ts     # ✨ NOVO
│   │   ├── logger.service.ts       # ✨ NOVO
│   │   └── auth.middleware.ts      # ✨ NOVO
│   └── middleware/
│       └── auth.middleware.ts
│
├── prisma/
│   ├── schema.prisma               # ✨ NOVO
│   └── seed.ts                     # ✨ NOVO
│
├── data/
│   └── helpdesk.db                 # ✨ GERADO (SQLite)
│
├── .env.example                    # ✨ NOVO
├── .env                            # ✨ NOVO (criar)
├── package.json                    # ✨ NOVO
├── tsconfig.json                   # ✨ NOVO
└── .gitignore

src/
└── hooks/
    └── useDatabase.ts              # ✨ NOVO (Frontend)
```

---

## 🚨 Troubleshooting

### Erro: "SQLite database file not found"
```bash
# Solução:
mkdir -p data
npx prisma migrate reset --force
```

### Erro: "Port 3001 already in use"
```bash
# Mude a porta em backend/.env
PORT=3002
```

### Erro: "Prisma client not generated"
```bash
# Solução:
cd backend
npx prisma generate
```

### Banco vazio (sem dados)
```bash
# Solução:
npx prisma db seed
```

---

## 📚 Próximas Implementações

### Melhorias Sugeridas
1. **Autenticação JWT**
   - Gerar tokens após login
   - Validar tokens em cada requisição

2. **Upload de Arquivos**
   - Implementar multipart/form-data
   - Salvar em `uploads/`

3. **Notificações**
   - Email quando ticket é criado
   - Email quando ticket é atribuído

4. **Validação**
   - Usar Zod ou Joi
   - Validar dados de entrada

5. **Paginação**
   - Adicionar limit e offset
   - Melhorar performance

6. **Cache**
   - Redis para cache
   - Invalidar ao atualizar

7. **Rate Limiting**
   - express-rate-limit
   - Proteger contra abuso

8. **Logging**
   - Winston para logs
   - Persistir em arquivo

---

## ✅ Checklist Final

- [ ] Pasta `backend/` criada
- [ ] `npm install` no backend executado
- [ ] `.env` configurado
- [ ] Banco criado: `npx prisma migrate reset`
- [ ] Dados seedados: `npx prisma db seed`
- [ ] Backend rodando: `npm run dev`
- [ ] Frontend rodando: `npm run dev`
- [ ] API respondendo: `http://localhost:3001/api/health`
- [ ] Hooks React funcionando
- [ ] Tickets salvos no banco

---

## 🎉 Conclusão

Você agora tem:

✅ Backend completo com Express  
✅ Banco de dados SQLite  
✅ ORM Prisma  
✅ API RESTful  
✅ Persistência de dados  
✅ Hooks React integrados  
✅ Auditoria  

**Próximo passo:** Integrar autenticação Google com o backend!