// netlify/functions/create-preference.js

const mercadopago = require('mercadopago');

// La función handler es el punto de entrada para todas las Netlify Functions
exports.handler = async (event, context) => {
    // 1. Configurar Mercado Pago (obtiene la clave del entorno de Netlify)
    // El 'access_token' se debe establecer en la configuración de Netlify.
    mercadopago.configure({
        access_token: process.env.MP_ACCESS_TOKEN
    });

    // 2. Comprobación y Extracción de Datos
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Método no permitido' };
    }

    let data;
    try {
        data = JSON.parse(event.body);
    } catch (error) {
        return { statusCode: 400, body: 'Cuerpo de solicitud JSON inválido' };
    }

    const { productName, price } = data;

    if (!productName || !price) {
        return { statusCode: 400, body: 'Faltan datos del producto (productName y price).' };
    }
    
    // 3. Crear el Objeto de Preferencia
    // 🚨 RECUERDA: Reemplaza ESTA URL por la URL real de tu sitio en Netlify
    const YOUR_NETLIFY_URL = "https://circula.uy"; 

    let preference = {
        items: [{
            title: productName,
            unit_price: parseFloat(price),
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
        const response = await mercadopago.preferences.create(preference);
        
        // 5. Devolver el ID de preferencia
        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ preferenceId: response.body.id })
        };

    } catch (error) {
        console.error("Error al crear preferencia de MP:", error);
        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ error: "Error interno del servidor al crear preferencia." })
        };
    }
};