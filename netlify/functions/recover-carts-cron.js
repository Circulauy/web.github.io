// netlify/functions/recover-carts-cron.js
let schedule;
try {
    schedule = require('@netlify/functions').schedule;
} catch (e) {
    console.warn("⚠️ @netlify/functions schedule module not available, running standalone.");
}
const nodemailer = require('nodemailer');
const db = require('./utils/db');

// Función auxiliar para generar códigos aleatorios únicos
function generateRandomCode(percent = 10) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 4; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `CIRCULA${percent}-${code}`;
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

async function cronHandler(event, context) {
    console.log("⏰ [CRON] Iniciando tarea de recuperación de carritos (últimos 30 días)...");

    try {
        const [carts, sales] = await Promise.all([
            db.getAbandonedCarts(),
            db.getSales()
        ]);

        const allCarts = Array.isArray(carts) ? carts : [];
        const allSales = Array.isArray(sales) ? sales : [];

        const now = Date.now();
        const oneHourAgo = new Date(now - 60 * 60 * 1000);
        const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);
        const threeMonthsAgo = new Date(now - 90 * 24 * 60 * 60 * 1000);

        // Conjunto de emails con ventas completadas
        const completedBuyerEmails = new Set(
            allSales
                .filter(s => s.customer_email && !s.customer_email.includes('sin-email') && !s.customer_email.includes('web.com'))
                .map(s => s.customer_email.toLowerCase().trim())
        );

        let processedCount = 0;
        let emailedCount = 0;
        let completedCount = 0;
        let skippedCount = 0;

        for (const cart of allCarts) {
            const email = (cart.customer_email || '').toLowerCase().trim();
            if (!email || !email.includes('@')) continue;

            const cartDate = new Date(cart.created_at || 0);

            // 1. Si el cliente ya completó una compra, marcar como 'completed'
            if (completedBuyerEmails.has(email)) {
                if (cart.status !== 'completed') {
                    cart.status = 'completed';
                    cart.recovered_at = cart.recovered_at || new Date().toISOString();
                    try {
                        await db.markAbandonedCartAsCompleted(email);
                        completedCount++;
                    } catch (e) {
                        console.error("Error auto-completing cart:", e);
                    }
                }
                continue;
            }

            // Solo procesamos carritos en estado 'pending'
            if (cart.status !== 'pending') continue;

            // Si el carrito tiene más de 30 días, marcarlo como 'skipped' para no enviar emails tan viejos
            if (cartDate < thirtyDaysAgo) {
                await db.updateAbandonedCartStatus(cart.id, 'skipped');
                skippedCount++;
                continue;
            }

            // Debe tener al menos 1 hora de antigüedad y menos de 30 días
            if (cartDate > oneHourAgo) {
                continue; // Todavía está dentro de la ventana de espera de 1 hora
            }

            processedCount++;

            // 2. Verificar si el cliente ya recibió un cupón en los últimos 3 meses (90 días)
            const alreadyEmailedRecently = allCarts.some(c =>
                c.id !== cart.id &&
                c.customer_email &&
                c.customer_email.toLowerCase().trim() === email &&
                c.status === 'emailed' &&
                new Date(c.created_at || 0) > threeMonthsAgo
            );

            if (alreadyEmailedRecently) {
                console.log(`⚠️ [CRON] Se omite el envío a ${email}: ya recibió un cupón en los últimos 3 meses.`);
                await db.updateAbandonedCartStatus(cart.id, 'skipped');
                skippedCount++;
                continue;
            }

            // 3. Generar cupón de 10% de descuento válido por 7 días
            const couponCode = generateRandomCode(10);
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + 7 + 1);
            expiryDate.setUTCHours(2, 59, 59, 999);
            const expiryDateStr = expiryDate.toLocaleDateString('es-UY', { timeZone: 'America/Montevideo' });

            try {
                // Registrar cupón en DB
                const coupon = await db.createDiscountCode(couponCode, 10, expiryDate.toISOString());

                // Enviar correo de recuperación
                console.log(`✉️ [CRON] Enviando correo de recuperación a: ${cart.customer_email}`);
                const emailSent = await sendCartRecoveryEmail(
                    cart.customer_email,
                    cart.customer_name,
                    cart.items,
                    cart.total,
                    coupon.code,
                    expiryDateStr
                );

                if (emailSent) {
                    emailedCount++;
                    cart.status = 'emailed';
                    cart.discount_code = coupon.code;
                    await db.updateAbandonedCartStatus(cart.id, 'emailed', coupon.code);
                    console.log(`✅ [CRON] Carrito de ${cart.customer_name} (${cart.customer_email}) recuperado con éxito.`);
                }
            } catch (err) {
                console.error(`❌ [CRON] Error procesando recuperación para carrito ${cart.id}:`, err);
            }
        }

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({
                success: true,
                message: `Procesados: ${processedCount}. Enviados: ${emailedCount}. Completados: ${completedCount}. Omitidos: ${skippedCount}.`
            })
        };
    } catch (err) {
        console.error("❌ [CRON] Error crítico en la ejecución de la tarea programada:", err);
        return {
            statusCode: 500,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({ error: "Error interno procesando el cron.", details: err.message })
        };
    }
}

exports.runRecovery = cronHandler;
exports.handler = typeof schedule === 'function' ? schedule("*/15 * * * *", cronHandler) : cronHandler;
