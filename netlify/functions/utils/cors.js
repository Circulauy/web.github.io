const ALLOWED_ORIGINS = [
  'https://circula.uy',
  'https://www.circula.uy',
  'https://crea.circula.uy',
  'https://appescuelas.circula.uy',
  'http://localhost:8888',
  'http://localhost:3000'
];

function getAllowedOrigin(event) {
  const origin = event.headers.origin || event.headers.Origin || '';
  if (ALLOWED_ORIGINS.includes(origin)) {
      return origin;
  }
  return 'https://circula.uy'; // Default fallback
}

function getCorsHeaders(event) {
  return {
    "Access-Control-Allow-Origin": getAllowedOrigin(event),
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, DELETE"
  };
}

module.exports = { getCorsHeaders, getAllowedOrigin, ALLOWED_ORIGINS };
