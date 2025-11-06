// netlify/functions/mp-webhook.js

const mercadopago = require('mercadopago');
const nodemailer = require('nodemailer'); 

mercadopago.configure({
    access_token: process.env.MP_ACCESS_TOKEN 
});

// Configuración de Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
});

// Función auxiliar para enviar el email de Pago Aprobado (Al COMPRADOR)
async function sendPaymentApprovedEmailToBuyer(paymentId, buyerEmail, buyerName, items) {
    const total = items ? items.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0).toFixed(2) : 'N/A';
    const itemList = items ? items.map(item => `<li>${item.title} (${item.quantity} x $${item.unit_price.toFixed(2)})</li>`).join('') : 'Detalle no disponible';

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: buyerEmail, 
        subject: `✅ ¡Tu pago ha sido APROBADO! - Circula`,
        html: `
            <h2>Hola ${buyerName}, ¡Pago Confirmado!</h2>
            <p>Hemos recibido la confirmación de Mercado Pago de que tu pago (ID: ${paymentId}) ha sido <strong>APROBADO</strong>.</p>
            <p>En breve, te contactaremos para coordinar la entrega de tus productos.</p>
            <hr/>
            <h3>Tu Pedido:</h3>
            <ul>${itemList}</ul>
            <p><strong>Total:</strong> $${total} UYU</p>
            <p>Gracias por tu compra.</p>
        `,
    };
    return transporter.sendMail(mailOptions);
}

// 🚨 NUEVA FUNCIÓN: Envía el email de Pago Aprobado (Al VENDEDOR)
async function sendSellerConfirmationEmail(paymentId, buyerEmail, buyerName, items) {
    const total = items ? items.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0).toFixed(2) : 'N/A';
    const itemList = items ? items.map(item => `<li>${item.title} (${item.quantity} x $${item.unit_price.toFixed(2)})</li>`).join('') : 'Detalle no disponible';

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER, // Al vendedor (a ti)
        subject: `🚨 ¡PAGO APROBADO! Nueva Orden Confirmada de ${buyerName}`,
        html: `
            <h2>¡PAGO APROBADO! Orden Confirmada</h2>
            <p>Se ha confirmado el pago de una nueva orden a través de Mercado Pago.</p>
            <p><strong>ID de Transacción:</strong> ${paymentId}</p>
            <hr/>
            <h3>Datos del Comprador:</h3>
            <p><strong>Nombre:</strong> ${buyerName}</p>
            <p><strong>Email:</strong> ${buyerEmail}</p>
            <hr/>
            <h3>Detalles del Pedido:</h3>
            <ul>${itemList}</ul>
            <p><strong>Total Pagado:</strong> $${total} UYU</p>
            <p style="font-weight: bold; color: green;">✅ El pago fue exitoso. Proceda a contactar al comprador para coordinar la entrega.</p>
        `,
    };
    return transporter.sendMail(mailOptions);
}


exports.handler = async (event, context) => {
    // ... (Validaciones de método y query params)
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Método no permitido' };
    }

    const { id, topic } = event.queryStringParameters;
    
    if (topic !== 'payment' || !id) {
        return { statusCode: 200, body: 'Notificación ignorada o inválida' };
    }

    try {
        const paymentInfo = await mercadopago.payment.get(id);
        const payment = paymentInfo.body;

        // 🚨 CRÍTICO: Recuperar datos desde la metadata de la preferencia
        const preferenceId = payment.metadata.preference_id;
        const preferenceResponse = await mercadopago.preferences.get(preferenceId);
        const metadata = preferenceResponse.body.metadata;

        const buyerEmail = metadata.buyer_email || payment.payer.email;
        const buyerName = metadata.buyer_name || 'Estimado Cliente';
        const items = preferenceResponse.body.items; 

        if (payment.status === 'approved') {
            console.log(`✅ Pago APROBADO recibido: ${payment.id}`);

            // 1. ENVIAR CONFIRMACIÓN FINAL AL COMPRADOR
            await sendPaymentApprovedEmailToBuyer(payment.id, buyerEmail, buyerName, items);
            
            // 2. 🚨 ENVIAR CONFIRMACIÓN FINAL AL VENDEDOR (Nueva acción)
            await sendSellerConfirmationEmail(payment.id, buyerEmail, buyerName, items);
            
        } else if (payment.status === 'rejected') {
            console.log(`❌ Pago RECHAZADO: ${payment.id}`);
            // Opcional: Enviar email de rechazo aquí
        }
        
        return { 
            statusCode: 200, 
            body: JSON.stringify({ message: 'Notificación de pago procesada.' }) 
        };

    } catch (error) {
        console.error("Error al procesar el Webhook de MP:", error);
        return { statusCode: 500, body: 'Error interno del servidor.' };
    }
};