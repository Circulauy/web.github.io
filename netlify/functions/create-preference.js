// netlify/functions/create-preference.js

const mercadopago = require('mercadopago');
// const nodemailer = require('nodemailer'); // 🚨 ELIMINADO: Nodemailer ya no se necesita aquí.

// 1. CONFIGURACIÓN DE MERCADO PAGO
mercadopago.configure({
    access_token: process.env.MP_ACCESS_TOKEN 
});

// ===========================================
// === HANDLER PRINCIPAL (SOLO CREACIÓN DE PREFERENCIA) ===
// ===========================================

exports.handler = async (event, context) => {
    
    // Verificación del Access Token (Mantenido)
    if (!process.env.MP_ACCESS_TOKEN) {
        return { 
            statusCode: 500, 
            body: JSON.stringify({ error: "Fallo de configuración: Token de MP ausente." }) 
        };
    }
    
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Método no permitido' };
    }

    let data;
    try {
        data = JSON.parse(event.body);
    } catch (error) {
        return { statusCode: 400, body: 'Cuerpo de solicitud JSON inválido' };
    }

    const { items, buyerName, buyerEmail } = data;
    
    if (!items || !Array.isArray(items) || items.length === 0 || !buyerName || !buyerEmail) {
        return { 
            statusCode: 400, 
            body: JSON.stringify({ error: 'Faltan datos (items, nombre o email del comprador).' }) 
        };
    }
    
    // 🚨 Generamos la Referencia Externa Única
    const uniqueOrderId = `CIRCULA-${Date.now()}`;
    
    const YOUR_NETLIFY_URL = "https://circula.uy"; 

    let preference = {
    items: items,
    back_urls: {
        success: `${YOUR_NETLIFY_URL}/success.html`,
        failure: `${YOUR_NETLIFY_URL}/failure.html`,
        pending: `${YOUR_NETLIFY_URL}/pending.html`,
    },
    auto_return: 'approved',

    external_reference: JSON.stringify({
        buyer_email: buyerEmail,
        buyer_name: buyerName,
        order_ref: uniqueOrderId
    }),

    notification_url: `${YOUR_NETLIFY_URL}/.netlify/functions/mp-webhook`, 

    payer: {
        email: buyerEmail
    },
};

    try {
        // 5. LLAMADA A LA API DE MERCADO PAGO (Crear preferencia)
        const response = await mercadopago.preferences.create(preference);
        
        // 6. 📧 ENVÍO DE EMAIL AL VENDEDOR ELIMINADO. SOLO RETORNAMOS LA PREFERENCIA.
        
        // 7. DEVOLVER ID DE PREFERENCIA AL FRONT-END
        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ preferenceId: response.body.id })
        };

    } catch (error) {
        console.error("Error en la API de MP:", error.message || error.toString()); 
        
        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ error: "Error interno: Fallo al crear preferencia." })
        };
    }
};