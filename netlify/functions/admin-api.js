// netlify/functions/admin-api.js

const nodemailer = require('nodemailer');
const db = require('./utils/db');

// Configuración de Email (Gmail)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
});

// Función para enviar email al comprador de venta manual
async function sendManualSaleEmailToBuyer(buyerEmail, buyerName, items, subtotal, shippingCost, discountApplied, total, deliveryOption, district, address, couponCode) {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn("⚠️ EMAIL: No están configurados EMAIL_USER o EMAIL_PASS. Omitiendo correo.");
        return null;
    }

    if (!buyerEmail || !buyerEmail.includes('@')) {
        console.log("Omitiendo correo: Email del comprador vacío o inválido.");
        return null;
    }

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
    if (deliveryOption === 'montevideo') deliveryLabel = "🚛 Envío Montevideo";
    else if (deliveryOption === 'interior') deliveryLabel = "🚚 Envío Interior";
    else if (deliveryOption === 'pickup') deliveryLabel = "🏪 Retiro en Local (Pick Up)";

    // Banner de regalo / cupón si fue generado
    let couponHtml = '';
    if (couponCode) {
        const percentMatch = couponCode.match(/CIRCULA(\d+)-/);
        const percent = percentMatch ? percentMatch[1] : '10';
        
        couponHtml = `
            <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border: 1px dashed #4ade80; padding: 24px; border-radius: 12px; margin-top: 30px; text-align: center; box-shadow: 0 4px 6px -1px rgba(22,163,74,0.03);">
                <span style="font-size: 26px; display: block; margin-bottom: 6px;">🎁</span>
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
        subject: `✅ Confirmación de tu compra presencial - Circula`,
        html: `
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8fafc; margin: 0; padding: 40px 0; width: 100%; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
                <tr>
                    <td align="center">
                        <div style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.03), 0 2px 4px rgba(0,0,0,0.02); overflow: hidden; border: 1px solid #e2e8f0; text-align: left;">
                            
                            <!-- Header con Logo -->
                            <div style="background-color: #ffffff; padding: 25px 30px; text-align: center; border-bottom: 1px solid #f1f5f9;">
                                <img src="https://circula.uy/images/logo.png" alt="Circula - Alternativa Sustentable" style="max-height: 55px; height: 55px; width: auto; display: inline-block; margin: 0 auto; vertical-align: middle;" />
                            </div>
                            
                            <!-- Banner de Comprobante -->
                            <div style="background: linear-gradient(135deg, #79C7C7 0%, #5ba8a8 100%); padding: 15px 30px; text-align: center; color: white;">
                                <p style="margin: 0; font-size: 12px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">Comprobante de Compra Presencial</p>
                            </div>
                            
                            <!-- Contenedor con padding -->
                            <div style="padding: 30px;">
                                <div style="text-align: center; margin-bottom: 25px;">
                                    <span style="background-color: #f0fdf4; color: #16a34a; padding: 6px 16px; border-radius: 9999px; font-size: 13px; font-weight: 600; display: inline-block; border: 1px solid #dcfce7;">
                                        ✓ Venta Aprobada y Registrada
                                    </span>
                                </div>
                                
                                <p style="font-size: 15px; line-height: 1.6; color: #334155; margin-top: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                                    Hola <strong>${buyerName}</strong>,
                                </p>
                                <p style="font-size: 14px; line-height: 1.6; color: #64748b; margin-bottom: 25px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                                    Muchas gracias por visitarnos y realizar tu compra presencial de forma exitosa. A continuación te presentamos el resumen detallado de tu transacción:
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
                                            <td style="padding: 4px 0; color: #64748b;">Envío (${deliveryLabel})</td>
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
                                    <h4 style="margin: 0 0 8px 0; font-size: 12px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.5px;">📦 Información de Entrega</h4>
                                    <div style="background-color: #f8fafc; border-radius: 8px; padding: 16px; border: 1px solid #f1f5f9; font-size: 13px; color: #475569; line-height: 1.5;">
                                        <div style="margin-bottom: 4px;"><strong>Método:</strong> ${deliveryLabel}</div>
                                        ${district ? `<div style="margin-bottom: 4px;"><strong>Barrio / Localidad:</strong> ${district}</div>` : ''}
                                        ${address ? `<div><strong>Dirección:</strong> ${address}</div>` : ''}
                                    </div>
                                </div>
                                
                                <!-- Cupón de Descuento -->
                                ${couponHtml}
                                
                                <!-- Footer de la tarjeta -->
                                <div style="text-align: center; margin-top: 35px; border-top: 1px solid #f1f5f9; padding-top: 25px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                                    <p style="font-size: 12px; color: #94a3b8; margin: 0 0 8px 0; line-height: 1.5;">
                                        Este comprobante fue enviado de forma automática tras tu compra presencial.<br>
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

    return transporter.sendMail(mailOptions);
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
    const correctPassword = (process.env.ADMIN_PASSWORD || '').trim();
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

    const authHeader = event.headers.authorization || event.headers.Authorization;
    const password = authHeader ? authHeader.replace(/^Bearer\s+/i, '').trim() : '';

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
                        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
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
                        await sendManualSaleEmailToBuyer(
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
                        emailSent = true;
                    } catch (emailErr) {
                        console.error("❌ Error al enviar email para venta manual:", emailErr);
                        // No fallamos la petición completa, solo logueamos el error de email
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
                const code = generateRandomCode();
                // Expiración en 30 días
                const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
                
                const newDiscount = await db.createDiscountCode(code, 10, expiresAt);
                
                return {
                    statusCode: 200,
                    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
                    body: JSON.stringify({ message: "Cupón generado con éxito", discount: newDiscount })
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
