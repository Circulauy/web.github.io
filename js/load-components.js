/**
 * CIRCULA - LOAD COMPONENTS & GLOBAL LOGIC (MASTER FILE)
 * Versión Final: Galería Full-Bleed con Navegación por Flechas
 */

// ==========================================
// 0. CONFIGURACIÓN GLOBAL Y BASE DE DATOS
// ==========================================
const NUMERO_WHATSAPP = "59899395724";

// Base de datos con ARRAY de imágenes para la galería
const PRODUCTS_DB = {
    'bowl-azul': { 
        name: 'Bowl Azul', 
        price: 450, 
        desc: 'Fabricado con 100% de plástico reciclado post-consumo. Ideal para darle vida a tu hogar con un toque sustentable.', 
        images: ['images/Tienda/Bowl Azul Arriba.jpeg', 'images/Tienda/Bowl Azul Costado.jpeg'] 
    },
    'bowl-blanco': { 
        name: 'Bowl Blanco', 
        price: 450, 
        desc: 'Elegancia y sustentabilidad. Fabricado con 100% de plástico reciclado post-consumo.', 
        images: ['images/Tienda/Bowl Blanco Arriba.jpeg', 'images/Tienda/Bowl Blanco Costado.jpeg'] 
    },
    'bowl-gris': { 
        name: 'Bowl Gris', 
        price: 450, 
        desc: 'Minimalista y ecológico. Fabricado con 100% de plástico reciclado post-consumo.', 
        images: ['images/Tienda/Bowl Gris Arriba.jpeg', 'images/Tienda/Bowl Gris Costado.jpeg'] 
    },
    'bowl-navideno': { 
        name: 'Bowl Navideño', 
        price: 450, 
        desc: 'Edición especial con colores festivos. Fabricado con 100% de plástico reciclado post-consumo.', 
        images: ['images/Tienda/Bowl Navideño Arriba.jpeg', 'images/Tienda/Bowl Navideño Costado.jpeg'] 
    },
    'bowl-negro': { 
        name: 'Bowl Negro', 
        price: 450, 
        desc: 'Sobriedad y diseño. Fabricado con 100% de plástico reciclado post-consumo.', 
        images: ['images/Tienda/Bowl Negro Arriba.jpeg', 'images/Tienda/Bowl Negro Costado.jpeg'] 
    },
    'bowl-naranja': { 
        name: 'Bowl Naranja', 
        price: 450, 
        desc: 'Energía pura. Fabricado con 100% de plástico reciclado post-consumo.', 
        images: ['images/Tienda/Bowl Naranja Arriba.jpeg', 'images/Tienda/Bowl Naranja Costado.jpeg'] 
    },
    'bowl-verde': { 
        name: 'Bowl Verde', 
        price: 450, 
        desc: 'Conexión con la naturaleza. Fabricado con 100% de plástico reciclado post-consumo.', 
        images: ['images/Tienda/Bowl Verde Arriba.jpeg', 'images/Tienda/Bowl Verde Costado.jpeg'] 
    },
    'posavasos-azul-blanco': { 
        name: 'Posavasos Azul y Blanco', 
        price: 400, 
        desc: 'Set de posavasos únicos. 100% plástico reciclado.', 
        images: ['images/Tienda/Posavasos azul y Blanco.jpeg', 'images/Tienda/Posavasos azul y Blanco Etiqueta.jpeg'] 
    },
    'posavasos-azul-celeste': { 
        name: 'Posavasos Azul y Celeste', 
        price: 400, 
        desc: 'Set de 6 unidades. Tonos marinos. 100% plástico reciclado.', 
        images: ['images/Tienda/Posavasos Azul y Celeste.jpeg', 'images/Tienda/Posavasos azul y Celeste Etiqueta.jpeg'] 
    },
    'posavasos-blanco': { 
        name: 'Posavasos Blanco', 
        price: 400, 
        desc: 'Set de 6 unidades. Pureza reciclada.', 
        images: ['images/Tienda/Posavasos Blanco.jpeg', 'images/Tienda/Posavasos Blanco Etiqueta.jpeg'] 
    },
    'posavasos-gris': { 
        name: 'Posavasos Gris', 
        price: 400, 
        desc: 'Set de 6 unidades. Estilo industrial.', 
        images: ['images/Tienda/Posavasos Gris.jpeg', 'images/Tienda/Posavasos Gris Etiqueta.jpeg'] 
    },
    'posavasos-rosado': { 
        name: 'Posavasos Rosado', 
        price: 400, 
        desc: 'Set de 6 unidades. Toque suave y sustentable.', 
        images: ['images/Tienda/Posavasos Rosado.jpeg', 'images/Tienda/Posavasos Rosado Etiqueta.jpeg'] 
    }
};

// ==========================================
// 1. LÓGICA DEL MENÚ MÓVIL
// ==========================================
window.toggleMobileMenu = function () {
    const menu = document.getElementById('mobile-menu');
    const btn = document.getElementById('mobile-menu-button');
    const lineTop = document.getElementById('line-top');
    const lineBottom = document.getElementById('line-bottom');
    const body = document.body;

    if (!menu) return;

    const isClosed = menu.classList.contains('invisible') || menu.style.visibility === 'hidden' || getComputedStyle(menu).visibility === 'hidden';

    if (isClosed) {
        // ABRIR
        const header = document.getElementById('main-header');
        if(header) {
            header.style.zIndex = '10000';
            header.style.position = 'relative';
        }

        menu.classList.remove('invisible', 'opacity-0', 'translate-y-4');
        menu.style.visibility = 'visible';
        menu.style.opacity = '1';
        menu.style.transform = 'translateY(0)';
        menu.classList.add('opacity-100', 'translate-y-0', 'visible');
        
        body.style.overflow = 'hidden'; 

        if (lineTop) {
            lineTop.classList.add('rotate-45', 'translate-y-[6px]');
            lineTop.style.transform = 'translateY(6px) rotate(45deg)'; 
            lineTop.style.backgroundColor = '#333333'; 
        }
        if (lineBottom) {
            lineBottom.classList.add('-rotate-45', '-translate-y-[6px]');
            lineBottom.style.transform = 'translateY(-6px) rotate(-45deg)';
            lineBottom.style.backgroundColor = '#333333'; 
        }

        if(btn) btn.style.zIndex = '10001';

    } else {
        // CERRAR
        const header = document.getElementById('main-header');
        if(header) header.style.zIndex = ''; 

        menu.classList.remove('opacity-100', 'translate-y-0', 'visible');
        menu.style.visibility = 'hidden';
        menu.style.opacity = '0';
        menu.style.transform = 'translateY(1rem)';
        menu.classList.add('opacity-0', 'translate-y-4', 'invisible');
        
        body.style.overflow = ''; 

        if (lineTop) {
            lineTop.classList.remove('rotate-45', 'translate-y-[6px]');
            lineTop.style.transform = '';
            lineTop.style.backgroundColor = ''; 
        }
        if (lineBottom) {
            lineBottom.classList.remove('-rotate-45', '-translate-y-[6px]');
            lineBottom.style.transform = '';
            lineBottom.style.backgroundColor = ''; 
        }
        
        if(btn) btn.style.zIndex = '';
    }
};

// ==========================================
// 2. CARGA DEL HEADER E INYECCIÓN
// ==========================================
function loadHeader() {
    const element = document.querySelector('header');
    const placeholder = document.getElementById('header-placeholder');

    if (element && element.children.length > 0) {
        if (!element.id) element.id = 'main-header';
        initializeHeader();
        return;
    }

    fetch('components/header.html?v=' + Date.now())
        .then(response => response.ok ? response.text() : Promise.reject(response.status))
        .then(data => {
            if (placeholder) {
                placeholder.outerHTML = `<header id="main-header" class="sticky top-0 z-[70] bg-white/90 backdrop-blur-md border-b border-gray-200/50">${data}</header>`;
            } else if (element) {
                element.innerHTML = data;
                if (!element.id) element.id = 'main-header';
            }
            initializeHeader();
        })
        .catch(error => console.error('Error loading header:', error));
}

function initializeHeader() {
    const existingMenu = document.getElementById('mobile-menu');
    if (existingMenu) existingMenu.remove();

    const mobileMenuHTML = `
            <nav id="mobile-menu"
                class="fixed inset-0 w-screen h-[100dvh] z-[9999] bg-white flex flex-col items-center justify-center space-y-6 transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] opacity-0 invisible translate-y-4 md:hidden overflow-hidden">
                
                <div class="flex flex-col items-center space-y-5 text-center w-full px-4">
                    <a href="index.html" class="block w-32 pb-2 border-b border-gray-300 text-sm font-bold font-brand uppercase tracking-[0.2em] text-text-dark hover:text-rp-teal hover:border-rp-teal transition-all duration-300" onclick="toggleMobileMenu()">Inicio</a>
                    <a href="talleres.html" class="block w-32 pb-2 border-b border-gray-300 text-sm font-bold font-brand uppercase tracking-[0.2em] text-text-dark hover:text-rp-teal hover:border-rp-teal transition-all duration-300" onclick="toggleMobileMenu()">Talleres</a>
                    <a href="nosotros.html" class="block w-32 pb-2 border-b border-gray-300 text-sm font-bold font-brand uppercase tracking-[0.2em] text-text-dark hover:text-rp-teal hover:border-rp-teal transition-all duration-300" onclick="toggleMobileMenu()">Nosotros</a>
                    <a href="galeria.html" class="block w-32 pb-2 border-b border-gray-300 text-sm font-bold font-brand uppercase tracking-[0.2em] text-text-dark hover:text-rp-teal hover:border-rp-teal transition-all duration-300" onclick="toggleMobileMenu()">Galería</a>
                    <a href="tienda.html" class="block w-32 pb-2 border-b border-gray-300 text-sm font-bold font-brand uppercase tracking-[0.2em] text-text-dark hover:text-rp-teal hover:border-rp-teal transition-all duration-300" onclick="toggleMobileMenu()">Tienda</a>
                    <a href="contacto.html" class="block w-32 pb-2 border-b border-gray-300 text-sm font-bold font-brand uppercase tracking-[0.2em] text-text-dark hover:text-rp-teal hover:border-rp-teal transition-all duration-300" onclick="toggleMobileMenu()">Contacto</a>
                </div>

                <div class="mt-10 flex gap-8 opacity-70">
                    <a href="https://www.instagram.com/circula.uy/" target="_blank" class="hover:text-rp-teal text-text-dark transition text-3xl">
                        <i class="fab fa-instagram"></i>
                    </a>
                    <a href="https://www.linkedin.com/company/circulauy" target="_blank" class="hover:text-rp-teal text-text-dark transition text-3xl">
                        <i class="fab fa-linkedin"></i>
                    </a>
                </div>
            </nav>`;

    document.body.insertAdjacentHTML('beforeend', mobileMenuHTML);
    setActiveLink();

    const cartContainer = document.getElementById('cart-dropdown-container');
    const cartDropdown = document.getElementById('cart-dropdown');

    if (cartContainer && cartDropdown) {
        let hideTimeout;
        cartContainer.addEventListener('mouseenter', () => {
            clearTimeout(hideTimeout);
            updateCartDropdown(); 
            cartDropdown.style.display = 'block';
        });
        cartContainer.addEventListener('mouseleave', () => {
            hideTimeout = setTimeout(() => { cartDropdown.style.display = 'none'; }, 200);
        });
        cartDropdown.addEventListener('mouseenter', () => clearTimeout(hideTimeout));
        cartDropdown.addEventListener('mouseleave', () => {
            hideTimeout = setTimeout(() => { cartDropdown.style.display = 'none'; }, 200);
        });
    }

    updateCartCount();
    if (typeof ScrollTrigger !== 'undefined') setTimeout(() => ScrollTrigger.refresh(), 100);
    window.dispatchEvent(new Event('headerLoaded'));
}

// ==========================================
// 3. CARGA DE FOOTER & WHATSAPP
// ==========================================
function loadFooter() {
    fetch('components/footer-content.html?v=' + Date.now())
        .then(res => res.ok ? res.text() : Promise.reject(res.status))
        .then(data => {
            const placeholder = document.getElementById('footer-placeholder');
            const element = document.querySelector('footer');
            if (placeholder) placeholder.outerHTML = `<footer class="bg-text-dark text-white py-12 border-t border-gray-800">${data}</footer>`;
            else if (element) element.innerHTML = data;
            
            const yearSpan = document.getElementById('current-year');
            if (yearSpan) yearSpan.textContent = new Date().getFullYear();
        })
        .catch(err => console.error('Error loading footer:', err));
}

function loadWhatsApp() {
    if (document.getElementById('whatsapp-widget')) return;
    fetch('components/whatsapp-widget.html')
        .then(res => res.text())
        .then(data => {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = data;
            tempDiv.querySelectorAll('style').forEach(s => document.head.appendChild(s));
            const widget = tempDiv.querySelector('#whatsapp-widget');
            if (widget) document.body.appendChild(widget);
        })
        .catch(err => console.error('Error loading WhatsApp:', err));
}

window.toggleChat = function () {
    const chatBox = document.getElementById('whatsapp-chat-box');
    if (chatBox) chatBox.classList.toggle('hidden');
};

window.enviarWhatsApp = function () {
    const input = document.getElementById('mensaje-usuario');
    const msg = input.value.trim();
    if (!msg) return alert("Escribe un mensaje.");
    window.open(`https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(msg)}`, '_blank');
    document.getElementById('whatsapp-chat-box').classList.add('hidden');
    input.value = '';
};

// ==========================================
// 4. UTILIDADES
// ==========================================
function setActiveLink() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    
    document.querySelectorAll('#desktop-nav a').forEach(link => {
        const href = link.getAttribute('href');
        link.className = 'nav-link font-brand font-normal text-sm text-text-dark hover:text-rp-teal transition uppercase tracking-widest';
        if (href === currentPath) link.className = 'font-brand font-bold text-sm text-rp-teal transition uppercase tracking-widest border-b-2 border-rp-teal';
    });

    document.querySelectorAll('#mobile-menu a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath) {
            link.classList.add('text-rp-teal', 'border-rp-teal');
            link.classList.remove('text-text-dark', 'border-gray-300');
        }
    });
}

// ==========================================
// 5. LÓGICA DE DETALLE DE PRODUCTO (GALERÍA CON FLECHAS)
// ==========================================
function loadProductDetails() {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('product');

    if (!productId || !document.getElementById('detail-container')) return;

    const product = PRODUCTS_DB[productId];

    if (product) {
        document.title = `${product.name} - Circula`;
        
        const imgEl = document.getElementById('detail-img');
        const thumbsContainer = document.getElementById('detail-thumbnails');
        const prevBtn = document.getElementById('prev-img-btn');
        const nextBtn = document.getElementById('next-img-btn');

        const titleEl = document.getElementById('detail-title');
        const priceEl = document.getElementById('detail-price');
        const descEl = document.getElementById('detail-desc');
        const addBtn = document.getElementById('detail-add-btn');

        // Validar imágenes
        const images = product.images && product.images.length > 0 ? product.images : ['images/logo.png'];
        let currentImageIndex = 0;

        // Función interna para actualizar la imagen principal y miniaturas
        function updateMainImage(index) {
            // Asegurar límites
            if (index < 0) index = images.length - 1;
            if (index >= images.length) index = 0;
            currentImageIndex = index;

            // Cambiar SRC con una pequeña animación de opacidad
            imgEl.style.opacity = '0.8';
            setTimeout(() => {
                imgEl.src = images[currentImageIndex];
                imgEl.style.opacity = '1';
            }, 150);

            // Actualizar borde activo en miniaturas
            if (thumbsContainer) {
                 Array.from(thumbsContainer.children).forEach((thumb, i) => {
                    if (i === currentImageIndex) {
                        thumb.classList.add('border-rp-teal');
                        thumb.classList.remove('border-transparent');
                    } else {
                        thumb.classList.remove('border-rp-teal');
                        thumb.classList.add('border-transparent');
                    }
                });
            }
        }

        // Inicializar Imagen
        updateMainImage(0);
        
        // Generar Miniaturas y Configurar Flechas
        if (thumbsContainer) {
            thumbsContainer.innerHTML = '';
            images.forEach((imgSrc, index) => {
                const thumb = document.createElement('img');
                thumb.src = imgSrc;
                // Clase base para miniaturas
                thumb.className = `w-20 h-20 object-cover rounded-lg cursor-pointer border-2 transition-all duration-300 hover:opacity-80 hover:scale-105`;
                
                thumb.onclick = () => updateMainImage(index);
                thumbsContainer.appendChild(thumb);
            });

            // Configurar flechas si hay más de 1 imagen
            if (images.length > 1) {
                if (prevBtn) {
                    prevBtn.classList.remove('hidden');
                    prevBtn.onclick = () => updateMainImage(currentImageIndex - 1);
                }
                if (nextBtn) {
                    nextBtn.classList.remove('hidden');
                    nextBtn.onclick = () => updateMainImage(currentImageIndex + 1);
                }
            }
        }

        // Renderizar Textos
        if (titleEl) titleEl.textContent = product.name;
        if (priceEl) priceEl.textContent = `$${product.price}`;
        if (descEl) descEl.textContent = product.desc || 'Sin descripción disponible.';
        
        // Lógica Botón Agregar
        if (addBtn) {
            addBtn.onclick = function() {
                window.addItemToCart({
                    id: productId,
                    name: product.name,
                    price: product.price,
                    quantity: 1,
                    imageUrl: images[0] // Usa la primera imagen como principal para el carrito
                });
                
                const originalText = addBtn.innerHTML;
                addBtn.innerHTML = '<i class="fas fa-check mr-2"></i> ¡AGREGADO!';
                addBtn.classList.remove('bg-mp-blue');
                addBtn.classList.add('bg-green-600');
                
                setTimeout(() => {
                    addBtn.innerHTML = originalText;
                    addBtn.classList.remove('bg-green-600');
                    addBtn.classList.add('bg-mp-blue');
                }, 2000);
            };
        }
    } else {
        document.getElementById('detail-container').innerHTML = 
            '<div class="col-span-2 text-center py-20"><h2 class="text-2xl font-bold text-gray-400">Producto no encontrado.</h2><a href="tienda.html" class="text-rp-teal mt-4 block hover:underline">Volver a la tienda</a></div>';
    }
}

// ==========================================
// 6. LÓGICA DE CHECKOUT / CARRITO
// ==========================================
function renderCheckoutPage() {
    const container = document.getElementById('cart-items-container');
    const totalEl = document.getElementById('cart-total-page');
    
    if (!container) return; 

    const cart = getCart();
    container.innerHTML = '';
    
    if (cart.length === 0) {
        container.innerHTML = '<p class="text-center text-gray-500 py-8">Tu carrito está vacío.</p>';
        if(totalEl) totalEl.textContent = '$0.00';
        return;
    }

    let total = 0;
    
    cart.forEach((item, index) => {
        const itemTotal = parseFloat(item.price) * parseInt(item.quantity);
        total += itemTotal;
        
        const row = document.createElement('div');
        row.className = 'flex flex-col sm:flex-row items-center justify-between border-b border-gray-200 py-4 gap-4';
        row.innerHTML = `
            <div class="flex items-center gap-4 w-full sm:w-auto">
                <img src="${item.imageUrl || 'images/logo.png'}" class="w-20 h-20 object-cover rounded-lg border border-gray-200">
                <div>
                    <h3 class="font-bold text-lg text-text-dark">${item.name}</h3>
                    <p class="text-sm text-gray-500">$${item.price} c/u</p>
                </div>
            </div>
            
            <div class="flex items-center gap-6">
                <div class="flex items-center border border-gray-300 rounded-full overflow-hidden">
                    <button onclick="decrementCartItem(${index}); renderCheckoutPage();" class="px-3 py-1 hover:bg-gray-100">-</button>
                    <span class="px-3 py-1 font-bold text-sm">${item.quantity}</span>
                    <button onclick="incrementCartItem(${index}); renderCheckoutPage();" class="px-3 py-1 hover:bg-gray-100">+</button>
                </div>
                <p class="font-bold text-lg min-w-[80px] text-right">$${itemTotal.toFixed(2)}</p>
                <button onclick="removeCartItem(${index}); renderCheckoutPage();" class="text-red-500 hover:text-red-700">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        container.appendChild(row);
    });

    if(totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
}

window.enviarPedidoWhatsApp = function() {
    const nombre = document.getElementById('checkout-name')?.value || '';
    const direccion = document.getElementById('checkout-address')?.value || '';
    
    if(!nombre || !direccion) {
        alert("Por favor completa tu nombre y dirección.");
        return;
    }

    const cart = getCart();
    if(cart.length === 0) return alert("El carrito está vacío.");

    let mensaje = `Hola Circula, soy ${nombre}. Quisiera realizar el siguiente pedido:\n\n`;
    let total = 0;

    cart.forEach(item => {
        const sub = item.price * item.quantity;
        total += sub;
        mensaje += `- ${item.quantity}x ${item.name} ($${sub})\n`;
    });

    mensaje += `\n*Total: $${total}*\n`;
    mensaje += `📍 Dirección de envío: ${direccion}`;

    window.open(`https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(mensaje)}`, '_blank');
};

// ==========================================
// 7. LÓGICA CORE DEL CARRITO (GLOBAL)
// ==========================================
function getCart() {
    try {
        const raw = localStorage.getItem('cartItems');
        const cart = raw ? JSON.parse(raw) : [];
        return Array.isArray(cart) ? cart : [];
    } catch (e) { return []; }
}

function saveCart(cart) {
    try {
        localStorage.setItem('cartItems', JSON.stringify(cart));
        window.dispatchEvent(new Event('cartUpdated'));
        window.dispatchEvent(new Event('storage'));
        window.updateCartCount();
        if(document.getElementById('cart-items-container')) renderCheckoutPage();
    } catch (e) { console.error(e); }
}

window.updateCartCount = function () {
    const cart = getCart();
    const total = cart.reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0);
    const countEl = document.getElementById('cart-count');
    if (countEl) countEl.textContent = total;
    updateCartDropdown();
}

window.incrementCartItem = function (index) {
    let cart = getCart();
    if (cart[index]) {
        cart[index].quantity++;
        saveCart(cart);
    }
};

window.decrementCartItem = function (index) {
    let cart = getCart();
    if (cart[index]) {
        cart[index].quantity--;
        if (cart[index].quantity <= 0) cart.splice(index, 1);
        saveCart(cart);
    }
};

window.removeCartItem = function (index) {
    let cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
};

window.addItemToCart = function (arg1, arg2, arg3, arg4) {
    let cart = getCart();
    let product = (typeof arg1 === 'string') 
        ? { id: arg1.toLowerCase().replace(/\s+/g, '-'), name: arg1, price: arg2, quantity: arg3, imageUrl: arg4 } 
        : arg1;

    const price = parseFloat(product.price) || 0;
    const qty = parseInt(product.quantity) || 1;
    const name = product.name || 'Producto';
    const id = product.id || name.toLowerCase().replace(/\s+/g, '-');
    const img = product.imageUrl || 'images/logo.png';

    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.quantity += qty;
    } else {
        cart.push({ id, name, price, quantity: qty, imageUrl: img });
    }

    saveCart(cart);
    window.dispatchEvent(new CustomEvent('cart:item-added', { detail: { product, cart } }));
    console.log('Item added:', name);
};

function updateCartDropdown() {
    const list = document.getElementById('dropdown-items-list');
    const totalDisplay = document.getElementById('dropdown-total');
    if (!list || !totalDisplay) return;

    const cart = getCart();
    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    list.style.color = '#1f2937';
    totalDisplay.textContent = `$${total.toFixed(2)}`;

    const titleStyle = document.querySelector('#cart-dropdown h4');
    if(titleStyle) titleStyle.textContent = `Resumen (${cart.length})`;

    if (cart.length === 0) {
        list.innerHTML = `<div style="padding: 20px; text-align: center; color: #6b7280;">Tu carrito está vacío.</div>`;
    } else {
        list.innerHTML = cart.slice(0, 3).map(item => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #f3f4f6;">
                <div style="display: flex; align-items: center; gap: 12px; overflow: hidden; flex: 1;">
                    <img src="${item.imageUrl || 'images/logo.png'}" class="w-12 h-12 object-cover rounded border border-gray-200">
                    <div style="display: flex; flex-direction: column;">
                        <span style="font-size: 14px; font-weight: 600; color: #1f2937;">${item.name}</span>
                        <span style="font-size: 12px; color: #6b7280;">Cant: ${item.quantity}</span>
                    </div>
                </div>
                <span style="font-weight: 700; font-size: 14px; color: #4b5563;">$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `).join('');
        
        if (cart.length > 3) {
            list.insertAdjacentHTML('beforeend', `<p style="text-align: center; font-size: 12px; font-weight: 600; color: #79C7C7; margin-top: 12px;">+ ${cart.length - 3} más</p>`);
        }
    }
    
    const btns = document.querySelectorAll('#dropdown-summary button, #dropdown-summary a');
    btns.forEach(btn => {
        btn.style.opacity = cart.length === 0 ? '0.5' : '1';
        btn.style.pointerEvents = cart.length === 0 ? 'none' : 'auto';
    });
}

// ==========================================
// 8. INICIALIZACIÓN GLOBAL
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    loadHeader();
    loadFooter();
    loadWhatsApp();
    
    // Detectar si estamos en páginas específicas
    if (window.location.pathname.includes('detalle.html')) {
        loadProductDetails();
    }
    if (window.location.pathname.includes('carrito.html') || window.location.pathname.includes('datos.html')) {
        renderCheckoutPage();
    }

    setTimeout(() => window.updateCartCount(), 500);
});