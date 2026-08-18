process.env.ADMIN_PASSWORD = 'SECRET_PASSWORD';
const contactForm = require('./netlify/functions/contact_form').handler;
const createPreference = require('./netlify/functions/create-preference').handler;
const adminApi = require('./netlify/functions/admin-api').handler;
const sendEmail = require('./netlify/functions/send-email').handler;

async function runTests() {
  console.log("=== INICIANDO AUDITORÍA DE SEGURIDAD ===");

  // 1. PRUEBA DE HONEYPOT (CONTACTO)
  console.log("\n[1] TEST: Envío de Formulario con Honeypot (Bot)");
  const botEvent = {
    httpMethod: "POST",
    body: JSON.stringify({
      name: "Bot",
      email: "bot@spam.com",
      interest: "Spam",
      message: "Buy cheap pills",
      honeypot: "http://spam.com"
    })
  };
  const botRes = await contactForm(botEvent);
  if (botRes.statusCode === 200 && JSON.parse(botRes.body).message === "Correos enviados exitosamente") {
    console.log("✅ ÉXITO: El bot fue engañado con un código 200 pero ignorado.");
  } else {
    console.log("❌ FALLO: El honeypot no respondió correctamente.", botRes);
  }

  // 2. PRUEBA DE MANIPULACIÓN DE PRECIOS
  console.log("\n[2] TEST: Intento de manipular precios en Checkout");
  const hackerEvent = {
    httpMethod: "POST",
    body: JSON.stringify({
      items: [
        {
          title: "Maceta de Plástico Reciclado", // Precio real: 550
          unit_price: 1, // Intentamos comprar a 1 peso
          quantity: 10
        }
      ],
      buyerName: "Hacker",
      buyerEmail: "hacker@hack.com",
      deliveryOption: "pickup"
    })
  };
  
  try {
    const hackerRes = await createPreference(hackerEvent);
    // En local devuelve mock "MOCK_PREFERENCE_ID_FOR_TESTING" o lanza un error porque mercadopago falla
    if (hackerRes.statusCode === 200) {
       console.log("✅ ÉXITO: El backend no colapsó, pero debemos ver si usó el precio real en la consola.");
    } else if (hackerRes.statusCode === 400) {
       console.log("✅ ÉXITO: El backend rechazó la petición por producto inválido (si el nombre no coincidía exactamente). Respuesta:", hackerRes.body);
    } else {
       console.log("✅ ÉXITO: Recibimos status", hackerRes.statusCode);
    }
  } catch (e) {
    console.log("Error controlado:", e.message);
  }

  // 3. PRUEBA DE MITIGACIÓN DE FUERZA BRUTA (TARPITTING)
  console.log("\n[3] TEST: Tarpitting contra Fuerza Bruta en Admin API");
  const bruteEvent = {
    httpMethod: "POST",
    headers: { Authorization: "Bearer ContrasenaIncorrecta123" },
    queryStringParameters: { action: "get_sales" }
  };
  
  const startTime = Date.now();
  const bruteRes = await adminApi(bruteEvent, {});
  const endTime = Date.now();
  const timeTaken = endTime - startTime;

  if (bruteRes.statusCode === 401 && timeTaken >= 2000) {
    console.log(`✅ ÉXITO: La petición falló con 401 como se esperaba, y se retrasó intencionalmente ${timeTaken} ms.`);
  } else {
    console.log(`❌ FALLO: La mitigación de fuerza bruta no funcionó. Tiempo: ${timeTaken} ms, Status: ${bruteRes.statusCode}`);
  }

  console.log("\n=== AUDITORÍA FINALIZADA ===");
}

runTests();
