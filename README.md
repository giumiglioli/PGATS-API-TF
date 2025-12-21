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
Esta seção detalha os pilares técnicos utilizados para a construção dos testes de performance neste projeto, utilizando o K6. Essa seção foi criada para avaliação, bem como revisar os conceitos e descrever onde eles foram aplicados.
O Report está anexado nesse repositório com o nome de APIrecipes-report.html

Workflow automatizado:
1. Criação (Register) de usuário  
2. Login do usuário registrado  
3. Criação de uma receita (somente com o usuário registrado)

A seguir cada conceito será explicado e um exemplo será mostrado para melhor compreensão da solução criada.

## Thresholds
Definem metas de desempenho; o teste falha se não forem atingidas. No código abaixo, as metas foram estabelecidas para os percentis de 90 e 95

### Exemplo de código
```javascript
// filepath: test/k6/APIrecipes.test.js
export const options = {
  thresholds: {
    http_req_duration: ['p(90)<8000', 'p(95)<10000'],
  },
  stages: [
    { duration: '3s', target: 5 },
    { duration: '15s', target: 10 },
    { duration: '2s', target: 40 },
    { duration: '10s', target: 10 },
    { duration: '3s', target: 0 },
  ],
};
```
## Checks  
Valida condições nas respostas HTTP.Asserções booleanas que verificam condições específicas da resposta (status, corpo, headers) sem interromper a execução em caso de falha.
No código abaixo verifica o status 200, caso o usuário consiga efetuar o login e armazena o token.

### Exemplo de código
```javascript
// filepath: test/k6/APIrecipes.test.js
group('login', () => {
  const res = login(baseUrl, { username, password });
  check(res, {
    'login status is 200': (r) => r.status === 200,
    'login has token': (r) => r.json('token') && typeof r.json('token') === 'string',
  });
});
```

## Helpers  
Módulos ou funções utilitárias que encapsulam lógica repetitiva, mantendo o script principal limpo e modular. No código abaixo, a função createRecipes.js é usada para criação de receitas usando o endpoint e forncendo resultado ao APIrecipes.test.js o resultado para o check (se a receita foi criada ou não)

### Exemplo de código
```javascript
// filepath: test/k6/helpers/createRecipes.js
export function createRecipe(baseUrl, token, recipe) {
  const url = `${baseUrl}/api/recipes`;
  const payload = JSON.stringify(recipe);
  return http.post(url, payload, {
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
  });
}
```
## Trends  
Métricas customizadas que permitem acompanhar a evolução de valores numéricos ao longo do tempo. No código abaixo 3 métricas foram setadas: Tempo de duração de registro, login e cadastro de receita.

### Exemplo de código
```javascript
// filepath: test/k6/APIrecipes.test.js
import { Trend } from 'k6/metrics';
export const loginTrend = new Trend('login_duration');
export const registerTrend = new Trend('register_duration');
export const createRecipeTrend = new Trend('create_recipe_duration');

group('login', () => {
  const res = login(baseUrl, { username, password });
  loginTrend.add(res.timings.duration);
});

...
```

## Faker  
Biblioteca (ou módulo externo) utilizada para gerar dados aleatórios e realistas para os testes, como nomes, e-mails e senhas. No código abaixo, é usado a Biblioteca faker para criar password e lastName. Em uma função separada, mas que também usa faker é gerado o nome de usuário unico.

### Exemplo de código
```javascript
// filepath: test/k6/APIrecipes.test.js
import faker from 'k6/x/faker';
const username = generateUniqueUsername();
const password = faker.internet.password();
const lastname = faker.person.lastName();
```

## Variável de Ambiente
Permitem parametrizar o teste (URL, ambiente, usuários) sem alterar o código-fonte, facilitando a execução em diferentes contextos. No K6, variáveis são acessadas via `__ENV`. No código abaixo foi definida a URL base da API como `BASE_URL`.

### Exemplo de código
```javascript
// filepath: test/k6/helpers/getBaseURL.js
export function getBaseURL() {
  // Usa BASE_URL se definida; caso contrário, fallback para localhost
  return __ENV.BASE_URL || 'http://localhost:3000';
}
```

```javascript
// filepath: test/k6/APIrecipes.test.js
export default function () {
  const baseUrl = getBaseURL(); // obtém BASE_URL de __ENV
  // ...existing code...
}
```

## Stages
Definem o perfil de carga do teste através de "degraus" de usuários virtuais. Controla ramp-up, pico e ramp-down de usuários virtuais. No código abaixo é mostrado alguns stages setado e o objetivo de teste de cada um.

### Exemplo de código
```javascript
// filepath: test/k6/APIrecipes.test.js
export const options = {
  stages: [
    { duration: '3s', target: 5 },   // Ramp Up
    { duration: '15s', target: 10 }, // Steady
    { duration: '2s', target: 40 },  // Spike
    { duration: '10s', target: 10 }, // Back to normal
    { duration: '3s', target: 0 },   // Ramp Down
  ],
};
```


## Reaproveitamento de Resposta
Técnica de extrair dados da resposta de uma requisição para utilizá-los em requisições subsequentes dentro do mesmo VU (ex: token). No código abaixo é usado o token obtido ao logar o usuário e será salvo para ser usado mais tarde para criar a receita pelo usuário.

### Exemplo de código
```javascript
// filepath: test/k6/APIrecipes.test.js
let token = '';
group('login', () => {
  const res = login(baseUrl, { username, password });
  token = res.json('token'); // reutilizado no createRecipe
});
```


## Uso de Token de Autenticação
Manipulação de headers para incluir tokens (JWT, Bearer) capturados no login em todas as requisições para rotas protegidas.
No código abaixo, inclui o token no header Authorization para endpoints protegidos (criação de receita).

### Exemplo de código
```javascript
// filepath: test/k6/helpers/createRecipes.js
return http.post(url, payload, {
  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
});
```

## Data-Driven Testing
Técnica que utiliza fontes de dados externas (JSON, CSV) para alimentar o teste com múltiplos cenários e inputs reais. No código abaixo é usado para gerar a receita a ser cadastrada pelo usuário. De forma geral, o código checa se o dataset é válido e caso positivo ele usa o json criado para a criação de receita, caso negativo, ele usa uma função de geração randômica que não usa o data-driven. 

### Exemplo de código
```javascript
// filepath: test/k6/APIrecipes.test.js
group('createRecipe-data-driven', () => {
  const dataset = Array.isArray(recipesData) && recipesData.length > 0
    ? recipesData
    : [generateRandomRecipe()];

  for (let i = 0; i < dataset.length; i++) {
    const recipe = dataset[i];
    const hasPreparo = typeof recipe.Preparo === 'string' || typeof recipe.preparo === 'string';
    const isValid = recipe && typeof recipe.nome === 'string' && Array.isArray(recipe.ingredientes) && hasPreparo;

    if (!isValid) { console.warn(`Skipping invalid recipe at index ${i}`); continue; }

    const res = createRecipe(baseUrl, token, recipe);
    check(res, { 'create recipe status is 201': (r) => r.status === 201 });
    createRecipeTrend.add(res.timings.duration);
  }
});
```

## Groups
Organização do script em partes, cada uma cobrindo o uso de um endpoint. Dessa forma permite segmentar as métricas e facilitar a leitura. 

O código abaixo está armazenado no arquivo test/k6/APIrecipes.test.js e demontra o uso do conceito de Groups, onde foi separado cada passo do workflow.  Dentro dele faço uso de um Helper, uma função de login, que foi importada de um outro script javascript.

### Exemplo de código
```javascript
// filepath: test/k6/APIrecipes.test.js
group('register', () => {
  const res = register(baseUrl, { username, lastname, password });
  check(res, { 'register status is 201': (r) => r.status === 201 });
  registerTrend.add(res.timings.duration);
});
```
---

Para dúvidas, consulte a documentação Swagger ou o código-fonte.
