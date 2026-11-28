# Mercearia PDV API

API REST desenvolvida em NestJS com TypeORM e PostgreSQL para gerenciamento de um Ponto de Venda (Clientes, Produtos e Vendas).

## Como executar o projeto

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar variáveis de ambiente
Copie o arquivo `.env.example` para `.env`:
```bash
cp .env.example .env
```

### 3. Subir o banco de dados (PostgreSQL via Docker)
```bash
docker compose up -d
```

### 4. Popular o banco de dados (Seed)
```bash
npx ts-node src/seed.ts
```

### 5. Iniciar a API
```bash
npm run start:dev
```

## Rotas

- **Clientes:** `GET /clientes`, `GET /clientes/:id`, `POST /clientes`, `PATCH /clientes/:id`, `DELETE /clientes/:id`
- **Produtos:** `GET /produtos`, `GET /produtos/:id`, `POST /produtos`, `PATCH /produtos/:id`, `DELETE /produtos/:id`
- **Vendas:** `GET /vendas`, `GET /vendas/:id`, `POST /vendas`, `PATCH /vendas/:id/cancelar`, `DELETE /vendas/:id`
