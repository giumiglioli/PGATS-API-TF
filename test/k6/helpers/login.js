import http from 'k6/http';

export function login(baseUrl, { username, password }) {
  const url = `${baseUrl}/api/users/login`;
  const payload = JSON.stringify({ username, password });
  const params = {
    headers: { 'Content-Type': 'application/json' },
  };
  return http.post(url, payload, params);
}
