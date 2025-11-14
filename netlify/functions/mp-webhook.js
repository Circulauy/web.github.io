// netlify/functions/mp-webhook.js

const mercadopago = require('mercadopago');
const nodemailer = require('nodemailer');

// ===========================================
// CONFIGURACIÓN MP + EMAIL
// ===========================================

mercadopago.configure({
    access_token: process.env.MP_ACCESS_TOKEN
});

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
});

// ===========================================
// FUNCIONES EMAIL
// ===========================================

// Email comprador
async function sendPaymentApprovedEmailToBuyer(paymentId, buyerEmail, buyerName, items, orderRef) {
    const total = items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0).toFixed(2);

    const itemList = items
        .map(item => `<li>${item.title} (${item.quantity} x $${item.unit_price})</li>`)
        .join('');

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: buyerEmail,
        subject: `✅ ¡Tu pago ha sido APROBADO! - Circula`,
        html: `
            <h2>Hola ${buyerName}, ¡Pago Confirmado!</h2>
            <p>Hemos recibido la confirmación de que tu pago (ID: ${paymentId}) fue <strong>APROBADO</strong>.</p>
            <p>Referencia interna: <strong>${orderRef}</strong></p>
            <hr/>
            <h3>Tu Pedido:</h3>
            <ul>${itemList}</ul>
            <p><strong>Total:</strong> $${total} UYU</p>
        `
    };

    return transporter.sendMail(mailOptions);
}

// Email vendedor
async function sendSellerConfirmationEmail(paymentId, buyerEmail, buyerName, items, orderRef) {
    const total = items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0).toFixed(2);

    const itemList = items
        .map(item => `<li>${item.title} (${item.quantity} x $${item.unit_price})</li>`)
        .join('');

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: `🚨 ¡NUEVO PAGO APROBADO! Orden de ${buyerName}`,
        html: `
            <h2>Nuevo pago aprobado</h2>
            <p><strong>ID de Transacción:</strong> ${paymentId}</p>
            <p><strong>Referencia Interna:</strong> ${orderRef}</p>
            <hr/>
            <h3>Datos del comprador:</h3>
            <p>${buyerName} (${buyerEmail})</p>
            <hr/>
            <h3>Detalles del pedido:</h3>
            <ul>${itemList}</ul>
            <p><strong>Total pagado:</strong> $${total} UYU</p>
        `
    };

    return transporter.sendMail(mailOptions);
}

// ===========================================
// WEBHOOK PRINCIPAL
// ===========================================

exports.handler = async (event) => {

    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Método no permitido" };
    }

    const { id, topic } = event.queryStringParameters;

    if (topic !== "payment" || !id) {
        return { statusCode: 200, body: "Notificación ignorada." };
    }

    try {
        // 1. Obtener el pago
        const paymentInfo = await mercadopago.payment.get(id);
        const payment = paymentInfo.body;

        console.log("Pago recibido:", payment.id, payment.status);

        // 2. Recuperar metadata desde external_reference
        let metadata = {};
        try {
            metadata = JSON.parse(payment.external_reference);
        } catch (e) {
            console.warn("⚠ No se pudo parsear external_reference. Valor:", payment.external_reference);
        }

        const buyerName = metadata.buyer_name || payment.payer?.first_name || "Cliente";
        const buyerEmail = metadata.buyer_email || payment.payer?.email;
        const orderRef = metadata.order_ref || "SIN-REF";

        // 3. Recuperar items del pago (esto SIEMPRE existe en MP)
        const items = payment.additional_info?.items || [];

        // Si no hay correo, no tiene sentido enviar email
        if (!buyerEmail) {
            console.error("❌ No se pudo obtener email del comprador.");
        }

        // 4. Procesar según estado del pago
        if (payment.status === "approved") {

            console.log("✅ Pago aprobado. Enviando emails...");

            await sendPaymentApprovedEmailToBuyer(payment.id, buyerEmail, buyerName, items, orderRef);
            await sendSellerConfirmationEmail(payment.id, buyerEmail, buyerName, items, orderRef);

            console.log("📧 Emails enviados correctamente.");

        } else {
            console.log(`Pago con estado ${payment.status}. No se envían emails.`);
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Webhook procesado correctamente" })
        };

    } catch (error) {
        console.error("❌ Error en webhook:", error);
        return { statusCode: 500, body: "Error interno" };
    }
};
