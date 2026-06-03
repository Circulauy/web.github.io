// netlify/functions/utils/db.js

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

const isMockMode = !SUPABASE_URL || !SUPABASE_KEY;

if (isMockMode) {
    console.warn("⚠️ BASE DE DATOS: SUPABASE_URL o SUPABASE_KEY ausentes. Ejecutando en MODO SIMULADO (MOCK MODE).");
}

// ==========================================
// MOCK DATA STORAGE (EN MEMORIA)
// ==========================================
// Nota: En producción serverless esto es efímero, pero es excelente para pruebas y desarrollo local.
let mockSales = [
    {
        id: "MOCK-1",
        created_at: new Date(Date.now() - 5*24*60*60*1000).toISOString(),
        source: "web",
        customer_name: "Juan Pérez",
        customer_email: "juan@gmail.com",
        items: [{ id: "bowl-azul", name: "Bowl Azul", price: 450, quantity: 2 }],
        delivery_option: "montevideo",
        district: "Montevideo - Pocitos",
        address: "Av. Brasil 1234, Apto 502",
        subtotal: 900,
        shipping_cost: 270,
        discount_applied: 0,
        total: 1170,
        payment_method: "mercadopago",
        status: "approved",
        mp_payment_id: "1234567890"
    },
    {
        id: "MOCK-2",
        created_at: new Date(Date.now() - 3*24*60*60*1000).toISOString(),
        source: "manual",
        customer_name: "María Rodríguez",
        customer_email: "maria@yahoo.com",
        items: [{ id: "posavasos-gris", name: "Posavasos Gris", price: 400, quantity: 1 }],
        delivery_option: "pickup",
        district: "Pick Up / Retiro en Tienda",
        address: "Retiro en local",
        subtotal: 400,
        shipping_cost: 0,
        discount_applied: 40,
        discount_code: "MOCK10",
        total: 360,
        payment_method: "efectivo",
        status: "approved"
    },
    {
        id: "MOCK-3",
        created_at: new Date(Date.now() - 1*24*60*60*1000).toISOString(),
        source: "web",
        customer_name: "Lucas Silva",
        customer_email: "lucas@gmail.com",
        items: [
            { id: "bowl-blanco", name: "Bowl Blanco", price: 450, quantity: 1 },
            { id: "posavasos-rosado", name: "Posavasos Rosado", price: 400, quantity: 2 }
        ],
        delivery_option: "interior",
        district: "Maldonado - Piriápolis",
        address: "Ruta 37 Km 2",
        subtotal: 1250,
        shipping_cost: 300,
        discount_applied: 0,
        total: 1550,
        payment_method: "mercadopago",
        status: "approved",
        mp_payment_id: "9876543210"
    }
];

let mockDiscountCodes = [
    {
        id: "d1",
        code: "MOCK10",
        discount_percent: 10,
        expires_at: new Date(Date.now() + 15*24*60*60*1000).toISOString(),
        is_used: false,
        created_at: new Date().toISOString()
    },
    {
        id: "d2",
        code: "EXPIRED10",
        discount_percent: 10,
        expires_at: new Date(Date.now() - 1*24*60*60*1000).toISOString(),
        is_used: false,
        created_at: new Date(Date.now() - 31*24*60*60*1000).toISOString()
    },
    {
        id: "d3",
        code: "USED10",
        discount_percent: 10,
        expires_at: new Date(Date.now() + 10*24*60*60*1000).toISOString(),
        is_used: true,
        used_at: new Date().toISOString(),
        created_at: new Date().toISOString()
    }
];

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
        const found = mockDiscountCodes.find(d => d.code.toUpperCase() === cleanCode);
        if (!found) return { valid: false, error: "El código de descuento no existe." };
        if (found.is_used) return { valid: false, error: "El código de descuento ya ha sido usado." };
        if (new Date(found.expires_at) < new Date()) return { valid: false, error: "El código de descuento ha expirado." };
        return { valid: true, discount_percent: found.discount_percent, code: found.code };
    }

    // Usar 'ieq' para coincidencia de texto insensible a mayúsculas
    const data = await supabaseRequest(`discount_codes?code=ieq.${cleanCode}&select=*`);
    if (!data || data.length === 0) {
        return { valid: false, error: "El código de descuento no existe." };
    }
    
    const coupon = data[0];
    if (coupon.is_used) {
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

    if (isMockMode) {
        const found = mockDiscountCodes.find(d => d.code.toUpperCase() === cleanCode);
        if (found) {
            found.is_used = true;
            found.used_at = new Date().toISOString();
        }
        return;
    }

    await supabaseRequest(`discount_codes?code=ieq.${cleanCode}`, {
        method: 'PATCH',
        body: JSON.stringify({
            is_used: true,
            used_at: new Date().toISOString()
        })
    });
}

/**
 * Crea un nuevo código de descuento
 */
async function createDiscountCode(code, percent = 10, expiresAt) {
    const cleanCode = code.trim().toUpperCase();
    const expiry = expiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 días

    if (isMockMode) {
        const newCode = {
            id: `MOCK-CODE-${Date.now()}`,
            code: cleanCode,
            discount_percent: percent,
            expires_at: expiry,
            is_used: false,
            created_at: new Date().toISOString()
        };
        mockDiscountCodes.push(newCode);
        return newCode;
    }

    const result = await supabaseRequest('discount_codes', {
        method: 'POST',
        headers: { 'Prefer': 'return=representation' },
        body: JSON.stringify({
            code: cleanCode,
            discount_percent: percent,
            expires_at: expiry
        })
    });
    return result ? result[0] : { code: cleanCode, discount_percent: percent, expires_at: expiry };
}

/**
 * Obtener todos los cupones
 */
async function getDiscountCodes() {
    if (isMockMode) {
        // Ordenar por fecha de creación desc
        return [...mockDiscountCodes].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
    return supabaseRequest('discount_codes?select=*&order=created_at.desc');
}

/**
 * Registra una venta en la base de datos
 */
async function saveSale(saleData) {
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
        created_at: saleData.created_at || new Date().toISOString()
    };

    if (isMockMode) {
        formattedSale.id = `MOCK-SALE-${Date.now()}`;
        mockSales.push(formattedSale);
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
        return [...mockSales].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
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

module.exports = {
    isMockMode,
    validateDiscountCode,
    markDiscountCodeAsUsed,
    createDiscountCode,
    getDiscountCodes,
    saveSale,
    getSales,
    getStats
};
