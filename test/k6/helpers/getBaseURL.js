export function getBaseURL() {
  const base = __ENV.BASE_URL || 'http://localhost:3000';
  return base.endsWith('/') ? base.slice(0, -1) : base;
}
