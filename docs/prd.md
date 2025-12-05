# 📌 PRD – Scrum Poker SaaS

## 1. Visão Geral

### 1.1 Objetivo do Produto

Criar uma aplicação **Scrum Poker** simples, rápida e colaborativa, evoluindo para um **SaaS monetizável**, com controle de usuários, times, planos e permissões.

### 1.2 Público-Alvo

- Times ágeis (Scrum/Kanban)
- Desenvolvedores
- Product Managers
- Agile Coaches
- Consultorias ágeis

### 1.3 Problema a Resolver

- Estimativas manuais e pouco estruturadas
- Ferramentas complexas ou caras
- Falta de histórico de estimativas
- Dificuldade de colaboração remota

---

## 2. Escopo Geral

### Etapa 1 – Produto (Scrum Poker)

Foco em **experiência de estimativa em tempo real**.

### Etapa 2 – SaaS

Foco em **monetização, escalabilidade e gestão de usuários**.

---

# 🟢 ETAPA 1 – SCRUM POKER (PRODUTO)

## 3. Funcionalidades Core

### 3.1 Criação de Sala

- Criar sala com nome
- Escolher tipo de escala:
  - Fibonacci
  - T-shirt (P, M, G)
  - Sequência customizada
- Sala pública ou privada (link)

### 3.2 Entrada na Sala

- Nome do participante
- Avatar gerado automaticamente
- Sem necessidade de login (modo convidado)

### 3.3 Rodada de Votação

- Seleção de carta
- Voto oculto até todos votarem
- Indicação visual de usuários que já votaram
- Reveal simultâneo

### 3.4 Resultado

- Cálculo automático:
  - Média
  - Mediana
  - Maior e menor valor
- Destaque de divergências
- Carta final escolhida pelo facilitador

### 3.5 Reset de Rodada

- Nova rodada mantendo participantes
- Limpar votos anteriores

### 3.6 Chat da Sala (Opcional)

- Chat simples em realtime
- Histórico apenas da sessão atual

---

## 4. Requisitos Funcionais

- Atualização em tempo real
- UX simples (máx. 2 cliques para votar)
- Mobile-first
- Funcionar sem login

---

## 5. Requisitos Não Funcionais

- Latência < 300ms
- Escalável (salas temporárias)
- Tolerante a desconexões
- Acessibilidade (teclado e leitores)

---

## 6. Stack Técnica – Etapa 1

### Frontend

- Next.js (App Router)
- TailwindCSS
- Headless UI
- Zustand ou Context API

### Backend / Infra

- Firebase
  - Firestore
  - Realtime listeners
  - Firebase Auth (futuro)
- Firebase Hosting ou Vercel

### Estrutura de Dados (exemplo)

```json
rooms {
  id
  name
  scale
  status
  createdAt
}

votes {
  roomId
  userId
  value
}
```

---

# 🔵 ETAPA 2 – SAAS (USUÁRIOS, PLANOS E PERMISSÕES)

## 7. Funcionalidades SaaS

### 7.1 Autenticação

- Email e senha
- Login social (Google, GitHub)
- Firebase Auth

### 7.2 Usuários

- Perfil do usuário:
  - Nome
  - Avatar
  - Plano ativo
- Histórico de sessões

### 7.3 Times

- Criar e gerenciar times
- Convite por link ou email
- Papéis:
  - Admin
  - Facilitador
  - Membro

### 7.4 Salas Persistentes

- Reutilizar salas
- Histórico de rodadas
- Exportação (CSV/JSON)

---

## 8. Planos e Monetização

### Free

- 1 time
- Até 5 participantes por sala
- Sem histórico
- Salas temporárias

### Pro – R$ 19/mês

- Times ilimitados
- Até 20 participantes
- Histórico de estimativas
- Salas persistentes
- Exportação de dados

### Business – R$ 49/mês

- Participantes ilimitados
- Multi-times
- Permissões avançadas
- Branding customizado
- Suporte prioritário

---

## 9. Controle de Permissões

| Funcionalidade     | Free | Pro | Business |
| ------------------ | ---- | --- | -------- |
| Criar time         | ❌   | ✅  | ✅       |
| Histórico          | ❌   | ✅  | ✅       |
| Escala customizada | ❌   | ✅  | ✅       |
| Branding           | ❌   | ❌  | ✅       |

---

## 10. Regras de Acesso

- Middleware no Next.js
- Feature flags por plano
- Firestore Security Rules

---

## 11. Pagamentos

### Stack

- Stripe
- Webhooks para:
  - Criação de assinatura
  - Cancelamento
  - Upgrade/Downgrade

### Estrutura de Dados

```json
subscriptions {
  userId
  plan
  status
  expiresAt
}
```

---

## 12. Métricas de Sucesso

- Salas criadas/dia
- Tempo médio por estimativa
- Conversão Free → Pro
- Retenção 7d / 30d

---

## 13. Roadmap

### Sprint 1

- Criação de salas
- Votação
- Reveal

### Sprint 2

- UX Mobile
- Escalas customizadas
- Otimização realtime

### Sprint 3

- Auth
- Times
- Histórico

### Sprint 4

- Pagamentos
- Planos
- Permissões

---

## 14. Riscos

- Custo de Firebase em realtime
- Uso abusivo do plano free
- Concorrência de salas grandes
- Complexidade de regras de acesso

---

## 15. Próximos Passos

- Wireframes
- Modelagem final do Firestore
- Regras de segurança
- MVP validável em 2–3 semanas
