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

## GraphQL API

A API GraphQL está disponível na pasta `graphql/`.

### Como rodar a API GraphQL

1. Instale as dependências necessárias:

   ```sh
   npm install @apollo/server express@5.1.0 graphql graphql-tag cors jsonwebtoken dotenv body-parser
   ```

2. Execute o servidor GraphQL:

   ```sh
   node graphql/server.js
   ```

3. Acesse o playground em: [http://localhost:4000/graphql](http://localhost:4000/graphql)

### Exemplos de Queries e Mutations

#### Login
```graphql
query {
  login(username: "Giuliana", password: "qwerty123") {
    username
    lastname
    token
  }
}
```

#### Registro de Usuário
```graphql
mutation {
  registerUser(username: "Giuliana", lastname: "Miglioli", password: "qwerty123") {
    username
    lastname
  }
}
```

#### Mutation protegida (exemplo)
```graphql
mutation {
  transferSomething(data: "...")
}
```

Para mutations protegidas, envie o header:

```
Authorization: Bearer <token>
```

> O token é obtido via mutation/login.

## Exemplos de Queries e Mutations para Receitas e Listas de Compras

### Listar todas as receitas
```graphql
query {
  recipes {
    id
    nome
    ingredientes
    Preparo
    userId
  }
}
```

### Buscar uma receita por ID
```graphql
query {
  recipe(id: "1") {
    id
    nome
    ingredientes
    Preparo
    userId
  }
}
```

### Buscar ingredientes de uma receita
```graphql
query {
  recipeIngredients(id: "1")
}
```

### Criar uma nova receita (autenticado)
```graphql
mutation {
  createRecipe(
    nome: "Bolo de cenoura"
    ingredientes: ["3 ovos", "2 xícaras de açúcar", "2 xícaras de farinha de trigo", "1 cenoura grande ralada", "1 colher de sopa de fermento em pó"]
    Preparo: "Bata no liquidificador os ovos, o açúcar e a cenoura. Despeje em uma tigela e adicione a farinha e o fermento. Misture bem e leve ao forno preaquecido a 180°C por cerca de 40 minutos."
  ) {
    id
    nome
    ingredientes
    Preparo
    userId
  }
}
```

### Editar uma receita (autenticado, apenas dono)
```graphql
mutation {
  updateRecipe(
    id: "1"
    nome: "Bolo de cenoura atualizado"
    ingredientes: ["3 ovos", "2 xícaras de açúcar"]
    Preparo: "Novo modo de preparo."
  ) {
    id
    nome
    ingredientes
    Preparo
    userId
  }
}
```

### Remover uma receita (autenticado, apenas dono)
```graphql
mutation {
  deleteRecipe(id: "1")
}
```

### Gerar lista de compras a partir de receitas (autenticado)
```graphql
mutation {
  generateShoppingList(recipeIds: ["1", "2"]) {
    id
    userId
    ingredients
  }
}
```

> Para mutations protegidas, envie o header:
>
> ```
> Authorization: Bearer <token>
> ```

# Teste de Performance com ferramenta K6
Esta seção detalha os pilares técnicos utilizados para a construção dos testes de performance neste projeto, utilizando o K6. Essa seção foi criada par avaliação, bem como revisar os conceitos e mostrar onde eles foram aplicados

## Thresholds
## Checks
## Helpers
## Trends
## Faker
## Variável de Ambiente
## Stages
## Reaproveitamento de Resposta
## Uso de Token de Autenticação
## Data-Driven Testing
## Groups
---

Para dúvidas, consulte a documentação Swagger ou o código-fonte.
