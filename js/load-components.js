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
    },
    'bandeja': {
        name: 'Bandeja',
        price: null,
        desc: 'Una bandeja moderna y funcional, ideal para servir o decorar. Cada pieza presenta un patrón único e irrepetible, resultado de nuestro proceso artesanal de reciclaje de tapitas y envases de plástico.',
        images: ['images/Tienda/bandeja.png'],
        upcoming: true
    },
    'banco-alto': {
        name: 'Banco Alto',
        price: null,
        desc: 'Asiento resistente e impermeable con estructura robusta combinada con una superficie superior de placa reciclada en nuestras texturas exclusivas. Ideal tanto para interiores como exteriores.',
        images: ['images/Tienda/banco-alto.png'],
        upcoming: true
    },
    'banco-bajo': {
        name: 'Banco Bajo',
        price: null,
        desc: 'Taburete o asiento bajo ecológico y versátil, con una superficie de plástico 100% reciclado. Resistente al agua, duradero y con un diseño moderno.',
        images: ['images/Tienda/banco-bajo.png'],
        upcoming: true
    },
    'comedero-mascotas': {
        name: 'Comedero / Bebedero para Mascotas',
        price: null,
        desc: 'Diseño higiénico, estable y duradero para tus animales. La base de alta resistencia está hecha de plástico 100% reciclado y cuenta con dos bowls de acero inoxidable desmontables.',
        images: ['images/Tienda/comedero.png'],
        upcoming: true
    },
    'espejo': {
        name: 'Espejo Circular (35 cm)',
        price: null,
        desc: 'Espejo de pared con un llamativo marco circular de 35 cm de diámetro fabricado a partir de nuestras placas recicladas. Aporta color, textura y sustentabilidad a cualquier ambiente.',
        images: ['images/Tienda/espejo.png'],
        upcoming: true
    },
    'estanteria': {
        name: 'Estantería',
        price: null,
        desc: 'Estantería de diseño moderno con baldas fabricadas con plástico 100% reciclado. Ofrece gran resistencia a la humedad, al peso y es ideal para exhibir tus objetos favoritos.',
        images: ['images/Tienda/estanteria.png'],
        upcoming: true
    },
    'mesa': {
        name: 'Mesa',
        price: null,
        desc: 'Mesa ratona o de centro que combina una estructura metálica minimalista con una tapa superior de plástico 100% reciclado. Un punto focal ecológico y sofisticado para tu living.',
        images: ['images/Tienda/mesa.png'],
        upcoming: true
    },
    'perchero-individual': {
        name: 'Perchero Individual',
        price: null,
        desc: 'Colgador de pared individual con botón torneado de plástico 100% reciclado. Una solución simple, estética y sustentable para organizar tus abrigos, bolsos o llaves.',
        images: ['images/Tienda/perchero-individual.png'],
        upcoming: true
    },
    'perchero-multiple': {
        name: 'Perchero Múltiple',
        price: null,
        desc: 'Perchero de pared múltiple que cuenta con colgadores de plástico 100% reciclado sobre una base robusta. Perfecto para el recibidor, aportando color y diseño ecológico.',
        images: ['images/Tienda/perchero-multiple.png'],
        upcoming: true
    },
    'porta-macetas': {
        name: 'Porta Macetas',
        price: null,
        desc: 'Soporte de diseño para tus plantas. Fabricado con placas de plástico reciclado, es totalmente impermeable y resistente a la humedad del riego. Resalta el verde de la naturaleza.',
        images: ['images/Tienda/porta-macetas.png'],
        upcoming: true
    },
    'reloj': {
        name: 'Reloj de Pared',
        price: null,
        desc: 'Reloj de pared minimalista de funcionamiento silencioso. El cuadrante está hecho a partir de placa de plástico reciclado, convirtiendo cada minuto en un recordatorio de sustentabilidad.',
        images: ['images/Tienda/reloj.png'],
        upcoming: true
    },
    'revistero': {
        name: 'Revistero',
        price: null,
        desc: 'Organizador y revistero de diseño geométrico fabricado con placas de plástico reciclado de alta densidad. Ligero, duradero y de producción ética uruguaya.',
        images: ['images/Tienda/revistero.png'],
        upcoming: true
    },
    'stand-celular': {
        name: 'Soporte para Celular',
        price: null,
        desc: 'Soporte ergonómico de escritorio para celulares. Hecho de plástico 100% reciclado, ofrece una inclinación perfecta para videollamadas, ver contenido o trabajar.',
        images: ['images/Tienda/stand-celular.png'],
        upcoming: true
    },
    'stand-celular-llavero': {
        name: 'Soporte para Celular Llavero',
        price: null,
        desc: 'Práctico soporte portátil para celulares con diseño tipo llavero. Llévalo en tus llaves y ten siempre a mano un soporte estable hecho de plástico reciclado.',
        images: ['images/Tienda/stand-celular-llavero.png'],
        upcoming: true
    },
    'stand-laptop': {
        name: 'Soporte para Laptop / Computadora',
        price: null,
        desc: 'Soporte ergonómico desmontable de dos piezas encastrables en plástico 100% reciclado. Eleva la pantalla de tu laptop para mejorar tu postura y refrigerar tu equipo.',
        images: ['images/Tienda/stand-laptop.png'],
        upcoming: true
    },
    'trofeo-empresarial': {
        name: 'Trofeo Empresarial',
        price: null,
        desc: 'Premio o reconocimiento institucional sustentable. Diseñado a medida con placas de plástico 100% reciclado, ideal para empresas comprometidas con el medio ambiente.',
        images: ['images/Tienda/trofeo.png'],
        upcoming: true
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
    // Obtener el path actual y limpiar extensiones (.html)
    let currentPath = window.location.pathname.split('/').pop();
    currentPath = currentPath.replace('.html', '') || 'index';

    // Normalizar index
    if (currentPath === '') currentPath = 'index';
    
    document.querySelectorAll('#desktop-nav a').forEach(link => {
        let href = link.getAttribute('href');
        if (href) href = href.replace('.html', ''); // Limpiar extension del href tambien

        link.className = 'nav-link font-brand font-normal text-sm text-text-dark hover:text-rp-teal transition uppercase tracking-widest';
        
        if (href === currentPath) {
            link.className = 'font-brand font-bold text-sm text-rp-teal transition uppercase tracking-widest border-b-2 border-rp-teal';
        }
    });

    document.querySelectorAll('#mobile-menu a').forEach(link => {
        let href = link.getAttribute('href');
        if (href) href = href.replace('.html', '');

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
        document.title = `${product.name} | Producto Sustentable Reciclado | Circula`;
        const metaDesc = document.getElementById('page-desc') || document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute('content', `${product.name} - ${product.desc} Fabricado artesanalmente en Uruguay a partir de plástico reciclado. Conoce nuestras texturas: Noche de Rocha, Piedras de Arequita, Marea del Polonio y Cuarzo de Artigas.`);
        }
        
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

        if (product.upcoming) {
            // Ocultar imagen y controles
            if (imgEl) imgEl.style.display = 'none';
            if (prevBtn) prevBtn.classList.add('hidden');
            if (nextBtn) nextBtn.classList.add('hidden');
            if (thumbsContainer) thumbsContainer.style.display = 'none';

            // Crear y agregar placeholder
            const parent = imgEl ? imgEl.parentElement : null;
            if (parent) {
                const existingPlaceholder = parent.querySelector('.detail-placeholder');
                if (existingPlaceholder) existingPlaceholder.remove();

                const placeholder = document.createElement('div');
                placeholder.className = 'detail-placeholder w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-400 gap-4';
                placeholder.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-20 h-20 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span class="text-sm font-medium text-gray-500">Foto disponible próximamente</span>
                `;
                parent.appendChild(placeholder);
            }
        } else {
            // Mostrar imagen y controles si no es upcoming
            if (imgEl) imgEl.style.display = 'block';
            if (thumbsContainer) thumbsContainer.style.display = 'flex';
            const parent = imgEl ? imgEl.parentElement : null;
            if (parent) {
                const existingPlaceholder = parent.querySelector('.detail-placeholder');
                if (existingPlaceholder) existingPlaceholder.remove();
            }

            // Función interna para actualizar la imagen principal y miniaturas
            const updateMainImage = function(index) {
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
            };

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
        }

        // Renderizar Textos
        if (titleEl) titleEl.textContent = product.name;
        if (priceEl) {
            if (product.upcoming) {
                priceEl.textContent = 'Precio a consultar';
                priceEl.className = 'text-3xl text-rp-teal font-extrabold mb-6';
            } else {
                priceEl.textContent = `$${product.price}`;
                priceEl.className = 'text-3xl text-rp-teal font-extrabold mb-6';
            }
        }
        if (descEl) descEl.textContent = product.desc || 'Sin descripción disponible.';

        // Mostrar u ocultar sección de texturas (solo para la nueva línea / productos próximos)
        const texturasEl = document.getElementById('texturas-disponibles');
        if (texturasEl) {
            if (product.upcoming) {
                texturasEl.style.display = 'block';
            } else {
                texturasEl.style.display = 'none';
            }
        }
        
        // Lógica Botón Agregar
        if (addBtn) {
            if (product.upcoming) {
                addBtn.innerHTML = '<i class="fab fa-whatsapp mr-2 text-xl"></i> CONSULTAR PRECIO';
                addBtn.className = 'w-full py-4 bg-rp-teal text-white font-bold rounded-lg hover:bg-rp-teal/90 transition duration-200 title-style text-lg flex items-center justify-center shadow-lg active:scale-95 text-center';
                addBtn.onclick = function(e) {
                    e.preventDefault();
                    const msg = `Hola Circula, me interesa el producto "${product.name}" de la tienda. ¿Podrían darme más información y el precio?`;
                    window.open(`https://wa.me/59899395724?text=${encodeURIComponent(msg)}`, '_blank');
                };
            } else {
                addBtn.className = 'w-full py-4 bg-mp-blue text-white font-bold rounded-lg hover:bg-mp-blue/90 transition duration-200 title-style text-lg flex items-center justify-center shadow-lg active:scale-95';
                addBtn.onclick = function() {
                    window.addItemToCart({
                        id: productId,
                        name: product.name,
                        price: product.price,
                        quantity: 1,
                        imageUrl: images[0] // Usa la primera imagen como principal para el carrito
                    });
                };

                // Feedback visual desacoplado mediante el evento global
                const handleItemAdded = function(e) {
                    if (e.detail && e.detail.product && e.detail.product.id === productId) {
                        const originalText = addBtn.innerHTML;
                        addBtn.innerHTML = '<i class="fas fa-check mr-2"></i> ¡AGREGADO!';
                        addBtn.classList.remove('bg-mp-blue');
                        addBtn.classList.add('bg-green-600');
                        
                        setTimeout(() => {
                            addBtn.innerHTML = originalText;
                            addBtn.classList.remove('bg-green-600');
                            addBtn.classList.add('bg-mp-blue');
                        }, 2000);
                    }
                };
                window.addEventListener('cart:item-added', handleItemAdded);
            }
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

// ==========================================
// TRACKING DE CARRITOS ABANDONADOS
// ==========================================
async function trackCartBackendDirectly(customer_email, customer_name, cartItems) {
    if (!customer_email || !customer_email.includes('@')) return;
    if (!cartItems || cartItems.length === 0) return;

    const total = cartItems.reduce((sum, item) => sum + (parseFloat(item.price) * parseInt(item.quantity)), 0);
    const items = cartItems.map(item => ({
        id: item.id || item.name.toLowerCase().replace(/\s+/g, '-'),
        name: item.name,
        price: parseFloat(item.price),
        quantity: parseInt(item.quantity)
    }));

    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:';

    try {
        if (isLocal) {
            console.log("📝 [MOCK-TRACK-CART] Carrito abandonado trackeado desde saveCart (Simulado):", {
                customer_name,
                customer_email,
                items,
                total
            });
            
            let localMockCarts = [];
            try {
                const stored = localStorage.getItem('localMockCarts');
                if (stored) localMockCarts = JSON.parse(stored);
            } catch (e) {
                console.error(e);
            }
            
            const existingIdx = localMockCarts.findIndex(c => c.customer_email.toLowerCase() === customer_email.toLowerCase() && c.status === 'pending');
            if (existingIdx > -1) {
                localMockCarts[existingIdx].customer_name = customer_name;
                localMockCarts[existingIdx].items = items;
                localMockCarts[existingIdx].total = total;
                localMockCarts[existingIdx].created_at = new Date().toISOString();
            } else {
                localMockCarts.push({
                    id: `MOCK-CART-${Date.now()}`,
                    customer_name,
                    customer_email,
                    items,
                    total,
                    status: 'pending',
                    created_at: new Date().toISOString()
                });
            }
            localStorage.setItem('localMockCarts', JSON.stringify(localMockCarts));
        } else {
            const response = await fetch('/.netlify/functions/track-cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customer_name,
                    customer_email,
                    items,
                    total
                })
            });
            const resData = await response.json();
            console.log("📝 [TRACK-CART] Respuesta del servidor:", resData);
        }
    } catch (err) {
        console.error("Error al trackear carrito abandonado:", err);
    }
}

// ==========================================
// MODAL DE CAPTURA DE EMAIL PARA EL CARRITO
// ==========================================
function showEmailPromptModal(pendingProduct) {
    const existingModal = document.getElementById('cart-email-modal');
    if (existingModal) existingModal.remove();

    const overlay = document.createElement('div');
    overlay.id = 'cart-email-modal';
    overlay.className = 'fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm opacity-0 transition-opacity duration-300 ease-out';
    
    overlay.innerHTML = `
        <div class="relative w-full max-w-md bg-white rounded-2xl p-8 shadow-2xl border border-rp-gray-soft/50 transform scale-95 opacity-0 transition-all duration-300 ease-out" id="cart-email-modal-card" style="font-family: 'Inter', sans-serif;">
            <!-- Botón Cerrar -->
            <button type="button" id="cart-email-modal-close" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none" aria-label="Cerrar">
                <i class="fas fa-times text-lg"></i>
            </button>

            <!-- Encabezado / Icono -->
            <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-rp-blue-light/80 text-rp-teal mb-6">
                <i class="fas fa-shopping-bag text-2xl"></i>
            </div>

            <!-- Título y Subtítulo -->
            <h3 class="text-2xl font-bold text-center text-text-dark title-style mb-2" style="font-family: 'Montserrat', sans-serif;">¡Casi listo!</h3>
            <p class="text-sm text-gray-500 text-center mb-6 leading-relaxed">
                Para agregar este producto al carrito y recibir el seguimiento de tu compra (¡incluyendo beneficios especiales!), por favor ingresa tus datos.
            </p>

            <!-- Formulario -->
            <form id="cart-email-form" class="space-y-5">
                <div>
                    <label for="prompt-name" class="block text-xs font-bold text-text-dark uppercase tracking-wider mb-1.5" style="font-family: 'Montserrat', sans-serif;">Nombre Completo *</label>
                    <input type="text" id="prompt-name" required 
                        class="w-full px-4 py-3 border border-rp-border-default rounded-lg focus:ring-2 focus:ring-rp-teal focus:border-rp-teal transition outline-none text-sm text-text-dark placeholder-gray-400" 
                        placeholder="Tu Nombre y Apellido">
                </div>
                <div>
                    <label for="prompt-email" class="block text-xs font-bold text-text-dark uppercase tracking-wider mb-1.5" style="font-family: 'Montserrat', sans-serif;">Correo Electrónico *</label>
                    <input type="email" id="prompt-email" required 
                        class="w-full px-4 py-3 border border-rp-border-default rounded-lg focus:ring-2 focus:ring-rp-teal focus:border-rp-teal transition outline-none text-sm text-text-dark placeholder-gray-400" 
                        placeholder="tu@email.com">
                </div>

                <div class="pt-2">
                    <button type="submit" 
                        class="w-full py-3.5 bg-rp-teal text-white font-bold rounded-lg hover:bg-rp-teal/90 transition-all duration-200 title-style text-base flex items-center justify-center shadow-lg active:scale-[0.98]" style="font-family: 'Montserrat', sans-serif;">
                        Confirmar y Agregar
                    </button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(overlay);

    // Animación de entrada
    setTimeout(() => {
        overlay.classList.remove('opacity-0');
        const card = document.getElementById('cart-email-modal-card');
        if (card) {
            card.classList.remove('scale-95', 'opacity-0');
            card.classList.add('scale-100', 'opacity-100');
        }
    }, 10);

    function closeModal() {
        overlay.classList.add('opacity-0');
        const card = document.getElementById('cart-email-modal-card');
        if (card) {
            card.classList.remove('scale-100', 'opacity-100');
            card.classList.add('scale-95', 'opacity-0');
        }
        setTimeout(() => {
            overlay.remove();
        }, 300);
    }

    document.getElementById('cart-email-modal-close').addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });

    document.getElementById('cart-email-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('prompt-name').value.trim();
        const email = document.getElementById('prompt-email').value.trim();

        if (name && email && email.includes('@')) {
            localStorage.setItem('customer_name', name);
            localStorage.setItem('customer_email', email.toLowerCase());

            // Agregar el producto al carrito ya con los datos registrados
            window.addItemToCart(pendingProduct);

            // Cerrar el modal
            closeModal();
        }
    });
}

function saveCart(cart) {
    try {
        localStorage.setItem('cartItems', JSON.stringify(cart));
        window.dispatchEvent(new Event('cartUpdated'));
        window.dispatchEvent(new Event('storage'));
        window.updateCartCount();
        if(document.getElementById('cart-items-container')) renderCheckoutPage();

        // Sincronizar automáticamente en segundo plano con el backend si hay email
        const email = localStorage.getItem('customer_email');
        const name = localStorage.getItem('customer_name') || 'Cliente';
        if (email && email.includes('@') && cart.length > 0) {
            trackCartBackendDirectly(email, name, cart);
        }
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
    let product = (typeof arg1 === 'string') 
        ? { id: arg1.toLowerCase().replace(/\s+/g, '-'), name: arg1, price: arg2, quantity: arg3, imageUrl: arg4 } 
        : arg1;

    // Verificar si el correo ya está registrado en localStorage
    const savedEmail = localStorage.getItem('customer_email');
    if (!savedEmail || !savedEmail.includes('@')) {
        showEmailPromptModal(product);
        return;
    }

    let cart = getCart();
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
    if (window.location.pathname.includes('detalle')) {
        loadProductDetails();
    }
    if (window.location.pathname.includes('carrito') || window.location.pathname.includes('datos')) {
        renderCheckoutPage();
    }

    setTimeout(() => window.updateCartCount(), 500);
});