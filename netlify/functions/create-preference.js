// netlify/functions/create-preference.js

const MP = require('mercadopago');
const MercadoPago = MP.default || MP; 

let mp; // Definir la variable aquí

try {
    // Intenta la inicialización
    mp = new MercadoPago(process.env.MP_ACCESS_TOKEN);
} catch (e) {
    // Si falla la inicialización (por token inválido o problema de clase/constructor)
    console.error("ERROR CRÍTICO DE INICIALIZACIÓN MP:", e.message); 
    // Como esto está fuera del handler, no podemos devolver un 500 aquí,
    // solo nos ayuda a diagnosticar el problema en la terminal.
} 

// La función handler es el punto de entrada para todas las Netlify Functions
exports.handler = async (event, context) => {
    
    // VERIFICACIÓN CLAVE: Muestra si el token es nulo ANTES de usarlo.
    if (!process.env.MP_ACCESS_TOKEN) {
        console.error("ERROR: El token no fue cargado en el entorno local (Netlify Dev).");
        return { 
            statusCode: 500, 
            body: JSON.stringify({ error: "Fallo de configuración: Token de MP ausente." }) 
        };
    }
    
    // 2. Comprobación y Extracción de Datos
    // ... (Tu lógica de extracción de datos)
    
    // 3. Crear el Objeto de Preferencia
    const YOUR_NETLIFY_URL = "https://circula.uy"; 
    let preference = {
        // **IMPORTANTE: Asegúrate que esta estructura sea válida para Mercado Pago**
        items: [{
            title: 'Producto Ejemplo', // Ejemplo de datos
            unit_price: 100.00,       // Ejemplo de datos
            quantity: 1,
        }],
        
        back_urls: { 
            success: `${YOUR_NETLIFY_URL}/#tienda?status=success`,
            failure: `${YOUR_NETLIFY_URL}/#tienda?status=failure`,
            pending: `${YOUR_NETLIFY_URL}/#tienda?status=pending`,
        },
        auto_return: "approved",
    };

    try {
        // 4. Llamar a la API de Mercado Pago
        const response = await mp.preferences.create(preference); 
        
        // 5. Devolver el ID de preferencia
        // ... (Tu respuesta exitosa 200)
        return { statusCode: 200, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ preferenceId: response.body.id }) };

    } catch (error) {
        // MUESTRA EL MENSAJE DE ERROR REAL DE MP EN TU TERMINAL
        console.error("Error al crear preferencia de MP (Detalle de API):", error.message || error.toString()); 
        
        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ error: "Error interno: Falla de la API de Mercado Pago. Verifique el token." })
        };
    }
};