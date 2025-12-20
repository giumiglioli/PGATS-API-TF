import http from 'k6/http';

export function register(baseUrl, { username, lastname, password }) {
  const url = `${baseUrl}/api/users/register`;
  const payload = JSON.stringify({ username, lastname, password });
  const params = {
    headers: { 'Content-Type': 'application/json' },
  };
  return http.post(url, payload, params);
}
