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

- `POST /api/users/register` — Registro de usuário
- `POST /api/users/login` — Login de usuário
- `GET /api/recipes` — Listar receitas (público)
- `GET /api/recipes/:id` — Detalhar receita (público)
- `GET /api/recipes/:id/ingredients` — Listar ingredientes (público)
- `POST /api/recipes` — Criar receita (autenticado)
- `PUT /api/recipes/:id` — Editar receita (autenticado, apenas dono)
- `DELETE /api/recipes/:id` — Remover receita (autenticado, apenas dono)
- `POST /api/shopping-lists` — Gerar lista de compras (autenticado)

## Autenticação

Após o login, utilize o token retornado no header `Authorization` para acessar rotas protegidas.

## Observações
- Não é possível registrar usuários duplicados.
- Apenas usuários autenticados podem criar, editar ou remover receitas.
- Consultar receitas e ingredientes é público.
- Listas de compras só podem ser geradas por usuários autenticados.
- Todos os dados são voláteis (em memória).

## Testes

Para testar com Supertest, importe o `app.js` diretamente.

---

Para dúvidas, consulte a documentação Swagger ou o código-fonte.
