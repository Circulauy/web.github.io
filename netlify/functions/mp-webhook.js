// netlify/functions/mp-webhook.js

const mercadopago = require('mercadopago');
const nodemailer = require('nodemailer'); 

// Configuración de Mercado Pago (Debe usar el Access Token de Producción)
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

// ===========================================
// === FUNCIONES DE ENVÍO DE EMAIL ===
// ===========================================

// 1. Email al COMPRADOR (Pago Aprobado)
async function sendPaymentApprovedEmailToBuyer(paymentId, buyerEmail, buyerName, items, orderRef) {
    const total = items ? items.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0).toFixed(2) : 'N/A';
    const itemList = items ? items.map(item => `<li>${item.title} (${item.quantity} x $${item.unit_price.toFixed(2)})</li>`).join('') : 'Detalle no disponible';

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: buyerEmail, 
        subject: `✅ ¡Tu pago ha sido APROBADO! - Circula`,
        html: `
            <h2>Hola ${buyerName}, ¡Pago Confirmado!</h2>
            <p>Hemos recibido la confirmación de Mercado Pago de que tu pago (ID: ${paymentId}) ha sido <strong>APROBADO</strong>.</p>
            <p>Tu número de orden interno es: <strong>${orderRef}</strong></p>
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

// 2. Email al VENDEDOR (Pago Aprobado)
async function sendSellerConfirmationEmail(paymentId, buyerEmail, buyerName, items, orderRef) {
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
            <p><strong>Referencia Interna:</strong> ${orderRef}</p>
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


// ===========================================
// === HANDLER PRINCIPAL (WEBHOOK) ===
// ===========================================

exports.handler = async (event, context) => {
    
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Método no permitido' };
    }

    // 🚨 Extraemos el ID del QUERY STRING (es la notificación ID)
    const { id, topic } = event.queryStringParameters;
    
    if (topic !== 'payment' || !id) {
        return { statusCode: 200, body: 'Notificación ignorada o inválida' };
    }

    try {
        // 1. Obtener el Detalle Completo del Pago (Payment ID)
        const paymentInfo = await mercadopago.payment.get(id);
        const payment = paymentInfo.body;

        // 2. Extraer el Preference ID del objeto de pago (campo 'external_reference')
        const preferenceId = payment.external_reference; 
        
        // 🚨 CRÍTICO: Si el external_reference es null/vacío, fallamos aquí si no hay ID.
        if (!preferenceId) {
             console.error("Error: external_reference (Preference ID) no encontrado en el pago.");
             // Devolvemos 200 OK para no reintentar, pero registramos el error
             return { statusCode: 200, body: 'Referencia externa no encontrada. Pago ignorado.' };
        }


        // 3. Obtener el Objeto de Preferencia (para recuperar METADATA y ITEMS)
        const preferenceResponse = await mercadopago.preferences.get(preferenceId);
        const metadata = preferenceResponse.body.metadata;
        const items = preferenceResponse.body.items; 

        // 4. Mapear los datos del comprador y la orden
        const buyerEmail = metadata.buyer_email;
        const buyerName = metadata.buyer_name;
        const orderRef = metadata.order_ref;
        
        console.log(`Webhook ejecutado para Pago ID: ${payment.id}. Estado: ${payment.status}.`);

        // 5. Procesar el Estado de Aprobación
        if (payment.status === 'approved') {
            
            // A. ENVIAR CONFIRMACIÓN FINAL AL COMPRADOR
            await sendPaymentApprovedEmailToBuyer(payment.id, buyerEmail, buyerName, items, orderRef);
            
            // B. ENVIAR CONFIRMACIÓN FINAL AL VENDEDOR
            await sendSellerConfirmationEmail(payment.id, buyerEmail, buyerName, items, orderRef);
            
        } else if (payment.status === 'rejected') {
            console.log(`❌ Pago RECHAZADO: ${payment.id}`);
            // Opcional: Enviar email de rechazo aquí
        }
        
        // 6. Devolver 200 OK
        return { 
            statusCode: 200, 
            body: JSON.stringify({ message: 'Notificación de pago procesada.' }) 
        };

    } catch (error) {
        // El error 404 de "Payment not found" (que vimos antes) cae aquí.
        console.error("Error al procesar el Webhook de MP:", error);
        
        // Si hay un error interno del servidor, devolvemos 500 para que MP reintente.
        return { statusCode: 500, body: 'Error interno del servidor.' };
    }
};