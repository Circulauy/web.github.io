// netlify/functions/create-preference.js

const mercadopago = require('mercadopago');
const { validateDiscountCode } = require('./utils/db');

// 1. CONFIGURACIÓN DE MERCADO PAGO
mercadopago.configure({
    access_token: process.env.MP_ACCESS_TOKEN 
});

// ===========================================
// === HANDLER PRINCIPAL ===
// ===========================================

exports.handler = async (event, context) => {
    
    // Verificación del Access Token
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

    // 1. EXTRAEMOS LOS NUEVOS DATOS DEL FRONTEND
    const { items, buyerName, buyerEmail, deliveryOption, district, address, discountCode } = data;
    
    // Validación básica
    if (!items || !Array.isArray(items) || items.length === 0 || !buyerName || !buyerEmail) {
        return { 
            statusCode: 400, 
            body: JSON.stringify({ error: 'Faltan datos esenciales (items, nombre o email).' }) 
        };
    }

    // 2. VALIDACIÓN DE CUPÓN DE DESCUENTO
    let isValidDiscount = false;
    let discountPercent = 0;
    let originalSubtotal = items.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);
    let discountApplied = 0;

    if (discountCode) {
        try {
            const validation = await validateDiscountCode(discountCode);
            if (validation.valid) {
                isValidDiscount = true;
                discountPercent = Number(validation.discount_percent || 10);
                
                // Aplicar descuento del 10% a los precios de los productos
                items.forEach(item => {
                    item.unit_price = Number((item.unit_price * (1 - discountPercent / 100)).toFixed(2));
                });

                const discountedSubtotal = items.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);
                discountApplied = Number((originalSubtotal - discountedSubtotal).toFixed(2));
            }
        } catch (dbErr) {
            console.error("Error al validar cupón en base de datos, procediendo sin descuento:", dbErr);
        }
    }

    const SHIPPING_COSTS = {
        'montevideo': 270,
        'interior': 300,
        'pickup': 0
    };

    // Determinamos el costo basado en lo que envió el frontend
    // Si el envío no existe en la lista (o es nulo), asumimos 0
    const shippingCost = SHIPPING_COSTS[deliveryOption] || 0;

    // Si hay costo de envío, lo agregamos como un ítem más a la lista de Mercado Pago
    if (shippingCost > 0) {
        items.push({
            title: `Costo de Envío (${deliveryOption === 'montevideo' ? 'Montevideo' : 'Interior'})`,
            description: "Servicio de logística",
            quantity: 1,
            currency_id: 'UYU',
            unit_price: Number(shippingCost)
        });
    }
    
    // Generamos la Referencia Externa Única
    const uniqueOrderId = `CIRCULA-${Date.now()}`;
    
    const YOUR_NETLIFY_URL = "https://circula.uy"; 

    // Intentamos separar nombre y apellido para el objeto Payer (opcional, pero recomendado)
    const nameParts = buyerName.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : 'Cliente';

    // 2. CONSTRUCCIÓN DE LA PREFERENCIA
    let preference = {
        items: items,
        back_urls: {
            success: `${YOUR_NETLIFY_URL}/success.html`,
            failure: `${YOUR_NETLIFY_URL}/failure.html`,
            pending: `${YOUR_NETLIFY_URL}/pending.html`,
        },
        auto_return: 'approved',
        
        // URL para el Webhook (donde MP avisará cuando el pago se concrete)
        notification_url: `${YOUR_NETLIFY_URL}/.netlify/functions/mp-webhook`, 

        // 3. OBJETO PAYER (Datos del comprador)
        payer: {
            name: firstName,
            surname: lastName,
            email: buyerEmail
        },

        // 4. METADATA (AQUÍ GUARDAMOS LA DIRECCIÓN Y DESCUENTOS DE FORMA SEGURA)
        // Mercado Pago guarda esto y te lo muestra en el detalle de la venta.
        metadata: {
            order_id: uniqueOrderId,
            cliente_nombre: buyerName,
            tipo_entrega: deliveryOption, // 'pickup', 'montevideo', 'interior'
            zona_barrio: district || 'No especificado',
            direccion_completa: address || 'No aplica (Pick Up)',
            discount_code: isValidDiscount ? discountCode.trim().toUpperCase() : null,
            discount_applied: discountApplied,
            original_subtotal: originalSubtotal
        },

        // 5. EXTERNAL REFERENCE (Para conciliación interna)
        // Guardamos un JSON stringificado con datos clave por redundancia
        external_reference: JSON.stringify({
            order_ref: uniqueOrderId,
            envio: deliveryOption,
            zona: district
        }),
        
        // Configuración para evitar envíos automáticos de MP si no los usas
        statement_descriptor: "CIRCULA UY",
        binary_mode: true // Solo acepta pagos aprobados o rechazados (sin pendientes largos)
    };

    try {
        // 6. LLAMADA A LA API DE MERCADO PAGO
        const response = await mercadopago.preferences.create(preference);
        
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