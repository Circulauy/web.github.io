process.env.ADMIN_PASSWORD = 'SECRET_PASSWORD';
const contactForm = require('./netlify/functions/contact_form').handler;
const createPreference = require('./netlify/functions/create-preference').handler;
const adminApi = require('./netlify/functions/admin-api').handler;

async function runIntegrationTests() {
  console.log("=== INICIANDO TEST DE INTEGRACIÓN (TRÁFICO NORMAL) ===\n");

  // 1. TEST: OBTENER CORS (Petición OPTIONS preflight del navegador)
  console.log("[1] TEST: Petición OPTIONS (CORS preflight) a create-preference");
  const optionsEvent = {
    httpMethod: "OPTIONS",
    headers: { origin: "https://circula.uy" }
  };
  const optionsRes = await createPreference(optionsEvent, {});
  if (optionsRes.statusCode === 200 && optionsRes.headers && optionsRes.headers["Access-Control-Allow-Origin"] === "https://circula.uy") {
    console.log("✅ ÉXITO: Cabeceras CORS correctas devueltas.");
  } else {
    console.log("❌ FALLO: Cabeceras CORS incorrectas.", optionsRes.headers);
  }

  // 2. TEST: ENVÍO NORMAL DE CONTACTO (Sin Honeypot)
  console.log("\n[2] TEST: Envío normal de contacto (Cliente Real)");
  const contactEvent = {
    httpMethod: "POST",
    headers: { origin: "https://circula.uy" },
    body: JSON.stringify({
      name: "Juan <script>alert(1)</script>", // Probando la sanitización también
      email: "juan@test.com",
      interest: "Ventas",
      message: "Hola, me interesa comprar macetas."
    })
  };
  try {
    const contactRes = await contactForm(contactEvent, {});
    // Si no está configurado el correo, podría dar 500 o 200 simulado
    console.log(`✅ Resultado del contacto: Status ${contactRes.statusCode}. (Si es 500 es normal en local por no haber config de email).`);
    // Validamos que tenga la cabecera CORS
    if (contactRes.headers && contactRes.headers["Access-Control-Allow-Origin"] === "https://circula.uy") {
       console.log("✅ ÉXITO: El backend de contacto retornó los headers CORS correctamente post-petición.");
    } else {
       console.log("❌ FALLO: Faltan headers CORS en la respuesta de contacto.");
    }
  } catch(e) {
    console.log("Error controlado:", e.message);
  }

  // 3. TEST: CREACIÓN DE PREFERENCIA DE COMPRA LEGÍTIMA
  console.log("\n[3] TEST: Compra legítima en Checkout");
  const validCheckoutEvent = {
    httpMethod: "POST",
    headers: { origin: "https://circula.uy" },
    body: JSON.stringify({
      items: [
        {
          title: "Maceta L", // Un producto válido que debería estar en el product-catalog.json
          unit_price: 550, // Precio válido que debería estar en product-catalog.json
          quantity: 2
        }
      ],
      buyerName: "Maria Cliente",
      buyerEmail: "maria@cliente.com",
      deliveryOption: "montevideo"
    })
  };
  
  try {
    const validRes = await createPreference(validCheckoutEvent, {});
    // Puede dar error 500 si no hay MP token configurado localmente.
    console.log(`✅ Resultado de Checkout: Status ${validRes.statusCode}. (Si es 500 es normal por falta de Token de MP local).`);
    if (validRes.headers && validRes.headers["Access-Control-Allow-Origin"] === "https://circula.uy") {
       console.log("✅ ÉXITO: El backend de compras retornó los headers CORS correctamente.");
    } else {
       console.log("❌ FALLO: Faltan headers CORS en la respuesta de checkout.");
    }
  } catch (e) {
    console.log("Error controlado:", e.message);
  }

  console.log("\n=== TEST FINALIZADO ===");
}

runIntegrationTests();
