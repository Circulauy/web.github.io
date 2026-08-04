// netlify/functions/utils/db.js

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

const isMockMode = !SUPABASE_URL || !SUPABASE_KEY;

if (isMockMode) {
    console.warn("⚠️ BASE DE DATOS: SUPABASE_URL o SUPABASE_KEY ausentes. Ejecutando en MODO SIMULADO (MOCK MODE).");
}

// ==========================================
// MOCK DATA STORAGE (PERSISTENTE EN JSON)
// ==========================================
const fs = require('fs');
const path = require('path');
const mockDbFile = path.join(__dirname, 'mock_db.json');

function readMockDb() {
    try {
        if (fs.existsSync(mockDbFile)) {
            const content = fs.readFileSync(mockDbFile, 'utf8');
            return JSON.parse(content);
        }
    } catch (err) {
        console.error("Error al leer la base de datos simulada:", err);
    }
    return { sales: [], discountCodes: [], abandonedCarts: [] };
}

function writeMockDb(data) {
    try {
        fs.writeFileSync(mockDbFile, JSON.stringify(data, null, 2), 'utf8');
    } catch (err) {
        console.error("Error al escribir en la base de datos simulada:", err);
    }
}


// Helper para hacer llamadas REST a Supabase
async function supabaseRequest(path, options = {}) {
    const url = `${SUPABASE_URL}/rest/v1/${path}`;
    const headers = {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        ...options.headers
    };
    
    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Error Supabase [${response.status}]: ${text}`);
    }
    
    // Las operaciones PATCH o POST pueden responder sin contenido
    if (response.status === 204) return null;
    return response.json();
}

// ==========================================
// MÉTODOS DE BASE DE DATOS
// ==========================================

/**
 * Valida un código de descuento
 */
async function validateDiscountCode(code) {
    if (!code) return { valid: false, error: "No se proporcionó ningún código." };
    const cleanCode = code.trim().toUpperCase();

    if (isMockMode) {
        const dbData = readMockDb();
        const found = dbData.discountCodes.find(d => d.code.toUpperCase() === cleanCode);
        if (!found) return { valid: false, error: "El código de descuento no existe." };
        
        // Forzar multiuso para LABASURAESUNCONCEPTO
        const isSingleUse = cleanCode === 'LABASURAESUNCONCEPTO' ? false : (found.is_single_use !== false);
        if (isSingleUse && found.is_used) return { valid: false, error: "El código de descuento ya ha sido usado." };
        if (new Date(found.expires_at) < new Date()) return { valid: false, error: "El código de descuento ha expirado." };
        return { valid: true, discount_percent: found.discount_percent, code: found.code };
    }

    // Usar 'ilike' para coincidencia de texto insensible a mayúsculas (ieq no es un operador válido en PostgREST)
    const data = await supabaseRequest(`discount_codes?code=ilike.${cleanCode}&select=*`);
    if (!data || data.length === 0) {
        return { valid: false, error: "El código de descuento no existe." };
    }
    
    const coupon = data[0];
    // Forzar multiuso para LABASURAESUNCONCEPTO
    const isSingleUse = cleanCode === 'LABASURAESUNCONCEPTO' ? false : (coupon.is_single_use !== false);
    if (isSingleUse && coupon.is_used) {
        return { valid: false, error: "El código de descuento ya ha sido usado." };
    }
    if (new Date(coupon.expires_at) < new Date()) {
        return { valid: false, error: "El código de descuento ha expirado." };
    }

    return { valid: true, discount_percent: Number(coupon.discount_percent), code: coupon.code };
}

/**
 * Marca un código de descuento como consumido
 */
async function markDiscountCodeAsUsed(code) {
    if (!code) return;
    const cleanCode = code.trim().toUpperCase();

    // No marcar como usado si es multiuso (como LABASURAESUNCONCEPTO)
    if (cleanCode === 'LABASURAESUNCONCEPTO') {
        return;
    }

    if (isMockMode) {
        const dbData = readMockDb();
        const found = dbData.discountCodes.find(d => d.code.toUpperCase() === cleanCode);
        if (found) {
            if (found.is_single_use !== false) {
                found.is_used = true;
                found.used_at = new Date().toISOString();
                writeMockDb(dbData);
            }
        }
        return;
    }

    const data = await supabaseRequest(`discount_codes?code=ilike.${cleanCode}&select=is_single_use`);
    if (data && data.length > 0) {
        const coupon = data[0];
        if (coupon.is_single_use !== false) {
            await supabaseRequest(`discount_codes?code=ilike.${cleanCode}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    is_used: true,
                    used_at: new Date().toISOString()
                })
            });
        }
    }
}

/**
 * Crea un nuevo código de descuento
 */
async function createDiscountCode(code, percent = 10, expiresAt, isSingleUse = true) {
    const cleanCode = code.trim().toUpperCase();
    const expiry = expiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 días

    if (isMockMode) {
        const dbData = readMockDb();
        const newCode = {
            id: `MOCK-CODE-${Date.now()}`,
            code: cleanCode,
            discount_percent: percent,
            expires_at: expiry,
            is_used: false,
            is_single_use: isSingleUse,
            created_at: new Date().toISOString()
        };
        dbData.discountCodes.push(newCode);
        writeMockDb(dbData);
        return newCode;
    }

    const result = await supabaseRequest('discount_codes', {
        method: 'POST',
        headers: { 'Prefer': 'return=representation' },
        body: JSON.stringify({
            code: cleanCode,
            discount_percent: percent,
            expires_at: expiry,
            is_single_use: isSingleUse
        })
    });
    return result ? result[0] : { code: cleanCode, discount_percent: percent, expires_at: expiry, is_single_use: isSingleUse };
}

/**
 * Obtener todos los cupones
 */
async function getDiscountCodes() {
    if (isMockMode) {
        const dbData = readMockDb();
        // Asegurarse de que LABASURAESUNCONCEPTO sea multiuso si está en el mock
        const found = dbData.discountCodes.find(d => d.code.toUpperCase() === 'LABASURAESUNCONCEPTO');
        if (found) {
            found.is_single_use = false;
        }
        return [...dbData.discountCodes].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
    const codes = await supabaseRequest('discount_codes?select=*&order=created_at.desc');
    if (Array.isArray(codes)) {
        return codes.map(c => {
            if (c.code && c.code.trim().toUpperCase() === 'LABASURAESUNCONCEPTO') {
                return { ...c, is_single_use: false };
            }
            return c;
        });
    }
    return codes;
}

/**
 * Busca una venta por su mp_payment_id
 */
async function getSaleByMpPaymentId(mpPaymentId) {
    if (!mpPaymentId) return null;
    const paymentIdStr = String(mpPaymentId).trim();
    if (isMockMode) {
        const dbData = readMockDb();
        return dbData.sales.find(s => s.mp_payment_id && String(s.mp_payment_id).trim() === paymentIdStr) || null;
    }
    try {
        const data = await supabaseRequest(`sales?mp_payment_id=eq.${paymentIdStr}&select=*`);
        return data && data.length > 0 ? data[0] : null;
    } catch (err) {
        console.error(`Error al buscar venta por mp_payment_id (${paymentIdStr}):`, err);
        return null;
    }
}

/**
 * Registra una venta en la base de datos
 */
async function saveSale(saleData) {
    if (saleData.mp_payment_id) {
        const existing = await getSaleByMpPaymentId(saleData.mp_payment_id);
        if (existing) {
            console.log(`⚠️ BASE DE DATOS: Venta con mp_payment_id ${saleData.mp_payment_id} ya existe. Evitando duplicado.`);
            return existing;
        }
    }

    const formattedSale = {
        source: saleData.source || 'web',
        customer_name: saleData.customer_name,
        customer_email: saleData.customer_email,
        items: saleData.items, // Array de items [{id, name, price, quantity}]
        delivery_option: saleData.delivery_option,
        district: saleData.district || '',
        address: saleData.address || '',
        subtotal: Number(saleData.subtotal),
        shipping_cost: Number(saleData.shipping_cost || 0),
        discount_applied: Number(saleData.discount_applied || 0),
        discount_code: saleData.discount_code || null,
        total: Number(saleData.total),
        payment_method: saleData.payment_method || 'efectivo',
        status: saleData.status || 'approved',
        mp_payment_id: saleData.mp_payment_id || null,
        invoice_type: saleData.invoice_type || 'final',
        rut: saleData.rut || null,
        razon_social: saleData.razon_social || null,
        direccion_fiscal: saleData.direccion_fiscal || null,
        invoice_status: saleData.invoice_status || (saleData.invoice_type === 'rut' ? 'pending' : null),
        invoice_sent_at: saleData.invoice_sent_at || null,
        created_at: saleData.created_at || new Date().toISOString()
    };

    if (isMockMode) {
        const dbData = readMockDb();
        formattedSale.id = `MOCK-SALE-${Date.now()}`;
        dbData.sales.push(formattedSale);
        writeMockDb(dbData);
        return formattedSale;
    }

    const result = await supabaseRequest('sales', {
        method: 'POST',
        headers: { 'Prefer': 'return=representation' },
        body: JSON.stringify(formattedSale)
    });
    return result ? result[0] : formattedSale;
}


/**
 * Obtiene el historial de ventas
 */
async function getSales() {
    if (isMockMode) {
        const dbData = readMockDb();
        return [...dbData.sales].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
    return supabaseRequest('sales?select=*&order=created_at.desc');
}

/**
 * Calcula estadísticas de ventas
 */
async function getStats() {
    const sales = await getSales();
    
    let totalRevenue = 0;
    let webRevenue = 0;
    let manualRevenue = 0;
    let totalSalesCount = sales.length;
    let webSalesCount = 0;
    let manualSalesCount = 0;
    
    const productQuantities = {};
    const salesOverTime = {};

    sales.forEach(sale => {
        const amt = Number(sale.total) || 0;
        totalRevenue += amt;
        
        if (sale.source === 'web') {
            webRevenue += amt;
            webSalesCount++;
        } else {
            manualRevenue += amt;
            manualSalesCount++;
        }

        // Ventas por producto
        if (Array.isArray(sale.items)) {
            sale.items.forEach(item => {
                const qty = Number(item.quantity) || 0;
                const name = item.name || item.title || 'Desconocido';
                productQuantities[name] = (productQuantities[name] || 0) + qty;
            });
        }

        // Agrupar por fecha (YYYY-MM-DD) para gráfico
        if (sale.created_at) {
            const dateStr = sale.created_at.split('T')[0];
            salesOverTime[dateStr] = (salesOverTime[dateStr] || 0) + amt;
        }
    });

    // Formatear top productos
    const topProducts = Object.entries(productQuantities)
        .map(([name, quantity]) => ({ name, quantity }))
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5);

    // Formatear ventas sobre el tiempo (ordenadas cronológicamente, últimos 7 días con ventas)
    const chartData = Object.entries(salesOverTime)
        .map(([date, amount]) => ({ date, amount }))
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(-10); // últimos 10 puntos de datos

    return {
        totalRevenue,
        webRevenue,
        manualRevenue,
        totalSalesCount,
        webSalesCount,
        manualSalesCount,
        topProducts,
        chartData
    };
}

async function deleteSale(id) {
    if (isMockMode) {
        const dbData = readMockDb();
        const index = dbData.sales.findIndex(s => s.id === id);
        if (index > -1) {
            dbData.sales.splice(index, 1);
            writeMockDb(dbData);
            return true;
        }
        return false;
    }

    await supabaseRequest(`sales?id=eq.${id}`, {
        method: 'DELETE'
    });
    return true;
}

async function updateSale(id, saleData) {
    if (isMockMode) {
        const dbData = readMockDb();
        const found = dbData.sales.find(s => s.id === id);
        if (found) {
            Object.assign(found, {
                customer_name: saleData.customer_name || found.customer_name,
                customer_email: saleData.customer_email || found.customer_email,
                items: saleData.items || found.items,
                delivery_option: saleData.delivery_option || found.delivery_option,
                district: saleData.district !== undefined ? saleData.district : found.district,
                address: saleData.address !== undefined ? saleData.address : found.address,
                subtotal: saleData.subtotal !== undefined ? Number(saleData.subtotal) : found.subtotal,
                shipping_cost: saleData.shipping_cost !== undefined ? Number(saleData.shipping_cost) : found.shipping_cost,
                discount_applied: saleData.discount_applied !== undefined ? Number(saleData.discount_applied) : found.discount_applied,
                total: saleData.total !== undefined ? Number(saleData.total) : found.total,
                payment_method: saleData.payment_method || found.payment_method,
                status: saleData.status || found.status,
                invoice_type: saleData.invoice_type !== undefined ? saleData.invoice_type : found.invoice_type,
                rut: saleData.rut !== undefined ? saleData.rut : found.rut,
                razon_social: saleData.razon_social !== undefined ? saleData.razon_social : found.razon_social,
                direccion_fiscal: saleData.direccion_fiscal !== undefined ? saleData.direccion_fiscal : found.direccion_fiscal,
                invoice_status: saleData.invoice_status !== undefined ? saleData.invoice_status : found.invoice_status,
                invoice_sent_at: saleData.invoice_sent_at !== undefined ? saleData.invoice_sent_at : found.invoice_sent_at
            });
            writeMockDb(dbData);
            return found;
        }
        throw new Error("Venta no encontrada en modo simulado.");
    }

    const result = await supabaseRequest(`sales?id=eq.${id}`, {
        method: 'PATCH',
        headers: { 'Prefer': 'return=representation' },
        body: JSON.stringify(saleData)
    });
    return result ? result[0] : null;
}

/**
 * Obtiene una venta por su ID
 */
async function getSaleById(id) {
    if (!id) return null;
    const idStr = String(id).trim();
    if (isMockMode) {
        const dbData = readMockDb();
        return dbData.sales.find(s => String(s.id).trim() === idStr) || null;
    }
    try {
        const data = await supabaseRequest(`sales?id=eq.${idStr}&select=*`);
        return data && data.length > 0 ? data[0] : null;
    } catch (err) {
        console.error(`Error al buscar venta por id (${idStr}):`, err);
        return null;
    }
}

async function deleteDiscountCode(id) {
    if (isMockMode) {
        const dbData = readMockDb();
        const index = dbData.discountCodes.findIndex(d => String(d.id) === String(id));
        if (index > -1) {
            dbData.discountCodes.splice(index, 1);
            writeMockDb(dbData);
            return true;
        }
        return false;
    }

    await supabaseRequest(`discount_codes?id=eq.${id}`, {
        method: 'DELETE'
    });
    return true;
}

async function saveAbandonedCart(cartData) {
    const cleanEmail = cartData.customer_email.trim().toLowerCase();
    
    if (isMockMode) {
        const dbData = readMockDb();
        const found = dbData.abandonedCarts.find(c => c.customer_email.toLowerCase() === cleanEmail && c.status === 'pending');
        if (found) {
            Object.assign(found, {
                customer_name: cartData.customer_name,
                items: cartData.items,
                total: Number(cartData.total),
                created_at: new Date().toISOString()
            });
            writeMockDb(dbData);
            return found;
        } else {
            const newCart = {
                id: `MOCK-CART-${Date.now()}`,
                ...cartData,
                status: 'pending',
                created_at: new Date().toISOString()
            };
            dbData.abandonedCarts.push(newCart);
            writeMockDb(dbData);
            return newCart;
        }
    }
    
    // Check if there is an existing pending cart for this customer email
    const existing = await supabaseRequest(`abandoned_carts?customer_email=eq.${cleanEmail}&status=eq.pending&select=*`);
    if (existing && existing.length > 0) {
        const cartId = existing[0].id;
        const result = await supabaseRequest(`abandoned_carts?id=eq.${cartId}`, {
            method: 'PATCH',
            headers: { 'Prefer': 'return=representation' },
            body: JSON.stringify({
                customer_name: cartData.customer_name,
                items: cartData.items,
                total: Number(cartData.total),
                created_at: new Date().toISOString()
            })
        });
        return result ? result[0] : existing[0];
    } else {
        const result = await supabaseRequest('abandoned_carts', {
            method: 'POST',
            headers: { 'Prefer': 'return=representation' },
            body: JSON.stringify(cartData)
        });
        return result ? result[0] : cartData;
    }
}

async function getAbandonedCarts() {
    if (isMockMode) {
        const dbData = readMockDb();
        return [...dbData.abandonedCarts].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
    return supabaseRequest('abandoned_carts?select=*&order=created_at.desc');
}

async function getAbandonedCartById(id) {
    if (isMockMode) {
        const dbData = readMockDb();
        return dbData.abandonedCarts.find(c => String(c.id) === String(id));
    }
    const data = await supabaseRequest(`abandoned_carts?id=eq.${id}&select=*`);
    return data && data.length > 0 ? data[0] : null;
}

async function updateAbandonedCartStatus(id, status, discountCode = null) {
    if (isMockMode) {
        const dbData = readMockDb();
        const found = dbData.abandonedCarts.find(c => String(c.id) === String(id));
        if (found) {
            found.status = status;
            if (discountCode) found.discount_code = discountCode;
            writeMockDb(dbData);
            return found;
        }
        return null;
    }

    const payload = { status };
    if (discountCode) payload.discount_code = discountCode;

    const result = await supabaseRequest(`abandoned_carts?id=eq.${id}`, {
        method: 'PATCH',
        headers: { 'Prefer': 'return=representation' },
        body: JSON.stringify(payload)
    });
    return result ? result[0] : null;
}

async function markAbandonedCartAsCompleted(email) {
    if (!email) return;
    const cleanEmail = email.trim().toLowerCase();

    if (isMockMode) {
        const dbData = readMockDb();
        dbData.abandonedCarts.forEach(c => {
            if (c.customer_email.toLowerCase() === cleanEmail && c.status !== 'completed') {
                c.status = 'completed';
                c.recovered_at = new Date().toISOString();
            }
        });
        writeMockDb(dbData);
        return;
    }

    await supabaseRequest(`abandoned_carts?customer_email=eq.${cleanEmail}&status=neq.completed`, {
        method: 'PATCH',
        body: JSON.stringify({
            status: 'completed',
            recovered_at: new Date().toISOString()
        })
    });
}

async function deleteAbandonedCart(id) {
    if (isMockMode) {
        const dbData = readMockDb();
        const index = dbData.abandonedCarts.findIndex(c => String(c.id) === String(id));
        if (index > -1) {
            dbData.abandonedCarts.splice(index, 1);
            writeMockDb(dbData);
            return true;
        }
        return false;
    }

    await supabaseRequest(`abandoned_carts?id=eq.${id}`, {
        method: 'DELETE'
    });
    return true;
}

async function makeCouponMultiUse(code) {
    if (!code) return;
    const cleanCode = code.trim().toUpperCase();
    if (isMockMode) {
        const dbData = readMockDb();
        const found = dbData.discountCodes.find(d => d.code.toUpperCase() === cleanCode);
        if (found) {
            found.is_single_use = false;
            writeMockDb(dbData);
        }
        return;
    }
    try {
        await supabaseRequest(`discount_codes?code=ilike.${cleanCode}`, {
            method: 'PATCH',
            body: JSON.stringify({
                is_single_use: false
            })
        });
    } catch (err) {
        console.error(`Error updating coupon ${code} to multi-use:`, err);
    }
}

module.exports = {
    isMockMode,
    validateDiscountCode,
    markDiscountCodeAsUsed,
    createDiscountCode,
    getDiscountCodes,
    saveSale,
    getSaleByMpPaymentId,
    getSaleById,
    getSales,
    getStats,
    deleteSale,
    updateSale,
    deleteDiscountCode,
    saveAbandonedCart,
    getAbandonedCarts,
    getAbandonedCartById,
    updateAbandonedCartStatus,
    markAbandonedCartAsCompleted,
    deleteAbandonedCart,
    makeCouponMultiUse
};

