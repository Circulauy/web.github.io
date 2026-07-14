const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, 'index.html');
let content = fs.readFileSync(targetFile, 'utf8');

const newHTML = `    <div id="preloader" class="fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-opacity duration-700 bg-text-dark overflow-hidden">
        
        <!-- Giant Background Percentage -->
        <div id="loader-bg-percent" class="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none select-none overflow-hidden">
            <span class="text-[30vw] font-black text-white leading-none font-brand tracking-tighter mix-blend-overlay">0</span>
        </div>

        <div class="flex flex-col items-center w-full z-10 relative mt-8">
            <!-- Brand Logo -->
            <div class="mb-4">
                <img src="images/LOGO Circula altst blanco.svg" alt="Circula" class="h-10 w-auto object-contain">
            </div>
            
            <!-- Abstract Geometric SVG Animation -->
            <div class="relative w-[320px] h-[320px] sm:w-[400px] sm:h-[400px]">
                <svg id="preloader-animation" class="w-full h-full" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <!-- Glow filter for premium effect -->
                        <filter id="premium-glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="4" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                        <clipPath id="cut-mask">
                            <rect id="laser-mask-rect" x="40" y="40" width="120" height="0" />
                        </clipPath>
                    </defs>

                    <!-- Technical Rings -->
                    <circle cx="100" cy="100" r="85" stroke="#1e293b" stroke-width="0.5" fill="none" />
                    <circle cx="100" cy="100" r="70" stroke="#1e293b" stroke-width="0.5" stroke-dasharray="2 4" fill="none" />
                    
                    <!-- Progress Arc -->
                    <path id="stepper-arc" d="M 100,15 A 85,85 0 1,1 99.9,15" stroke="#79C7C7" stroke-width="1.5" stroke-dasharray="534" stroke-dashoffset="534" fill="none" stroke-linecap="round" />

                    <!-- Nodes -->
                    <g class="step-nodes" opacity="0.8">
                        <!-- P1: 0 deg (Top) -->
                        <circle id="node-0" cx="100" cy="15" r="2.5" fill="#1e293b" stroke="#334155" stroke-width="1"/>
                        <text x="100" y="8" font-family="'Inter', sans-serif" font-size="4.5" font-weight="600" fill="#64748b" text-anchor="middle" letter-spacing="0.5">RESIDUO</text>
                        
                        <!-- P2: 60 deg -->
                        <circle id="node-1" cx="173.6" cy="57.5" r="2.5" fill="#1e293b" stroke="#334155" stroke-width="1"/>
                        <text x="178" y="59" font-family="'Inter', sans-serif" font-size="4.5" font-weight="600" fill="#64748b" text-anchor="start" letter-spacing="0.5">CLASIFICAR</text>
                        
                        <!-- P3: 120 deg -->
                        <circle id="node-2" cx="173.6" cy="142.5" r="2.5" fill="#1e293b" stroke="#334155" stroke-width="1"/>
                        <text x="178" y="144" font-family="'Inter', sans-serif" font-size="4.5" font-weight="600" fill="#64748b" text-anchor="start" letter-spacing="0.5">TRITURAR</text>
                        
                        <!-- P4: 180 deg (Bottom) -->
                        <circle id="node-3" cx="100" cy="185" r="2.5" fill="#1e293b" stroke="#334155" stroke-width="1"/>
                        <text x="100" y="194" font-family="'Inter', sans-serif" font-size="4.5" font-weight="600" fill="#64748b" text-anchor="middle" letter-spacing="0.5">MOLDEAR</text>
                        
                        <!-- P5: 240 deg -->
                        <circle id="node-4" cx="26.4" cy="142.5" r="2.5" fill="#1e293b" stroke="#334155" stroke-width="1"/>
                        <text x="22" y="144" font-family="'Inter', sans-serif" font-size="4.5" font-weight="600" fill="#64748b" text-anchor="end" letter-spacing="0.5">CORTAR</text>
                        
                        <!-- P6: 300 deg -->
                        <circle id="node-5" cx="26.4" cy="57.5" r="2.5" fill="#1e293b" stroke="#334155" stroke-width="1"/>
                        <text x="22" y="59" font-family="'Inter', sans-serif" font-size="4.5" font-weight="600" fill="#64748b" text-anchor="end" letter-spacing="0.5">PRODUCTO</text>
                    </g>

                    <!-- Center Stage (100, 100) -->
                    <g id="center-stage" transform="translate(100, 100)">
                        <!-- Abstract Particles -->
                        <g id="particles-container"></g>
                        
                        <!-- Solid Form (Hidden initially) -->
                        <circle id="solid-form" cx="0" cy="0" r="28" fill="#79C7C7" opacity="0" filter="url(#premium-glow)" />
                        
                        <!-- Cut Shape (Hidden initially) -->
                        <path id="cut-form" d="M -20,-20 L 20,-20 L 25,20 L -25,20 Z" fill="#79C7C7" opacity="0" />
                        <line id="laser-beam" x1="-35" y1="-25" x2="35" y2="-25" stroke="#a3e6ba" stroke-width="1.5" opacity="0" filter="url(#premium-glow)" />
                        
                        <!-- Circular Text -->
                        <g id="circular-text-group" opacity="0">
                            <path id="text-path" d="M -35,0 A 35,35 0 1,1 35,0 A 35,35 0 1,1 -35,0" fill="none" />
                            <text font-family="'Inter', sans-serif" font-size="6" font-weight="600" fill="#79C7C7" letter-spacing="3">
                                <textPath href="#text-path" startOffset="50%" text-anchor="middle">DISEÑO 100% CIRCULAR</textPath>
                            </text>
                        </g>
                    </g>
                </svg>
            </div>
            
            <p id="loading-text" class="text-xs uppercase tracking-[0.25em] text-white font-brand mt-4 opacity-70">INICIANDO SISTEMA</p>
        </div>
    </div>`;

const newJS = `    <script>
        // --- PRELOADER ABSTRACTO PREMIUM CON GSAP ---
        (function() {
            window.preloaderInitialized = true;
            
            const preloader = document.getElementById('preloader');
            const percentEl = document.getElementById('loader-bg-percent').querySelector('span');
            const textEl = document.getElementById('loading-text');
            const arc = document.getElementById('stepper-arc');
            
            if (!preloader || typeof gsap === 'undefined') return;
            
            // Build particles
            const particlesContainer = document.getElementById('particles-container');
            const numParticles = 60;
            const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7', '#79C7C7', '#ec4899'];
            
            const particles = [];
            for (let i = 0; i < numParticles; i++) {
                const el = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                el.setAttribute("r", "1.8");
                const color = colors[Math.floor(Math.random() * colors.length)];
                el.setAttribute("fill", color);
                particlesContainer.appendChild(el);
                
                particles.push({
                    el: el,
                    color: color,
                    // Phase 1: Chaos (random in a circle r=30)
                    p1_r: Math.random() * 25,
                    p1_theta: Math.random() * Math.PI * 2,
                    // Phase 2: Ordered bars
                    p2_x: (i % 3 - 1) * 12,
                    p2_y: (Math.floor(i / 3) - 10) * 4.5,
                    // Phase 3: Grid
                    p3_x: (i % 8 - 3.5) * 6,
                    p3_y: (Math.floor(i / 8) - 3.5) * 6
                });
            }
            
            // Set initial positions
            particles.forEach(p => {
                const x = p.p1_r * Math.cos(p.p1_theta);
                const y = p.p1_r * Math.sin(p.p1_theta);
                gsap.set(p.el, { x: x, y: y });
            });

            // Master Timeline mapping 0 to 1
            const masterTl = gsap.timeline({ paused: true });
            
            // 0 -> 0.16 (Residuo)
            // 0.16 -> 0.33 (Clasificar)
            particles.forEach(p => {
                masterTl.to(p.el, {
                    x: p.p2_x,
                    y: p.p2_y,
                    duration: 0.17,
                    ease: "power2.inOut"
                }, 0.16);
            });
            
            // 0.33 -> 0.50 (Triturar - Fragment to grid, change shape)
            particles.forEach(p => {
                masterTl.to(p.el, {
                    x: p.p3_x,
                    y: p.p3_y,
                    duration: 0.17,
                    ease: "back.out(1.2)"
                }, 0.33);
            });
            
            // 0.50 -> 0.66 (Moldear - Grid merges into solid)
            masterTl.to(particlesContainer, { scale: 0, opacity: 0, duration: 0.1, ease: "power2.in" }, 0.5);
            masterTl.to('#solid-form', { opacity: 1, duration: 0.16, ease: "power2.out" }, 0.55);
            
            // 0.66 -> 0.83 (Cortar - Laser sweeps and reveals cut shape)
            masterTl.set('#laser-beam', { opacity: 1 }, 0.66);
            masterTl.to('#laser-beam', { y: 45, duration: 0.17, ease: "none" }, 0.66);
            masterTl.to('#solid-form', { opacity: 0, duration: 0.05 }, 0.75); // Swap forms mid-cut
            masterTl.to('#cut-form', { opacity: 1, duration: 0.05 }, 0.75);
            masterTl.set('#laser-beam', { opacity: 0 }, 0.83);
            
            // 0.83 -> 1.0 (Producto - Badge appears, rotates)
            masterTl.to('#cut-form', { scale: 0.8, duration: 0.17, ease: "power2.out" }, 0.83);
            masterTl.to('#circular-text-group', { opacity: 1, rotation: 360, duration: 0.17, ease: "power1.out", transformOrigin: "0 0" }, 0.83);
            
            
            // Progress logic
            let currentPercent = 0;
            let pageHasLoaded = false;
            const durationMs = 8000; // 8 seconds premium load
            let startTime = null;
            
            const messages = [
                "RESIDUO", "CLASIFICANDO", "TRITURANDO", "MOLDEANDO", "CORTANDO", "PRODUCTO CIRCULAR"
            ];
            
            function tick(timestamp) {
                if (!startTime) startTime = timestamp;
                const elapsed = timestamp - startTime;
                
                let progress = (elapsed / durationMs) * 100;
                
                if (progress > 99 && !pageHasLoaded) {
                    progress = 99;
                }
                if (progress >= 100) {
                    currentPercent = 100;
                } else {
                    currentPercent = progress;
                }
                
                // Update UI
                percentEl.textContent = Math.floor(currentPercent);
                arc.setAttribute('stroke-dashoffset', 534 - (currentPercent/100)*534);
                
                // Update master timeline
                masterTl.progress(currentPercent / 100);
                
                // Update nodes and texts
                for(let i=0; i<6; i++) {
                    const node = document.getElementById(\`node-\${i}\`);
                    const nodeText = node.nextElementSibling;
                    if(currentPercent >= i * (100/6)) {
                        node.setAttribute('fill', '#79C7C7');
                        node.setAttribute('stroke', '#79C7C7');
                        nodeText.setAttribute('fill', '#ffffff');
                    } else {
                        node.setAttribute('fill', '#1e293b');
                        node.setAttribute('stroke', '#334155');
                        nodeText.setAttribute('fill', '#64748b');
                    }
                }
                
                const msgIdx = Math.min(5, Math.floor(currentPercent / (100/6)));
                textEl.textContent = messages[msgIdx];
                
                if (currentPercent < 100) {
                    requestAnimationFrame(tick);
                } else {
                    finishLoading();
                }
            }
            
            requestAnimationFrame(tick);
            
            function finishLoading() {
                percentEl.textContent = '100';
                setTimeout(() => {
                    preloader.style.opacity = '0';
                    setTimeout(() => {
                        preloader.style.display = 'none';
                        document.body.classList.add('loaded');
                        if (typeof initializeGsapAnimations === 'function') {
                            initializeGsapAnimations();
                        }
                    }, 700);
                }, 500);
            }
            
            window.addEventListener('load', () => {
                pageHasLoaded = true;
            });
            
            setTimeout(() => {
                if (preloader.style.display !== 'none') {
                    pageHasLoaded = true;
                }
            }, durationMs + 3000);
        })();
    </script>`;

// Regex to replace the entire <div id="preloader">...</div>
let startIndex = content.indexOf('<div id="preloader"');
if(startIndex === -1) startIndex = content.indexOf('<div id="preloader">'); // fallback

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
console.log('Successfully updated index.html with ABSTRACT PREMIUM preloader');
