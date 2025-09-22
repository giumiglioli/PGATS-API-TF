# API de Receitas e Listas de Compras

Esta API permite registro e login de usuários, administração de receitas e geração de listas de supermercado baseadas em receitas. O armazenamento é feito em memória, ideal para aprendizado de testes e automação de APIs.

## Instalação

```bash
npm install
```

## Execução

```bash
npm start
```

O servidor será iniciado em `http://localhost:3000`.

## Documentação Swagger

Acesse a documentação interativa em: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

## Endpoints principais

### Usuários
- `POST /api/users/register` — Registro de usuário
- `POST /api/users/login` — Login de usuário

### Receitas
- `GET /api/recipes` — Listar todas as receitas (público)
- `GET /api/recipes/:id` — Detalhar uma receita específica (público)
- `GET /api/recipes/:id/ingredients` — Listar ingredientes de uma receita (público)
- `POST /api/recipes` — Criar nova receita (autenticado)
- `PUT /api/recipes/:id` — Editar receita (autenticado, apenas dono)
- `DELETE /api/recipes/:id` — Remover receita (autenticado, apenas dono)

### Listas de Compras
- `POST /api/shopping-lists` — Gerar lista de compras a partir de receitas (autenticado)
- `GET /api/shopping-lists` — Listar listas de compras do usuário autenticado
- `GET /api/shopping-lists/:id` — Detalhar uma lista de compras específica
- `DELETE /api/shopping-lists/:id` — Remover uma lista de compras

## Autenticação

Após o login, utilize o token retornado no header `Authorization` (formato: `Bearer <token>`) para acessar rotas protegidas.

## Observações
- Não é possível registrar usuários duplicados.
- Apenas usuários autenticados podem criar, editar ou remover receitas.
- Consultar receitas e ingredientes é público.
- Listas de compras só podem ser geradas e consultadas por usuários autenticados.
- Todos os dados são voláteis (em memória).

## Testes

Para testar com Supertest, importe o `app.js` diretamente.

---

Para dúvidas, consulte a documentação Swagger ou o código-fonte.
