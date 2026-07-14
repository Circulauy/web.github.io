const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, 'index.html');
let content = fs.readFileSync(targetFile, 'utf8');

const newHTML = `    <div id="preloader" class="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center transition-opacity duration-700">
        <!-- Giant Background Percentage -->
        <div id="loader-bg-percent" class="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden opacity-[0.03]">
            <span class="text-[35vw] font-black text-black leading-none font-brand tracking-tighter">0</span>
        </div>

        <div class="loader-container flex flex-col items-center w-full relative z-10">
            <!-- Brand Logo -->
            <div class="loader-logo-wrap mb-4 mt-8">
                <img src="images/logo.png" alt="Circula" class="h-10 w-auto object-contain">
            </div>
            
            <!-- Original Process Animation (White Theme Colors) -->
            <div class="relative mb-6">
                <svg id="preloader-animation" class="w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] mx-auto overflow-visible" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <clipPath id="bottle-clip-recolectar">
                            <path d="M85 35 H115 V60 C115 70, 140 75, 140 85 V175 C140 183, 133 190, 125 190 H75 C67 190, 60 183, 60 175 V85 C60 75, 85 70, 85 60 Z" />
                        </clipPath>
                    </defs>
                    
                    <circle cx="100" cy="100" r="95" stroke="#e2e8f0" stroke-width="0.8" stroke-dasharray="2 2" fill="none" />
                    <path id="stepper-arc" d="M 100,5 A 95,95 0 1,1 99.9,5" stroke="#000000" stroke-width="1.2" stroke-dasharray="597" stroke-dashoffset="597" fill="none" stroke-linecap="round" />
                    
                    <g id="step-node-0">
                        <circle cx="100" cy="5" r="3.2" fill="#ffffff" stroke="#94a3b8" stroke-width="1" />
                        <circle cx="100" cy="5" r="1.5" fill="none" id="step-dot-inner-0" />
                        <text x="100" y="-3" font-family="'Inter', sans-serif" font-size="5" font-weight="700" fill="#94a3b8" text-anchor="middle" letter-spacing="0.5">RESIDUO</text>
                    </g>
                    <g id="step-node-1">
                        <circle cx="182.3" cy="52.5" r="3.2" fill="#ffffff" stroke="#94a3b8" stroke-width="1" />
                        <circle cx="182.3" cy="52.5" r="1.5" fill="none" id="step-dot-inner-1" />
                        <text x="190" y="54" font-family="'Inter', sans-serif" font-size="5" font-weight="700" fill="#94a3b8" text-anchor="start" letter-spacing="0.5">CLASIFICAR</text>
                    </g>
                    <g id="step-node-2">
                        <circle cx="182.3" cy="147.5" r="3.2" fill="#ffffff" stroke="#94a3b8" stroke-width="1" />
                        <circle cx="182.3" cy="147.5" r="1.5" fill="none" id="step-dot-inner-2" />
                        <text x="190" y="149" font-family="'Inter', sans-serif" font-size="5" font-weight="700" fill="#94a3b8" text-anchor="start" letter-spacing="0.5">TRITURAR</text>
                    </g>
                    <g id="step-node-3">
                        <circle cx="100" cy="195" r="3.2" fill="#ffffff" stroke="#94a3b8" stroke-width="1" />
                        <circle cx="100" cy="195" r="1.5" fill="none" id="step-dot-inner-3" />
                        <text x="100" y="204" font-family="'Inter', sans-serif" font-size="5" font-weight="700" fill="#94a3b8" text-anchor="middle" letter-spacing="0.5">MOLDEAR</text>
                    </g>
                    <g id="step-node-4">
                        <circle cx="17.7" cy="147.5" r="3.2" fill="#ffffff" stroke="#94a3b8" stroke-width="1" />
                        <circle cx="17.7" cy="147.5" r="1.5" fill="none" id="step-dot-inner-4" />
                        <text x="10" y="149" font-family="'Inter', sans-serif" font-size="5" font-weight="700" fill="#94a3b8" text-anchor="end" letter-spacing="0.5">CORTAR</text>
                    </g>
                    <g id="step-node-5">
                        <circle cx="17.7" cy="52.5" r="3.2" fill="#ffffff" stroke="#94a3b8" stroke-width="1" />
                        <circle cx="17.7" cy="52.5" r="1.5" fill="none" id="step-dot-inner-5" />
                        <text x="10" y="54" font-family="'Inter', sans-serif" font-size="5" font-weight="700" fill="#94a3b8" text-anchor="end" letter-spacing="0.5">PRODUCTO</text>
                    </g>
                    
                    <!-- Phase 1: Recolectar -->
                    <g id="phase-recolectar" opacity="0" transform="scale(0.60)" transform-origin="100 100">
                        <path d="M85 30 H115 V60 C115 70, 140 75, 140 85 V175 C140 183, 133 190, 125 190 H75 C67 190, 60 183, 60 175 V85 C60 75, 85 70, 85 60 Z" stroke="#000000" stroke-width="1.2" stroke-linejoin="round" fill="none" />
                        <rect x="81" y="26" width="38" height="4" rx="2" fill="#000000" />
                        <g clip-path="url(#bottle-clip-recolectar)">
                            <rect x="50" y="25" width="100" height="170" fill="#ffffff" />
                            <g id="piled-caps-recolectar"></g>
                        </g>
                        <g id="falling-caps-recolectar"></g>
                    </g>
                    
                    <!-- Phase 2: Clasificar -->
                    <g id="phase-clasificar" opacity="0" transform="scale(0.60)" transform-origin="100 100">
                        <rect x="42" y="90" width="32" height="90" rx="3" stroke="#000000" stroke-width="1" fill="#f8fafc" />
                        <text x="58" y="193" font-family="monospace" font-size="7" font-weight="bold" fill="#000000" text-anchor="middle">01</text>
                        <g id="piled-caps-green"></g>
                        
                        <rect x="84" y="90" width="32" height="90" rx="3" stroke="#000000" stroke-width="1" fill="#f8fafc" />
                        <text x="100" y="193" font-family="monospace" font-size="7" font-weight="bold" fill="#000000" text-anchor="middle">02</text>
                        <g id="piled-caps-blue"></g>
                        
                        <rect x="126" y="90" width="32" height="90" rx="3" stroke="#000000" stroke-width="1" fill="#f8fafc" />
                        <text x="142" y="193" font-family="monospace" font-size="7" font-weight="bold" fill="#000000" text-anchor="middle">03</text>
                        <g id="piled-caps-pink"></g>
                        
                        <g id="sorting-caps"></g>
                    </g>
                    
                    <!-- Phase 3: Triturar -->
                    <g id="phase-triturar" opacity="0" transform="scale(0.60)" transform-origin="100 100">
                        <path d="M40 30 H160 L120 90 H80 Z" stroke="#000000" stroke-width="1.2" fill="#f8fafc" stroke-linejoin="round" />
                        
                        <g id="gear-left" transform="translate(88, 100)">
                            <circle cx="0" cy="0" r="10" stroke="#000000" stroke-width="1.2" fill="#e2e8f0" />
                            <path d="M-12 0 H12 M0 -12 V12 M-8 -8 L8 8 M-8 8 L8 -8" stroke="#000000" stroke-width="1.2" />
                        </g>
                        <g id="gear-right" transform="translate(112, 100)">
                            <circle cx="0" cy="0" r="10" stroke="#000000" stroke-width="1.2" fill="#e2e8f0" />
                            <path d="M-12 0 H12 M0 -12 V12 M-8 -8 L8 8 M-8 8 L8 -8" stroke="#000000" stroke-width="1.2" />
                        </g>
                        
                        <rect x="50" y="140" width="100" height="45" rx="3" stroke="#000000" stroke-width="1.2" fill="#f8fafc" />
                        <g id="piled-flakes"></g>
                        
                        <g id="falling-caps-triturar"></g>
                        <g id="falling-flakes"></g>
                    </g>
                    
                    <!-- Phase 4: Prensar -->
                    <g id="phase-prensar" opacity="0" transform="scale(0.60)" transform-origin="100 100">
                        <rect x="48" y="138" width="104" height="44" rx="2" stroke="#000000" stroke-width="1.2" fill="none" />
                        <g id="loose-flakes-mold"></g>
                        
                        <g id="pressed-sheet-group" opacity="0">
                            <rect x="50" y="140" width="100" height="40" rx="3" fill="#1e293b" stroke="#000000" stroke-width="1" />
                            <rect x="58" y="146" width="3" height="3" transform="rotate(15 58 146)" fill="#79C7C7" />
                            <rect x="74" y="162" width="2" height="4" transform="rotate(45 74 162)" fill="#a3e6ba" />
                            <rect x="110" y="152" width="4" height="2" transform="rotate(-30 110 152)" fill="#79C7C7" />
                            <rect x="132" y="166" width="3" height="3" transform="rotate(10 132 166)" fill="#cbd5e1" />
                            <rect x="90" y="148" width="3" height="2" transform="rotate(75 90 148)" fill="#cbd5e1" />
                            <rect x="122" y="144" width="2" height="3" transform="rotate(25 122 144)" fill="#a3e6ba" />
                        </g>
                        
                        <line x1="100" y1="20" x2="100" y2="120" stroke="#000000" stroke-width="4" id="press-shaft" />
                        <rect x="50" y="115" width="100" height="15" rx="1.5" fill="#000000" id="press-head" />
                    </g>
                    
                    <!-- Phase 5: Cortar -->
                    <g id="phase-cortar" opacity="0" transform="scale(0.60)" transform-origin="100 100">
                        <g id="cutting-sheet-group" opacity="0.6">
                            <rect x="50" y="70" width="100" height="60" rx="4" fill="#1e293b" stroke="#000000" stroke-width="1" />
                            <rect x="58" y="76" width="3" height="3" transform="rotate(15 58 76)" fill="#79C7C7" />
                            <rect x="74" y="92" width="2" height="4" transform="rotate(45 74 92)" fill="#a3e6ba" />
                            <rect x="110" y="82" width="4" height="2" transform="rotate(-30 110 82)" fill="#79C7C7" />
                            <rect x="132" y="96" width="3" height="3" transform="rotate(10 132 96)" fill="#cbd5e1" />
                            <rect x="90" y="78" width="3" height="2" transform="rotate(75 90 78)" fill="#cbd5e1" />
                            <rect x="122" y="74" width="2" height="3" transform="rotate(25 122 74)" fill="#a3e6ba" />
                        </g>
                        
                        <path id="cnc-cut-path" d="M70 125 V90 H130 V125 M85 125 V102 H115 V125" stroke="#79C7C7" stroke-width="1.5" stroke-dasharray="300" stroke-dashoffset="300" stroke-linecap="round" fill="none" />
                        
                        <g id="laser-head" transform="translate(70, 125)">
                            <circle cx="0" cy="0" r="3" fill="#79C7C7" />
                            <circle cx="0" cy="0" r="6" stroke="#79C7C7" stroke-width="1" opacity="0.4" class="animate-ping" />
                        </g>
                    </g>
                    
                    <!-- Phase 6: Ensamblar -->
                    <g id="phase-ensamblar" opacity="0" transform="scale(0.60)" transform-origin="100 100">
                        <path id="stool-legs" d="M75 130 L85 85 H115 L125 130 H110 L105 105 H95 L90 130 Z" fill="#1e293b" stroke="#000000" stroke-width="1.2" />
                        
                        <g id="stool-seat-group">
                            <ellipse id="stool-seat" cx="100" cy="85" rx="30" ry="8" fill="#1e293b" stroke="#000000" stroke-width="1.2" />
                            <ellipse id="stool-seat-fleck1" cx="85" cy="84" rx="1.5" ry="0.6" fill="#79C7C7" />
                            <ellipse id="stool-seat-fleck2" cx="102" cy="86" rx="2" ry="0.8" fill="#a3e6ba" />
                            <ellipse id="stool-seat-fleck3" cx="112" cy="83" rx="1.2" ry="0.5" fill="#cbd5e1" />
                        </g>
                        
                        <path id="stool-logo" d="M97 85 C97 85, 100 82, 103 85 C103 88, 103 91, 100 93 C97 91, 97 88, 97 85 Z" fill="#79C7C7" opacity="0.8" />
                        <ellipse id="stool-shine" cx="100" cy="85" rx="25" ry="4" fill="#ffffff" opacity="0.2" />
                        
                        <path id="circular-arrow" d="M100 45 C130 45, 155 70, 155 100 C155 130, 130 155, 100 155 C70 155, 45 130, 45 100 C45 80, 56 62, 72 53" stroke="#79C7C7" stroke-width="1.2" stroke-dasharray="3 3" fill="none" opacity="0" />
                        <path id="circular-arrow-head" d="M68 57 L74 52 L78 59" stroke="#79C7C7" stroke-width="1.2" fill="none" opacity="0" />
                        <text id="circular-badge" x="100" y="172" font-family="'Inter', sans-serif" font-size="6.5" font-weight="700" fill="#000000" text-anchor="middle" letter-spacing="1" opacity="0">DISEÑO 100% CIRCULAR</text>
                    </g>
                </svg>
            </div>

            <!-- Dynamic Process Step (Main focal text) -->
            <p id="loading-text" class="text-sm font-semibold text-gray-800 tracking-wide font-brand mt-3 h-6 flex items-center justify-center text-center">Iniciando...</p>
            
            <div class="loader-bar-bg hidden"><div class="loader-bar-fill" id="loader-bar"></div></div>
        </div>
    </div>`;

const newJS = `    <script>
        // --- PRELOADER ORIGINAL (RESTORED TO WHITE THEME) ---
        (function() {
            window.preloaderInitialized = true;
            
            const percentEl = document.getElementById('loader-bg-percent').querySelector('span');
            const barEl = document.getElementById('loader-bar');
            const textEl = document.getElementById('loading-text');
            const preloader = document.getElementById('preloader');
            const stepperLineEl = document.getElementById('stepper-arc');
            
            if (!preloader || !percentEl) return;
            
            const phaseElements = {
                'phase-recolectar': document.getElementById('phase-recolectar'),
                'phase-clasificar': document.getElementById('phase-clasificar'),
                'phase-triturar': document.getElementById('phase-triturar'),
                'phase-prensar': document.getElementById('phase-prensar'),
                'phase-cortar': document.getElementById('phase-cortar'),
                'phase-ensamblar': document.getElementById('phase-ensamblar')
            };
            
            const messages = [
                "Recolectando tapitas de plástico...",
                "Clasificando por color y densidad...",
                "Triturando plástico en partes pequeñas...",
                "Moldeando placas de diseño a alta presión...",
                "Diseñando productos de triple impacto...",
                "¡Experiencia lista para circular!"
            ];
            
            const capColors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7', '#79C7C7', '#ec4899'];
            
            let currentPercent = 0;
            let messageIndex = -1;
            let pageHasLoaded = false;
            let frameCount = 0;
            let gearAngle = 0;
            
            let fallingCaps = [];
            let fallingFlakes = [];
            
            const duration = 10000; 
            let startTime = null;
            
            function tick(timestamp) {
                if (!startTime) startTime = timestamp;
                const elapsed = timestamp - startTime;
                
                let progress = (elapsed / duration) * 100;
                
                if (progress > 99 && !pageHasLoaded) progress = 99;
                
                if (progress >= 100) currentPercent = 100;
                else currentPercent = progress;
                
                percentEl.textContent = Math.floor(currentPercent);
                if (barEl) barEl.style.width = \`\${currentPercent}%\`;
                
                if (stepperLineEl) {
                    const arcOffset = 597 - (currentPercent / 100) * 597;
                    stepperLineEl.setAttribute('stroke-dashoffset', arcOffset.toFixed(2));
                }
                
                for (let i = 0; i <= 5; i++) {
                    const node = document.getElementById(\`step-node-\${i}\`);
                    if (node) {
                        const circleOuter = node.getElementsByTagName('circle')[0];
                        const circleInner = document.getElementById(\`step-dot-inner-\${i}\`);
                        const textLabel = node.getElementsByTagName('text')[0];
                        
                        if (currentPercent >= (i * 16.7)) {
                            if (circleOuter) circleOuter.setAttribute('stroke', '#000000');
                            if (circleInner) circleInner.setAttribute('fill', '#000000');
                            if (textLabel) textLabel.setAttribute('fill', '#000000');
                        } else {
                            if (circleOuter) circleOuter.setAttribute('stroke', '#94a3b8');
                            if (circleInner) circleInner.setAttribute('fill', 'none');
                            if (textLabel) textLabel.setAttribute('fill', '#94a3b8');
                        }
                    }
                }
                
                const msgIdx = Math.min(messages.length - 1, Math.floor((currentPercent / 100) * messages.length));
                if (msgIdx !== messageIndex) {
                    messageIndex = msgIdx;
                    if (typeof gsap !== 'undefined') {
                        gsap.to(textEl, {
                            opacity: 0,
                            y: -5,
                            duration: 0.12,
                            onComplete: () => {
                                textEl.textContent = messages[messageIndex];
                                gsap.to(textEl, { opacity: 1, y: 0, duration: 0.2 });
                            }
                        });
                    } else {
                        textEl.textContent = messages[messageIndex];
                    }
                }
                
                let activePhaseId = 'phase-recolectar';
                if (currentPercent >= 19 && currentPercent <= 36) activePhaseId = 'phase-clasificar';
                else if (currentPercent >= 37 && currentPercent <= 54) activePhaseId = 'phase-triturar';
                else if (currentPercent >= 55 && currentPercent <= 72) activePhaseId = 'phase-prensar';
                else if (currentPercent >= 73 && currentPercent <= 90) activePhaseId = 'phase-cortar';
                else if (currentPercent >= 91) activePhaseId = 'phase-ensamblar';
                
                for (let key in phaseElements) {
                    const el = phaseElements[key];
                    if (el) {
                        let currentOpacity = parseFloat(el.getAttribute('opacity') || '0');
                        let targetOpacity = (key === activePhaseId) ? 1 : 0;
                        let nextOpacity = currentOpacity + (targetOpacity - currentOpacity) * 0.15;
                        if (Math.abs(nextOpacity - targetOpacity) < 0.01) nextOpacity = targetOpacity;
                        el.setAttribute('opacity', nextOpacity.toFixed(2));
                        
                        if (nextOpacity === 0) {
                            el.style.pointerEvents = 'none';
                            el.style.display = 'none';
                        } else {
                            el.style.pointerEvents = 'auto';
                            el.style.display = 'block';
                        }
                    }
                }
                
                frameCount++;
                
                // --- PHASE 1: RECOLECTAR ---
                if (activePhaseId === 'phase-recolectar') {
                    let fillY = 185 - (currentPercent / 18) * 45;
                    if (currentPercent < 100 && frameCount % 6 === 0) {
                        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                        const color = capColors[Math.floor(Math.random() * capColors.length)];
                        const cx = 95 + (Math.random() - 0.5) * 8;
                        const cy = 25;
                        circle.setAttribute("cx", cx);
                        circle.setAttribute("cy", cy);
                        circle.setAttribute("r", "2.8");
                        circle.setAttribute("fill", color);
                        document.getElementById('falling-caps-recolectar').appendChild(circle);
                        fallingCaps.push({ el: circle, cx: cx, cy: cy, speed: 3.2 + Math.random() * 1.5, color: color, type: 'recolectar' });
                    }
                    
                    for (let i = fallingCaps.length - 1; i >= 0; i--) {
                        let cap = fallingCaps[i];
                        if (cap.type === 'recolectar') {
                            cap.cy += cap.speed;
                            cap.el.setAttribute("cy", cap.cy);
                            
                            if (cap.cy >= fillY) {
                                cap.el.remove();
                                fallingCaps.splice(i, 1);
                                
                                const piledCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                                let finalX = cap.cx + (Math.random() - 0.5) * 10;
                                finalX = Math.max(70, Math.min(130, finalX));
                                let finalY = fillY + Math.random() * 4;
                                
                                piledCircle.setAttribute("cx", finalX);
                                piledCircle.setAttribute("cy", finalY);
                                piledCircle.setAttribute("r", "2.8");
                                piledCircle.setAttribute("fill", cap.color);
                                document.getElementById('piled-caps-recolectar').appendChild(piledCircle);
                            }
                        }
                    }
                }
                
                // --- PHASE 2: CLASIFICAR ---
                if (activePhaseId === 'phase-clasificar') {
                    let phaseProgress = (currentPercent - 19) / 17;
                    if (currentPercent < 100 && frameCount % 7 === 0) {
                        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                        const warm = ['#ef4444', '#f97316', '#eab308', '#ec4899'];
                        const cool = ['#3b82f6', '#a855f7'];
                        const greens = ['#22c55e', '#79C7C7'];

                        let color, targetX, containerId;
                        let rVal = Math.random();
                        if (rVal < 0.33) {
                            color = warm[Math.floor(Math.random() * warm.length)];
                            targetX = 58;
                            containerId = 'piled-caps-green';
                        } else if (rVal < 0.66) {
                            color = cool[Math.floor(Math.random() * cool.length)];
                            targetX = 100;
                            containerId = 'piled-caps-blue';
                        } else {
                            color = greens[Math.floor(Math.random() * greens.length)];
                            targetX = 142;
                            containerId = 'piled-caps-pink';
                        }
                        const cx = 100;
                        const cy = 20;
                        
                        circle.setAttribute("cx", cx);
                        circle.setAttribute("cy", cy);
                        circle.setAttribute("r", "2.8");
                        circle.setAttribute("fill", color);
                        document.getElementById('sorting-caps').appendChild(circle);
                        fallingCaps.push({ el: circle, cx: cx, cy: cy, targetX: targetX, containerId: containerId, speed: 4 + Math.random(), type: 'clasificar', color: color });
                    }
                    
                    for (let i = fallingCaps.length - 1; i >= 0; i--) {
                        let cap = fallingCaps[i];
                        if (cap.type === 'clasificar') {
                            if (cap.cy < 60) {
                                cap.cy += cap.speed;
                            } else if (Math.abs(cap.cx - cap.targetX) > 2) {
                                cap.cx += (cap.targetX > cap.cx ? cap.speed : -cap.speed);
                            } else {
                                cap.cy += cap.speed;
                            }
                            cap.el.setAttribute("cx", cap.cx);
                            cap.el.setAttribute("cy", cap.cy);
                            
                            if (cap.cy > 185) {
                                cap.el.remove();
                                fallingCaps.splice(i, 1);
                                
                                const piledCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                                piledCircle.setAttribute("cx", cap.targetX + (Math.random() - 0.5) * 20);
                                piledCircle.setAttribute("cy", 185 - Math.random() * 80 * phaseProgress);
                                piledCircle.setAttribute("r", "2.8");
                                piledCircle.setAttribute("fill", cap.color);
                                document.getElementById(cap.containerId).appendChild(piledCircle);
                            }
                        }
                    }
                }
                
                // --- PHASE 3: TRITURAR ---
                if (activePhaseId === 'phase-triturar') {
                    gearAngle += 3;
                    const gearL = document.getElementById('gear-left');
                    const gearR = document.getElementById('gear-right');
                    if (gearL) gearL.setAttribute("transform", \`translate(88, 100) rotate(\${gearAngle})\`);
                    if (gearR) gearR.setAttribute("transform", \`translate(112, 100) rotate(\${-gearAngle})\`);
                    
                    if (currentPercent < 100 && frameCount % 5 === 0) {
                        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                        const color = capColors[Math.floor(Math.random() * capColors.length)];
                        const cx = 100 + (Math.random() - 0.5) * 40;
                        const cy = 20;
                        circle.setAttribute("cx", cx);
                        circle.setAttribute("cy", cy);
                        circle.setAttribute("r", "2.8");
                        circle.setAttribute("fill", color);
                        document.getElementById('falling-caps-triturar').appendChild(circle);
                        fallingCaps.push({ el: circle, cx: cx, cy: cy, speed: 3 + Math.random(), color: color, type: 'triturar' });
                    }
                    
                    for (let i = fallingCaps.length - 1; i >= 0; i--) {
                        let cap = fallingCaps[i];
                        if (cap.type === 'triturar') {
                            cap.cy += cap.speed;
                            if (cap.cy > 50 && cap.cy < 90) {
                                cap.cx += (100 - cap.cx) * 0.1;
                            }
                            cap.el.setAttribute("cx", cap.cx);
                            cap.el.setAttribute("cy", cap.cy);
                            
                            if (cap.cy > 95) {
                                cap.el.remove();
                                fallingCaps.splice(i, 1);
                                
                                for (let f = 0; f < 3; f++) {
                                    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                                    const fx = 95 + Math.random() * 10;
                                    const fy = 110;
                                    rect.setAttribute("x", fx);
                                    rect.setAttribute("y", fy);
                                    rect.setAttribute("width", 2 + Math.random() * 2);
                                    rect.setAttribute("height", 2 + Math.random() * 2);
                                    rect.setAttribute("fill", cap.color);
                                    rect.setAttribute("transform", \`rotate(\${Math.random()*360} \${fx} \${fy})\`);
                                    document.getElementById('falling-flakes').appendChild(rect);
                                    fallingFlakes.push({ el: rect, x: fx, y: fy, speedY: 2 + Math.random()*2, speedX: (Math.random()-0.5)*3, color: cap.color });
                                }
                            }
                        }
                    }
                    
                    for (let i = fallingFlakes.length - 1; i >= 0; i--) {
                        let flake = fallingFlakes[i];
                        flake.y += flake.speedY;
                        flake.x += flake.speedX;
                        flake.el.setAttribute("x", flake.x);
                        flake.el.setAttribute("y", flake.y);
                        
                        if (flake.y > 180) {
                            flake.el.remove();
                            fallingFlakes.splice(i, 1);
                            
                            const piledFlake = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                            piledFlake.setAttribute("x", 55 + Math.random() * 90);
                            piledFlake.setAttribute("y", 145 + Math.random() * 35);
                            piledFlake.setAttribute("width", 2 + Math.random() * 2);
                            piledFlake.setAttribute("height", 2 + Math.random() * 2);
                            piledFlake.setAttribute("fill", flake.color);
                            piledFlake.setAttribute("transform", \`rotate(\${Math.random()*360} \${piledFlake.getAttribute('x')} \${piledFlake.getAttribute('y')})\`);
                            document.getElementById('piled-flakes').appendChild(piledFlake);
                        }
                    }
                }
                
                // --- PHASE 4: PRENSAR ---
                if (activePhaseId === 'phase-prensar') {
                    let phaseProgress = (currentPercent - 55) / 17;
                    const pressHead = document.getElementById('press-head');
                    const pressShaft = document.getElementById('press-shaft');
                    const solidSheet = document.getElementById('pressed-sheet-group');
                    
                    if (phaseProgress < 0.4) {
                        let pressY = 20 + (phaseProgress / 0.4) * 85;
                        if(pressHead) pressHead.setAttribute('y', pressY + 95);
                        if(pressShaft) pressShaft.setAttribute('y2', pressY + 95);
                    } else if (phaseProgress < 0.7) {
                        if(solidSheet) solidSheet.setAttribute('opacity', ((phaseProgress - 0.4) / 0.3).toFixed(2));
                    } else {
                        let pressY = 105 - ((phaseProgress - 0.7) / 0.3) * 85;
                        if(pressHead) pressHead.setAttribute('y', pressY + 95);
                        if(pressShaft) pressShaft.setAttribute('y2', pressY + 95);
                        if(solidSheet) solidSheet.setAttribute('opacity', '1');
                    }
                }
                
                // --- PHASE 5: CORTAR ---
                if (activePhaseId === 'phase-cortar') {
                    let phaseProgress = (currentPercent - 73) / 17;
                    const laser = document.getElementById('laser-head');
                    const cutPath = document.getElementById('cnc-cut-path');
                    
                    if (laser && cutPath) {
                        let offset = 300 - (phaseProgress * 300);
                        cutPath.setAttribute('stroke-dashoffset', offset);
                        
                        let lx, ly;
                        if (phaseProgress < 0.25) { lx = 70; ly = 125 - phaseProgress*4*35; }
                        else if (phaseProgress < 0.5) { lx = 70 + (phaseProgress-0.25)*4*60; ly = 90; }
                        else if (phaseProgress < 0.75) { lx = 130; ly = 90 + (phaseProgress-0.5)*4*35; }
                        else { lx = 130; ly = 125; }
                        
                        laser.setAttribute('transform', \`translate(\${lx}, \${ly})\`);
                    }
                }
                
                // --- PHASE 6: ENSAMBLAR ---
                if (activePhaseId === 'phase-ensamblar') {
                    let phaseProgress = (currentPercent - 91) / 9;
                    const seat = document.getElementById('stool-seat-group');
                    const logo = document.getElementById('stool-logo');
                    const arrow = document.getElementById('circular-arrow');
                    const arrowHead = document.getElementById('circular-arrow-head');
                    const badge = document.getElementById('circular-badge');
                    
                    if (seat) seat.setAttribute('transform', \`translate(0, \${Math.max(0, -30 * (1 - phaseProgress))})\`);
                    if (logo) logo.setAttribute('transform', \`translate(0, \${Math.max(0, -30 * (1 - phaseProgress))})\`);
                    
                    if (phaseProgress > 0.5 && arrow && arrowHead && badge) {
                        let aP = (phaseProgress - 0.5) * 2;
                        arrow.setAttribute('opacity', aP.toFixed(2));
                        arrowHead.setAttribute('opacity', aP.toFixed(2));
                        badge.setAttribute('opacity', aP.toFixed(2));
                    }
                }

                if (currentPercent < 100) {
                    requestAnimationFrame(tick);
                } else {
                    finishLoading();
                }
            }
            
            requestAnimationFrame(tick);
            
            function finishLoading() {
                percentEl.textContent = '100';
                if (barEl) barEl.style.width = '100%';
                if (stepperLineEl) stepperLineEl.setAttribute('stroke-dashoffset', '0');
                
                setTimeout(() => {
                    preloader.style.opacity = '0';
                    setTimeout(() => {
                        preloader.style.display = 'none';
                        document.body.classList.add('loaded');
                        if (typeof initializeGsapAnimations === 'function') {
                            initializeGsapAnimations();
                        }
                    }, 500);
                }, 400);
            }
            
            window.addEventListener('load', () => {
                pageHasLoaded = true;
            });
            
            setTimeout(() => {
                if (preloader.style.display !== 'none') {
                    pageHasLoaded = true;
                    if (currentPercent < 100) {
                        currentPercent = 100;
                        finishLoading();
                    }
                }
            }, duration + 3000);
        })();
    </script>`;

let startIndex = content.indexOf('<div id="preloader"');
if(startIndex === -1) startIndex = content.indexOf('<div id="preloader">'); 

let endIndex = content.indexOf('<script>', startIndex);
if (startIndex !== -1 && endIndex !== -1) {
    content = content.substring(0, startIndex) + newHTML + '\n\n' + content.substring(endIndex);
}

let scriptStartIndex = content.indexOf('<script>', startIndex);
let scriptEndIndex = content.indexOf('</script>', scriptStartIndex) + 9;

if (scriptStartIndex !== -1 && scriptEndIndex !== -1) {
    content = content.substring(0, scriptStartIndex) + newJS + content.substring(scriptEndIndex);
}

fs.writeFileSync(targetFile, content);
console.log('Successfully updated index.html with FULL RESTORED PRELOADER');
