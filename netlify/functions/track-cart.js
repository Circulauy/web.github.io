// netlify/functions/track-cart.js
const { saveAbandonedCart } = require('./utils/db');

exports.handler = async (event, context) => {
    // CORS headers handling
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
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json"
            },
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
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ error: "Cuerpo de solicitud JSON inválido" })
            };
        }

        const { customer_name, customer_email, items, total } = body;
        if (!customer_name || !customer_email || !items || total === undefined) {
            return {
                statusCode: 400,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ error: "Faltan campos requeridos (customer_name, customer_email, items, total)" })
            };
        }

        const cartData = {
            customer_name,
            customer_email,
            items,
            total: Number(total)
        };

        const savedCart = await saveAbandonedCart(cartData);

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({ success: true, cart: savedCart })
        };

    } catch (error) {
        console.error("Error al guardar carrito abandonado:", error);
        return {
            statusCode: 500,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({ error: "Error interno del servidor al procesar el carrito." })
        };
    }
};
