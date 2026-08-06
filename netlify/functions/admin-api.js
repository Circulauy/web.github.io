// netlify/functions/admin-api.js

const nodemailer = require('nodemailer');
const mercadopago = require('mercadopago');
const db = require('./utils/db');

if (process.env.MP_ACCESS_TOKEN) {
    mercadopago.configure({
        access_token: process.env.MP_ACCESS_TOKEN
    });
}

// Función para enviar email al comprador de venta manual
async function sendManualSaleEmailToBuyer(buyerEmail, buyerName, items, subtotal, shippingCost, discountApplied, total, deliveryOption, district, address, couponCode) {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn("⚠️ EMAIL: No están configurados EMAIL_USER o EMAIL_PASS. Omitiendo correo.");
        return false;
    }

    if (!buyerEmail || !buyerEmail.includes('@')) {
        console.log("Omitiendo correo: Email del comprador vacío o inválido.");
        return false;
    }

    // Configuración de Email (Gmail) - Inicializado dinámicamente en cada invocación
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        }
    });

    // Formatear filas de la tabla de productos
    const itemsTableRows = items
        .map(item => {
            const itemPrice = Number(item.price || 0);
            const itemQty = Number(item.quantity || 1);
            const itemTotal = itemPrice * itemQty;
            return `
                <tr style="border-bottom: 1px solid #f1f5f9;">
                    <td style="padding: 12px 8px; font-size: 14px; color: #334155; text-align: left; vertical-align: middle;">
                        <span style="font-weight: 600; color: #1e293b; display: block;">${item.name}</span>
                    </td>
                    <td style="padding: 12px 8px; font-size: 14px; color: #64748b; text-align: center; vertical-align: middle;">
                        ${itemQty}
                    </td>
                    <td style="padding: 12px 8px; font-size: 14px; color: #64748b; text-align: right; vertical-align: middle;">
                        $${itemPrice.toLocaleString()}
                    </td>
                    <td style="padding: 12px 8px; font-size: 14px; font-weight: 600; color: #1e293b; text-align: right; vertical-align: middle;">
                        $${itemTotal.toLocaleString()}
                    </td>
                </tr>
            `;
        })
        .join('');

    let deliveryLabel = "Entrega en Mano";
    let deliveryIcon = "handshake";
    if (deliveryOption === 'montevideo') {
        deliveryLabel = "Envío Montevideo";
        deliveryIcon = "truck";
    } else if (deliveryOption === 'interior') {
        deliveryLabel = "Envío Interior";
        deliveryIcon = "shipped"; // Shipped icon on Icons8
    } else if (deliveryOption === 'pickup') {
        deliveryLabel = "Retiro en Local (Pick Up)";
        deliveryIcon = "shop";
    }

    // Banner de regalo / cupón si fue generado
    let couponHtml = '';
    if (couponCode) {
        const percentMatch = couponCode.match(/CIRCULA(\d+)-/);
        const percent = percentMatch ? percentMatch[1] : '10';
        
        couponHtml = `
            <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border: 1px dashed #4ade80; padding: 24px; border-radius: 12px; margin-top: 30px; text-align: center; box-shadow: 0 4px 6px -1px rgba(22,163,74,0.03);">
                <img src="https://img.icons8.com/ios-filled/100/166534/gift.png" width="28" height="28" style="height: 28px; width: 28px; display: block; margin: 0 auto 8px auto;" />
                <h4 style="margin: 0 0 6px 0; font-size: 15px; color: #166534; font-weight: 700; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                    ¡Un obsequio especial para tu próxima compra!
                </h4>
                <p style="margin: 0 0 16px 0; font-size: 13px; color: #166534; opacity: 0.9; line-height: 1.4;">
                    Te regalamos un <strong>${percent}% de descuento</strong> para usar en nuestra tienda online. Válido por 30 días.
                </p>
                <div style="display: inline-block; background-color: #ffffff; border: 2px solid #86efac; padding: 12px 24px; font-size: 22px; font-weight: 800; color: #15803d; letter-spacing: 3px; font-family: 'Courier New', Courier, monospace; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
                    ${couponCode}
                </div>
                <p style="margin: 12px 0 0 0; font-size: 11px; color: #166534; opacity: 0.7; font-style: italic;">
                    Ingresá este código en el checkout de la web para aplicar el descuento.
                </p>
            </div>
        `;
    }

    const nSubtotal = Number(subtotal || total);
    const nShippingCost = Number(shippingCost || 0);
    const nDiscountApplied = Number(discountApplied || 0);
    const nTotal = Number(total);

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: buyerEmail,
        cc: process.env.EMAIL_USER, // Se auto-envía una copia al vendedor
        subject: `¡Gracias por tu compra! - Circula`,
        html: `
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8fafc; margin: 0; padding: 40px 0; width: 100%; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
                <tr>
                    <td align="center">
                        <div style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.03), 0 2px 4px rgba(0,0,0,0.02); overflow: hidden; border: 1px solid #e2e8f0; text-align: left;">
                            
                            <!-- Header con Logo -->
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(#ffffff, #ffffff); background-color: #ffffff; border-bottom: 1px solid #f1f5f9;" bgcolor="#ffffff">
                                <tr>
                                    <td align="center" style="padding: 20px 30px; background: linear-gradient(#ffffff, #ffffff); background-color: #ffffff;" bgcolor="#ffffff">
                                        <table cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(#ffffff, #ffffff); background-color: #ffffff;" bgcolor="#ffffff">
                                            <tr>
                                                <td style="padding: 10px 20px; background: linear-gradient(#ffffff, #ffffff); background-color: #ffffff;" bgcolor="#ffffff">
                                                    <img src="https://circula.uy/images/logo.png" alt="Circula" width="220" height="65" style="display: block; width: 220px; height: 65px; border: 0;" />
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Banner de Comprobante -->
                            <div style="background: linear-gradient(135deg, #79C7C7 0%, #5ba8a8 100%); padding: 15px 30px; text-align: center; color: white;">
                                <p style="margin: 0; font-size: 12px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;"><img src="https://img.icons8.com/ios-filled/100/ffffff/checked.png" width="14" height="14" style="height: 14px; width: 14px; vertical-align: middle; margin-right: 6px; margin-top: -2px;" /> Comprobante de Compra</p>
                            </div>
                            
                            <!-- Contenedor con padding -->
                            <div style="padding: 30px;">
                                <div style="text-align: center; margin-bottom: 25px;">
                                    <span style="background-color: #f0fdf4; color: #16a34a; padding: 6px 16px; border-radius: 9999px; font-size: 13px; font-weight: 600; display: inline-block; border: 1px solid #dcfce7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                                        <img src="https://img.icons8.com/ios-filled/100/16a34a/checked.png" width="13" height="13" style="height: 13px; width: 13px; vertical-align: middle; margin-right: 6px; margin-top: -2px;" /> Venta Aprobada y Registrada
                                    </span>
                                </div>
                                
                                <p style="font-size: 15px; line-height: 1.6; color: #334155; margin-top: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                                    Hola <strong>${buyerName}</strong>,
                                </p>
                                <p style="font-size: 14px; line-height: 1.6; color: #64748b; margin-bottom: 25px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                                    Muchas gracias por tu compra. A continuación te presentamos el resumen detallado de tu pedido:
                                </p>
                                
                                <!-- Tabla de Productos -->
                                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                                    <thead>
                                        <tr style="border-bottom: 2px solid #e2e8f0;">
                                            <th style="padding: 10px 8px; text-align: left; font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">Detalle del Producto</th>
                                            <th style="padding: 10px 8px; text-align: center; font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; width: 60px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">Cant.</th>
                                            <th style="padding: 10px 8px; text-align: right; font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; width: 90px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">Precio</th>
                                            <th style="padding: 10px 8px; text-align: right; font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; width: 90px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${itemsTableRows}
                                    </tbody>
                                </table>
                                
                                <!-- Desglose de Valores -->
                                <div style="background-color: #f8fafc; border-radius: 8px; padding: 16px; margin-bottom: 25px; border: 1px solid #f1f5f9;">
                                    <table style="width: 100%; border-collapse: collapse; font-size: 14px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                                        <tr>
                                            <td style="padding: 4px 0; color: #64748b;">Subtotal</td>
                                            <td style="padding: 4px 0; text-align: right; color: #334155; font-weight: 500;">$${nSubtotal.toLocaleString()} UYU</td>
                                        </tr>
                                        ${nShippingCost > 0 ? `
                                        <tr>
                                            <td style="padding: 4px 0; color: #64748b;">
                                                <img src="https://img.icons8.com/ios-filled/100/64748b/${deliveryIcon}.png" width="12" height="12" style="height: 12px; width: 12px; vertical-align: middle; margin-right: 4px; margin-top: -2px;" /> Envío (${deliveryLabel})
                                            </td>
                                            <td style="padding: 4px 0; text-align: right; color: #334155; font-weight: 500;">+$${nShippingCost.toLocaleString()} UYU</td>
                                        </tr>` : ''}
                                        ${nDiscountApplied > 0 ? `
                                        <tr>
                                            <td style="padding: 4px 0; color: #16a34a; font-weight: 500;">Descuento Aplicado</td>
                                            <td style="padding: 4px 0; text-align: right; color: #16a34a; font-weight: 600;">-$${nDiscountApplied.toLocaleString()} UYU</td>
                                        </tr>` : ''}
                                        <tr style="border-top: 1px solid #e2e8f0;">
                                            <td style="padding: 10px 0 0 0; font-size: 15px; font-weight: 700; color: #1e293b;">Total</td>
                                            <td style="padding: 10px 0 0 0; text-align: right; font-size: 18px; font-weight: 800; color: #79C7C7;">$${nTotal.toLocaleString()} UYU</td>
                                        </tr>
                                    </table>
                                </div>
                                
                                <!-- Información de Entrega -->
                                <div style="margin-bottom: 25px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                                    <h4 style="margin: 0 0 8px 0; font-size: 12px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.5px;">
                                        <img src="https://img.icons8.com/ios-filled/100/475569/box.png" width="13" height="13" style="height: 13px; width: 13px; vertical-align: middle; margin-right: 6px; margin-top: -2px;" /> Información de Entrega
                                    </h4>
                                    <div style="background-color: #f8fafc; border-radius: 8px; padding: 16px; border: 1px solid #f1f5f9; font-size: 13px; color: #475569; line-height: 1.5;">
                                        <div style="margin-bottom: 4px;">
                                            <strong>Método:</strong> 
                                            <img src="https://img.icons8.com/ios-filled/100/475569/${deliveryIcon}.png" width="12" height="12" style="height: 12px; width: 12px; vertical-align: middle; margin-right: 4px; margin-top: -2px;" /> ${deliveryLabel}
                                        </div>
                                        ${district ? `<div style="margin-bottom: 4px;"><strong>Barrio / Localidad:</strong> ${district}</div>` : ''}
                                        ${address ? `<div><strong>Dirección:</strong> ${address}</div>` : ''}
                                    </div>
                                </div>
                                
                                <!-- Cupón de Descuento -->
                                ${couponHtml}
                                
                                <!-- Footer de la tarjeta -->
                                <div style="text-align: center; margin-top: 35px; border-top: 1px solid #f1f5f9; padding-top: 25px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                                    <p style="font-size: 12px; color: #94a3b8; margin: 0 0 8px 0; line-height: 1.5;">
                                        Este comprobante fue enviado de forma automática tras tu compra.<br>
                                        ¿Tenés alguna consulta? Respondé directamente a este correo.
                                    </p>
                                    <p style="font-size: 13px; font-weight: 700; color: #79C7C7; margin: 8px 0 0 0; letter-spacing: 0.5px;">Equipo Circula</p>
                                </div>
                                
                            </div>
                        </div>
                    </td>
                </tr>
            </table>
        `
    };

    await transporter.sendMail(mailOptions);
    return true;
}

// Función para enviar email de recuperación de carrito abandonado
async function sendCartRecoveryEmail(buyerEmail, buyerName, items, total, couponCode, expiryDateStr) {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn("⚠️ EMAIL: No están configurados EMAIL_USER o EMAIL_PASS. Omitiendo correo.");
        return false;
    }

    if (!buyerEmail || !buyerEmail.includes('@')) {
        console.log("Omitiendo correo de recuperación: Email del comprador vacío o inválido.");
        return false;
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        }
    });

    const itemsTableRows = items
        .map(item => {
            const itemPrice = Number(item.price || 0);
            const itemQty = Number(item.quantity || 1);
            const itemTotal = itemPrice * itemQty;
            return `
                <tr style="border-bottom: 1px solid #f1f5f9;">
                    <td style="padding: 12px 8px; font-size: 14px; color: #334155; text-align: left; vertical-align: middle;">
                        <span style="font-weight: 600; color: #1e293b; display: block;">${item.name}</span>
                    </td>
                    <td style="padding: 12px 8px; font-size: 14px; color: #64748b; text-align: center; vertical-align: middle;">
                        x${itemQty}
                    </td>
                    <td style="padding: 12px 8px; font-size: 14px; font-weight: 600; color: #1e293b; text-align: right; vertical-align: middle;">
                        $${itemTotal.toLocaleString()} UYU
                    </td>
                </tr>
            `;
        })
        .join('');

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: buyerEmail,
        subject: `¡Dejaste algo especial en tu carrito! - Circula`,
        html: `
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8fafc; margin: 0; padding: 40px 0; width: 100%; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
                <tr>
                    <td align="center">
                        <div style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.03), 0 2px 4px rgba(0,0,0,0.02); overflow: hidden; border: 1px solid #e2e8f0; text-align: left;">
                            
                            <!-- Header con Logo -->
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(#ffffff, #ffffff) !important; background-color: #ffffff !important; border-bottom: 1px solid #f1f5f9; border-top-left-radius: 12px; border-top-right-radius: 12px;" bgcolor="#ffffff">
                                <tr>
                                    <td align="center" style="padding: 25px 0; background: linear-gradient(#ffffff, #ffffff) !important; background-color: #ffffff !important; border-top-left-radius: 12px; border-top-right-radius: 12px;" bgcolor="#ffffff">
                                        <img src="https://circula.uy/images/logo.png" alt="Circula" width="200" height="59" style="display: block; width: 200px; height: 59px; border: 0; margin: 0 auto;" />
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Banner de Urgencia -->
                            <div style="background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%); padding: 15px 30px; text-align: center; color: #0369a1;">
                                <p style="margin: 0; font-size: 12px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;"><img src="https://img.icons8.com/ios-filled/100/0369a1/leaf.png" width="14" height="14" style="height: 14px; width: 14px; vertical-align: middle; margin-right: 6px; margin-top: -2px;" /> ¿Te olvidaste de algo especial?</p>
                            </div>
                            
                            <!-- Contenedor con padding -->
                            <div style="padding: 30px;">
                                <p style="font-size: 16px; line-height: 1.6; color: #1e293b; margin-top: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                                    ¡Hola <strong>${buyerName}</strong>!
                                </p>
                                <p style="font-size: 14px; line-height: 1.6; color: #475569; margin-bottom: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                                    Notamos que dejaste algunos productos increíbles en tu carrito de compras. Para ayudarte a dar el paso hacia una alternativa más sustentable, ¡tenemos una sorpresa especial para vos!
                                </p>
                                
                                <!-- Tarjeta de Beneficio / Descuento -->
                                <div style="background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); border: 1px dashed #f87171; padding: 24px; border-radius: 12px; margin-bottom: 25px; text-align: center; box-shadow: 0 4px 6px -1px rgba(220,38,38,0.03);">
                                    <img src="https://img.icons8.com/ios-filled/100/b91c1c/fantasy.png" width="28" height="28" style="height: 28px; width: 28px; display: block; margin: 0 auto 8px auto;" />
                                    <h4 style="margin: 0 0 6px 0; font-size: 16px; color: #991b1b; font-weight: 700; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                                        Beneficio Exclusivo
                                    </h4>
                                    <p style="margin: 0 0 16px 0; font-size: 13px; color: #991b1b; opacity: 0.9; line-height: 1.4;">
                                        Completá tu pedido hoy mismo y obtené un <strong>10% de descuento de regalo</strong> en tu compra total.
                                    </p>
                                    <div style="display: inline-block; background-color: #ffffff; border: 2px solid #fca5a5; padding: 12px 24px; font-size: 22px; font-weight: 800; color: #b91c1c; letter-spacing: 3px; font-family: 'Courier New', Courier, monospace; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
                                        ${couponCode}
                                    </div>
                                    <p style="margin: 12px 0 0 0; font-size: 12px; color: #991b1b; font-weight: 600;">
                                        <img src="https://img.icons8.com/ios-filled/100/b91c1c/exclamation-mark.png" width="12" height="12" style="height: 12px; width: 12px; vertical-align: middle; margin-right: 6px; margin-top: -2px;" /> Cupón válido por solo 7 días (vence el ${expiryDateStr}).
                                    </p>
                                </div>
 
                                <!-- Tabla de Productos Olvidados -->
                                <h3 style="font-size: 13px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px;">
                                    <img src="https://img.icons8.com/ios-filled/100/64748b/shopping-cart.png" width="13" height="13" style="height: 13px; width: 13px; vertical-align: middle; margin-right: 6px; margin-top: -2px;" /> Resumen de tu Carrito:
                                </h3>
                                <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
                                    <tbody>
                                        ${itemsTableRows}
                                    </tbody>
                                </table>
                                
                                <!-- Botón de CTA Principal -->
                                <div style="text-align: center; margin: 30px 0 20px 0;">
                                    <a href="https://www.circula.uy/tienda.html" target="_blank" style="display: inline-block; background-color: #79C7C7; color: #ffffff; padding: 14px 32px; font-size: 16px; font-weight: 700; text-decoration: none; border-radius: 8px; box-shadow: 0 4px 6px rgba(121, 199, 199, 0.3); transition: background-color 0.2s;">
                                        Volver al Carrito y Comprar
                                    </a>
                                </div>
                                
                                <!-- Footer de la tarjeta -->
                                <div style="text-align: center; margin-top: 35px; border-top: 1px solid #f1f5f9; padding-top: 25px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                                    <p style="font-size: 12px; color: #94a3b8; margin: 0 0 8px 0; line-height: 1.5;">
                                        Si ya completaste esta compra usando otro correo o método, podés ignorar este mensaje.
                                    </p>
                                    <p style="font-size: 13px; font-weight: 700; color: #79C7C7; margin: 8px 0 0 0; letter-spacing: 0.5px;">Equipo Circula</p>
                                </div>
                                
                            </div>
                        </div>
                    </td>
                </tr>
            </table>
        `
    };

    await transporter.sendMail(mailOptions);
    return true;
}

// Función para enviar email con Factura PDF adjunta al cliente
async function sendInvoicePdfEmailToBuyer(buyerEmail, buyerName, rut, razonSocial, pdfBase64, filename, customNotes, orderId) {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn("⚠️ EMAIL: No están configurados EMAIL_USER o EMAIL_PASS. Omitiendo correo.");
        return false;
    }

    if (!buyerEmail || !buyerEmail.includes('@')) {
        throw new Error("Email del destinatario vacío o inválido.");
    }

    if (!pdfBase64) {
        throw new Error("No se ha proporcionado el archivo PDF de la factura.");
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        }
    });

    const safeFilename = filename || `e-Factura-Circula-${rut || 'RUT'}.pdf`;
    const cleanBase64 = pdfBase64.replace(/^data:application\/pdf;base64,/, '');

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: buyerEmail,
        cc: process.env.EMAIL_USER, // Copia de respaldo al vendedor
        subject: `📄 Factura con RUT adjunta - Compra en Circula ${orderId ? `(#${orderId})` : ''}`,
        html: `
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8fafc; margin: 0; padding: 40px 0; width: 100%; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
                <tr>
                    <td align="center">
                        <div style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.03), 0 2px 4px rgba(0,0,0,0.02); overflow: hidden; border: 1px solid #e2e8f0; text-align: left;">
                            
                            <!-- Header con Logo -->
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(#ffffff, #ffffff); background-color: #ffffff; border-bottom: 1px solid #f1f5f9;" bgcolor="#ffffff">
                                <tr>
                                    <td align="center" style="padding: 20px 30px; background: linear-gradient(#ffffff, #ffffff); background-color: #ffffff;" bgcolor="#ffffff">
                                        <img src="https://circula.uy/images/logo.png" alt="Circula" width="220" height="65" style="display: block; width: 220px; height: 65px; border: 0;" />
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Contenido Principal -->
                            <div style="padding: 32px 30px;">
                                <div style="background-color: #f0fdf4; border-left: 4px solid #16a34a; padding: 14px 18px; border-radius: 6px; margin-bottom: 24px;">
                                    <h3 style="margin: 0 0 4px 0; color: #166534; font-size: 16px;">¡Adjuntamos tu e-Factura oficial!</h3>
                                    <p style="margin: 0; font-size: 13px; color: #15803d;">Tu comprobante fiscal correspondiente a tu compra ya se encuentra emitido y adjunto a este correo.</p>
                                </div>

                                <p style="margin: 0 0 16px 0; font-size: 15px; color: #334155; line-height: 1.6;">
                                    Estimado/a <strong>${buyerName || razonSocial || 'Cliente'}</strong>:
                                </p>
                                <p style="margin: 0 0 20px 0; font-size: 14px; color: #64748b; line-height: 1.6;">
                                    Muchas gracias por confiar en Circula. Te hacemos llegar la <strong>Factura con RUT (e-Factura)</strong> emitida con los datos fiscales indicados en tu compra.
                                </p>

                                <!-- Cuadro de Datos Fiscales -->
                                <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px; margin-bottom: 24px;">
                                    <h4 style="margin: 0 0 10px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; font-weight: 700;">Datos del Comprobante Fiscal</h4>
                                    <table width="100%" style="font-size: 13px; color: #1e293b; border-collapse: collapse;">
                                        <tr>
                                            <td style="padding: 4px 0; color: #64748b; width: 120px;">Razón Social:</td>
                                            <td style="padding: 4px 0; font-weight: 600;">${razonSocial || 'No especificada'}</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 4px 0; color: #64748b;">RUT:</td>
                                            <td style="padding: 4px 0; font-weight: 600; font-family: monospace;">${rut || 'No especificado'}</td>
                                        </tr>
                                        ${orderId ? `
                                        <tr>
                                            <td style="padding: 4px 0; color: #64748b;">Referencia:</td>
                                            <td style="padding: 4px 0; font-weight: 600;">${orderId}</td>
                                        </tr>` : ''}
                                        <tr>
                                            <td style="padding: 4px 0; color: #64748b;">Archivo Adjunto:</td>
                                            <td style="padding: 4px 0; font-weight: 600; color: #0284c7;">📎 ${safeFilename}</td>
                                        </tr>
                                    </table>
                                </div>

                                ${customNotes ? `
                                <div style="background-color: #f1f5f9; padding: 14px 18px; border-radius: 8px; margin-bottom: 24px; font-size: 13px; color: #475569;">
                                    <strong>Nota adicional:</strong> ${customNotes}
                                </div>` : ''}

                                <p style="margin: 0 0 10px 0; font-size: 13px; color: #64748b; line-height: 1.5;">
                                    Encontrarás el archivo PDF adjunto al final de este correo electrónico para tu archivo contable o fiscal.
                                </p>
                                <p style="margin: 0; font-size: 13px; color: #64748b; line-height: 1.5;">
                                    Ante cualquier consulta, no dudes en responder directamente a este mensaje o escribirnos por WhatsApp.
                                </p>
                            </div>

                            <!-- Footer -->
                            <div style="background-color: #f1f5f9; padding: 20px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                                <p style="margin: 0 0 6px 0; font-size: 13px; font-weight: 600; color: #1e293b;">Circula Uruguay</p>
                                <p style="margin: 0; font-size: 12px; color: #64748b;">
                                    Moda circular consciente y sustentable · <a href="https://circula.uy" style="color: #0d9488; text-decoration: none;">circula.uy</a>
                                </p>
                            </div>

                        </div>
                    </td>
                </tr>
            </table>
        `,
        attachments: [
            {
                filename: safeFilename,
                content: cleanBase64,
                encoding: 'base64',
                contentType: 'application/pdf'
            }
        ]
    };

    const info = await transporter.sendMail(mailOptions);
    return !!info.messageId;
}

// Función auxiliar para generar códigos aleatorios únicos
function generateRandomCode(percent = 10) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 4; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `CIRCULA${percent}-${code}`;
}

// Función de Auto-Verificación y Sincronización Segura con Mercado Pago (Previene Duplicados)
async function syncMercadopagoPayments(db) {
    if (!process.env.MP_ACCESS_TOKEN) {
        throw new Error("MP_ACCESS_TOKEN no está configurado en las variables de entorno de Netlify.");
    }

    mercadopago.configure({
        access_token: process.env.MP_ACCESS_TOKEN
    });

    // 1. Obtener todas las ventas guardadas en Supabase
    const existingSales = await db.getSales();
    const existingMpIds = new Set(
        existingSales.map(s => String(s.mp_payment_id)).filter(id => id && id !== 'undefined' && id !== 'null')
    );

    // Mapeo de huellas existentes para evitar duplicar ventas históricas ya cargadas
    const existingFingerprints = new Set(
        existingSales.map(s => {
            const email = (s.customer_email || '').toLowerCase().trim();
            const total = Number(s.total || 0).toFixed(2);
            const dateDay = (s.created_at || '').substring(0, 10);
            return `${email}|${total}|${dateDay}`;
        })
    );

    console.log(`🔍 [MP-SYNC] Comparando con ${existingSales.length} ventas locales (${existingMpIds.size} con MP ID)...`);

    // 2. Consultar solo las compras recientes (últimos 15 pagos aprobados)
    const searchRes = await mercadopago.payment.search({
        qs: {
            sort: 'date_created',
            criteria: 'desc',
            limit: 15,
            status: 'approved'
        }
    });

    const mpPayments = (searchRes && searchRes.body && searchRes.body.results) ? searchRes.body.results : [];
    console.log(`🔍 [MP-SYNC] Encontrados ${mpPayments.length} pagos aprobados recientes en Mercado Pago.`);

    const recoveredSales = [];

    for (const payment of mpPayments) {
        const paymentIdStr = String(payment.id);
        const metadata = payment.metadata || {};
        const extRef = String(payment.external_reference || '');

        // FILTRO DE SEGURIDAD CRÍTICO:
        // Asegurarse de que el pago corresponda REALMENTE a una compra de Circula
        // (y NO a gastos personales, compras propias u otras transacciones hechas con la cuenta de MP)
        const isCirculaOrder = (extRef && extRef.includes('CIRCULA')) ||
                               (metadata.order_id && String(metadata.order_id).startsWith('CIRCULA')) ||
                               Boolean(metadata.cliente_nombre) ||
                               Boolean(metadata.tipo_entrega) ||
                               Boolean(metadata.invoice_type) ||
                               Boolean(metadata.rut);

        if (!isCirculaOrder) {
            console.log(`⏩ [MP-SYNC] Omitiendo pago MP ID ${paymentIdStr} ($${payment.transaction_amount}) - No es una venta de Circula.`);
            continue;
        }

        const buyerName = metadata.cliente_nombre || 
                          (payment.payer ? `${payment.payer.first_name || ''} ${payment.payer.last_name || ''}`.trim() : '') || 
                          'Cliente Web';
        const buyerEmail = (payment.payer && payment.payer.email) ? payment.payer.email : (metadata.cliente_email || 'sin-email@web.com');
        const total = Number(payment.transaction_amount || 0);
        const paymentDate = (payment.date_approved || payment.date_created || new Date().toISOString()).substring(0, 10);
        const fingerprint = `${buyerEmail.toLowerCase().trim()}|${total.toFixed(2)}|${paymentDate}`;

        // Si ya está registrado por ID de MP o por datos idénticos de compra en el mismo día
        if (existingMpIds.has(paymentIdStr) || existingFingerprints.has(fingerprint)) {
            // Si la venta existía pero no tenía asignado el mp_payment_id, actualizarlo silenciosamente
            const matchWithoutMpId = existingSales.find(s => 
                (!s.mp_payment_id || s.mp_payment_id === 'null') && 
                (s.customer_email || '').toLowerCase().trim() === buyerEmail.toLowerCase().trim() &&
                Math.abs(Number(s.total || 0) - total) < 1
            );
            if (matchWithoutMpId && matchWithoutMpId.id) {
                try {
                    await db.updateSale(matchWithoutMpId.id, { mp_payment_id: paymentIdStr });
                    existingMpIds.add(paymentIdStr);
                    console.log(`🔗 [MP-SYNC] Vinculado mp_payment_id ${paymentIdStr} a venta existente ID ${matchWithoutMpId.id}`);
                } catch (e) {
                    console.error("Error al actualizar mp_payment_id:", e);
                }
            }
            continue;
        }

        console.log(`✨ [MP-SYNC] Venta legítima de Circula recuperada: MP ID ${paymentIdStr} ($${total} de ${buyerName})`);
        
        const rawItems = (payment.additional_info && payment.additional_info.items) ? payment.additional_info.items : [];
        let shippingCost = 0;
        const productItems = [];

        rawItems.forEach(item => {
            const price = Number(item.unit_price || 0);
            const quantity = Number(item.quantity || 1);
            if (item.title && item.title.startsWith("Costo de Envío")) {
                shippingCost = price;
            } else {
                productItems.push({
                    id: item.id || (item.title ? item.title.toLowerCase().replace(/\s+/g, '-') : 'prod'),
                    name: item.title || 'Producto',
                    price: price,
                    quantity: quantity
                });
            }
        });

        if (productItems.length === 0) {
            productItems.push({
                id: 'compra-mp',
                name: payment.description || 'Compra Online',
                price: total,
                quantity: 1
            });
        }

        const discountCode = metadata.discount_code || null;
        const discountApplied = Number(metadata.discount_applied || 0);
        const subtotal = Number(metadata.original_subtotal || (total - shippingCost + discountApplied));

        const isRut = metadata.invoice_type === 'rut' || Boolean(metadata.rut);
        const saleToSave = {
            source: 'web',
            customer_name: buyerName,
            customer_email: buyerEmail,
            items: productItems,
            delivery_option: metadata.tipo_entrega || 'pickup',
            district: metadata.zona_barrio || '',
            address: metadata.direccion_completa || '',
            subtotal: subtotal,
            shipping_cost: shippingCost,
            discount_applied: discountApplied,
            discount_code: discountCode,
            total: total,
            payment_method: 'mercadopago',
            status: 'approved',
            mp_payment_id: paymentIdStr,
            invoice_type: isRut ? 'rut' : 'final',
            rut: isRut ? String(metadata.rut || '').trim() : null,
            razon_social: isRut ? String(metadata.razon_social || '').trim() : null,
            direccion_fiscal: isRut ? String(metadata.direccion_fiscal || '').trim() : null,
            invoice_status: isRut ? 'pending' : null,
            invoice_sent_at: null,
            created_at: payment.date_approved || payment.date_created || new Date().toISOString()
        };

        const saved = await db.saveSale(saleToSave);
        existingMpIds.add(paymentIdStr);
        existingFingerprints.add(fingerprint);
        recoveredSales.push({
            id: saved.id || paymentIdStr,
            customer_name: buyerName,
            total: total,
            is_rut: isRut,
            rut: metadata.rut,
            mp_payment_id: paymentIdStr
        });
        console.log(`✅ [MP-SYNC] Venta recuperada y registrada con éxito para ${buyerName} ($${total})`);
    }

    return recoveredSales;
}

exports.handler = async (event, context) => {
    // Manejo de CORS
    if (event.httpMethod === "OPTIONS") {
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
            },
            body: ""
        };
    }

    // 1. AUTENTICACIÓN
    const authHeader = event.headers.authorization || event.headers.Authorization;
    const password = authHeader ? authHeader.replace(/^Bearer\s+/i, '').trim() : '';

    let correctPassword = (process.env.ADMIN_PASSWORD || '').trim();
    if (!correctPassword && db.isMockMode) {
        correctPassword = password; // En desarrollo local simulado aceptamos cualquier contraseña
    }

    if (!correctPassword) {
        console.error("❌ ADMIN_PASSWORD no está configurada en las variables de entorno de Netlify.");
        return {
            statusCode: 500,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({ error: "Configuración del servidor incompleta. ADMIN_PASSWORD no configurada." })
        };
    }

    if (password !== correctPassword) {
        return {
            statusCode: 401,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({ error: "No autorizado. Contraseña incorrecta." })
        };
    }

    const { action } = event.queryStringParameters || {};

    try {
        // 2. ENRUTADO DE ACCIONES
        if (event.httpMethod === 'GET') {
            if (action === 'get_stats') {
                const stats = await db.getStats();
                return {
                    statusCode: 200,
                    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
                    body: JSON.stringify(stats)
                };
            }
            
            if (action === 'get_sales') {
                const sales = await db.getSales();
                return {
                    statusCode: 200,
                    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
                    body: JSON.stringify(sales)
                };
            }

            if (action === 'get_discounts') {
                // Migrar LABASURAESUNCONCEPTO a multiuso de forma automática
                try {
                    await db.makeCouponMultiUse('LABASURAESUNCONCEPTO');
                } catch (e) {
                    console.error("Error al migrar LABASURAESUNCONCEPTO:", e);
                }

                const discounts = await db.getDiscountCodes();
                return {
                    statusCode: 200,
                    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
                    body: JSON.stringify(discounts)
                };
            }

            if (action === 'get_abandoned_carts') {
                const [carts, sales] = await Promise.all([
                    db.getAbandonedCarts(),
                    db.getSales()
                ]);

                // Auto-sincronizar: Si un carrito con status 'pending' o 'emailed' tiene una venta completada en sales con el mismo email, marcarlo como 'completed'
                const completedEmails = new Set(
                    (sales || [])
                        .filter(s => s.customer_email && !s.customer_email.includes('sin-email') && !s.customer_email.includes('web.com'))
                        .map(s => s.customer_email.toLowerCase().trim())
                );

                for (const cart of (carts || [])) {
                    const email = (cart.customer_email || '').toLowerCase().trim();
                    if (email && completedEmails.has(email) && cart.status !== 'completed') {
                        cart.status = 'completed';
                        cart.recovered_at = cart.recovered_at || new Date().toISOString();
                        try {
                            await db.markAbandonedCartAsCompleted(email);
                        } catch (e) {
                            console.error("Error auto-completing cart:", e);
                        }
                    }
                }

                return {
                    statusCode: 200,
                    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
                    body: JSON.stringify(carts)
                };
            }

            if (action === 'trigger_cart_recovery') {
                try {
                    const cronModule = require('./recover-carts-cron');
                    const result = await cronModule.runRecovery();
                    return {
                        statusCode: 200,
                        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
                        body: result.body || JSON.stringify({ success: true, message: "Recuperación de carritos ejecutada." })
                    };
                } catch (recErr) {
                    console.error("❌ Error en trigger_cart_recovery:", recErr);
                    return {
                        statusCode: 500,
                        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
                        body: JSON.stringify({ error: "Error ejecutando recuperación: " + recErr.message })
                    };
                }
            }

            if (action === 'sync_mercadopago') {
                try {
                    const recovered = await syncMercadopagoPayments(db);
                    return {
                        statusCode: 200,
                        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
                        body: JSON.stringify({
                            success: true,
                            recovered_count: recovered.length,
                            recovered_sales: recovered,
                            message: recovered.length > 0 
                                ? `¡Se detectaron e ingresaron automáticamente ${recovered.length} venta(s) de Mercado Pago faltante(s)!`
                                : "Todas las compras de Mercado Pago ya están sincronizadas."
                        })
                    };
                } catch (mpErr) {
                    console.error("❌ Error en sync_mercadopago:", mpErr);
                    return {
                        statusCode: 500,
                        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
                        body: JSON.stringify({ error: "Error al sincronizar con Mercado Pago: " + mpErr.message })
                    };
                }
            }

            if (action === 'clean_duplicates') {
                try {
                    const salesResult = await db.deduplicateSales();
                    const cartsResult = await db.deduplicateAbandonedCarts();
                    return {
                        statusCode: 200,
                        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
                        body: JSON.stringify({
                            success: true,
                            deleted_sales: salesResult.deletedCount,
                            kept_sales: salesResult.keptCount,
                            deleted_carts: cartsResult.deletedCount,
                            kept_carts: cartsResult.keptCount,
                            message: `Limpieza completada: Se eliminaron ${salesResult.deletedCount} venta(s) duplicada(s) y ${cartsResult.deletedCount} carrito(s) duplicado(s).`
                        })
                    };
                } catch (cleanErr) {
                    console.error("❌ Error en clean_duplicates:", cleanErr);
                    return {
                        statusCode: 500,
                        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
                        body: JSON.stringify({ error: "Error al limpiar duplicados: " + cleanErr.message })
                    };
                }
            }

            return { statusCode: 400, body: JSON.stringify({ error: "Acción GET no soportada." }) };
        } 
        
        if (event.httpMethod === 'POST') {
            let body;
            try {
                body = JSON.parse(event.body);
            } catch (e) {
                return { statusCode: 400, body: JSON.stringify({ error: "Cuerpo de solicitud inválido" }) };
            }

            if (action === 'add_manual_sale') {
                const { customer_name, customer_email, items, delivery_option, district, address, subtotal, shipping_cost, discount_applied, total, payment_method, notes, generate_coupon, coupon_discount_percent, invoice_type, rut, razon_social, direccion_fiscal, send_email } = body;
                
                if (!customer_name || !items || !Array.isArray(items) || items.length === 0 || !total) {
                    return { 
                        statusCode: 400, 
                        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
                        body: JSON.stringify({ error: "Faltan campos obligatorios para registrar la venta." }) 
                    };
                }

                // Guardar en la base de datos
                const isRut = invoice_type === 'rut' || (rut && rut.trim() !== '');
                const saleData = {
                    source: 'manual',
                    customer_name,
                    customer_email: customer_email || 'sin-email@manual.com',
                    items,
                    delivery_option: delivery_option || 'manual',
                    district: district || '',
                    address: address || notes || '', // usar notas si no hay dirección física
                    subtotal: Number(subtotal || total),
                    shipping_cost: Number(shipping_cost || 0),
                    discount_applied: Number(discount_applied || 0),
                    total: Number(total),
                    payment_method: payment_method || 'efectivo',
                    status: 'approved',
                    invoice_type: isRut ? 'rut' : 'final',
                    rut: isRut ? String(rut || '').trim() : null,
                    razon_social: isRut ? String(razon_social || '').trim() : null,
                    direccion_fiscal: isRut ? String(direccion_fiscal || '').trim() : null,
                    invoice_status: isRut ? 'pending' : null,
                    invoice_sent_at: null,
                    created_at: new Date().toISOString()
                };

                const savedSale = await db.saveSale(saleData);

                // Generar cupón automático si se solicita y se proporciona email del cliente
                let autoCoupon = null;
                if (generate_coupon && customer_email && customer_email.trim() !== '' && customer_email.includes('@')) {
                    try {
                        const percent = Number(coupon_discount_percent || 10);
                        const couponCode = generateRandomCode(percent);
                        const expiryDate = new Date();
                        expiryDate.setDate(expiryDate.getDate() + 30 + 1);
                        expiryDate.setUTCHours(2, 59, 59, 999);
                        const expiresAt = expiryDate.toISOString();
                        autoCoupon = await db.createDiscountCode(couponCode, percent, expiresAt);
                        console.log(`🎁 Cupón de regalo '${couponCode}' (${percent}%) creado para venta manual de ${customer_name}`);
                    } catch (cupErr) {
                        console.error("❌ Error generando cupón automático para venta manual:", cupErr);
                    }
                }

                // Enviar email automático si se especificó email y no fue deshabilitado explícitamente
                let emailSent = false;
                const shouldSendEmail = send_email !== false;
                if (shouldSendEmail && customer_email && customer_email.trim() !== '' && customer_email.includes('@')) {
                    try {
                        console.log(`✉️ Intentando enviar correo manual a: ${customer_email}`);
                        emailSent = await sendManualSaleEmailToBuyer(
                            customer_email,
                            customer_name,
                            items,
                            subtotal,
                            shipping_cost,
                            discount_applied,
                            total,
                            delivery_option,
                            district,
                            address,
                            autoCoupon ? autoCoupon.code : null
                        );
                        if (emailSent) {
                            console.log(`✅ Correo enviado con éxito a: ${customer_email}`);
                        } else {
                            console.log(`⚠️ El envío de correo fue omitido (falta configuración o email inválido).`);
                        }
                    } catch (emailErr) {
                        console.error("❌ Error al enviar email para venta manual:", emailErr);
                        emailSent = false;
                    }
                }

                return {
                    statusCode: 200,
                    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
                    body: JSON.stringify({ 
                        message: "Venta registrada con éxito", 
                        sale: savedSale, 
                        email_sent: emailSent,
                        coupon_code: autoCoupon ? autoCoupon.code : null
                    })
                };
            }

            if (action === 'generate_discount') {
                const { code: customCode, percent: customPercent, expires_days, is_single_use } = body || {};
                
                const percent = Number(customPercent) || 10;
                const days = Number(expires_days) || 30;
                const isSingleUse = is_single_use !== undefined ? !!is_single_use : true;
                
                let code = customCode ? customCode.trim().toUpperCase() : '';
                if (!code) {
                    code = generateRandomCode(percent);
                }
                
                const expiryDate = new Date();
                expiryDate.setDate(expiryDate.getDate() + days + 1);
                expiryDate.setUTCHours(2, 59, 59, 999);
                const expiresAt = expiryDate.toISOString();
                
                const newDiscount = await db.createDiscountCode(code, percent, expiresAt, isSingleUse);
                
                return {
                    statusCode: 200,
                    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
                    body: JSON.stringify({ message: "Cupón generado con éxito", discount: newDiscount })
                };
            }

            if (action === 'delete_sale') {
                const { id } = body;
                if (!id) {
                    return { 
                        statusCode: 400, 
                        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
                        body: JSON.stringify({ error: "ID de venta es requerido." }) 
                    };
                }
                await db.deleteSale(id);
                return {
                    statusCode: 200,
                    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
                    body: JSON.stringify({ message: "Venta eliminada con éxito" })
                };
            }

            if (action === 'update_sale') {
                const { id, sale_data } = body;
                if (!id || !sale_data) {
                    return { 
                        statusCode: 400, 
                        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
                        body: JSON.stringify({ error: "ID y datos de venta son requeridos." }) 
                    };
                }
                const updated = await db.updateSale(id, sale_data);
                return {
                    statusCode: 200,
                    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
                    body: JSON.stringify({ message: "Venta actualizada con éxito", sale: updated })
                };
            }

            if (action === 'delete_discount') {
                const { id } = body;
                if (!id) {
                    return { 
                        statusCode: 400, 
                        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
                        body: JSON.stringify({ error: "ID de cupón es requerido." }) 
                    };
                }
                await db.deleteDiscountCode(id);
                return {
                    statusCode: 200,
                    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
                    body: JSON.stringify({ message: "Cupón eliminado con éxito" })
                };
            }

            if (action === 'delete_abandoned_cart') {
                const { id } = body;
                if (!id) {
                    return { 
                        statusCode: 400, 
                        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
                        body: JSON.stringify({ error: "ID de carrito es requerido." }) 
                    };
                }
                await db.deleteAbandonedCart(id);
                return {
                    statusCode: 200,
                    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
                    body: JSON.stringify({ message: "Carrito abandonado eliminado con éxito" })
                };
            }

            if (action === 'recover_cart') {
                const { id } = body;
                if (!id) {
                    return { 
                        statusCode: 400, 
                        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
                        body: JSON.stringify({ error: "ID de carrito es requerido." }) 
                    };
                }
                
                const cart = await db.getAbandonedCartById(id);
                if (!cart) {
                    return { 
                        statusCode: 404, 
                        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
                        body: JSON.stringify({ error: "Carrito no encontrado." }) 
                    };
                }

                // Generar un cupón único con vencimiento de 7 días
                const couponCode = generateRandomCode(10);
                const expiryDate = new Date();
                expiryDate.setDate(expiryDate.getDate() + 7 + 1);
                expiryDate.setUTCHours(2, 59, 59, 999);
                const expiryDateStr = expiryDate.toLocaleDateString('es-UY', { timeZone: 'America/Montevideo' });
                
                const coupon = await db.createDiscountCode(couponCode, 10, expiryDate.toISOString());
                
                // Enviar email
                let emailSent = false;
                try {
                    emailSent = await sendCartRecoveryEmail(
                        cart.customer_email,
                        cart.customer_name,
                        cart.items,
                        cart.total,
                        coupon.code,
                        expiryDateStr
                    );
                } catch (emailErr) {
                    console.error("Error al enviar email de recuperación:", emailErr);
                }

                // Cambiar estado a 'emailed' y guardar cupón
                await db.updateAbandonedCartStatus(id, 'emailed', coupon.code);

                return {
                    statusCode: 200,
                    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
                    body: JSON.stringify({ 
                        message: "Correo de recuperación enviado con éxito.", 
                        email_sent: emailSent,
                        discount_code: coupon.code
                    })
                };
            }

            if (action === 'send_invoice_email') {
                const { sale_id, buyer_email, buyer_name, rut, razon_social, invoice_pdf_base64, invoice_filename, invoice_notes, order_id } = body || {};

                if (!sale_id || !buyer_email || !invoice_pdf_base64) {
                    return {
                        statusCode: 400,
                        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
                        body: JSON.stringify({ error: "Faltan datos obligatorios (ID de venta, email del comprador o archivo PDF)." })
                    };
                }

                let emailSent = false;
                try {
                    emailSent = await sendInvoicePdfEmailToBuyer(
                        buyer_email,
                        buyer_name,
                        rut,
                        razon_social,
                        invoice_pdf_base64,
                        invoice_filename,
                        invoice_notes,
                        order_id || sale_id
                    );
                } catch (emailErr) {
                    console.error("❌ Error al enviar email con factura PDF:", emailErr);
                    return {
                        statusCode: 500,
                        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
                        body: JSON.stringify({ error: `Error al enviar correo: ${emailErr.message}` })
                    };
                }

                const nowIso = new Date().toISOString();
                // Actualizar la venta en la base de datos
                const updatedSale = await db.updateSale(sale_id, {
                    invoice_status: 'sent',
                    invoice_sent_at: nowIso
                });

                return {
                    statusCode: 200,
                    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
                    body: JSON.stringify({
                        message: "Factura enviada con éxito al cliente.",
                        email_sent: emailSent,
                        invoice_status: 'sent',
                        invoice_sent_at: nowIso,
                        sale: updatedSale
                    })
                };
            }

            return { statusCode: 400, body: JSON.stringify({ error: "Acción POST no soportada." }) };
        }

        return { statusCode: 405, body: JSON.stringify({ error: "Método HTTP no soportado." }) };

    } catch (err) {
        console.error("Error crítico en admin-api:", err);
        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ error: "Error interno del servidor.", details: err.message })
        };
    }
};
