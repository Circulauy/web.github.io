// netlify/functions/create-preference.js

const mercadopago = require('mercadopago');
const nodemailer = require('nodemailer'); // Asegúrate de haber instalado 'nodemailer' (npm install nodemailer)

// 1. CONFIGURACIÓN DE MERCADO PAGO
mercadopago.configure({
    access_token: process.env.MP_ACCESS_TOKEN 
});

// 2. CONFIGURACIÓN DE NODEMAILER (Para enviar los emails)
const transporter = nodemailer.createTransport({
    service: 'gmail', // O usa 'smtp' para otros servicios (Outlook, SendGrid, etc.)
    auth: {
        user: process.env.EMAIL_USER, // Variable de entorno en Netlify (Tu email de vendedor)
        pass: process.env.EMAIL_PASS, // Variable de entorno en Netlify (Tu contraseña/token de aplicación)
    }
});

// ===========================================
// === FUNCIONES DE ENVÍO DE EMAIL ===
// ===========================================

// Función auxiliar para enviar el email al VENDEDOR (Tú)
async function sendOrderEmailToSeller(buyerName, buyerEmail, items) {
    const total = items.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0).toFixed(2);
    
    // Formato de los ítems para el cuerpo del email
    const itemList = items.map(item => 
        `<li>${item.title} (${item.quantity} x $${item.unit_price.toFixed(2)})</li>`
    ).join('');

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER, // Se lo enviamos al vendedor (a ti)
        subject: `🛒 [URGENTE] Nueva Orden de Compra de ${buyerName} - Total $${total} UYU`,
        html: `
            <h2>Detalles del Nuevo Pedido</h2>
            <p><strong>Comprador:</strong> ${buyerName}</p>
            <p><strong>Email:</strong> ${buyerEmail}</p>
            <hr/>
            <h3>Artículos Comprados:</h3>
            <ul>
                ${itemList}
            </ul>
            <p><strong>Total:</strong> $${total} UYU</p>
            <p style="color: red; font-weight: bold;">⚠️ Revisa tu panel de Mercado Pago (Actividad) para confirmar que el pago fue APROBADO antes de coordinar el envío.</p>
        `,
    };

    return transporter.sendMail(mailOptions);
}

// Función auxiliar para enviar el email al COMPRADOR (Cliente)
async function sendConfirmationEmailToBuyer(buyerName, buyerEmail, items) {
    const total = items.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0).toFixed(2);
    const vendorName = "Circula"; // Asumo el nombre de la tienda
    
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: buyerEmail, // Enviamos el email al comprador
        subject: `¡Gracias por tu compra en ${vendorName}! (Confirmación de Orden)`,
        html: `
            <h2>Hola ${buyerName},</h2>
            <p>¡Gracias por realizar tu compra en **${vendorName}**!</p>
            <p>Hemos recibido tu pedido (total **$${total} UYU**) y actualmente se encuentra en estado de validación de pago por parte de Mercado Pago.</p>
            
            <p style="font-weight: bold; margin-top: 20px;">
                ➡️ Recibirás un **segundo email** de respuesta de ${vendorName} en breve, una vez que el pago esté confirmado, para coordinar la entrega y finalizar la compra.
            </p>
            
            <p>Por favor, revisa tu bandeja de entrada en las próximas horas.</p>
            <br/>
            <p>Saludos cordiales,</p>
            <p>El equipo de ${vendorName}</p>
        `,
    };

    return transporter.sendMail(mailOptions);
}


// ===========================================
// === HANDLER PRINCIPAL ===
// ===========================================

exports.handler = async (event, context) => {
    
    // ... (Verificaciones de Token y HTTP Method mantenidas) ...

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
    
    // 4. CREACIÓN DEL OBJETO DE PREFERENCIA DE MERCADO PAGO
    const YOUR_NETLIFY_URL = "https://circula.uy"; 

    let preference = {
        items: items,
        back_urls: {
            success: `${YOUR_NETLIFY_URL}/success.html`,
            failure: `${YOUR_NETLIFY_URL}/failure.html`,
            pending: `${YOUR_NETLIFY_URL}/pending.html`,
        },
        auto_return: 'approved',
        payer: {
            email: buyerEmail 
        },
    };

    try {
        // 5. LLAMADA A LA API DE MERCADO PAGO (Crear preferencia)
        const response = await mercadopago.preferences.create(preference);
        
        // 6. 📧 ENVÍO DE EMAILS (Ambas llamadas son asíncronas y no bloquean la respuesta)
        
        // A. Email para el VENDEDOR (Tú)
        await sendOrderEmailToSeller(buyerName, buyerEmail, items);
        
        // B. Email para el COMPRADOR (Cliente)
        await sendConfirmationEmailToBuyer(buyerName, buyerEmail, items); 
        
        // 7. DEVOLVER ID DE PREFERENCIA AL FRONT-END
        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ preferenceId: response.body.id })
        };

    } catch (error) {
        console.error("Error en la API de MP o al enviar email:", error.message || error.toString()); 
        
        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ error: "Error interno: Fallo al crear preferencia o enviar notificación." })
        };
    }
};