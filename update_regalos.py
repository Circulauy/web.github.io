import re

html_file = r'c:\Users\anton\Downloads\web.github.io-main\web.github.io-main\regalos-empresariales.html'

with open(html_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace palette
palette_original = r"""                <div class="flex flex-wrap justify-center gap-8 md:gap-12 reveal-element delay-200">
                    <div class="group relative flex flex-col items-center cursor-pointer">
                        <div class="w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#8c928e] shadow-lg mb-4 transform transition-all duration-500 group-hover:scale-110 group-hover:shadow-xl"></div>
                        <div class="absolute -top-12 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-text-dark text-white text-xs py-2 px-4 rounded whitespace-nowrap z-10 pointer-events-none transform translate-y-2 group-hover:-translate-y-2">
                            Inspirado en la piedra y la niebla
                        </div>
                        <h4 class="font-bold text-text-dark text-sm md:text-base">Piedra de Arequita</h4>
                    </div>
                    <div class="group relative flex flex-col items-center cursor-pointer">
                        <div class="w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#1b232a] shadow-lg mb-4 transform transition-all duration-500 group-hover:scale-110 group-hover:shadow-xl"></div>
                        <div class="absolute -top-12 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-text-dark text-white text-xs py-2 px-4 rounded whitespace-nowrap z-10 pointer-events-none transform translate-y-2 group-hover:-translate-y-2">
                            Profundidad oceánica nocturna
                        </div>
                        <h4 class="font-bold text-text-dark text-sm md:text-base">Noche de Rocha</h4>
                    </div>
                    <div class="group relative flex flex-col items-center cursor-pointer">
                        <div class="w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#1d3557] shadow-lg mb-4 transform transition-all duration-500 group-hover:scale-110 group-hover:shadow-xl"></div>
                        <div class="absolute -top-12 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-text-dark text-white text-xs py-2 px-4 rounded whitespace-nowrap z-10 pointer-events-none transform translate-y-2 group-hover:-translate-y-2">
                            Reflejos azules del mar
                        </div>
                        <h4 class="font-bold text-text-dark text-sm md:text-base">Marea de Polonio</h4>
                    </div>
                    <div class="group relative flex flex-col items-center cursor-pointer">
                        <div class="w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#2b5a45] shadow-lg mb-4 transform transition-all duration-500 group-hover:scale-110 group-hover:shadow-xl"></div>
                        <div class="absolute -top-12 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-text-dark text-white text-xs py-2 px-4 rounded whitespace-nowrap z-10 pointer-events-none transform translate-y-2 group-hover:-translate-y-2">
                            Verde profundo de nuestro monte
                        </div>
                        <h4 class="font-bold text-text-dark text-sm md:text-base">Monte Nativo</h4>
                    </div>
                </div>"""

palette_new = r"""                <div class="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 max-w-5xl mx-auto reveal-element delay-200">
                    <div class="group relative flex flex-col items-center cursor-pointer">
                        <div class="w-24 h-24 md:w-32 md:h-32 rounded-full shadow-lg mb-4 transform transition-all duration-500 group-hover:scale-110 group-hover:shadow-xl overflow-hidden border-4 border-white">
                            <img src="images/PIEDRA DEL AREQUITA_Col.jpg" class="w-full h-full object-cover" alt="Piedra de Arequita">
                        </div>
                        <div class="absolute -top-12 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-text-dark text-white text-xs py-2 px-4 rounded whitespace-nowrap z-10 pointer-events-none transform translate-y-2 group-hover:-translate-y-2">
                            Base sólida que replica el granito oscuro
                        </div>
                        <h4 class="font-bold text-text-dark text-sm md:text-base text-center">Piedra de Arequita</h4>
                    </div>
                    <div class="group relative flex flex-col items-center cursor-pointer">
                        <div class="w-24 h-24 md:w-32 md:h-32 rounded-full shadow-lg mb-4 transform transition-all duration-500 group-hover:scale-110 group-hover:shadow-xl overflow-hidden border-4 border-white">
                            <img src="images/CUERDA DE TAMBORES_Col.jpg" class="w-full h-full object-cover" alt="Cuerda de Tambores">
                        </div>
                        <div class="absolute -top-12 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-text-dark text-white text-xs py-2 px-4 rounded whitespace-nowrap z-10 pointer-events-none transform translate-y-2 group-hover:-translate-y-2">
                            Ensamble vibrante de colores
                        </div>
                        <h4 class="font-bold text-text-dark text-sm md:text-base text-center">Cuerda de Tambores</h4>
                    </div>
                    <div class="group relative flex flex-col items-center cursor-pointer">
                        <div class="w-24 h-24 md:w-32 md:h-32 rounded-full shadow-lg mb-4 transform transition-all duration-500 group-hover:scale-110 group-hover:shadow-xl overflow-hidden border-4 border-white">
                            <img src="images/ATARDECER EN CASAPUEBLO_Col.jpg" class="w-full h-full object-cover" alt="Atardecer en Casapueblo">
                        </div>
                        <div class="absolute -top-12 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-text-dark text-white text-xs py-2 px-4 rounded whitespace-nowrap z-10 pointer-events-none transform translate-y-2 group-hover:-translate-y-2">
                            Fondo inmaculado con destellos cálidos
                        </div>
                        <h4 class="font-bold text-text-dark text-sm md:text-base text-center">Atardecer en Casapueblo</h4>
                    </div>
                    <div class="group relative flex flex-col items-center cursor-pointer">
                        <div class="w-24 h-24 md:w-32 md:h-32 rounded-full shadow-lg mb-4 transform transition-all duration-500 group-hover:scale-110 group-hover:shadow-xl overflow-hidden border-4 border-white">
                            <img src="images/CUARZO DE ARTIGAS_Col.jpg" class="w-full h-full object-cover" alt="Cuarzo de Artigas">
                        </div>
                        <div class="absolute -top-12 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-text-dark text-white text-xs py-2 px-4 rounded whitespace-nowrap z-10 pointer-events-none transform translate-y-2 group-hover:-translate-y-2">
                            Elegancia mineral que simula cuarzo
                        </div>
                        <h4 class="font-bold text-text-dark text-sm md:text-base text-center">Cuarzo de Artigas</h4>
                    </div>
                    <div class="group relative flex flex-col items-center cursor-pointer">
                        <div class="w-24 h-24 md:w-32 md:h-32 rounded-full shadow-lg mb-4 transform transition-all duration-500 group-hover:scale-110 group-hover:shadow-xl overflow-hidden border-4 border-white">
                            <img src="images/NOCHE DE ROCHA_Col.jpg" class="w-full h-full object-cover" alt="Noche de Rocha">
                        </div>
                        <div class="absolute -top-12 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-text-dark text-white text-xs py-2 px-4 rounded whitespace-nowrap z-10 pointer-events-none transform translate-y-2 group-hover:-translate-y-2">
                            Base oscura del cielo estrellado
                        </div>
                        <h4 class="font-bold text-text-dark text-sm md:text-base text-center">Noche de Rocha</h4>
                    </div>
                    <div class="group relative flex flex-col items-center cursor-pointer">
                        <div class="w-24 h-24 md:w-32 md:h-32 rounded-full shadow-lg mb-4 transform transition-all duration-500 group-hover:scale-110 group-hover:shadow-xl overflow-hidden border-4 border-white">
                            <img src="images/MAREA DEL POLONIO_Col.jpg" class="w-full h-full object-cover" alt="Marea de Polonio">
                        </div>
                        <div class="absolute -top-12 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-text-dark text-white text-xs py-2 px-4 rounded whitespace-nowrap z-10 pointer-events-none transform translate-y-2 group-hover:-translate-y-2">
                            Azul marino profundo y salvaje
                        </div>
                        <h4 class="font-bold text-text-dark text-sm md:text-base text-center">Marea de Polonio</h4>
                    </div>
                    <div class="group relative flex flex-col items-center cursor-pointer">
                        <div class="w-24 h-24 md:w-32 md:h-32 rounded-full shadow-lg mb-4 transform transition-all duration-500 group-hover:scale-110 group-hover:shadow-xl overflow-hidden border-4 border-white">
                            <img src="images/TIERRA DE RIVERA_Col.jpg" class="w-full h-full object-cover" alt="Tierra de Rivera">
                        </div>
                        <div class="absolute -top-12 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-text-dark text-white text-xs py-2 px-4 rounded whitespace-nowrap z-10 pointer-events-none transform translate-y-2 group-hover:-translate-y-2">
                            Tono cálido de tierras coloradas
                        </div>
                        <h4 class="font-bold text-text-dark text-sm md:text-base text-center">Tierra de Rivera</h4>
                    </div>
                    <div class="group relative flex flex-col items-center cursor-pointer">
                        <div class="w-24 h-24 md:w-32 md:h-32 rounded-full shadow-lg mb-4 transform transition-all duration-500 group-hover:scale-110 group-hover:shadow-xl overflow-hidden border-4 border-white">
                            <img src="images/ESPESURA DE LA QUEBRADA_Col.jpg" class="w-full h-full object-cover" alt="Espesura de la Quebrada">
                        </div>
                        <div class="absolute -top-12 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-text-dark text-white text-xs py-2 px-4 rounded whitespace-nowrap z-10 pointer-events-none transform translate-y-2 group-hover:-translate-y-2">
                            Verde intenso de nuestra vegetación
                        </div>
                        <h4 class="font-bold text-text-dark text-sm md:text-base text-center">Espesura de la Quebrada</h4>
                    </div>
                </div>"""

content = content.replace(palette_original, palette_new)

# Replace Grid of Products
grid_original = r"""                <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    <!-- Producto 1 -->
                    <div class="group reveal-element delay-100 transition-all duration-500 hover:-translate-y-2">
                        <div class="bg-stone aspect-[4/5] overflow-hidden mb-6 flex items-center justify-center p-8 rounded-lg shadow-sm group-hover:shadow-xl transition-all duration-500">
                            <img src="images/catalogo/page_12_img_1.png" alt="Soporte para celular"
                                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
                        </div>
                        <h3 class="text-2xl font-bold text-text-dark mb-2">Soporte Monolítico</h3>
                        <p class="text-slate-500 font-light text-sm mb-3">Un ejercicio de minimalismo arquitectónico.
                            Tallado en un único bloque macizo, este soporte utiliza su propio peso para anclar cualquier
                            dispositivo en el ángulo perfecto.</p>
                        <p class="text-espesura font-bold text-lg mb-1">$320 UYU c/u</p>
                        <p class="text-xs text-slate-400">Lote mínimo: 60 uds.</p>
                    </div>

                    <!-- Producto 2 -->
                    <div class="group reveal-element delay-200 transition-all duration-500 hover:-translate-y-2">
                        <div class="bg-stone aspect-[4/5] overflow-hidden mb-6 flex items-center justify-center p-8 rounded-lg shadow-sm group-hover:shadow-xl transition-all duration-500">
                            <img src="images/catalogo/page_2_img_1.png" alt="Gancho de escritorio"
                                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
                        </div>
                        <h3 class="text-2xl font-bold text-text-dark mb-2">Gancho de Escritorio</h3>
                        <p class="text-slate-500 font-light text-sm mb-3">La física al servicio del orden. Se bloquea
                            mecánicamente contra el borde de la mesa. Sin adhesivos ni herrajes, un punto de apoyo
                            invisible y portátil.</p>
                        <p class="text-espesura font-bold text-lg mb-1">$363 UYU c/u</p>
                        <p class="text-xs text-slate-400">Lote mínimo: 60 uds.</p>
                    </div>

                    <!-- Producto 3 -->
                    <div class="group reveal-element delay-300 transition-all duration-500 hover:-translate-y-2">
                        <div class="bg-stone aspect-[4/5] overflow-hidden mb-6 flex items-center justify-center p-8 rounded-lg shadow-sm group-hover:shadow-xl transition-all duration-500">
                            <img src="images/catalogo/page_6_img_1.png" alt="Reloj de pared"
                                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
                        </div>
                        <h3 class="text-2xl font-bold text-text-dark mb-2">Reloj de Pared</h3>
                        <p class="text-slate-500 font-light text-sm mb-3">Funcionamiento silencioso. El cuadrante está
                            hecho a partir de placa de plástico reciclado, convirtiendo cada minuto en un recordatorio
                            de sustentabilidad.</p>
                        <p class="text-espesura font-bold text-lg mb-1">$1.400 UYU c/u</p>
                        <p class="text-xs text-slate-400">Lote mínimo: 9 uds.</p>
                    </div>
                </div>"""

grid_new = r"""                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
                    <!-- Products -->
                    <div class="group reveal-element delay-100 transition-all duration-500 hover:-translate-y-2">
                        <div class="bg-stone aspect-square overflow-hidden mb-6 flex items-center justify-center p-8 rounded-lg shadow-sm group-hover:shadow-xl transition-all duration-500">
                            <img src="images/catalogo/page_2_img_1.png" alt="Gancho de escritorio" class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700">
                        </div>
                        <h3 class="text-xl font-bold text-text-dark mb-2">Gancho de Escritorio</h3>
                        <p class="text-espesura font-bold text-lg mb-1">$363 UYU c/u</p>
                        <p class="text-xs text-slate-400">Lote mínimo: 60 uds.</p>
                    </div>
                    <div class="group reveal-element delay-200 transition-all duration-500 hover:-translate-y-2">
                        <div class="bg-stone aspect-square overflow-hidden mb-6 flex items-center justify-center p-8 rounded-lg shadow-sm group-hover:shadow-xl transition-all duration-500">
                            <img src="images/catalogo/page_3_img_1.png" alt="Llavero Soporte" class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700">
                        </div>
                        <h3 class="text-xl font-bold text-text-dark mb-2">Llavero Soporte</h3>
                        <p class="text-espesura font-bold text-lg mb-1">$150 UYU c/u</p>
                        <p class="text-xs text-slate-400">Lote mínimo: 200 uds.</p>
                    </div>
                    <div class="group reveal-element delay-300 transition-all duration-500 hover:-translate-y-2">
                        <div class="bg-stone aspect-square overflow-hidden mb-6 flex items-center justify-center p-8 rounded-lg shadow-sm group-hover:shadow-xl transition-all duration-500">
                            <img src="images/catalogo/page_4_img_1.png" alt="Soporte para celular encastrable" class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700">
                        </div>
                        <h3 class="text-xl font-bold text-text-dark mb-2">Soporte Celular Encastrable</h3>
                        <p class="text-espesura font-bold text-lg mb-1">$380 UYU c/u</p>
                        <p class="text-xs text-slate-400">Lote mínimo: 20 uds.</p>
                    </div>
                    <div class="group reveal-element delay-100 transition-all duration-500 hover:-translate-y-2">
                        <div class="bg-stone aspect-square overflow-hidden mb-6 flex items-center justify-center p-8 rounded-lg shadow-sm group-hover:shadow-xl transition-all duration-500">
                            <img src="images/catalogo/page_5_img_1.png" alt="Stand para laptop" class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700">
                        </div>
                        <h3 class="text-xl font-bold text-text-dark mb-2">Stand para Laptop</h3>
                        <p class="text-espesura font-bold text-lg mb-1">$650 UYU c/u</p>
                        <p class="text-xs text-slate-400">Lote mínimo: 20 uds.</p>
                    </div>
                    <div class="group reveal-element delay-200 transition-all duration-500 hover:-translate-y-2">
                        <div class="bg-stone aspect-square overflow-hidden mb-6 flex items-center justify-center p-8 rounded-lg shadow-sm group-hover:shadow-xl transition-all duration-500">
                            <img src="images/catalogo/page_6_img_1.png" alt="Reloj de pared" class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700">
                        </div>
                        <h3 class="text-xl font-bold text-text-dark mb-2">Reloj de Pared</h3>
                        <p class="text-espesura font-bold text-lg mb-1">$1.400 UYU c/u</p>
                        <p class="text-xs text-slate-400">Lote mínimo: 9 uds.</p>
                    </div>
                    <div class="group reveal-element delay-300 transition-all duration-500 hover:-translate-y-2">
                        <div class="bg-stone aspect-square overflow-hidden mb-6 flex items-center justify-center p-8 rounded-lg shadow-sm group-hover:shadow-xl transition-all duration-500">
                            <img src="images/catalogo/page_7_img_1.png" alt="Vacíabolsillos Minimalista" class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700">
                        </div>
                        <h3 class="text-xl font-bold text-text-dark mb-2">Vacíabolsillos Minimalista</h3>
                        <p class="text-espesura font-bold text-lg mb-1">$534 UYU c/u</p>
                        <p class="text-xs text-slate-400">Lote mínimo: 40 uds.</p>
                    </div>
                    <div class="group reveal-element delay-100 transition-all duration-500 hover:-translate-y-2">
                        <div class="bg-stone aspect-square overflow-hidden mb-6 flex items-center justify-center p-8 rounded-lg shadow-sm group-hover:shadow-xl transition-all duration-500">
                            <img src="images/catalogo/page_8_img_1.png" alt="Estacas Playeras" class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700">
                        </div>
                        <h3 class="text-xl font-bold text-text-dark mb-2">Estacas Playeras (Kit x4)</h3>
                        <p class="text-espesura font-bold text-lg mb-1">$586 UYU c/u</p>
                        <p class="text-xs text-slate-400">Lote mínimo: 35 uds.</p>
                    </div>
                    <div class="group reveal-element delay-200 transition-all duration-500 hover:-translate-y-2">
                        <div class="bg-stone aspect-square overflow-hidden mb-6 flex items-center justify-center p-8 rounded-lg shadow-sm group-hover:shadow-xl transition-all duration-500">
                            <img src="images/catalogo/page_9_img_1.png" alt="Sujetador de Libro" class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700">
                        </div>
                        <h3 class="text-xl font-bold text-text-dark mb-2">Sujetador de Libro</h3>
                        <p class="text-espesura font-bold text-lg mb-1">$240 UYU c/u</p>
                        <p class="text-xs text-slate-400">Lote mínimo: 100 uds.</p>
                    </div>
                    <div class="group reveal-element delay-300 transition-all duration-500 hover:-translate-y-2">
                        <div class="bg-stone aspect-square overflow-hidden mb-6 flex items-center justify-center p-8 rounded-lg shadow-sm group-hover:shadow-xl transition-all duration-500">
                            <img src="images/catalogo/page_10_img_1.png" alt="Jabonera Acanalada" class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700">
                        </div>
                        <h3 class="text-xl font-bold text-text-dark mb-2">Jabonera Acanalada</h3>
                        <p class="text-espesura font-bold text-lg mb-1">$428 UYU c/u</p>
                        <p class="text-xs text-slate-400">Lote mínimo: 40 uds.</p>
                    </div>
                    <div class="group reveal-element delay-100 transition-all duration-500 hover:-translate-y-2">
                        <div class="bg-stone aspect-square overflow-hidden mb-6 flex items-center justify-center p-8 rounded-lg shadow-sm group-hover:shadow-xl transition-all duration-500">
                            <img src="images/catalogo/page_11_img_1.png" alt="Soporte de Vino" class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700">
                        </div>
                        <h3 class="text-xl font-bold text-text-dark mb-2">Soporte de Vino</h3>
                        <p class="text-espesura font-bold text-lg mb-1">$600 UYU c/u</p>
                        <p class="text-xs text-slate-400">Lote mínimo: 30 uds.</p>
                    </div>
                    <div class="group reveal-element delay-200 transition-all duration-500 hover:-translate-y-2">
                        <div class="bg-stone aspect-square overflow-hidden mb-6 flex items-center justify-center p-8 rounded-lg shadow-sm group-hover:shadow-xl transition-all duration-500">
                            <img src="images/catalogo/page_12_img_1.png" alt="Soporte Celular Monolítico" class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700">
                        </div>
                        <h3 class="text-xl font-bold text-text-dark mb-2">Soporte Celular Monolítico</h3>
                        <p class="text-espesura font-bold text-lg mb-1">$320 UYU c/u</p>
                        <p class="text-xs text-slate-400">Lote mínimo: 60 uds.</p>
                    </div>
                </div>"""

content = content.replace(grid_original, grid_new)

# Replace Select Option original with all 11 options
select_original = r"""                            <select id="calc-product" class="w-full bg-white border border-slate-200 p-4 text-text-dark focus:border-espesura focus:ring-1 focus:ring-espesura outline-none transition-all rounded-md shadow-sm cursor-pointer">
                                <option value="363" data-min="60" data-name="Gancho de Escritorio">Gancho de Escritorio ($363 UYU base)</option>
                                <option value="320" data-min="60" data-name="Soporte Monolítico">Soporte Monolítico ($320 UYU base)</option>
                                <option value="1400" data-min="9" data-name="Reloj de Pared">Reloj de Pared ($1400 UYU base)</option>
                            </select>"""

select_new = r"""                            <select id="calc-product" class="w-full bg-white border border-slate-200 p-4 text-text-dark focus:border-espesura focus:ring-1 focus:ring-espesura outline-none transition-all rounded-md shadow-sm cursor-pointer">
                                <option value="363" data-min="60" data-name="Gancho de Escritorio">Gancho de Escritorio ($363 UYU base)</option>
                                <option value="150" data-min="200" data-name="Llavero Soporte">Llavero Soporte ($150 UYU base)</option>
                                <option value="380" data-min="20" data-name="Soporte Celular Encastrable">Soporte Celular Encastrable ($380 UYU base)</option>
                                <option value="650" data-min="20" data-name="Stand para Laptop">Stand para Laptop ($650 UYU base)</option>
                                <option value="1400" data-min="9" data-name="Reloj de Pared">Reloj de Pared ($1400 UYU base)</option>
                                <option value="534" data-min="40" data-name="Vacíabolsillos Minimalista">Vacíabolsillos Minimalista ($534 UYU base)</option>
                                <option value="586" data-min="35" data-name="Estacas Playeras">Estacas Playeras ($586 UYU base)</option>
                                <option value="240" data-min="100" data-name="Sujetador de Libro">Sujetador de Libro ($240 UYU base)</option>
                                <option value="428" data-min="40" data-name="Jabonera Acanalada">Jabonera Acanalada ($428 UYU base)</option>
                                <option value="600" data-min="30" data-name="Soporte de Vino">Soporte de Vino ($600 UYU base)</option>
                                <option value="320" data-min="60" data-name="Soporte Celular Monolítico">Soporte Celular Monolítico ($320 UYU base)</option>
                            </select>"""

content = content.replace(select_original, select_new)

with open(html_file, 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
