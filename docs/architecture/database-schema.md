# Database Schema - Cloud Firestore

Este documento descreve a modelagem NoSQL do banco de dados Firestore para o Scrum Poker SaaS.

## Estrutura de Coleções

### `rooms` (Coleção Raiz)

Armazena as sessões de Scrum Poker.

| Campo         | Tipo        | Descrição                                        |
| :------------ | :---------- | :----------------------------------------------- |
| `id`          | `string`    | UUID ou Auto-generated ID                        |
| `name`        | `string`    | Nome da sala                                     |
| `ownerId`     | `string`    | ID do criador (pode ser anônimo ou authId)       |
| `scaleType`   | `string`    | Tipo de escala (`FIBONACCI`, `TSHIRT`, `CUSTOM`) |
| `customScale` | `array`     | Array de strings (se scaleType for `CUSTOM`)     |
| `status`      | `string`    | `VOTING`, `REVEALED`, `FINISHED`                 |
| `createdAt`   | `timestamp` | Data de criação                                  |
| `updatedAt`   | `timestamp` | Data de atualização                              |
| `teamId`      | `string`    | (Opcional) ID do time vinculado (SaaS)           |

### `rooms/{roomId}/votes` (Sub-coleção)

Armazena os votos de cada participante em uma sala específica.

| Campo        | Tipo        | Descrição                        |
| :----------- | :---------- | :------------------------------- |
| `userId`     | `string`    | ID do usuário (Document ID)      |
| `userName`   | `string`    | Nome de exibição                 |
| `userAvatar` | `string`    | URL do avatar                    |
| `value`      | `string`    | Valor da carta escolhida         |
| `spectator`  | `boolean`   | Se o usuário é apenas observador |
| `votedAt`    | `timestamp` | Momento do voto                  |

---

## SaaS (Etapa 2)

### `users` (Coleção Raiz)

Perfil dos usuários cadastrados.

| Campo              | Tipo     | Descrição                 |
| :----------------- | :------- | :------------------------ |
| `uid`              | `string` | Firebase Auth UID         |
| `email`            | `string` | Email do usuário          |
| `displayName`      | `string` | Nome                      |
| `photoURL`         | `string` | Avatar                    |
| `stripeCustomerId` | `string` | ID do cliente no Stripe   |
| `plan`             | `string` | `FREE`, `PRO`, `BUSINESS` |

### `teams` (Coleção Raiz)

Grupos de usuários para planos pagos.

| Campo     | Tipo     | Descrição                                            |
| :-------- | :------- | :--------------------------------------------------- |
| `id`      | `string` | ID do time                                           |
| `name`    | `string` | Nome do time                                         |
| `ownerId` | `string` | ID do admin do time                                  |
| `members` | `map`    | Mapa de `{ userId: role }` (e.g., `admin`, `member`) |
| `plan`    | `string` | Plano associado ao time (herdado do owner)           |

### `subscriptions` (Coleção Raiz - Opcional / Stripe Sync)

Dados de faturamento sincronizados via Webhook.

| Campo              | Tipo        | Descrição                                    |
| :----------------- | :---------- | :------------------------------------------- |
| `userId`           | `string`    | ID do usuário dono da assinatura             |
| `status`           | `string`    | `active`, `trialing`, `past_due`, `canceled` |
| `currentPeriodEnd` | `timestamp` | Data de expiração                            |
| `tier`             | `string`    | Identificador do plano                       |

## Índices Necessários

- `rooms`: `createdAt` DESC (Para queries de histórico recente - se aplicável).
- `rooms`: `ownerId` (Para listar salas de um usuário).
- `teams`: `members.{userId}` (Para listar times que um usuário participa).
