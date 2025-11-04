// netlify/functions/mp-webhook.js

const mercadopago = require('mercadopago');
const nodemailer = require('nodemailer'); 
// 🚨 Importa tu configuración de email aquí (transporter)

// Configuración de Mercado Pago (Debe usar el Access Token de Producción)
mercadopago.configure({
    access_token: process.env.MP_ACCESS_TOKEN 
});

// Configuración de Nodemailer (Mantenla consistente con tu create-preference.js)
const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
});

// Función auxiliar para enviar el email de Pago Aprobado (Al COMPRADOR)
async function sendPaymentApprovedEmail(paymentId, buyerEmail) {
    // 
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: buyerEmail, 
        subject: `✅ ¡Tu pago ha sido APROBADO! - Circula`,
        html: `
            <h2>¡Pago Confirmado!</h2>
            <p>Hemos recibido la confirmación de Mercado Pago de que tu pago (ID de transacción: ${paymentId}) ha sido <strong>APROBADO</strong>.</p>
            <p>En breve, te contactaremos para coordinar la entrega de tus productos.</p>
            <p>Gracias por tu compra.</p>
        `,
    };
    return transporter.sendMail(mailOptions);
}


// Punto de entrada del Webhook
exports.handler = async (event, context) => {
    // 1. Validar Método HTTP (Mercado Pago siempre usa POST)
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Método no permitido' };
    }

    // 2. Extraer el ID de la Notificación de Mercado Pago
    // MP envía la notificación como un parámetro de consulta (query parameter)
    const { id, topic } = event.queryStringParameters;
    
    // Verificamos que sea una notificación de pago
    if (topic !== 'payment' || !id) {
        // Devolvemos 200 OK para evitar que MP intente notificar de nuevo por un error nuestro
        return { statusCode: 200, body: 'Notificación ignorada o inválida' };
    }

    try {
        // 3. Obtener el Detalle Completo del Pago desde la API de Mercado Pago
        // Esta es la clave: le pedimos a MP el detalle usando el ID que nos enviaron.
        const paymentInfo = await mercadopago.payment.get(id);
        const payment = paymentInfo.body;

        // 4. Procesar el Estado
        if (payment.status === 'approved') {
            console.log(`✅ Pago APROBADO recibido: ${payment.id}`);

            // 🚨 Acciones Críticas: 
            // 1. ENVIAR CONFIRMACIÓN FINAL AL COMPRADOR
            await sendPaymentApprovedEmail(payment.id, payment.payer.email);
            
            // 2. Aquí iría la lógica para actualizar tu base de datos si tuvieras una
            
        } else if (payment.status === 'pending') {
            console.log(`🕒 Pago PENDIENTE recibido: ${payment.id}`);
            // No hacemos nada si está pendiente, esperamos la siguiente notificación (APPROVED/REJECTED)
        } else if (payment.status === 'rejected') {
            console.log(`❌ Pago RECHAZADO: ${payment.id}`);
            // Opcional: Enviar email al comprador/vendedor sobre el rechazo
        }
        
        // 5. Devolver 200 OK
        // SIEMPRE debemos responder 200 para decirle a MP que recibimos la notificación.
        return { 
            statusCode: 200, 
            body: JSON.stringify({ message: 'Notificación de pago procesada.' }) 
        };

    } catch (error) {
        console.error("Error al procesar el Webhook de MP:", error);
        // Si hay un error interno, devolvemos 500. MP reintentará más tarde.
        return { statusCode: 500, body: 'Error interno del servidor.' };
    }
};