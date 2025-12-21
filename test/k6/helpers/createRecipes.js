import http from 'k6/http';
import { SharedArray } from 'k6/data';

// Carrega receitas de um arquivo JSON para data-driven testing
export const recipesData = new SharedArray('recipes_data', function () {
  try {
    const text = open(__ENV.RECIPES_FILE || '../data/recipes.test.data.json');
    const json = JSON.parse(text);
    if (!Array.isArray(json)) {
      throw new Error('recipes.test.data.json must be an array');
    }
    return json;
  } catch (e) {
    console.error(`Failed to load recipes data: ${e.message}`);
    return [];
  }
});

export function generateRandomRecipe() {
  const adjectives = ['Deliciosa', 'Saborosa', 'Crocrante', 'Apimentada', 'Suave'];
  const foods = ['Massa', 'Sopa', 'Salada', 'Sanduíche', 'Torta', 'Curry'];
  const nome = `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${foods[Math.floor(Math.random() * foods.length)]}`;

  const ingredientesBase = ['Tomate', 'Cebola', 'Alho', 'Azeite', 'Sal', 'Pimenta', 'Frango', 'Carne', 'Queijo', 'Leite'];
  const ingredientes = Array.from({ length: 4 + Math.floor(Math.random() * 4) }, () => {
    return ingredientesBase[Math.floor(Math.random() * ingredientesBase.length)];
  });

  const steps = [
    'Pique os ingredientes',
    'Refogue no azeite',
    'Adicione sal e pimenta',
    'Cozinhe por 20 minutos',
    'Sirva quente'
  ];
  const Preparo = steps.sort(() => 0.5 - Math.random()).slice(0, 3).join('. ') + '.';

  return { nome, ingredientes, Preparo };
}

export function createRecipe(baseUrl, token, recipe) {
  const url = `${baseUrl}/api/recipes`;
  const payload = JSON.stringify(recipe);
  const params = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };
  return http.post(url, payload, params);
}
