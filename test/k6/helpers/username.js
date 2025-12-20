import faker from "k6/x/faker";

//The original function used before integrating faker library uses math functions to generate unique usernames
//This new function uses faker to generate more realistic usernames with a rand to assure no name repeats

export function generateUniqueUsername() {
  const name = faker.person.firstName(); 
  const rand = Math.random().toString(36).slice(2, 8); 
  return `${name}_${rand}`;
}

/* function used before integrating faker library
export function generateUniqueUsername() {
  const ts = Date.now();
  const rand = Math.random().toString(36).slice(2, 8);
  return `user_${ts}_${rand}`;
} */