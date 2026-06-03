// netlify/functions/validate-discount.js

const { validateDiscountCode } = require('./utils/db');

exports.handler = async (event, context) => {
    // Manejo de CORS si es necesario (preflight OPTIONS)
    if (event.httpMethod === "OPTIONS") {
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "POST, OPTIONS"
            },
            body: ""
        };
    }

    if (event.httpMethod !== 'POST') {
        return { 
            statusCode: 405, 
            body: JSON.stringify({ error: 'Método no permitido. Utilizar POST.' }) 
        };
    }

    try {
        let body;
        try {
            body = JSON.parse(event.body);
        } catch (e) {
            return {
                statusCode: 400,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ valid: false, error: "Cuerpo de solicitud JSON inválido" })
            };
        }

        const { code } = body;
        if (!code) {
            return {
                statusCode: 200,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ valid: false, error: "El código no puede estar vacío." })
            };
        }

        const result = await validateDiscountCode(code);
        
        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify(result)
        };

    } catch (error) {
        console.error("Error al validar cupón:", error);
        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ valid: false, error: "Error interno del servidor al verificar el cupón." })
        };
    }
};
