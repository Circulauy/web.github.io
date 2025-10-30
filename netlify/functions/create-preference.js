// netlify/functions/create-preference.js

const mercadopago = require('mercadopago');

// ************************************************
// 1. CONFIGURACIÓN ESTÁTICA (REQUERIDA POR v1.5.17)
// Inicialización fuera del handler para eficiencia.
// ************************************************
mercadopago.configure({
    access_token: process.env.MP_ACCESS_TOKEN 
});

// La función handler es el punto de entrada para todas las Netlify Functions
exports.handler = async (event, context) => {
    
    // VERIFICACIÓN DEL TOKEN DE ACCESO
    if (!process.env.MP_ACCESS_TOKEN) {
        console.error("ERROR: MP_ACCESS_TOKEN no está definido. Revisa .env o la configuración de Netlify.");
        return { 
            statusCode: 500, 
            body: JSON.stringify({ error: "Fallo de configuración: Token de MP ausente." }) 
        };
    }
    
    // 2. VALIDACIÓN DEL MÉTODO HTTP
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Método no permitido' };
    }

    // 3. EXTRACCIÓN Y PARSEO DE DATOS DEL FRONT-END
    let data;
    try {
        data = JSON.parse(event.body);
    } catch (error) {
        return { statusCode: 400, body: 'Cuerpo de solicitud JSON inválido' };
    }

    const { items } = data;
    
    if (!items || !Array.isArray(items) || items.length === 0) {
        // Cambiamos la validación para verificar el carrito
        return { 
            statusCode: 400, 
            body: JSON.stringify({ error: 'Faltan datos: No se encontró la lista de ítems del carrito.' }) 
        };
    }
    
    // 4. CREACIÓN DEL OBJETO DE PREFERENCIA DE MERCADO PAGO
    const YOUR_NETLIFY_URL = "https://circula.uy"; 

    let preference = {
        items: items,
        
        back_urls: {
            // El usuario será redirigido a estas URLs
            success: `${YOUR_NETLIFY_URL}/success.html`,
            failure: `${YOUR_NETLIFY_URL}/failure.html`,
            pending: `${YOUR_NETLIFY_URL}/pending.html`,
        },
        auto_return: 'approved',
        // URLs a las que el usuario es redirigido después del pago
        payer: {
        email: "test_circula_dev@testuser.com" // Email de prueba obligatorio
    },
    };

    try {
        // 5. LLAMADA A LA API DE MERCADO PAGO
        // Usamos el objeto estático 'mercadopago' que se configuró arriba
        const response = await mercadopago.preferences.create(preference);
        
        // 6. DEVOLVER ID DE PREFERENCIA AL FRONT-END
        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ preferenceId: response.body.id })
        };

    } catch (error) {
        // Captura errores de la API (ej. token inválido, datos mal formados, etc.)
        console.error("Error REAL de la API de MP:", error.message || error.toString()); 
        
        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ error: "Error interno del servidor al crear preferencia." })
        };
    }
};