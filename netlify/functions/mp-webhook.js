// netlify/functions/mp-webhook.js

const mercadopago = require('mercadopago');
const nodemailer = require('nodemailer');
const { saveSale, markDiscountCodeAsUsed, markAbandonedCartAsCompleted, getSaleByMpPaymentId } = require('./utils/db');

// ===========================================
// CONFIGURACIÓN MP + EMAIL
// ===========================================

mercadopago.configure({
    access_token: process.env.MP_ACCESS_TOKEN
});

// Helper para obtener el transportador de correo de forma dinámica en cada invocación
function getTransporter() {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        }
    });
}

// ===========================================
// FUNCIONES EMAIL
// ===========================================

// 1. Email comprador (Confirmación con aviso de Factura RUT si aplica)
async function sendPaymentApprovedEmailToBuyer(paymentId, buyerEmail, buyerName, items, orderRef, invoiceInfo = {}) {
    const total = items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0).toFixed(2);

    const itemList = items
        .map(item => `<li style="margin-bottom: 5px;">${item.title} <br><small>(${item.quantity} x $${item.unit_price})</small></li>`)
        .join('');

    const isRut = invoiceInfo.type === 'rut' && invoiceInfo.rut;
    const subject = isRut 
        ? `✅ ¡Pago Confirmado! Pedido #${orderRef} - Tu Factura con RUT está en preparación`
        : `✅ ¡Pago Confirmado! Pedido #${orderRef}`;

    let invoiceNoticeHtml = '';
    if (isRut) {
        invoiceNoticeHtml = `
            <div style="background-color: #f0fdf4; border: 1px solid #86efac; border-left: 5px solid #16a34a; padding: 15px; border-radius: 6px; margin: 20px 0;">
                <h4 style="margin: 0 0 8px 0; color: #166534; font-size: 15px;">📄 Facturación con RUT (e-Factura)</h4>
                <p style="margin: 0 0 6px 0; font-size: 13px; color: #166534;">Registramos tus datos fiscales para la emisión de la e-Factura oficial:</p>
                <ul style="margin: 0 0 8px 0; padding-left: 20px; font-size: 13px; color: #1e293b;">
                    <li><strong>RUT:</strong> ${invoiceInfo.rut}</li>
                    <li><strong>Razón Social:</strong> ${invoiceInfo.razonSocial || 'No especificada'}</li>
                    ${invoiceInfo.fiscalAddress ? `<li><strong>Dirección Fiscal:</strong> ${invoiceInfo.fiscalAddress}</li>` : ''}
                </ul>
                <p style="margin: 0; font-size: 12px; color: #15803d; font-style: italic;">
                    A la brevedad emitiremos tu factura oficial y te la enviaremos en formato PDF a este correo electrónico.
                </p>
            </div>
        `;
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: buyerEmail,
        subject: subject,
        html: `
            <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #79C7C7;">¡Hola ${buyerName}!</h2>
                <p>¡Hemos recibido tu pedido! Ya tenemos la confirmación de tu pago (ID: <strong>${paymentId}</strong>).</p>
                <p>Referencia de pedido: <strong>${orderRef}</strong></p>
                
                ${invoiceNoticeHtml}

                <hr style="border: 1px solid #eee; margin: 20px 0;"/>
                <h3>Tu Resumen de Compra:</h3>
                <ul>${itemList}</ul>
                <p style="font-size: 18px;"><strong>Total Abonado: $${total} UYU</strong></p>
                
                <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 15px; margin: 20px 0;">
                    <p style="margin: 0; color: #475569; font-size: 14px;"><strong>📦 Siguiente paso:</strong> A la brevedad estaremos verificando el stock de los productos. Te enviaremos un nuevo correo confirmando tu compra y la demora estimada de envío o preparación.</p>
                </div>
                
                <p style="margin-top: 25px;"><em>Equipo Circula</em></p>
            </div>
        `
    };

    return getTransporter().sendMail(mailOptions);
}

// 2. Email vendedor (DETALLADO CON DATOS DE ENVÍO Y FACTURA RUT)
async function sendSellerConfirmationEmail(paymentId, buyerEmail, buyerName, items, orderRef, shippingInfo, invoiceInfo = {}) {
    const total = items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0).toFixed(2);

    const itemList = items
        .map(item => `<li style="margin-bottom: 5px;"><strong>${item.title}</strong> <br> Cantidad: ${item.quantity} | Precio Unit: $${item.unit_price}</li>`)
        .join('');

    // Traducir el tipo de envío para que se lea mejor
    let deliveryLabel = "No especificado";
    if (shippingInfo.type === 'montevideo') deliveryLabel = "🚛 Envío Montevideo";
    else if (shippingInfo.type === 'interior') deliveryLabel = "🚚 Envío Interior";
    else if (shippingInfo.type === 'pickup') deliveryLabel = "🏪 Retiro en Local (Pick Up)";

    const isRut = invoiceInfo.type === 'rut' && invoiceInfo.rut;
    const subject = isRut 
        ? `🚨 NUEVA VENTA CON RUT (Emitir Factura) - Ref: ${orderRef}`
        : `🚨 NUEVA VENTA (${deliveryLabel}) - Ref: ${orderRef}`;

    let rutAlertHtml = '';
    if (isRut) {
        rutAlertHtml = `
            <div style="background-color: #fef3c7; border: 2px solid #f59e0b; border-left: 6px solid #d97706; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
                <h3 style="margin: 0 0 6px 0; color: #92400e; font-size: 16px;">⚠️ ¡ATENCIÓN! ESTA VENTA REQUIERE FACTURA CON RUT</h3>
                <p style="margin: 0 0 10px 0; font-size: 13px; color: #78350f;">
                    El cliente solicitó <strong>Factura con RUT (e-Factura)</strong>. Por favor genera la e-Factura en tu software contable y súbela desde el Panel de Administración para enviársela automáticamente.
                </p>
                <div style="background: #ffffff; padding: 12px 14px; border-radius: 4px; border: 1px solid #fde68a; font-size: 13px; color: #1e293b;">
                    <p style="margin: 3px 0;"><strong>🏢 Razón Social:</strong> ${invoiceInfo.razonSocial || 'No especificada'}</p>
                    <p style="margin: 3px 0;"><strong>🔢 RUT:</strong> ${invoiceInfo.rut}</p>
                    ${invoiceInfo.fiscalAddress ? `<p style="margin: 3px 0;"><strong>📍 Dirección Fiscal:</strong> ${invoiceInfo.fiscalAddress}</p>` : ''}
                </div>
            </div>
        `;
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER, // Se envía al dueño de la tienda
        subject: subject,
        html: `
            <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px;">
                <h2 style="background-color: #79C7C7; color: white; padding: 10px; border-radius: 5px;">¡Nueva Venta Aprobada! 🎉</h2>
                
                ${rutAlertHtml}

                <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                    <p style="margin: 5px 0;"><strong>ID Transacción MP:</strong> ${paymentId}</p>
                    <p style="margin: 5px 0;"><strong>Referencia Interna:</strong> ${orderRef}</p>
                    <p style="margin: 5px 0;"><strong>Tipo de Comprobante:</strong> <span style="font-weight: bold; color: ${isRut ? '#d97706' : '#166534'};">${isRut ? 'Factura con RUT' : 'Consumidor Final (e-Ticket)'}</span></p>
                    <p style="margin: 5px 0;"><strong>Total Cobrado:</strong> <span style="color: #009ee3; font-weight: bold; font-size: 16px;">$${total} UYU</span></p>
                </div>
 
                <h3 style="border-bottom: 2px solid #eee; padding-bottom: 5px;">📦 Datos de Envío / Entrega</h3>
                <ul style="list-style: none; padding: 0;">
                    <li style="margin-bottom: 8px;"><strong>Método:</strong> ${deliveryLabel}</li>
                    <li style="margin-bottom: 8px;"><strong>Destinatario:</strong> ${buyerName}</li>
                    <li style="margin-bottom: 8px;"><strong>Email:</strong> <a href="mailto:${buyerEmail}">${buyerEmail}</a></li>
                    <li style="margin-bottom: 8px;"><strong>Zona / Barrio / Localidad:</strong> ${shippingInfo.district}</li>
                    <li style="margin-bottom: 8px;"><strong>Dirección Completa:</strong> <br> ${shippingInfo.address}</li>
                </ul>

                <h3 style="border-bottom: 2px solid #eee; padding-bottom: 5px; margin-top: 20px;">🛒 Productos Vendidos</h3>
                <ul>${itemList}</ul>
            </div>
        `
    };

    return getTransporter().sendMail(mailOptions);
}

// ===========================================
// WEBHOOK PRINCIPAL
// ===========================================

exports.handler = async (event) => {

    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Método no permitido" };
    }

    const { id, topic } = event.queryStringParameters;

    // Mercado Pago suele enviar 'topic=payment' o 'type=payment'
    if ((topic !== "payment" && event.queryStringParameters.type !== "payment") || !id) {
        return { statusCode: 200, body: "Notificación ignorada (no es payment)." };
    }

    try {
        // 1. Obtener la información completa del pago desde Mercado Pago
        const paymentInfo = await mercadopago.payment.get(id);
        const payment = paymentInfo.body;

        console.log("Pago recibido:", payment.id, "Estado:", payment.status);

        // 2. Extraer Datos Principales
        // create-preference.js guardó los datos clave en 'metadata'.
        // MP suele devolver metadata en snake_case.
        const metadata = payment.metadata || {};

        // Recuperamos datos del comprador y referencia
        const orderRef = metadata.order_id || payment.external_reference || "SIN-REF";
        const buyerName = metadata.cliente_nombre || payment.payer?.name || "Cliente Desconocido";
        const buyerPhone = metadata.cliente_telefono || "No especificado";
        
        // Intentamos obtener el email de metadata, si no, del pagador de MP
        const buyerEmail = payment.payer?.email || "sin-email@ejemplo.com";

        // 3. Recuperar Datos de ENVÍO
        const shippingInfo = {
            type: metadata.tipo_entrega || "No especificado",
            district: metadata.zona_barrio || "No especificado",
            address: metadata.direccion_completa || "No especificado"
        };

        // 4. Recuperar Datos de Facturación
        const invoiceInfo = {
            type: metadata.invoice_type || (metadata.rut ? 'rut' : 'final'),
            rut: metadata.rut || null,
            razonSocial: metadata.razon_social || null,
            fiscalAddress: metadata.direccion_fiscal || null
        };

        // 5. Recuperar items
        const items = payment.additional_info?.items || [];

        // 6. Si el pago está APROBADO, guardamos en base de datos y enviamos los correos
        if (payment.status === "approved") {
            // Evitar procesamiento duplicado (idempotencia)
            const paymentIdStr = String(payment.id);
            try {
                const existingSale = await getSaleByMpPaymentId(paymentIdStr);
                if (existingSale) {
                    console.log(`⚠️ Webhook: El pago con ID ${paymentIdStr} ya fue procesado anteriormente. Omitiendo duplicado.`);
                    return {
                        statusCode: 200,
                        body: JSON.stringify({ message: "Webhook procesado correctamente (pago ya registrado anteriormente)" })
                    };
                }
            } catch (checkErr) {
                console.error("❌ Error al verificar si el pago ya existe:", checkErr);
            }

            console.log("✅ Pago aprobado. Guardando venta y enviando correos...");

            // Separar el costo de envío de los items comprados
            let shippingCost = 0;
            const productItems = [];

            items.forEach(item => {
                const price = Number(item.unit_price || 0);
                const quantity = Number(item.quantity || 1);
                
                if (item.title && item.title.startsWith("Costo de Envío")) {
                    shippingCost = price;
                } else {
                    productItems.push({
                        id: item.id || item.title.toLowerCase().replace(/\s+/g, '-'),
                        name: item.title,
                        price: price,
                        quantity: quantity
                    });
                }
            });

            // Extraer datos de descuentos
            const discountCode = metadata.discount_code || null;
            const discountApplied = Number(metadata.discount_applied || 0);
            const total = Number(payment.transaction_amount || 0);
            const subtotal = Number(metadata.original_subtotal || (total - shippingCost + discountApplied));

            // Guardar la venta en la base de datos
            try {
                await saveSale({
                    source: 'web',
                    customer_name: buyerName,
                    customer_email: buyerEmail,
                    customer_phone: buyerPhone,
                    items: productItems,
                    delivery_option: shippingInfo.type || 'pickup',
                    district: shippingInfo.district || '',
                    address: shippingInfo.address || '',
                    subtotal: subtotal,
                    shipping_cost: shippingCost,
                    discount_applied: discountApplied,
                    discount_code: discountCode,
                    total: total,
                    payment_method: 'mercadopago',
                    status: 'approved',
                    mp_payment_id: String(payment.id),
                    invoice_type: invoiceInfo.type,
                    rut: invoiceInfo.rut,
                    razon_social: invoiceInfo.razonSocial,
                    direccion_fiscal: invoiceInfo.fiscalAddress,
                    invoice_status: invoiceInfo.type === 'rut' ? 'pending' : null,
                    invoice_sent_at: null
                });
                console.log("✅ Venta web guardada exitosamente en la base de datos.");
            } catch (dbErr) {
                console.error("❌ Error al guardar venta en base de datos:", dbErr);
            }

            // Consumir el cupón de descuento si se aplicó uno
            if (discountCode) {
                try {
                    await markDiscountCodeAsUsed(discountCode);
                    console.log(`✅ Cupón '${discountCode}' marcado como usado.`);
                } catch (cupErr) {
                    console.error(`❌ Error al consumir el cupón '${discountCode}':`, cupErr);
                }
            }

            // Marcar el carrito abandonado correspondiente como completado
            try {
                await markAbandonedCartAsCompleted(buyerEmail);
                console.log(`✅ Carrito abandonado para ${buyerEmail} marcado como completado.`);
            } catch (cartErr) {
                console.error(`❌ Error al marcar carrito como completado para ${buyerEmail}:`, cartErr);
            }

            // Enviar correo al COMPRADOR (Resumen simple + aviso RUT si aplica)
            try {
                await sendPaymentApprovedEmailToBuyer(payment.id, buyerEmail, buyerName, items, orderRef, invoiceInfo);
                console.log("📧 Email enviado al comprador.");
            } catch (err) {
                console.error("❌ Error enviando email al comprador:", err);
            }

            // Enviar correo al VENDEDOR (Completo con dirección y alerta RUT si aplica)
            try {
                await sendSellerConfirmationEmail(payment.id, buyerEmail, buyerName, items, orderRef, shippingInfo, invoiceInfo);
                console.log("📧 Email enviado al vendedor.");
            } catch (err) {
                console.error("❌ Error enviando email al vendedor:", err);
            }

        } else {
            console.log(`Pago con estado '${payment.status}'. No se guardan datos ni envían emails.`);
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Webhook procesado correctamente" })
        };

    } catch (error) {
        console.error("❌ Error crítico en webhook:", error);
        // Devolvemos 200 o 500. A veces devolver 500 hace que MP reintente muchas veces.
        // Si es un error de código nuestro, mejor 500 para verlo en logs.
        return { statusCode: 500, body: `Error interno: ${error.message}` };
    }
};