// netlify/functions/admin-api.js

const nodemailer = require('nodemailer');
const db = require('./utils/db');

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
                    Ingresa este código en el checkout de la web para aplicar el descuento.
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
                                        ¿Tienes alguna consulta? Responde directamente a este correo.
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
                                    Notamos que dejaste algunos productos increíbles en tu carrito de compras. Para ayudarte a dar el paso hacia una alternativa más sustentable, ¡tenemos una sorpresa especial para ti!
                                </p>
                                
                                <!-- Tarjeta de Beneficio / Descuento -->
                                <div style="background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); border: 1px dashed #f87171; padding: 24px; border-radius: 12px; margin-bottom: 25px; text-align: center; box-shadow: 0 4px 6px -1px rgba(220,38,38,0.03);">
                                    <img src="https://img.icons8.com/ios-filled/100/b91c1c/fantasy.png" width="28" height="28" style="height: 28px; width: 28px; display: block; margin: 0 auto 8px auto;" />
                                    <h4 style="margin: 0 0 6px 0; font-size: 16px; color: #991b1b; font-weight: 700; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                                        Beneficio Exclusivo
                                    </h4>
                                    <p style="margin: 0 0 16px 0; font-size: 13px; color: #991b1b; opacity: 0.9; line-height: 1.4;">
                                        Completa tu pedido hoy mismo y obtén un <strong>10% de descuento de regalo</strong> en tu compra total.
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
                                        Si ya completaste esta compra usando otro correo o método, puedes ignorar este mensaje.
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

// Función auxiliar para generar códigos aleatorios únicos
function generateRandomCode(percent = 10) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 4; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `CIRCULA${percent}-${code}`;
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
                const discounts = await db.getDiscountCodes();
                return {
                    statusCode: 200,
                    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
                    body: JSON.stringify(discounts)
                };
            }

            if (action === 'get_abandoned_carts') {
                const carts = await db.getAbandonedCarts();
                return {
                    statusCode: 200,
                    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
                    body: JSON.stringify(carts)
                };
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
                const { customer_name, customer_email, items, delivery_option, district, address, subtotal, shipping_cost, discount_applied, total, payment_method, notes, generate_coupon, coupon_discount_percent } = body;
                
                if (!customer_name || !items || !Array.isArray(items) || items.length === 0 || !total) {
                    return { 
                        statusCode: 400, 
                        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
                        body: JSON.stringify({ error: "Faltan campos obligatorios para registrar la venta." }) 
                    };
                }

                // Guardar en la base de datos
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

                // Enviar email automático si se especificó email
                let emailSent = false;
                if (customer_email && customer_email.trim() !== '' && customer_email.includes('@')) {
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
                const { code: customCode, percent: customPercent, expires_days } = body || {};
                
                const percent = Number(customPercent) || 10;
                const days = Number(expires_days) || 30;
                
                let code = customCode ? customCode.trim().toUpperCase() : '';
                if (!code) {
                    code = generateRandomCode(percent);
                }
                
                const expiryDate = new Date();
                expiryDate.setDate(expiryDate.getDate() + days + 1);
                expiryDate.setUTCHours(2, 59, 59, 999);
                const expiresAt = expiryDate.toISOString();
                
                const newDiscount = await db.createDiscountCode(code, percent, expiresAt);
                
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
