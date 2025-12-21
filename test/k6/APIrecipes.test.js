import http from 'k6/http';
import { check, group } from 'k6';
import { getBaseURL } from './helpers/getBaseURL.js';
import { register } from './helpers/register.js';
import { login } from './helpers/login.js';
import { createRecipe, generateRandomRecipe,recipesData } from './helpers/createRecipes.js';
import { generateUniqueUsername } from './helpers/username.js';
import faker from "k6/x/faker";
import {Trend } from 'k6/metrics';

//Trends for measuring durations of each operation
export const loginTrend = new Trend('login_duration');
export const registerTrend = new Trend('register_duration');
export const createRecipeTrend = new Trend('create_recipe_duration');   

export const options = {
  vus: 10,
  duration: '5s',
  thresholds: {
    http_req_duration: [
      'p(90)<8000',
      'p(95)<10000'
    ]
  },
  /*stages: [
    { duration: '3s', target: 5 }, //Ramp Up
    { duration: '15s', target: 10 }, //Average
    { duration: '2s', target: 40 }, //Spike
    { duration: '10s', target: 10 }, //Average
    { duration: '3s', target: 0 }, //Ramp Down
  ], */
};

export default function () {
  const baseUrl = getBaseURL();

  const username = generateUniqueUsername(); //username generation using helper function that uses faker
  const password = faker.internet.password(); //password generation using faker
  const lastname = faker.person.lastName(); //lastname generation using faker
//console.log(`User credentials: ${username} / ${password} / ${lastname}`);

  group('register', () => {
    const res = register(baseUrl, { username, lastname, password });
    check(res, {
      'register status is 201': (r) => r.status === 201,
      //'register status is 201 or 409': (r) => r.status === 201 || r.status === 409, //in case of re-running test with same username
    });
    registerTrend.add(res.timings.duration);
  });

  let token = '';
  group('login', () => {
    const res = login(baseUrl, { username, password });
    check(res, {
      'login status is 200': (r) => r.status === 200,
      'login has token': (r) => r.json('token') && typeof r.json('token') === 'string',
    });
    token = res.json('token');
    loginTrend.add(res.timings.duration);
  });


// Data-driven: try to create recipes from the dataset. If the dataset is empty it uses the generateRandomRecipe function
group('createRecipe-data-driven', () => {
    // Garantir que recipesData é um array antes de usar length
    const dataset = Array.isArray(recipesData) && recipesData.length > 0
      ? recipesData
      : [generateRandomRecipe()];

    for (let i = 0; i < dataset.length; i++) {
      const recipe = dataset[i];

      // Schema validation before send 
      const hasPreparo =
        typeof recipe.Preparo === 'string' || typeof recipe.preparo === 'string';

      const isValid =
        recipe &&
        typeof recipe.nome === 'string' &&
        Array.isArray(recipe.ingredientes) &&
        hasPreparo;

      if (!isValid) {
        console.warn(`Skipping invalid recipe at index ${i}`);
        continue;
      }

      const res = createRecipe(baseUrl, token, recipe);
      check(res, {
        'create recipe status is 201': (r) => r.status === 201,
      });
      createRecipeTrend.add(res.timings.duration);
    }
  });

  /* Create Recipe without data-driven approach
  group('createRecipe', () => {
    const recipe = generateRandomRecipe();
    const res = createRecipe(baseUrl, token, recipe);
    check(res, {
      'create recipe status is 201': (r) => r.status === 201,
    });
    createRecipeTrend.add(res.timings.duration);
  }); */
}
