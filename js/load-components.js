/**
 * CIRCULA - LOAD COMPONENTS & GLOBAL LOGIC (MASTER FILE)
 * Versión Final: Galería Full-Bleed con Navegación por Flechas
 */

// Redirección automática a HTTPS (SSL)
if (window.location.protocol === 'http:' && window.location.hostname !== 'localhost' && !window.location.hostname.includes('127.0.0.1')) {
    window.location.replace('https://' + window.location.hostname + window.location.pathname + window.location.search + window.location.hash);
}

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
        images: ['images/Tienda/Bowl Azul Arriba.jpeg', 'images/Tienda/Bowl Azul Costado.jpeg'],
        specs: {
            'Diámetro': '14 cm',
            'Alto': '6 cm'
        }
    },
    'bowl-blanco': { 
        name: 'Bowl Blanco', 
        price: 450, 
        desc: 'Elegancia y sustentabilidad. Fabricado con 100% de plástico reciclado post-consumo.', 
        images: ['images/Tienda/Bowl Blanco Arriba.jpeg', 'images/Tienda/Bowl Blanco Costado.jpeg'],
        specs: {
            'Diámetro': '14 cm',
            'Alto': '6 cm'
        }
    },
    'bowl-gris': { 
        name: 'Bowl Gris', 
        price: 450, 
        desc: 'Minimalista y ecológico. Fabricado con 100% de plástico reciclado post-consumo.', 
        images: ['images/Tienda/Bowl Gris Arriba.jpeg', 'images/Tienda/Bowl Gris Costado.jpeg'],
        specs: {
            'Diámetro': '14 cm',
            'Alto': '6 cm'
        }
    },
    'bowl-navideno': { 
        name: 'Bowl Navideño', 
        price: 450, 
        desc: 'Edición especial con colores festivos. Fabricado con 100% de plástico reciclado post-consumo.', 
        images: ['images/Tienda/Bowl Navideño Arriba.jpeg', 'images/Tienda/Bowl Navideño Costado.jpeg'],
        specs: {
            'Diámetro': '14 cm',
            'Alto': '6 cm'
        }
    },
    'bowl-negro': { 
        name: 'Bowl Negro', 
        price: 450, 
        desc: 'Sobriedad y diseño. Fabricado con 100% de plástico reciclado post-consumo.', 
        images: ['images/Tienda/Bowl Negro Arriba.jpeg', 'images/Tienda/Bowl Negro Costado.jpeg'],
        specs: {
            'Diámetro': '14 cm',
            'Alto': '6 cm'
        }
    },
    'bowl-naranja': { 
        name: 'Bowl Naranja', 
        price: 450, 
        desc: 'Energía pura. Fabricado con 100% de plástico reciclado post-consumo.', 
        images: ['images/Tienda/Bowl Naranja Arriba.jpeg', 'images/Tienda/Bowl Naranja Costado.jpeg'],
        specs: {
            'Diámetro': '14 cm',
            'Alto': '6 cm'
        }
    },
    'bowl-verde': { 
        name: 'Bowl Verde', 
        price: 450, 
        desc: 'Conexión con la naturaleza. Fabricado con 100% de plástico reciclado post-consumo.', 
        images: ['images/Tienda/Bowl Verde Arriba.jpeg', 'images/Tienda/Bowl Verde Costado.jpeg'],
        specs: {
            'Diámetro': '14 cm',
            'Alto': '6 cm'
        }
    },
    'posavasos-azul-blanco': { 
        name: 'Posavasos Azul y Blanco', 
        price: 400, 
        desc: 'Set de posavasos únicos. 100% plástico reciclado.', 
        images: ['images/Tienda/Posavasos azul y Blanco.jpeg', 'images/Tienda/Posavasos azul y Blanco Etiqueta.jpeg'],
        specs: {
            'Diámetro': '9 cm',
            'Espesor': '10 mm'
        }
    },
    'posavasos-azul-celeste': { 
        name: 'Posavasos Azul y Celeste', 
        price: 400, 
        desc: 'Set de 6 unidades. Tonos marinos. 100% plástico reciclado.', 
        images: ['images/Tienda/Posavasos Azul y Celeste.jpeg', 'images/Tienda/Posavasos azul y Celeste Etiqueta.jpeg'],
        specs: {
            'Diámetro': '9 cm',
            'Espesor': '10 mm'
        }
    },
    'posavasos-blanco': { 
        name: 'Posavasos Blanco', 
        price: 400, 
        desc: 'Set de 6 unidades. Pureza reciclada.', 
        images: ['images/Tienda/Posavasos Blanco.jpeg', 'images/Tienda/Posavasos Blanco Etiqueta.jpeg'],
        specs: {
            'Diámetro': '9 cm',
            'Espesor': '10 mm'
        }
    },
    'posavasos-gris': { 
        name: 'Posavasos Gris', 
        price: 400, 
        desc: 'Set de 6 unidades. Estilo industrial.', 
        images: ['images/Tienda/Posavasos Gris.jpeg', 'images/Tienda/Posavasos Gris Etiqueta.jpeg'],
        specs: {
            'Diámetro': '9 cm',
            'Espesor': '10 mm'
        }
    },
    'posavasos-rosado': { 
        name: 'Posavasos Rosado', 
        price: 400, 
        desc: 'Set de 6 unidades. Toque suave y sustentable.', 
        images: ['images/Tienda/Posavasos Rosado.jpeg', 'images/Tienda/Posavasos Rosado Etiqueta.jpeg'],
        specs: {
            'Diámetro': '9 cm',
            'Espesor': '10 mm'
        }
    },
    'bandeja': {
        name: 'Bandeja',
        price: null,
        desc: 'Una bandeja moderna y funcional, ideal para servir o decorar. Cada pieza presenta un patrón único e irrepetible, resultado de nuestro proceso artesanal de reciclaje de tapitas y envases de plástico.',
        images: ['images/Tienda/bandeja.png', 'images/Tienda/bandeja_detalle.png'],
        specs: {
            'Ancho': '30 cm',
            'Largo': '40 cm',
            'Alto': '4 cm',
            'Espesor de placa': '10 mm'
        },
        upcoming: true,
        showImage: false
    },
    'banco-alto': {
        name: 'Banco Alto',
        price: 5659,
        desc: 'Asiento resistente e impermeable con estructura robusta combinada con una superficie superior de placa reciclada en nuestras texturas exclusivas. Ideal tanto para interiores como exteriores.',
        images: ['images/Tienda/banco-alto.png', 'images/Tienda/banco-alto_detalle.png'],
        specs: {
            'Diámetro': '30 cm',
            'Alto': '34 cm',
            'Espesor de placa': '19 mm'
        },
        showImage: true
    },
    'banco-bajo': {
        name: 'Banco Bajo',
        price: 4579,
        desc: 'Taburete o asiento bajo ecológico y versátil, con una superficie de plástico 100% reciclado. Resistente al agua, duradero y con un diseño moderno.',
        images: ['images/Tienda/banco-bajo.png', 'images/Tienda/banco-bajo_detalle.png'],
        specs: {
            'Diámetro': '30 cm',
            'Alto': '25 cm',
            'Espesor de placa': '16 mm'
        },
        showImage: true
    },
    'comedero-mascotas': {
        name: 'Comedero / Bebedero para Mascotas',
        price: 3199,
        desc: 'Diseño higiénico, estable y duradero para tus animales. La base de alta resistencia está hecha de plástico 100% reciclado y cuenta con dos bowls de acero inoxidable desmontables.',
        images: ['images/Tienda/comedero.png', 'images/Tienda/comedero_detalle.png'],
        specs: {
            'Ancho': '25 cm',
            'Largo': '50 cm',
            'Alto': '25 cm',
            'Espesor de placa': '16 mm'
        },
        showImage: true
    },
    'espejo': {
        name: 'Espejo Circular (35 cm)',
        price: 3449,
        desc: 'Espejo de pared con un llamativo marco circular de 35 cm de diámetro fabricado a partir de nuestras placas recicladas. Aporta color, textura y sustentabilidad a cualquier ambiente.',
        images: ['images/espejo.jpeg'],
        specs: {
            'Diámetro': '35 cm',
            'Espesor de placa': '16 mm'
        },
        showImage: true
    },
    'estanteria': {
        name: 'Estantería',
        price: 6999,
        desc: 'Estantería de diseño moderno con baldas fabricadas con plástico 100% reciclado. Ofrece gran resistencia a la humedad, al peso y es ideal para exhibir tus objetos favoritos.',
        images: ['images/Tienda/estanteria.png', 'images/Tienda/estanteria_detalle.png'],
        specs: {
            'Alto': '76 cm',
            'Ancho': '76 cm',
            'Profundidad': '18 cm',
            'Espesor de placa': '19 mm'
        },
        showImage: true
    },
    'mesa': {
        name: 'Mesa',
        price: 7499,
        desc: 'Mesa ratona o de centro que combina una estructura metálica minimalista con una tapa superior de plástico 100% reciclado. Un punto focal ecológico y sofisticado para tu living.',
        images: ['images/Tienda/mesa.png', 'images/Tienda/mesa_detalle.png'],
        specs: {
            'Diámetro': '70 cm',
            'Alto': '37 cm',
            'Espesor de placa': '16 mm'
        },
        showImage: true
    },
    'perchero-individual': {
        name: 'Perchero Individual',
        price: null,
        desc: 'Colgador de pared individual con botón torneado de plástico 100% reciclado. Una solución simple, estética y sustentable para organizar tus abrigos, bolsos o llaves.',
        images: ['images/Tienda/perchero-individual.png', 'images/Tienda/perchero-individual_detalle.png'],
        specs: {
            'Diámetro': '8 cm',
            'Profundidad': '6 cm'
        },
        upcoming: true,
        showImage: false
    },
    'perchero-multiple': {
        name: 'Perchero Múltiple',
        price: null,
        desc: 'Perchero de pared múltiple que cuenta con colgadores de plástico 100% reciclado sobre una base robusta. Perfecto para el recibidor, aportando color y diseño ecológico.',
        images: ['images/Tienda/perchero-multiple.png', 'images/Tienda/perchero-multiple_detalle.png'],
        specs: {
            'Ancho': '50 cm',
            'Alto': '10 cm',
            'Profundidad': '8 cm'
        },
        upcoming: true,
        showImage: false
    },
    'porta-macetas': {
        name: 'Porta Macetas',
        price: null,
        desc: 'Soporte de diseño para tus plantas. Fabricado con placas de plástico reciclado, es totalmente impermeable y resistente a la humedad del riego. Resalta el verde de la naturaleza.',
        images: ['images/Tienda/porta-macetas.png', 'images/Tienda/porta-macetas_detalle.png'],
        specs: {
            'Alto': '22 cm',
            'Ancho': '20 cm',
            'Diámetro interno': '18 cm'
        },
        upcoming: true,
        showImage: false
    },
    'reloj': {
        name: 'Reloj de Pared',
        price: 1400,
        desc: 'Reloj de pared minimalista de funcionamiento silencioso. El cuadrante está hecho a partir de placa de plástico reciclado, convirtiendo cada minuto en un recordatorio de sustentabilidad.',
        images: ['images/Tienda/reloj.png', 'images/Tienda/reloj_detalle.png'],
        specs: {
            'Diámetro': '25 cm',
            'Espesor de placa': '10 mm'
        },
        showImage: true
    },
    'revistero': {
        name: 'Revistero',
        price: 1757,
        desc: 'Organizador y revistero de diseño geométrico fabricado con placas de plástico reciclado de alta densidad. Ligero, duradero y de producción ética uruguaya.',
        images: ['images/Tienda/revistero.png', 'images/Tienda/revistero_detalle.png'],
        specs: {
            'Alto': '50 cm',
            'Ancho': '35 cm',
            'Profundidad': '20 cm',
            'Espesor de placa': '10 mm'
        },
        showImage: true
    },
    'stand-celular': {
        name: 'Soporte para Celular',
        price: 379,
        desc: 'Soporte ergonómico de escritorio para celulares. Hecho de plástico 100% reciclado, ofrece una inclinación perfecta para videollamadas, ver contenido o trabajar.',
        images: ['images/Tienda/stand-celular.png', 'images/Tienda/stand-celular_detalle.png'],
        specs: {
            'Alto': '12 cm',
            'Ancho': '8 cm',
            'Profundidad': '9 cm',
            'Espesor de placa': '10 mm'
        },
        showImage: true
    },
    'stand-celular-llavero': {
        name: 'Soporte para Celular Llavero',
        price: null,
        desc: 'Práctico soporte portátil para celulares con diseño tipo llavero. Llevalo en tus llaves y tené siempre a mano un soporte estable hecho de plástico reciclado.',
        images: ['images/Tienda/stand-celular-llavero.png', 'images/Tienda/stand-celular-llavero_detalle.png'],
        specs: {
            'Largo': '6 cm',
            'Ancho': '2.5 cm',
            'Espesor': '10 mm'
        },
        upcoming: true,
        showImage: false
    },
    'stand-laptop': {
        name: 'Soporte para Laptop / Computadora',
        price: 619,
        desc: 'Soporte ergonómico desmontable de dos piezas encastrables en plástico 100% reciclado. Eleva la pantalla de tu laptop para mejorar tu postura y refrigerar tu equipo.',
        images: ['images/stand-laptop.jpeg', 'images/Tienda/stand-laptop_detalle.png'],
        specs: {
            'Ancho': '26 cm',
            'Largo': '25 cm',
            'Alto': '14 cm',
            'Espesor de placa': '10 mm'
        },
        showImage: true
    },
    'trofeo-empresarial': {
        name: 'Trofeo Empresarial',
        price: null,
        desc: 'Premio o reconocimiento institucional sustentable. Diseñado a medida con placas de plástico 100% reciclado, ideal para empresas comprometidas con el medio ambiente.',
        images: ['images/Logo Werfen Web.jpeg'],
        specs: {
            'Alto': '20 cm',
            'Ancho': '15 cm',
            'Espesor de placa': '10 mm'
        },
        upcoming: true,
        showImage: true
    }
};

// ==========================================
// 1. LÓGICA DEL MENÚ MÓVIL
// ==========================================
window.toggleMobileMenu = function () {
    const header = document.getElementById('main-header');
    const lineTop = document.getElementById('line-top');
    const lineMiddle = document.getElementById('line-middle');
    const lineBottom = document.getElementById('line-bottom');

    // Desktop overlay override (desplegar header original durante el video transparente)
    if (window.innerWidth >= 768 && header && header.classList.contains('header-transparent')) {
        header.classList.toggle('menu-open');
        const isMenuOpen = header.classList.contains('menu-open');
        
        if (isMenuOpen) {
            if (lineTop) {
                lineTop.classList.add('rotate-45', 'translate-y-[9px]');
                lineTop.style.transform = 'translateY(9px) rotate(45deg)'; 
            }
            if (lineMiddle) {
                lineMiddle.style.opacity = '0';
            }
            if (lineBottom) {
                lineBottom.classList.add('-rotate-45', '-translate-y-[9px]');
                lineBottom.style.transform = 'translateY(-9px) rotate(-45deg)';
            }
        } else {
            if (lineTop) {
                lineTop.classList.remove('rotate-45', 'translate-y-[9px]');
                lineTop.style.transform = 'none'; 
            }
            if (lineMiddle) {
                lineMiddle.style.opacity = '1';
            }
            if (lineBottom) {
                lineBottom.classList.remove('-rotate-45', '-translate-y-[9px]');
                lineBottom.style.transform = 'none';
            }
        }
        return; // Detenemos la ejecución para no abrir el menú móvil de pantalla completa
    }

    const menu = document.getElementById('mobile-menu');
    const btn = document.getElementById('mobile-menu-button');
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
            lineTop.classList.add('rotate-45', 'translate-y-[9px]');
            lineTop.style.transform = 'translateY(9px) rotate(45deg)'; 
            lineTop.style.backgroundColor = '#333333'; 
        }
        if (lineMiddle) {
            lineMiddle.style.opacity = '0';
        }
        if (lineBottom) {
            lineBottom.classList.add('-rotate-45', '-translate-y-[9px]');
            lineBottom.style.transform = 'translateY(-9px) rotate(-45deg)';
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
            lineTop.classList.remove('rotate-45', 'translate-y-[9px]');
            lineTop.style.transform = '';
            lineTop.style.backgroundColor = ''; 
        }
        if (lineMiddle) {
            lineMiddle.style.opacity = '1';
        }
        if (lineBottom) {
            lineBottom.classList.remove('-rotate-45', '-translate-y-[9px]');
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
                placeholder.outerHTML = `<header id="main-header" class="sticky top-0 z-[70] bg-white/90 backdrop-blur-md border-b border-gray-200/50 transition-all duration-400">${data}</header>`;
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
    if (chatBox) {
        const wasHidden = chatBox.classList.contains('hidden');
        chatBox.classList.toggle('hidden');
        if (wasHidden && typeof window.trackGA4Event === 'function') {
            window.trackGA4Event('whatsapp_chat_opened', {
                event_category: 'Engagement',
                event_label: 'WhatsApp Floating Chatbox'
            });
        }
    }
};

window.enviarWhatsApp = function () {
    const input = document.getElementById('mensaje-usuario');
    const msg = input.value.trim();
    if (!msg) return alert("Escribí un mensaje.");
    
    if (typeof window.trackGA4Event === 'function') {
        window.trackGA4Event('whatsapp_message_sent', {
            event_category: 'Conversion',
            event_label: 'WhatsApp Message Sent',
            message_length: msg.length
        });
    }

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
        if (href) {
            let cleanHref = href.split('/').pop().replace('.html', '');
            if (cleanHref === '') cleanHref = 'index';

            link.className = 'nav-link font-brand font-normal text-sm text-text-dark hover:text-rp-teal transition uppercase tracking-widest';
            
            if (cleanHref === currentPath) {
                link.className = 'font-brand font-bold text-sm text-rp-teal transition uppercase tracking-widest border-b-2 border-rp-teal';
            }
        }
    });

    document.querySelectorAll('#mobile-menu a').forEach(link => {
        let href = link.getAttribute('href');
        if (href) {
            let cleanHref = href.split('/').pop().replace('.html', '');
            if (cleanHref === '') cleanHref = 'index';

            if (cleanHref === currentPath) {
                link.classList.add('text-rp-teal', 'border-rp-teal');
                link.classList.remove('text-text-dark', 'border-gray-300');
            }
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
            metaDesc.setAttribute('content', `${product.name} - ${product.desc} Fabricado artesanalmente en Uruguay a partir de plástico reciclado. Conocé nuestras texturas: Noche de Rocha, Piedras de Arequita, Marea del Polonio y Cuarzo de Artigas.`);
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
        const rawImages = product.images && product.images.length > 0 ? product.images : ['images/logo.png'];
        let currentImageIndex = 0;

        // Función para verificar la existencia física de la imagen
        const checkImageExists = (url) => {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => resolve(true);
                img.onerror = () => resolve(false);
                img.src = url;
            });
        };

        const showImageImmediately = !product.upcoming || product.showImage;
        if (imgEl) {
            if (showImageImmediately) {
                imgEl.style.display = 'block';
                imgEl.src = rawImages[0];
                const parent = imgEl.parentElement;
                if (parent) {
                    const existingPlaceholder = parent.querySelector('.detail-placeholder');
                    if (existingPlaceholder) existingPlaceholder.remove();
                }
            } else {
                imgEl.style.display = 'none';
                if (prevBtn) prevBtn.classList.add('hidden');
                if (nextBtn) nextBtn.classList.add('hidden');
                if (thumbsContainer) thumbsContainer.style.display = 'none';

                // Crear y agregar placeholder
                const parent = imgEl.parentElement;
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
            }
        }

        // Renderizar Textos
        if (titleEl) titleEl.textContent = product.name;
        if (priceEl) {
            if (product.upcoming) {
                priceEl.textContent = 'Precio a consultar';
                priceEl.className = 'text-3xl text-rp-teal font-extrabold mb-6';
            } else {
                priceEl.textContent = `$${product.price.toLocaleString('es-UY')}`;
                priceEl.className = 'text-3xl text-rp-teal font-extrabold mb-6';
            }
        }
        if (descEl) descEl.textContent = product.desc || 'Sin descripción disponible.';

        // Renderizar especificaciones / medidas
        const specsContainer = document.getElementById('detail-specs-container');
        const specsGrid = document.getElementById('detail-specs-grid');
        if (specsContainer && specsGrid) {
            if (product.specs && Object.keys(product.specs).length > 0) {
                specsContainer.classList.remove('hidden');
                specsGrid.innerHTML = Object.entries(product.specs).map(([key, val]) => `
                    <div class="bg-gray-50/50 border border-gray-100 rounded-xl p-3 text-center">
                        <span class="block text-[10px] uppercase font-bold text-gray-400 mb-1 font-brand leading-none">${key}</span>
                        <span class="text-sm font-semibold text-text-dark font-brand leading-normal">${val}</span>
                    </div>
                `).join('');
            } else {
                specsContainer.classList.add('hidden');
                specsGrid.innerHTML = '';
            }
        }

        // Mostrar u ocultar sección de texturas
        const productRequiresTexture = !productId.startsWith('bowl-') && !productId.startsWith('posavasos-');
        const texturasEl = document.getElementById('texturas-disponibles');
        if (texturasEl) {
            if (productRequiresTexture) {
                texturasEl.style.display = 'block';
            } else {
                texturasEl.style.display = 'none';
            }
        }
        
        // Lógica Botón Agregar y Contenedor de Cantidad
        const qtyInput = document.getElementById('detail-qty');
        if (qtyInput) qtyInput.value = 1;

        // Resetear la selección de texturas al cargar
        window.selectedTexture = null;
        const swatches = document.querySelectorAll('.texture-swatch');
        swatches.forEach(swatch => {
            swatch.classList.remove('border-rp-teal', 'ring-2', 'ring-rp-teal/20', 'bg-white');
            swatch.classList.add('border-gray-200', 'bg-gray-50/30');
        });

        // Filtrar imágenes que realmente existen y configurar la galería
        Promise.all(rawImages.map(img => checkImageExists(img).then(exists => exists ? img : null)))
            .then(filtered => {
                const images = filtered.filter(img => img !== null);
                const finalImages = images.length > 0 ? images : ['images/logo.png'];

                if (showImageImmediately) {
                    if (thumbsContainer) {
                        thumbsContainer.style.display = 'flex';
                        thumbsContainer.innerHTML = '';
                        finalImages.forEach((imgSrc, index) => {
                            const wrapper = document.createElement('div');
                            wrapper.className = `relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-300 cursor-pointer hover:opacity-80 hover:scale-105 border-transparent`;

                            const thumb = document.createElement('img');
                            thumb.src = imgSrc;
                            thumb.className = `w-full h-full object-cover object-center`;
                            thumb.style.transform = 'scale(1.2)';
                            thumb.style.transformOrigin = '35% 35%';

                            wrapper.appendChild(thumb);

                            if (index === currentImageIndex) {
                                wrapper.classList.add('border-rp-teal');
                                wrapper.classList.remove('border-transparent');
                            }

                            wrapper.onclick = () => updateMainImage(index);
                            thumbsContainer.appendChild(wrapper);
                        });
                    }

                    // Función interna para actualizar la imagen principal y miniaturas
                    const updateMainImage = function(index) {
                        if (index < 0) index = finalImages.length - 1;
                        if (index >= finalImages.length) index = 0;
                        currentImageIndex = index;

                        imgEl.style.opacity = '0.8';
                        setTimeout(() => {
                            imgEl.src = finalImages[currentImageIndex];
                            imgEl.style.opacity = '1';
                        }, 150);

                        if (thumbsContainer) {
                            Array.from(thumbsContainer.children).forEach((wrapper, i) => {
                                if (i === currentImageIndex) {
                                    wrapper.classList.add('border-rp-teal');
                                    wrapper.classList.remove('border-transparent');
                                } else {
                                    wrapper.classList.remove('border-rp-teal');
                                    wrapper.classList.add('border-transparent');
                                }
                            });
                        }
                    };

                    // Configurar flechas si hay más de 1 imagen válida
                    if (finalImages.length > 1) {
                        if (prevBtn) {
                            prevBtn.classList.remove('hidden');
                            prevBtn.onclick = () => updateMainImage(currentImageIndex - 1);
                        }
                        if (nextBtn) {
                            nextBtn.classList.remove('hidden');
                            nextBtn.onclick = () => updateMainImage(currentImageIndex + 1);
                        }
                    } else {
                        if (prevBtn) prevBtn.classList.add('hidden');
                        if (nextBtn) nextBtn.classList.add('hidden');
                    }
                }

                // Configurar botón de agregar al carrito con finalImages[0]
                if (addBtn) {
                    const qtySelector = document.getElementById('detail-qty-selector');
                    const qtyContainer = document.getElementById('detail-qty-container');

                    if (product.upcoming) {
                        if (qtySelector) qtySelector.style.display = 'none';
                        if (qtyContainer) qtyContainer.className = 'block mb-6';

                        addBtn.innerHTML = '<i class="fab fa-whatsapp mr-2 text-xl"></i> CONSULTAR PRECIO';
                        addBtn.className = 'w-full py-4 bg-rp-teal text-white font-bold rounded-lg hover:bg-rp-teal/90 transition duration-200 title-style text-lg flex items-center justify-center shadow-lg active:scale-95 text-center';
                        addBtn.onclick = function(e) {
                            e.preventDefault();
                            const msg = `Hola Circula, me interesa el producto "${product.name}" de la tienda. ¿Podrían darme más información y el precio?`;
                            window.open(`https://wa.me/59899395724?text=${encodeURIComponent(msg)}`, '_blank');
                        };
                    } else {
                        if (qtySelector) qtySelector.style.display = 'flex';
                        if (qtyContainer) qtyContainer.className = 'flex items-center space-x-4 mb-6';

                        addBtn.innerHTML = '<i class="fas fa-shopping-cart mr-2"></i> AGREGAR AL CARRITO';
                        addBtn.className = 'flex-1 h-[56px] bg-mp-blue text-white font-bold rounded-lg hover:bg-mp-blue/90 transition duration-200 title-style text-lg flex items-center justify-center shadow-lg active:scale-95';
                        addBtn.onclick = function() {
                            const qtyVal = qtyInput ? (parseInt(qtyInput.value) || 1) : 1;
                            
                            if (productRequiresTexture && !window.selectedTexture) {
                                alert("Por favor, selecciona una textura de placa antes de agregar al carrito.");
                                document.getElementById('texturas-disponibles')?.scrollIntoView({ behavior: 'smooth' });
                                return;
                            }

                            const finalName = productRequiresTexture 
                                ? `${product.name} (${window.selectedTexture})`
                                : product.name;
                            
                            const finalId = productRequiresTexture
                                ? `${productId}-${window.selectedTexture.toLowerCase().replace(/ /g, '-').normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`
                                : productId;

                            window.addItemToCart({
                                id: finalId,
                                name: finalName,
                                price: product.price,
                                quantity: qtyVal,
                                imageUrl: finalImages[0] // Usa la primera imagen válida como principal para el carrito
                            });
                        };

                        // Feedback visual desacoplado mediante el evento global
                        const handleItemAdded = function(e) {
                            const checkId = productRequiresTexture
                                ? `${productId}-${(window.selectedTexture || '').toLowerCase().replace(/ /g, '-').normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`
                                : productId;
                            if (e.detail && e.detail.product && e.detail.product.id === checkId) {
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
            });
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
                    <p class="text-sm text-gray-500">$${parseFloat(item.price).toLocaleString('es-UY')} c/u</p>
                </div>
            </div>
            
            <div class="flex items-center gap-6">
                <div class="flex items-center border border-gray-300 rounded-full overflow-hidden">
                    <button onclick="decrementCartItem(${index}); renderCheckoutPage();" class="px-3 py-1 hover:bg-gray-100">-</button>
                    <span class="px-3 py-1 font-bold text-sm">${item.quantity}</span>
                    <button onclick="incrementCartItem(${index}); renderCheckoutPage();" class="px-3 py-1 hover:bg-gray-100">+</button>
                </div>
                <p class="font-bold text-lg min-w-[80px] text-right">$${itemTotal.toLocaleString('es-UY', { minimumFractionDigits: 2 })}</p>
                <button onclick="removeCartItem(${index}); renderCheckoutPage();" class="text-red-500 hover:text-red-700">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        container.appendChild(row);
    });

    if(totalEl) totalEl.textContent = `$${total.toLocaleString('es-UY', { minimumFractionDigits: 2 })}`;
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
                Para agregar este producto al carrito y recibir el seguimiento de tu compra (¡incluyendo beneficios especiales!), por favor ingresá tus datos.
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

// ==========================================
// GOOGLE ANALYTICS (GA4) EVENT TRACKING HELPER
// ==========================================
window.trackGA4Event = function(eventName, params) {
    try {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            event: eventName,
            ...params
        });
        console.log(`[GA4] Evento trackeado: ${eventName}`, params);
    } catch (e) {
        console.error(`[GA4] Error al trackear ${eventName}:`, e);
    }
};

window.incrementCartItem = function (index) {
    let cart = getCart();
    if (cart[index]) {
        const item = cart[index];
        item.quantity++;
        saveCart(cart);

        // Tracking add_to_cart en GA4 para incremento
        trackGA4Event('add_to_cart', {
            ecommerce: {
                currency: 'UYU',
                value: parseFloat(item.price),
                items: [{
                    item_id: item.id,
                    item_name: item.name,
                    price: parseFloat(item.price),
                    quantity: 1
                }]
            }
        });
    }
};

window.decrementCartItem = function (index) {
    let cart = getCart();
    if (cart[index]) {
        const item = cart[index];
        item.quantity--;

        // Tracking remove_from_cart en GA4 para decremento
        trackGA4Event('remove_from_cart', {
            ecommerce: {
                currency: 'UYU',
                value: parseFloat(item.price),
                items: [{
                    item_id: item.id,
                    item_name: item.name,
                    price: parseFloat(item.price),
                    quantity: 1
                }]
            }
        });

        if (item.quantity <= 0) cart.splice(index, 1);
        saveCart(cart);
    }
};

window.removeCartItem = function (index) {
    let cart = getCart();
    const removedItem = cart[index];
    if (removedItem) {
        cart.splice(index, 1);
        saveCart(cart);

        // Tracking remove_from_cart en GA4 para eliminación total
        trackGA4Event('remove_from_cart', {
            ecommerce: {
                currency: 'UYU',
                value: parseFloat(removedItem.price) * parseInt(removedItem.quantity),
                items: [{
                    item_id: removedItem.id,
                    item_name: removedItem.name,
                    price: parseFloat(removedItem.price),
                    quantity: parseInt(removedItem.quantity)
                }]
            }
        });
    }
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
    if (!list) return;

    // #dropdown-total se inyecta dinámicamente; se obtiene después del render si ya existe
    const totalDisplay = document.getElementById('dropdown-total');

    const cart = getCart();
    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    // Leer descuento del localStorage
    const discountCode = localStorage.getItem('appliedDiscountCode');
    const discountPercent = parseFloat(localStorage.getItem('appliedDiscountPercent')) || 0;
    const discountAmount = discountPercent > 0 ? subtotal * (discountPercent / 100) : 0;
    const total = subtotal - discountAmount;

    list.style.color = '#1f2937';

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
                <span style="font-weight: 700; font-size: 14px; color: #4b5563;">$${(item.price * item.quantity).toLocaleString('es-UY', { minimumFractionDigits: 2 })}</span>
            </div>
        `).join('');
        
        if (cart.length > 3) {
            list.insertAdjacentHTML('beforeend', `<p style="text-align: center; font-size: 12px; font-weight: 600; color: #79C7C7; margin-top: 12px;">+ ${cart.length - 3} más</p>`);
        }
    }

    // Actualizar el bloque de totales en el dropdown-summary
    let summaryTotalsEl = document.getElementById('dropdown-totals-block');
    const summaryContainer = document.getElementById('dropdown-summary');
    if (summaryContainer) {
        // Remover bloque anterior si existe
        if (summaryTotalsEl) summaryTotalsEl.remove();

        const totalsHTML = discountPercent > 0 ? `
            <div id="dropdown-totals-block" style="margin-bottom: 1rem;">
                <div style="display: flex; justify-content: space-between; font-size: 0.875rem; color: #6b7280; margin-bottom: 0.4rem;">
                    <span>Subtotal</span>
                    <span>$${subtotal.toLocaleString('es-UY', { minimumFractionDigits: 2 })}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 0.875rem; color: #16a34a; font-weight: 600; margin-bottom: 0.5rem;">
                    <span>Descuento (${discountCode}, ${discountPercent}%)</span>
                    <span>-$${discountAmount.toLocaleString('es-UY', { minimumFractionDigits: 2 })}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 1.125rem; border-top: 1px solid #e5e7eb; padding-top: 0.5rem;">
                    <span>Total</span>
                    <span id="dropdown-total" style="color: #009ee3;">$${total.toLocaleString('es-UY', { minimumFractionDigits: 2 })}</span>
                </div>
            </div>
        ` : `
            <div id="dropdown-totals-block" style="display: flex; justify-content: space-between; font-weight: bold; font-size: 1.25rem; margin-bottom: 1rem;">
                <span>Total:</span><span id="dropdown-total" style="color: #009ee3;">$${total.toLocaleString('es-UY', { minimumFractionDigits: 2 })}</span>
            </div>
        `;
        summaryContainer.insertAdjacentHTML('afterbegin', totalsHTML);
    } else {
        // Fallback: actualizar el span de total directamente
        totalDisplay.textContent = `$${total.toLocaleString('es-UY', { minimumFractionDigits: 2 })}`;
    }

    const btns = document.querySelectorAll('#dropdown-summary button, #dropdown-summary a');
    btns.forEach(btn => {
        btn.style.opacity = cart.length === 0 ? '0.5' : '1';
        btn.style.pointerEvents = cart.length === 0 ? 'none' : 'auto';
    });
}

// ==========================================
// 8. INICIALIZACIÓN PREMIUM (HEADER SCROLL & SCROLL REVEAL & CURSOR & TILT)
// ==========================================
function initializePremiumFeatures() {
    let lastScrollY = window.scrollY;
    
    // 1. Controlar la clase .scrolled y .header-transparent del Header
    window.handleHeaderScroll = () => {
        const header = document.getElementById('main-header') || document.querySelector('header');
        if (header) {
            // Asegurar que el header tiene las clases de transición (útil para las páginas secundarias)
            if (!header.classList.contains('transition-transform')) {
                header.classList.add('transition-transform', 'duration-300', 'ease-in-out');
            }

            const currentScrollY = window.scrollY;
            const scrollDelta = currentScrollY - lastScrollY;

            // Smart Header Logic: Ocultar al bajar, mostrar al subir
            if (currentScrollY > 100 && scrollDelta > 8 && !header.classList.contains('menu-open')) {
                header.classList.add('-translate-y-full'); // Tailwind class para ocultar hacia arriba
            } else if (scrollDelta < -8 || currentScrollY <= 100) {
                header.classList.remove('-translate-y-full');
            }
            lastScrollY = currentScrollY;

            const videoSection = document.getElementById('featured-project-video');
            const headerHeight = header.offsetHeight || 80;
            
            if (videoSection) {
                // Estamos en la Home con video
                let isVideoActive = true;
                if (typeof ScrollTrigger !== 'undefined') {
                    const st = ScrollTrigger.getById('video-main-trigger');
                    if (st) {
                        // Comprobación exacta usando la posición final del ScrollTrigger
                        isVideoActive = window.scrollY < st.end;
                    } else {
                        const nextSection = document.getElementById('presentacion-triple-impacto');
                        isVideoActive = nextSection 
                            ? (nextSection.getBoundingClientRect().top > headerHeight)
                            : (window.scrollY < (videoSection.offsetHeight - headerHeight));
                    }
                } else {
                    const nextSection = document.getElementById('presentacion-triple-impacto');
                    isVideoActive = nextSection 
                        ? (nextSection.getBoundingClientRect().top > headerHeight)
                        : (window.scrollY < (videoSection.offsetHeight - headerHeight));
                }
                
                if (isVideoActive) {
                    header.classList.add('header-transparent');
                    header.classList.remove('scrolled');
                } else {
                    if (header.classList.contains('menu-open')) {
                        header.classList.remove('menu-open');
                        const lineTop = document.getElementById('line-top');
                        const lineMiddle = document.getElementById('line-middle');
                        const lineBottom = document.getElementById('line-bottom');
                        if (lineTop) {
                            lineTop.classList.remove('rotate-45', 'translate-y-[9px]');
                            lineTop.style.transform = 'none'; 
                        }
                        if (lineMiddle) lineMiddle.style.opacity = '1';
                        if (lineBottom) {
                            lineBottom.classList.remove('-rotate-45', '-translate-y-[9px]');
                            lineBottom.style.transform = 'none';
                        }
                    }
                    header.classList.remove('header-transparent');
                    header.classList.add('scrolled');
                }
            } else {
                // Resto de las páginas
                if (window.scrollY > 20) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            }
        }
    };
    window.addEventListener('scroll', window.handleHeaderScroll);
    window.handleHeaderScroll(); // Ejecutar en carga por si recargan a mitad de página

    // 2. Cursor Personalizado Interactivo (Desktop Only)
    const initCustomCursor = () => {
        if (window.innerWidth < 768) return; // Solo en desktop
        
        // Crear elementos del cursor si no existen
        let cursorDot = document.getElementById('custom-cursor-dot');
        let cursorRing = document.getElementById('custom-cursor-ring');
        
        if (!cursorDot) {
            cursorDot = document.createElement('div');
            cursorDot.id = 'custom-cursor-dot';
            document.body.appendChild(cursorDot);
        }
        
        if (!cursorRing) {
            cursorRing = document.createElement('div');
            cursorRing.id = 'custom-cursor-ring';
            cursorRing.innerHTML = '<span id="custom-cursor-text"></span>';
            document.body.appendChild(cursorRing);
        }
        
        let mouseX = 0, mouseY = 0;
        let ringX = 0, ringY = 0;
        let isCursorVisible = false;
        const textEl = document.getElementById('custom-cursor-text');
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            if (!isCursorVisible) {
                cursorDot.style.opacity = '1';
                cursorRing.style.opacity = '1';
                isCursorVisible = true;
            }
            
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        });
        
        document.addEventListener('mouseleave', () => {
            cursorDot.style.opacity = '0';
            cursorRing.style.opacity = '0';
            isCursorVisible = false;
        });
        
        // Loop de interpolación suave (Lerp) para el anillo exterior
        const updateCursorRing = () => {
            const lerpFactor = 0.12;
            ringX += (mouseX - ringX) * lerpFactor;
            ringY += (mouseY - ringY) * lerpFactor;
            
            cursorRing.style.left = `${ringX}px`;
            cursorRing.style.top = `${ringY}px`;
            
            requestAnimationFrame(updateCursorRing);
        };
        requestAnimationFrame(updateCursorRing);
        
        // Detectar elementos para hover dinámico del cursor
        const updateHoverTargets = () => {
            const hoverItems = document.querySelectorAll('a, button, .card-hover, .btn-checkout, input, select, textarea, [onclick]');
            hoverItems.forEach(item => {
                if (item.classList.contains('cursor-hover-processed')) return;
                
                // Excluir botones de la calculadora de impacto
                if (item.hasAttribute('onclick') && item.getAttribute('onclick').includes('updateImpactQty')) return;
                
                item.classList.add('cursor-hover-processed');
                
                item.addEventListener('mouseenter', () => {
                    document.body.classList.add('cursor-active');
                    textEl.textContent = "";
                    let hasText = false;
                    
                    // COMPRAR (Botones de compra / carrito)
                    if (item.closest('#cart-dropdown-container') || item.classList.contains('btn-checkout') || item.textContent.toUpperCase().includes('AGREGAR') || item.textContent.toUpperCase().includes('COMPRAR')) {
                        textEl.textContent = "COMPRAR";
                        hasText = true;
                    } 
                    // ENVIAR (Botones submit de formularios)
                    else if (item.tagName.toLowerCase() === 'button' && item.type === 'submit' && item.closest('form')) {
                        textEl.textContent = "ENVIAR";
                        hasText = true;
                    }
                    // PLAY (Videos)
                    else if (item.closest('#featured-project-video')) {
                        textEl.textContent = "PLAY";
                        hasText = true;
                    }
                    // VER (Solo links que llevan a otro lugar, o tarjetas con redirección)
                    else if (
                        (item.tagName.toLowerCase() === 'a' && item.hasAttribute('href') && !item.getAttribute('href').startsWith('#')) || 
                        (item.hasAttribute('onclick') && item.getAttribute('onclick').includes('window.location.href')) ||
                        item.closest('#featured-products')
                    ) {
                        textEl.textContent = "VER";
                        hasText = true;
                    }

                    if (!hasText) {
                        document.body.classList.add('cursor-blend');
                    }
                });
                
                item.addEventListener('mouseleave', () => {
                    document.body.classList.remove('cursor-active', 'cursor-blend');
                    textEl.textContent = "";
                });
            });
        };
        
        updateHoverTargets();
        window.addEventListener('headerLoaded', updateHoverTargets);
        window.addEventListener('contentLoaded', updateHoverTargets);
        setTimeout(updateHoverTargets, 1000);
    };
    initCustomCursor();

    // 3. Efecto de Inclinación 3D (3D Tilt) en Tarjetas de Producto y Equipo
    const init3DTilt = () => {
        if (window.innerWidth < 768) return; // Solo en desktop
        
        const cards = document.querySelectorAll('.card-hover, .tilt-card');
        cards.forEach(card => {
            if (card.classList.contains('tilt-processed')) return;
            card.classList.add('tilt-processed', 'tilt-card');
            
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = ((centerY - y) / centerY) * 8; // Máximo 8 grados de inclinación
                const rotateY = ((x - centerX) / centerX) * 8;
                
                gsap.to(card, {
                    rotateX: rotateX,
                    rotateY: rotateY,
                    transformPerspective: 1000,
                    ease: 'power2.out',
                    duration: 0.3
                });
            });
            
            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    rotateX: 0,
                    rotateY: 0,
                    ease: 'power2.out',
                    duration: 0.5
                });
            });
        });
    };
    init3DTilt();
    window.addEventListener('contentLoaded', init3DTilt);
    setTimeout(init3DTilt, 1000);

    // 4. Inicializar el IntersectionObserver para Scroll Reveal
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target); // Dejar de observar una vez revelado
                }
            });
        }, {
            threshold: 0.05,
            rootMargin: '0px 0px -40px 0px'
        });

        const initMagneticButtons = () => {
            if (window.innerWidth < 768) return; // Solo escritorio
            
            const targets = document.querySelectorAll('.nav-link, #desktop-nav a, #mobile-menu-button, .social-icon, #whatsapp-icon, #cart-dropdown-container, .btn-magnetic, .magnetic-btn');
            targets.forEach(btn => {
                if (btn.classList.contains('magnetic-processed')) return;
                btn.classList.add('magnetic-processed');
                
                btn.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
                
                btn.addEventListener('mousemove', (e) => {
                    const bound = btn.getBoundingClientRect();
                    const btnX = bound.left + bound.width / 2;
                    const btnY = bound.top + bound.height / 2;
                    
                    const deltaX = e.clientX - btnX;
                    const deltaY = e.clientY - btnY;
                    
                    const pullPower = 0.3; 
                    btn.style.transform = `translate3d(${deltaX * pullPower}px, ${deltaY * pullPower}px, 0px)`;
                });
                
                btn.addEventListener('mouseleave', () => {
                    btn.style.transform = 'translate3d(0px, 0px, 0px)';
                });
            });
        };

        const observeElements = () => {
            // Auto-asignar clases de reveal en Tienda
            if (window.location.pathname.includes('tienda')) {
                const cards = document.querySelectorAll('.card-hover');
                cards.forEach((card, index) => {
                    card.classList.add('reveal-element');
                    const delayClass = `reveal-delay-${((index % 3) + 1) * 100}`;
                    card.classList.add(delayClass);
                });
                const headerElements = document.querySelectorAll('main h1, main p');
                headerElements.forEach(el => el.classList.add('reveal-element'));
            }

            // Auto-asignar clases de reveal en Nosotros
            if (window.location.pathname.includes('nosotros')) {
                const services = document.querySelectorAll('.card-hover');
                services.forEach((service, index) => {
                    service.classList.add('reveal-element');
                    service.classList.add(`reveal-delay-${((index % 3) + 1) * 100}`);
                });
                const team = document.querySelectorAll('.flex.flex-col.items-center.text-center.group');
                team.forEach((member, index) => {
                    member.classList.add('reveal-element');
                    member.classList.add(`reveal-delay-${((index % 5) + 1) * 100}`);
                });
            }

            // Auto-asignar clases de reveal text mask en títulos h1 y h2 de la página
            const headers = document.querySelectorAll('h1, h2');
            headers.forEach(h => {
                if (h.classList.contains('reveal-processed') || h.closest('#modal') || h.closest('#whatsapp-chat-box') || h.closest('#dropdown-summary') || h.closest('#cart-dropdown') || h.closest('#expo-announcement-modal')) return;
                h.classList.add('reveal-processed');

                const originalHTML = h.innerHTML;
                h.innerHTML = `<span class="reveal-text-mask"><span class="reveal-text-child">${originalHTML}</span></span>`;
                
                const child = h.querySelector('.reveal-text-child');
                if (child) revealObserver.observe(child);
            });

            const elements = document.querySelectorAll('.reveal-element');
            elements.forEach(el => revealObserver.observe(el));

            // Inicializar botones magnéticos
            initMagneticButtons();
        };

        observeElements();
        window.addEventListener('headerLoaded', observeElements);
        window.addEventListener('contentLoaded', observeElements);
        setTimeout(observeElements, 500); // re-intentar a los 500ms
    } else {
        // Fallback
        document.querySelectorAll('.reveal-element').forEach(el => el.classList.add('revealed'));
    }
}

// 8.1. SIMULACIÓN DE PRELOADER EDUCATIVO Y PREMIUM
function initPremiumPreloader() {
    if (window.preloaderInitialized) return;
    window.preloaderInitialized = true;
    
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    // Check if preloader was already shown in this session
    if (sessionStorage.getItem('preloaderShown')) {
        preloader.style.display = 'none';
        preloader.classList.add('hidden');
        return;
    }
    
    // Mark as shown for future navigations in the same session
    sessionStorage.setItem('preloaderShown', 'true');
    
    const percentEl = document.getElementById('loader-percent');
    const barEl = document.getElementById('loader-bar');
    const textEl = document.getElementById('loading-text');
    
    if (!percentEl) {
        // Fallback preloader anterior
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.style.display = 'none';
                    preloader.classList.add('hidden');
                }, 700);
            }, 500);
        });
        return;
    }
    
    // Dynamic elements for bottle loader
    const fallingCapsContainer = document.getElementById('falling-caps-svg');
    const piledCapsContainer = document.getElementById('piled-caps-svg');
    const fillRect = document.getElementById('bottle-fill-rect');
    
    const messages = [
        "Recolectando tapitas de plástico...",
        "Clasificando por color y densidad...",
        "Triturando plástico en partes pequeñas...",
        "Moldeando placas de diseño a alta presión...",
        "Diseñando productos de triple impacto...",
        "¡Experiencia lista para circular!"
    ];
    
    const capColors = ['#79C7C7', '#A3E6BA', '#4da3d4', '#f6d854', '#f687b3', '#ed8936', '#48bb78'];
    
    let currentPercent = 0;
    let targetPercent = 0;
    let messageIndex = 0;
    window.pageHasLoaded = false;
    
    // Simular progreso de carga gradual y lento para que se aprecie la animación (mínimo 6 segundos)
    const interval = setInterval(() => {
        if (targetPercent < 99) {
            targetPercent += 1;
        } else if (window.pageHasLoaded) {
            targetPercent = 100;
            clearInterval(interval);
        }
    }, 60);
    
    // Tracking falling caps
    let fallingCaps = [];
    let frameCount = 0;
    
    // Loop de renderizado para suavidad del preloader
    function tick() {
        // Incrementar porcentaje
        if (currentPercent < targetPercent) {
            currentPercent += 1;
            percentEl.textContent = `${currentPercent}%`;
            if (barEl) barEl.style.width = `${currentPercent}%`;
            
            // Cambiar textos según porcentaje
            const msgIdx = Math.min(messages.length - 1, Math.floor((currentPercent / 100) * messages.length));
            if (msgIdx !== messageIndex) {
                messageIndex = msgIdx;
                gsap.to(textEl, {
                    opacity: 0,
                    y: -10,
                    duration: 0.15,
                    onComplete: () => {
                        textEl.textContent = messages[messageIndex];
                        gsap.to(textEl, { opacity: 1, y: 0, duration: 0.25 });
                    }
                });
            }
        }
        
        // Altura del relleno
        // La botella va desde Y=195 (vacía) hasta Y=55 (llena en los hombros)
        let fillY = 195 - (currentPercent / 100) * 140;
        if (fillRect) {
            fillRect.setAttribute('y', fillY);
            fillRect.setAttribute('height', 195 - fillY);
        }
        
        // Spawn falling caps (cada 8 frames si no estamos al 100%)
        frameCount++;
        if (fallingCapsContainer && currentPercent < 100 && frameCount % 8 === 0) {
            // Crear círculo en SVG
            const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            const color = capColors[Math.floor(Math.random() * capColors.length)];
            // Spawn en la boca de la botella
            const cx = 45 + Math.random() * 10;
            const cy = 10;
            
            circle.setAttribute("cx", cx);
            circle.setAttribute("cy", cy);
            circle.setAttribute("r", "3.5");
            circle.setAttribute("fill", color);
            
            fallingCapsContainer.appendChild(circle);
            
            fallingCaps.push({
                el: circle,
                cx: cx,
                cy: cy,
                speed: 3 + Math.random() * 1.5,
                color: color
            });
        }
        
        // Actualizar animación de tapitas cayendo
        for (let i = fallingCaps.length - 1; i >= 0; i--) {
            let cap = fallingCaps[i];
            cap.cy += cap.speed;
            cap.el.setAttribute("cy", cap.cy);
            
            // Si la tapita llega al nivel actual del relleno
            if (cap.cy >= fillY) {
                // Remover de tapitas cayendo
                cap.el.remove();
                fallingCaps.splice(i, 1);
                
                // Agregar a tapitas acumuladas
                if (piledCapsContainer) {
                    const piledCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                    // Ajustar la posición X para que se esparzan
                    let driftX = (Math.random() - 0.5) * 12;
                    let finalX = cap.cx + driftX;
                    
                    // Limitar X según el nivel para no salirse de la botella
                    if (fillY > 60) {
                        finalX = Math.max(16, Math.min(84, finalX));
                    } else {
                        finalX = Math.max(38, Math.min(62, finalX));
                    }
                    
                    // Añadir un pequeño offset Y para que se asienten de forma natural
                    let finalY = fillY + Math.random() * 6;
                    finalY = Math.min(194, finalY);
                    
                    piledCircle.setAttribute("cx", finalX);
                    piledCircle.setAttribute("cy", finalY);
                    piledCircle.setAttribute("r", "3.5");
                    piledCircle.setAttribute("fill", cap.color);
                    piledCircle.setAttribute("opacity", "0.9");
                    
                    piledCapsContainer.appendChild(piledCircle);
                }
            }
        }
        
        if (currentPercent < 100) {
            requestAnimationFrame(tick);
        } else {
            // Finalizado
            clearInterval(interval);
            percentEl.textContent = "100%";
            if (fillRect) {
                fillRect.setAttribute('y', 55);
                fillRect.setAttribute('height', 140);
            }
            textEl.textContent = "¡BIENVENIDO A CIRCULA!";
            
            // Limpiar tapitas sobrantes que quedaron cayendo
            fallingCaps.forEach(cap => cap.el.remove());
            fallingCaps = [];
            
            setTimeout(() => {
                gsap.to(preloader, {
                    opacity: 0,
                    y: -50,
                    duration: 0.8,
                    ease: 'power3.inOut',
                    onComplete: () => {
                        preloader.style.display = 'none';
                        preloader.classList.add('hidden');
                        window.dispatchEvent(new Event('preloaderFinished'));
                    }
                });
            }, 750);
        }
    }
    requestAnimationFrame(tick);
    
    // Al cargar toda la página de verdad
    window.addEventListener('load', () => {
        window.pageHasLoaded = true;
        // Si el progreso lento ya completó el 99%, disparamos el 100%
        if (targetPercent >= 99) {
            targetPercent = 100;
            clearInterval(interval);
        }
    });
    
    // Respaldo de seguridad (máximo 12 segundos para dar tiempo a ver la botella llenándose)
    setTimeout(() => {
        window.pageHasLoaded = true;
        targetPercent = 100;
        clearInterval(interval);
    }, 12000);
}

// ==========================================
// 9. INICIALIZACIÓN GLOBAL
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('Circula JS: DOMContentLoaded fired');
    try {
        console.log('Circula JS: Initializing Premium Preloader...');
        initPremiumPreloader();
    } catch(e) {
        console.error('Error in initPremiumPreloader:', e);
    }
    
    try {
        console.log('Circula JS: Loading Header...');
        loadHeader();
    } catch(e) {
        console.error('Error in loadHeader:', e);
    }
    
    try {
        console.log('Circula JS: Loading Footer...');
        loadFooter();
    } catch(e) {
        console.error('Error in loadFooter:', e);
    }
    
    try {
        console.log('Circula JS: Loading WhatsApp...');
        loadWhatsApp();
    } catch(e) {
        console.error('Error in loadWhatsApp:', e);
    }
    
    try {
        console.log('Circula JS: Initializing Premium Features...');
        initializePremiumFeatures();
    } catch(e) {
        console.error('Error in initializePremiumFeatures:', e);
    }
    
    // Detectar si estamos en páginas específicas
    if (window.location.pathname.includes('detalle')) {
        loadProductDetails();
    }
    if (window.location.pathname.includes('carrito') || window.location.pathname.includes('datos')) {
        renderCheckoutPage();
    }

    // --- INTEGRACIÓN CON CREA.CIRCULA.UY (DISEÑO PERSONALIZADO) ---
    const urlParams = new URLSearchParams(window.location.search);
    
    // Soporte para múltiples ítems en lote (lista)
    if (urlParams.get('add-custom-list') === 'true') {
        try {
            const rawItems = urlParams.get('items');
            if (rawItems) {
                const items = JSON.parse(decodeURIComponent(rawItems));
                setTimeout(() => {
                    if (typeof window.addItemToCart === 'function') {
                        items.forEach(item => {
                            window.addItemToCart({
                                id: item.id,
                                name: item.name,
                                price: parseFloat(item.price) || 0,
                                quantity: parseInt(item.qty) || 1,
                                imageUrl: item.img || 'images/logo.png'
                            });
                        });
                        
                        // Limpiar parámetros para evitar duplicaciones al refrescar
                        const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
                        window.history.replaceState({ path: cleanUrl }, '', cleanUrl);
                        
                        // Redirigir al carrito si no está allí
                        if (!window.location.pathname.includes('carrito')) {
                            window.location.href = 'carrito.html';
                        } else {
                            renderCheckoutPage();
                        }
                    }
                }, 500);
            }
        } catch (e) {
            console.error("Error al parsear add-custom-list:", e);
        }
    } else if (urlParams.get('add-custom') === 'true') {
        // Soporte para un único ítem
        const id = urlParams.get('id') || 'custom-product';
        const name = urlParams.get('name') || 'Producto Personalizado';
        const price = parseFloat(urlParams.get('price')) || 0;
        const imageUrl = urlParams.get('img') || 'images/logo.png';
        const quantity = parseInt(urlParams.get('qty')) || 1;
        const colors = urlParams.get('colors');
        
        const finalName = colors ? `${name} (${colors})` : name;
        
        setTimeout(() => {
            if (typeof window.addItemToCart === 'function') {
                window.addItemToCart({
                    id: id,
                    name: finalName,
                    price: price,
                    quantity: quantity,
                    imageUrl: imageUrl
                });
                
                // Limpiar parámetros para evitar duplicaciones al refrescar
                const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
                window.history.replaceState({ path: cleanUrl }, '', cleanUrl);
                
                // Redirigir al carrito si no está allí
                if (!window.location.pathname.includes('carrito')) {
                    window.location.href = 'carrito.html';
                } else {
                    renderCheckoutPage();
                }
            }
        }, 500);
    }

    // --- TRACKING DE ECOMMERCE EN CARGA DE PÁGINAS ---
    if (window.location.pathname.includes('carrito')) {
        const cart = getCart();
        trackGA4Event('view_cart', {
            ecommerce: {
                currency: 'UYU',
                value: cart.reduce((acc, item) => acc + (parseFloat(item.price) * parseInt(item.quantity)), 0),
                items: cart.map(item => ({
                    item_id: item.id,
                    item_name: item.name,
                    price: parseFloat(item.price),
                    quantity: parseInt(item.quantity)
                }))
            }
        });
    }

    if (window.location.pathname.includes('datos')) {
        const cart = getCart();
        trackGA4Event('begin_checkout', {
            ecommerce: {
                currency: 'UYU',
                value: cart.reduce((acc, item) => acc + (parseFloat(item.price) * parseInt(item.quantity)), 0),
                items: cart.map(item => ({
                    item_id: item.id,
                    item_name: item.name,
                    price: parseFloat(item.price),
                    quantity: parseInt(item.quantity)
                }))
            }
        });
    }

    // --- TRACKING DE CLICS GENERALES (Interacciones clave y Enlaces de Salida) ---
    document.addEventListener('click', (e) => {
        const target = e.target.closest('a, button');
        if (!target) return;

        // Clic en Reservar Taller o enlaces que lleven a talleres
        const text = target.textContent ? target.textContent.toUpperCase() : '';
        const href = target.getAttribute('href') || '';
        
        if (text.includes('RESERVÁ TU TALLER') || href.includes('talleres')) {
            trackGA4Event('workshop_reservation_click', {
                event_category: 'Engagement',
                event_label: target.textContent.trim() || 'Reservá tu Taller Link'
            });
        }

        // Clics a redes sociales salientes
        if (href.includes('instagram.com')) {
            trackGA4Event('outbound_click', {
                event_category: 'Social Media',
                event_label: 'Instagram Link',
                destination: href
            });
        } else if (href.includes('linkedin.com')) {
            trackGA4Event('outbound_click', {
                event_category: 'Social Media',
                event_label: 'LinkedIn Link',
                destination: href
            });
        }
    });

    // --- TRACKING DE EVENTO AGREGAR AL CARRITO ---
    window.addEventListener('cart:item-added', (e) => {
        try {
            const { product } = e.detail;
            trackGA4Event('add_to_cart', {
                ecommerce: {
                    currency: 'UYU',
                    value: parseFloat(product.price) * parseInt(product.quantity),
                    items: [{
                        item_id: product.id,
                        item_name: product.name,
                        price: parseFloat(product.price),
                        quantity: parseInt(product.quantity)
                    }]
                }
            });
        } catch (err) {
            console.error('Error al trackear add_to_cart en GA4:', err);
        }
    });

    // --- ANUNCIO EXPO URUGUAY SOSTENIBLE 2026 ---
    const now = new Date();
    const expirationDate = new Date("2026-06-14T19:00:00-03:00"); // Zona horaria de Uruguay (UTC-3)
    if (now < expirationDate) {
        if (!localStorage.getItem('expo_modal_shown')) {
            showExpoModal();
        }
    }

    setTimeout(() => window.updateCartCount(), 500);
});

// ==========================================
// FUNCIÓN PARA MOSTRAR EL MODAL DE LA EXPO 2026
// ==========================================
function showExpoModal() {
    const modalHTML = `
        <div id="expo-announcement-modal" class="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 100000; align-items: center; justify-content: center; padding: 1rem; background-color: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px); opacity: 0;">
            <div class="relative w-full max-w-lg bg-white rounded-2xl p-6 sm:p-8 shadow-2xl border border-gray-200 transform scale-95 transition-all duration-300" id="expo-modal-card" style="background-color: #ffffff; border-radius: 1rem; padding: 2rem; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); max-width: 32rem; width: 100%; border: 1px solid #e5e7eb; position: relative;">
                
                <!-- Botón Cerrar -->
                <button type="button" id="expo-modal-close" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; cursor: pointer; color: #9ca3af; padding: 4px;" aria-label="Cerrar">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width: 1.5rem; height: 1.5rem;"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>

                <!-- Banner Oficial -->
                <div class="mb-6 pb-4 border-b border-gray-100" style="margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid #f3f4f6; text-align: center;">
                    <img src="images/expo-sostenible-banner.png" alt="Expo Uruguay Sostenible 2026 - Antel Arena - Ministerio de Ambiente" class="w-full h-auto object-contain rounded-lg" style="width: 100%; height: auto; object-fit: contain; border-radius: 0.5rem;" />
                </div>

                <!-- Contenido -->
                <div class="text-center" style="text-align: center;">
                    <span class="inline-block px-3 py-1 bg-rp-blue-light text-rp-teal font-extrabold text-xs tracking-widest rounded-full uppercase mb-4" style="display: inline-block; padding: 0.25rem 0.75rem; background-color: #e0f7f7; color: #79C7C7; font-weight: 800; font-size: 0.75rem; letter-spacing: 0.1em; border-radius: 9999px; text-transform: uppercase; margin-bottom: 1rem;">¡VISITÁ NUESTRO STAND!</span>
                    <h2 class="text-2xl font-bold text-text-dark mb-4 leading-tight title-style" style="font-size: 1.5rem; font-weight: 700; color: #333333; margin-bottom: 1rem; line-height: 1.25; font-family: 'Patua One', cursive;">Estaremos en la <span class="text-rp-teal" style="color: #79C7C7;">Expo Uruguay Sostenible</span></h2>
                    
                    <p class="text-sm text-gray-600 mb-6 leading-relaxed" style="font-size: 0.875rem; color: #4b5563; margin-bottom: 1.5rem; line-height: 1.5; font-family: 'Inter', sans-serif;">
                        Nos complace invitarlos a visitarnos en el evento ambiental más importante del país. Vení a conocer nuestros procesos de reciclaje de plástico y productos de diseño sostenible.
                    </p>

                    <!-- Tarjeta de Detalles -->
                    <div class="bg-bg-light rounded-xl p-4 border border-rp-gray-soft/50 text-left mb-6 space-y-3" style="background-color: #fafafa; border-radius: 0.75rem; padding: 1rem; border: 1px solid #dddddd; text-align: left; margin-bottom: 1.5rem;">
                        <div class="flex items-center gap-3 mb-3" style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem;">
                            <div class="flex items-center justify-center w-8 h-8 rounded-full bg-rp-blue-light text-rp-teal" style="display: flex; align-items: center; justify-content: center; width: 2rem; height: 2rem; border-radius: 9999px; background-color: #e0f7f7; color: #79C7C7; flex-shrink: 0;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width: 1rem; height: 1rem;"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                            </div>
                            <div style="display: flex; flex-direction: column;">
                                <span class="block text-xs font-bold text-gray-400 uppercase leading-none" style="font-size: 10px; font-weight: 700; color: #9ca3af; text-transform: uppercase; line-height: 1; margin-bottom: 2px;">Fechas</span>
                                <span class="text-sm font-semibold text-text-dark" style="font-size: 0.875rem; font-weight: 600; color: #333333;">Del jueves 11/06 al domingo 14/06</span>
                            </div>
                        </div>

                        <div class="flex items-center gap-3 mb-3" style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem;">
                            <div class="flex items-center justify-center w-8 h-8 rounded-full bg-rp-blue-light text-rp-teal" style="display: flex; align-items: center; justify-content: center; width: 2rem; height: 2rem; border-radius: 9999px; background-color: #e0f7f7; color: #79C7C7; flex-shrink: 0;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width: 1rem; height: 1rem;"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                            </div>
                            <div style="display: flex; flex-direction: column;">
                                <span class="block text-xs font-bold text-gray-400 uppercase leading-none" style="font-size: 10px; font-weight: 700; color: #9ca3af; text-transform: uppercase; line-height: 1; margin-bottom: 2px;">Horario</span>
                                <span class="text-sm font-semibold text-text-dark" style="font-size: 0.875rem; font-weight: 600; color: #333333;">De 10:00 a 19:00 hs</span>
                            </div>
                        </div>

                        <div class="flex items-center gap-3" style="display: flex; align-items: center; gap: 0.75rem;">
                            <div class="flex items-center justify-center w-8 h-8 rounded-full bg-rp-blue-light text-rp-teal" style="display: flex; align-items: center; justify-content: center; width: 2rem; height: 2rem; border-radius: 9999px; background-color: #e0f7f7; color: #79C7C7; flex-shrink: 0;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width: 1rem; height: 1rem;"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                            </div>
                            <div style="display: flex; flex-direction: column;">
                                <span class="block text-xs font-bold text-gray-400 uppercase leading-none" style="font-size: 10px; font-weight: 700; color: #9ca3af; text-transform: uppercase; line-height: 1; margin-bottom: 2px;">Ubicación</span>
                                <span class="text-sm font-extrabold text-rp-teal uppercase" style="font-size: 0.875rem; font-weight: 800; color: #79C7C7; text-transform: uppercase;">Stand C52 (Antel Arena)</span>
                            </div>
                        </div>
                    </div>

                     <div class="flex gap-3" style="display: flex; gap: 0.75rem; width: 100%;">
                        <a href="https://ambiente.gub.uy/comunicaciones" target="_blank" rel="noopener noreferrer" class="flex-1 py-3 bg-white border-2 border-rp-teal text-rp-teal font-bold rounded-lg hover:bg-rp-blue-light transition text-center active:scale-[0.98]" style="flex: 1; padding: 0.75rem; border: 2px solid #79C7C7; background-color: #ffffff; color: #79C7C7; font-weight: 700; border-radius: 0.5rem; text-decoration: none; text-align: center; cursor: pointer; font-family: 'Montserrat', sans-serif; font-size: 1rem; box-sizing: border-box; display: inline-block;">
                            Más info
                        </a>
                        <button type="button" id="expo-modal-btn" class="flex-1 py-3 bg-rp-teal text-white font-bold rounded-lg hover:bg-rp-teal/90 transition shadow-lg active:scale-[0.98]" style="flex: 1; padding: 0.75rem; background-color: #79C7C7; color: #ffffff; font-weight: 700; border: none; border-radius: 0.5rem; cursor: pointer; font-family: 'Montserrat', sans-serif; font-size: 1rem; box-shadow: 0 4px 6px -1px rgba(121, 199, 199, 0.4);">
                            ¡Nos vemos allí!
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const overlay = document.getElementById('expo-announcement-modal');
    const card = document.getElementById('expo-modal-card');

    overlay.style.display = 'flex';

    setTimeout(() => {
        overlay.style.opacity = '1';
        if (card) {
            card.style.transform = 'scale(1)';
            card.style.opacity = '1';
        }
    }, 50);

    function closeModal() {
        overlay.style.opacity = '0';
        if (card) {
            card.style.transform = 'scale(0.95)';
            card.style.opacity = '0';
        }
        setTimeout(() => {
            overlay.style.display = 'none';
            overlay.remove();
        }, 300);
        localStorage.setItem('expo_modal_shown', 'true');
    }

    document.getElementById('expo-modal-close').addEventListener('click', closeModal);
    document.getElementById('expo-modal-btn').addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });
}