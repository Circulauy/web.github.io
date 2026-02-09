// Global function to ensure visibility
window.toggleMobileMenu = function () {
    console.log('Mobile menu toggled');
    const menu = document.getElementById('mobile-menu');
    const lineTop = document.getElementById('line-top');
    const lineBottom = document.getElementById('line-bottom');
    const body = document.body;

    if (!menu) {
        console.warn('Menu element not found');
        return;
    }

    // Check visibility via style or class
    const isClosed = menu.classList.contains('invisible') || menu.style.visibility === 'hidden' || getComputedStyle(menu).visibility === 'hidden';

    if (isClosed) {
        // OPEN
        console.log('Opening menu...');
        // Remove hiding classes
        menu.classList.remove('invisible', 'opacity-0', 'translate-y-4');
        // Force direct styles to guarantee visibility
        menu.style.visibility = 'visible';
        menu.style.opacity = '1';
        menu.style.transform = 'translateY(0)';

        menu.classList.add('opacity-100', 'translate-y-0', 'visible');
        body.style.overflow = 'hidden'; // Lock scroll

        // Animate Icon to X
        if (lineTop) {
            lineTop.classList.add('rotate-45', 'translate-y-[6px]');
            lineTop.style.transform = 'translateY(6px) rotate(45deg)';
        }
        if (lineBottom) {
            lineBottom.classList.add('-rotate-45', '-translate-y-[6px]');
            lineBottom.style.transform = 'translateY(-6px) rotate(-45deg)';
        }

    } else {
        // CLOSE
        console.log('Closing menu...');
        menu.classList.remove('opacity-100', 'translate-y-0', 'visible');

        // Force direct styles
        menu.style.visibility = 'hidden';
        menu.style.opacity = '0';
        menu.style.transform = 'translateY(1rem)'; // 4 units

        menu.classList.add('opacity-0', 'translate-y-4', 'invisible');
        body.style.overflow = ''; // Unlock scroll

        // Reset Icon
        if (lineTop) {
            lineTop.classList.remove('rotate-45', 'translate-y-[6px]');
            lineTop.style.transform = '';
        }
        if (lineBottom) {
            lineBottom.classList.remove('-rotate-45', '-translate-y-[6px]');
            lineBottom.style.transform = '';
        }
    }
};

// Function to load the header
function loadHeader() {
    const element = document.querySelector('header');
    const placeholder = document.getElementById('header-placeholder');

    // Check if header is already populated (Static HTML for instant load)
    if (element && element.children.length > 0) {
        console.log('Static header detected. Skipping fetch.');
        initializeHeader();
        return;
    }

    // Cache-busting to ensure latest header version
    console.log('Fetching header...');
    fetch('components/header.html?v=' + Date.now())
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            console.log(`Header data received. Length: ${data.length}`);

            if (placeholder) {
                placeholder.outerHTML = `<header class="sticky top-0 z-[70] bg-white/90 backdrop-blur-md border-b border-gray-200/50">${data}</header>`;
            } else if (element) {
                element.innerHTML = data;
            }

            initializeHeader();
        })
        .catch(error => console.error('Error loading header:', error));
}

function initializeHeader() {
    // CRITICAL FIX: Inject Mobile Menu directly into Body
    // This bypasses any issues with header.html fetch/parse dropping the nav element.
    const existingMenu = document.getElementById('mobile-menu');
    if (existingMenu) existingMenu.remove(); // Clean up if any

    // CORRECCIÓN PRINCIPAL: SVGs limpiados para evitar error de parseo
    const mobileMenuHTML = `
            <nav id="mobile-menu"
                class="fixed inset-0 z-[60] bg-white/98 backdrop-blur-xl flex flex-col items-center justify-center space-y-8 transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] opacity-0 invisible translate-y-4 md:hidden">
                
                <div class="flex flex-col items-center space-y-6 text-center">
                    <a href="index.html" class="text-3xl font-heading text-text-dark hover:text-rp-teal transition-colors duration-300" onclick="toggleMobileMenu()">Inicio</a>
                    <a href="talleres.html" class="text-3xl font-heading text-text-dark hover:text-rp-teal transition-colors duration-300" onclick="toggleMobileMenu()">Talleres</a>
                    <a href="nosotros.html" class="text-3xl font-heading text-text-dark hover:text-rp-teal transition-colors duration-300" onclick="toggleMobileMenu()">Nosotros</a>
                    <a href="galeria.html" class="text-3xl font-heading text-text-dark hover:text-rp-teal transition-colors duration-300" onclick="toggleMobileMenu()">Galería</a>
                    <a href="tienda.html" class="text-3xl font-heading text-text-dark hover:text-rp-teal transition-colors duration-300" onclick="toggleMobileMenu()">Tienda</a>
                    <a href="contacto.html" class="text-3xl font-heading text-text-dark hover:text-rp-teal transition-colors duration-300" onclick="toggleMobileMenu()">Contacto</a>
                </div>

                <div class="mt-8 flex gap-6 opacity-60">
                    <a href="https://www.instagram.com/circula.uy/" target="_blank" class="hover:text-rp-teal text-text-dark transition">
                        <span class="sr-only">Instagram</span>
                        <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                            <path fill-rule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.468 2.37c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clip-rule="evenodd" />
                        </svg>
                    </a>
                    
                    <a href="https://www.linkedin.com/company/circulauy" target="_blank" class="hover:text-rp-teal text-text-dark transition">
                        <span class="sr-only">LinkedIn</span>
                        <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                            <path fill-rule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clip-rule="evenodd" />
                        </svg>
                    </a>
                </div>
            </nav>`;

    document.body.insertAdjacentHTML('beforeend', mobileMenuHTML);
    console.log('Mobile menu injected directly into body.');

    setActiveLink();

    // CART DROPDOWN HOVER TRIGGER (Fixes empty state issues)
    const cartContainer = document.getElementById('cart-dropdown-container');
    const cartDropdown = document.getElementById('cart-dropdown');

    if (cartContainer && cartDropdown) {
        let hideTimeout;

        // Force show on hover with direct styles
        cartContainer.addEventListener('mouseenter', () => {
            clearTimeout(hideTimeout);
            updateCartDropdown(); // Refresh data ON HOVER
            cartDropdown.style.display = 'block';
        });

        // Hide on leave with delay (stability fix)
        cartContainer.addEventListener('mouseleave', () => {
            hideTimeout = setTimeout(() => {
                cartDropdown.style.display = 'none';
            }, 200);
        });

        // Also keep open if hovering the dropdown itself (extra safety)
        cartDropdown.addEventListener('mouseenter', () => {
            clearTimeout(hideTimeout);
        });

        cartDropdown.addEventListener('mouseleave', () => {
            hideTimeout = setTimeout(() => {
                cartDropdown.style.display = 'none';
            }, 200);
        });
    }

    // Always update cart count on load
    updateCartCount();

    // Refresh ScrollTrigger if it exists (fixes index video scroll)
    if (typeof ScrollTrigger !== 'undefined') {
        setTimeout(() => ScrollTrigger.refresh(), 100);
    }

    // Dispatch event for other scripts
    window.dispatchEvent(new Event('headerLoaded'));
}

// Function to load the footer
function loadFooter() {
    fetch('components/footer-content.html?v=' + Date.now())
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            const placeholder = document.getElementById('footer-placeholder');
            const element = document.querySelector('footer');

            if (placeholder) {
                placeholder.outerHTML = `<footer class="bg-text-dark text-white py-12 border-t border-gray-800">${data}</footer>`;
            } else if (element) {
                element.innerHTML = data;
            }

            // Update current year in footer
            const yearSpan = document.getElementById('current-year');
            if (yearSpan) {
                yearSpan.textContent = new Date().getFullYear();
            }
        })
        .catch(error => console.error('Error loading footer:', error));
}

// Function to load the WhatsApp Widget
function loadWhatsApp() {
    const existingWidget = document.getElementById('whatsapp-widget');
    if (existingWidget) {
        console.log('WhatsApp widget already exists. Skipping load.');
        return;
    }

    fetch('components/whatsapp-widget.html')
        .then(response => response.text())
        .then(data => {
            // Create a temporary container to parse the HTML
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = data;

            // Extract the widget container
            const widget = tempDiv.querySelector('#whatsapp-widget');

            // Extract styles
            const styles = tempDiv.querySelectorAll('style');
            styles.forEach(style => document.head.appendChild(style));

            // Extract FontAwesome link if needed (check if already exists)
            const links = tempDiv.querySelectorAll('link');
            links.forEach(link => {
                const href = link.getAttribute('href');
                if (href && !document.querySelector(`link[href="${href}"]`)) {
                    document.head.appendChild(link);
                }
            });

            if (widget) {
                document.body.appendChild(widget);
                console.log('WhatsApp widget loaded successfully.');
            }
        })
        .catch(error => console.error('Error loading WhatsApp widget:', error));
}

// WhatsApp Widget Logic (Global)
const NUMERO_WHATSAPP = "59899395724"; // Número de WhatsApp para contacto

window.toggleChat = function () {
    const chatBox = document.getElementById('whatsapp-chat-box');
    if (chatBox) {
        chatBox.classList.toggle('hidden');
    }
};

window.enviarWhatsApp = function () {
    const mensajeInput = document.getElementById('mensaje-usuario');
    const mensajeUsuario = mensajeInput.value;

    if (mensajeUsuario.trim() === "") {
        alert("Por favor, escribe un mensaje antes de enviarlo.");
        return;
    }

    // GA4 Event: WhatsApp click (si existe dataLayer)
    if (window.dataLayer) {
        window.dataLayer.push({
            event: 'click_whatsapp',
            message_length: mensajeUsuario.length,
            interaction_type: 'chat'
        });
    }

    const mensajeCodificado = encodeURIComponent(mensajeUsuario);
    const urlWhatsApp = `https://wa.me/${NUMERO_WHATSAPP}?text=${mensajeCodificado}`;
    window.open(urlWhatsApp, '_blank');

    // Opcional: Cerrar chat y limpiar input
    const chatBox = document.getElementById('whatsapp-chat-box');
    if (chatBox) chatBox.classList.add('hidden');
    mensajeInput.value = '';
};



// Function to set active link based on current URL
function setActiveLink() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';

    // Desktop Nav
    const desktopLinks = document.querySelectorAll('#desktop-nav a');
    desktopLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        // Reset styled classes
        link.className = 'nav-link font-brand font-normal text-sm text-text-dark hover:text-rp-teal transition uppercase tracking-widest';

        if (linkPath === currentPath) {
            // Add Active Styling (Bold, specific color, border-b)
            link.className = 'font-brand font-bold text-sm text-rp-teal transition uppercase tracking-widest border-b-2 border-rp-teal';
        }
    });

    // Mobile Nav
    const mobileLinks = document.querySelectorAll('#mobile-menu a');
    mobileLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        // Reset
        link.className = 'block px-6 py-3 text-sm font-bold uppercase tracking-widest text-text-dark hover:bg-rp-blue-light border-b border-gray-50';

        if (linkPath === currentPath) {
            // Active
            link.className = 'block px-6 py-3 text-sm font-bold uppercase tracking-widest text-rp-teal border-b border-gray-50';
        }
    });
}

// Global update cart count function (exposed for other scripts)
window.updateCartCount = function () {
    let cart = [];
    try {
        const raw = localStorage.getItem('cartItems');
        cart = raw ? JSON.parse(raw) : [];
        if (!Array.isArray(cart)) cart = [];
    } catch (e) { cart = []; }

    // Filter nulls safely
    cart = cart.filter(item => item && typeof item === 'object');

    const total = cart.reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0);
    const countElement = document.getElementById('cart-count');
    if (countElement) {
        countElement.textContent = total;
    }

    // Also update dropdown if it exists
    updateCartDropdown();
}

// Helper to save cart and update UI
function saveCart(cart) {
    console.log('Saving cart:', cart);
    try {
        localStorage.setItem('cartItems', JSON.stringify(cart));
        window.dispatchEvent(new Event('cartUpdated'));
        window.dispatchEvent(new Event('storage'));
        window.updateCartCount();
    } catch (e) {
        console.error('Error saving cart:', e);
    }
}

// Global Cart Actions
window.incrementCartItem = function (index) {
    let cart = getCart();
    if (cart[index]) {
        cart[index].quantity = (parseInt(cart[index].quantity) || 0) + 1;
        saveCart(cart);
    }
};

window.decrementCartItem = function (index) {
    let cart = getCart();
    if (cart[index]) {
        cart[index].quantity = (parseInt(cart[index].quantity) || 0) - 1;
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
        saveCart(cart);
    }
};

window.removeCartItem = function (index) {
    let cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
};

// Global Add to Cart Function
// Global Add to Cart Function (Polymorphic: supports Object or Legacy Arguments)
window.addItemToCart = function (arg1, arg2, arg3, arg4) {
    console.log('Adding to cart (Global):', arg1, arg2, arg3, arg4);
    let cart = getCart();

    let product = {};

    // Check if legacy call: first argument is String (Name)
    if (typeof arg1 === 'string') {
        product = {
            id: arg1.toLowerCase().replace(/\s+/g, '-'), // Generate simplistic ID from name
            name: arg1,
            price: arg2,
            quantity: arg3,
            imageUrl: arg4
        };
    } else {
        // Modern call: Object passed
        product = arg1;
    }

    // Validate and Sanitize
    const price = parseFloat(product.price) || 0;
    const qty = parseInt(product.quantity) || 1;
    const name = product.name || 'Producto sin nombre';
    // Use ID if present, else name as ID
    const id = product.id || name.toLowerCase().replace(/\s+/g, '-');
    const img = product.imageUrl || 'images/logo.png';

    const existingIndex = cart.findIndex(item => item.id === id || item.name === name);

    if (existingIndex > -1) {
        cart[existingIndex].quantity = (parseInt(cart[existingIndex].quantity) || 0) + qty;
        // Update image if new one is provided
        if (img && img !== 'images/logo.png') {
            cart[existingIndex].imageUrl = img;
        }
    } else {
        cart.push({
            id: id,
            name: name,
            price: price,
            quantity: qty,
            imageUrl: img
        });
    }

    saveCart(cart);

    // Dispatch specific event for UI feedback
    const event = new CustomEvent('cart:item-added', {
        detail: { product: product, cart: cart }
    });
    window.dispatchEvent(event);
    console.log('Event cart:item-added dispatched');
};

// Helper: Get Cart safely
function getCart() {
    try {
        const raw = localStorage.getItem('cartItems');
        const cart = raw ? JSON.parse(raw) : [];
        return Array.isArray(cart) ? cart : [];
    } catch (e) {
        console.error('Error reading cart:', e);
        return [];
    }
}

function updateCartDropdown() {
    const dropdownItemsList = document.getElementById('dropdown-items-list');
    const dropdownTotalDisplay = document.getElementById('dropdown-total');

    if (!dropdownTotalDisplay || !dropdownItemsList) return;

    const cartItems = getCart();
    console.log('Updating Dropdown. Items:', cartItems.length);

    // Filter and sanitize
    const validItems = cartItems.map((item, originalIndex) => {
        if (!item || typeof item !== 'object') return null;
        return {
            ...item,
            originalIdx: originalIndex,
            name: item.name || 'Producto',
            price: parseFloat(item.price) || 0,
            quantity: parseInt(item.quantity) || 1,
            imageUrl: item.imageUrl || 'images/logo.png'
        };
    }).filter(item => item !== null);

    // Calculate Total
    const total = validItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    // Initial styling for visibility
    dropdownItemsList.style.color = '#1f2937';
    dropdownItemsList.style.display = 'block';

    // Update Title with Count
    const titleStyle = document.querySelector('#cart-dropdown h4');
    if (titleStyle) {
        titleStyle.textContent = `Resumen (${validItems.length})`;
    }

    // Render Items
    if (validItems.length === 0) {
        console.log("Cart is empty (render)");
        dropdownItemsList.innerHTML = `<div style="padding: 20px; text-align: center; color: #6b7280;">Tu carrito está vacío.</div>`;
    } else {
        console.log("Rendering items:", validItems);
        // Logic from index-old-full.html: Simple display, limit to 3 items
        const itemsToShow = validItems.slice(0, 3);
        let itemsHtml = '';

        itemsToShow.forEach(item => {
            const itemTotal = (item.price * item.quantity).toFixed(2);
            // Bulletproof item HTML with explicit styles
            itemsHtml += `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #f3f4f6; width: 100%;">
                    <div style="display: flex; align-items: center; gap: 12px; overflow: hidden; flex: 1;">
                        <img src="${item.imageUrl}" alt="${item.name}" 
                             style="width: 48px; height: 48px; object-fit: cover; border-radius: 6px; flex-shrink: 0; background-color: #f3f4f6; border: 1px solid #e5e7eb;"
                             onerror="this.src='images/logo.png'">
                        <div style="display: flex; flex-direction: column; overflow: hidden;">
                            <span style="font-size: 14px; font-weight: 600; color: #1f2937; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 140px;">${item.name}</span>
                            <span style="font-size: 12px; color: #6b7280;">Cant: ${item.quantity}</span>
                        </div>
                    </div>
                    <span style="font-weight: 700; font-size: 14px; color: #4b5563; margin-left: 8px;">$${itemTotal}</span>
                </div>
            `;
        });

        dropdownItemsList.innerHTML = itemsHtml;

        if (validItems.length > 3) {
            const remaining = validItems.length - 3;
            dropdownItemsList.insertAdjacentHTML('beforeend',
                `<p style="text-align: center; font-size: 12px; font-weight: 600; color: #79C7C7; margin-top: 12px; cursor: pointer;">+ ${remaining} más en el carrito</p>`
            );
        }
    }

    // Render Summary (Total + Buttons) - Dynamic Injection
    const summaryContainer = document.getElementById('dropdown-summary');
    if (summaryContainer) {
        const isCartEmpty = validItems.length === 0;
        const totalFormatted = total.toFixed(2);
        const opacity = isCartEmpty ? '0.5' : '1';
        const cursor = isCartEmpty ? 'not-allowed' : 'pointer';

        summaryContainer.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; font-weight: bold; font-size: 1.25rem; margin-bottom: 1rem; color: #111827;">
                <span style="font-family: 'Patua One', cursive;">Total:</span>
                <span style="color: #009ee3; font-family: 'Patua One', cursive;">$${totalFormatted}</span>
            </div>
            
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                <button onclick="if(!${isCartEmpty}) window.location.href='datos.html'"
                    style="display: block; width: 100%; padding: 0.75rem; background-color: #4da3d4; color: white; font-family: 'Patua One', cursive; font-size: 1rem; border: none; border-radius: 0.5rem; transition: background-color 0.2s; text-shadow: 0 1px 2px rgba(0,0,0,0.1); opacity: ${opacity}; cursor: ${cursor};"
                    onmouseover="if(!${isCartEmpty}) this.style.backgroundColor='#3a8bb8'" 
                    onmouseout="if(!${isCartEmpty}) this.style.backgroundColor='#4da3d4'">
                    Finalizar Compra
                </button>
                
                <a href="carrito.html"
                    style="display: block; width: 100%; padding: 0.75rem; background-color: #92c9c9; color: white; font-family: 'Patua One', cursive; font-size: 1rem; text-align: center; border-radius: 0.5rem; text-decoration: none; transition: background-color 0.2s; text-shadow: 0 1px 2px rgba(0,0,0,0.1);"
                    onmouseover="this.style.backgroundColor='#7ab2b2'" onmouseout="this.style.backgroundColor='#92c9c9'">
                    Ver Carrito
                </a>
            </div>
        `;
    }
}

// Initial Load
document.addEventListener('DOMContentLoaded', () => {
    // DEMO DATA INJECTION
    try {
        const existing = localStorage.getItem('cartItems');
        if (!existing || JSON.parse(existing).length === 0) {
            // Only inject if truly empty and wanting demo
            // const demoItems = [ ... ];
            // localStorage.setItem('cartItems', JSON.stringify(demoItems));
        }
    } catch (e) { console.error(e); }

    loadHeader();
    loadFooter();
    loadWhatsApp();

    // Force immediate update after a short delay to ensure Header is in DOM
    setTimeout(() => {
        window.updateCartCount();
        console.log('Force update trigger');
    }, 500);
});