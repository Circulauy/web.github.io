const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, 'index.html');
let content = fs.readFileSync(targetFile, 'utf8');

const newHTML = `    <div id="preloader" class="fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-opacity duration-700 bg-white overflow-hidden">
        
        <!-- Giant Background Percentage -->
        <div id="loader-bg-percent" class="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden opacity-[0.03]">
            <span class="text-[35vw] font-black text-black leading-none font-brand tracking-tighter">0</span>
        </div>

        <div class="flex flex-col items-center w-full z-10 relative mt-8">
            <!-- Brand Logo -->
            <div class="mb-8">
                <img src="images/logo.png" alt="Circula" class="h-10 w-auto object-contain">
            </div>
            
            <!-- Abstract Geometric SVG Animation -->
            <div class="relative w-[340px] h-[340px] sm:w-[420px] sm:h-[420px]">
                <svg id="preloader-animation" class="w-full h-full" viewBox="-60 -60 320 320" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <!-- Premium Glow -->
                        <filter id="premium-glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                        
                        <!-- Flake Shape -->
                        <polygon id="flake-shape" points="0,-2 2,1 -1,2" />
                    </defs>

                    <!-- Technical Rings -->
                    <circle cx="100" cy="100" r="110" stroke="#e2e8f0" stroke-width="1" fill="none" />
                    <circle cx="100" cy="100" r="95" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="2 6" fill="none" />
                    
                    <!-- Progress Arc -->
                    <path id="stepper-arc" d="M 100,-10 A 110,110 0 1,1 99.9,-10" stroke="#000000" stroke-width="2" stroke-dasharray="691.15" stroke-dashoffset="691.15" fill="none" stroke-linecap="round" />

                    <!-- Nodes -->
                    <g class="step-nodes" opacity="1">
                        <!-- P1: 0 deg (Top) -->
                        <circle id="node-0" cx="100" cy="-10" r="3.5" fill="#ffffff" stroke="#94a3b8" stroke-width="1.5"/>
                        <text x="100" y="-22" font-family="'Inter', sans-serif" font-size="6" font-weight="700" fill="#64748b" text-anchor="middle" letter-spacing="1">RESIDUO</text>
                        
                        <!-- P2: 60 deg -->
                        <circle id="node-1" cx="195.26" cy="45" r="3.5" fill="#ffffff" stroke="#94a3b8" stroke-width="1.5"/>
                        <text x="204" y="47" font-family="'Inter', sans-serif" font-size="6" font-weight="700" fill="#64748b" text-anchor="start" letter-spacing="1">CLASIFICAR</text>
                        
                        <!-- P3: 120 deg -->
                        <circle id="node-2" cx="195.26" cy="155" r="3.5" fill="#ffffff" stroke="#94a3b8" stroke-width="1.5"/>
                        <text x="204" y="157" font-family="'Inter', sans-serif" font-size="6" font-weight="700" fill="#64748b" text-anchor="start" letter-spacing="1">TRITURAR</text>
                        
                        <!-- P4: 180 deg (Bottom) -->
                        <circle id="node-3" cx="100" cy="210" r="3.5" fill="#ffffff" stroke="#94a3b8" stroke-width="1.5"/>
                        <text x="100" y="226" font-family="'Inter', sans-serif" font-size="6" font-weight="700" fill="#64748b" text-anchor="middle" letter-spacing="1">PRENSAR</text>
                        
                        <!-- P5: 240 deg -->
                        <circle id="node-4" cx="4.74" cy="155" r="3.5" fill="#ffffff" stroke="#94a3b8" stroke-width="1.5"/>
                        <text x="-4" y="157" font-family="'Inter', sans-serif" font-size="6" font-weight="700" fill="#64748b" text-anchor="end" letter-spacing="1">CORTE CNC</text>
                        
                        <!-- P6: 300 deg -->
                        <circle id="node-5" cx="4.74" cy="45" r="3.5" fill="#ffffff" stroke="#94a3b8" stroke-width="1.5"/>
                        <text x="-4" y="47" font-family="'Inter', sans-serif" font-size="6" font-weight="700" fill="#64748b" text-anchor="end" letter-spacing="1">ARMAR</text>
                    </g>

                    <!-- Center Stage (100, 100) -->
                    <g id="center-stage" transform="translate(100, 100)">
                        <!-- Phase 3: Triturador blade -->
                        <line id="shredder-blade" x1="-30" y1="0" x2="30" y2="0" stroke="#000000" stroke-width="2" stroke-dasharray="4 2" opacity="0" />
                        
                        <!-- Particles (Caps & Flakes) -->
                        <g id="caps-container"></g>
                        <g id="flakes-container"></g>
                        
                        <!-- Phase 4: Prensa plates -->
                        <line id="press-plate-top" x1="-35" y1="-40" x2="35" y2="-40" stroke="#0f172a" stroke-width="4" stroke-linecap="round" opacity="0" />
                        <line id="press-plate-bot" x1="-35" y1="40" x2="35" y2="40" stroke="#0f172a" stroke-width="4" stroke-linecap="round" opacity="0" />
                        
                        <!-- Phase 4: Solid Block -->
                        <rect id="solid-block" x="-25" y="-15" width="50" height="30" fill="#111111" rx="2" opacity="0" />
                        
                        <!-- Phase 5: CNC Laser and Path -->
                        <path id="cnc-path" d="M -15,-10 L 15,-10 L 18,10 L -18,10 Z" stroke="#10b981" stroke-width="1.5" fill="none" stroke-dasharray="100" stroke-dashoffset="100" opacity="0" />
                        <circle id="cnc-laser" cx="0" cy="0" r="2" fill="#10b981" filter="url(#premium-glow)" opacity="0" />
                        
                        <!-- Phase 6: Final Stool & Text -->
                        <path id="final-stool" d="M -15,-10 L 15,-10 L 18,10 L -18,10 Z" fill="#111111" opacity="0" />
                        
                        <g id="circular-text-group" opacity="0">
                            <path id="text-path" d="M -45,0 A 45,45 0 1,1 45,0 A 45,45 0 1,1 -45,0" fill="none" />
                            <text font-family="'Inter', sans-serif" font-size="7" font-weight="700" fill="#000000" letter-spacing="4">
                                <textPath href="#text-path" startOffset="50%" text-anchor="middle">DISEÑO 100% CIRCULAR</textPath>
                            </text>
                        </g>
                    </g>
                </svg>
            </div>
            
            <p id="loading-text" class="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-brand mt-4">INICIANDO SISTEMA</p>
        </div>
    </div>`;

const newJS = `    <script>
        // --- PRELOADER GEOMÉTRICO PREMIUM (WHITE THEME) ---
        (function() {
            window.preloaderInitialized = true;
            
            const preloader = document.getElementById('preloader');
            const percentEl = document.getElementById('loader-bg-percent').querySelector('span');
            const textEl = document.getElementById('loading-text');
            const arc = document.getElementById('stepper-arc');
            
            if (!preloader || typeof gsap === 'undefined') return;
            
            // Build particles
            const capsContainer = document.getElementById('caps-container');
            const flakesContainer = document.getElementById('flakes-container');
            const numParticles = 30;
            
            // Premium Palette (Vibrant minimal)
            const colors = ['#10b981', '#f59e0b', '#3b82f6', '#ec4899', '#8b5cf6'];
            
            const particles = [];
            for (let i = 0; i < numParticles; i++) {
                const color = colors[Math.floor(Math.random() * colors.length)];
                
                // Cap (Circle)
                const cap = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                cap.setAttribute("r", "2.5");
                cap.setAttribute("fill", color);
                capsContainer.appendChild(cap);
                
                // Flake (Polygon)
                const flake = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
                flake.setAttribute("points", "0,-2 2,1 -1,2");
                flake.setAttribute("fill", color);
                flake.setAttribute("opacity", "0");
                flakesContainer.appendChild(flake);
                
                particles.push({
                    cap: cap,
                    flake: flake,
                    color: color,
                    // P1: Chaos (top half)
                    p1_x: (Math.random() - 0.5) * 40,
                    p1_y: -40 + Math.random() * 25,
                    // P2: Ordered columns
                    p2_x: (i % 3 - 1) * 12,
                    p2_y: -40 + Math.floor(i / 3) * 6,
                    // P3: Flake piled at bottom
                    p3_x: (Math.random() - 0.5) * 35,
                    p3_y: 5 + Math.random() * 20
                });
            }
            
            particles.forEach(p => {
                gsap.set(p.cap, { x: p.p1_x, y: p.p1_y });
                gsap.set(p.flake, { x: p.p1_x, y: p.p1_y, rotation: Math.random() * 360 });
            });

            // Master Timeline mapping 0 to 1
            const masterTl = gsap.timeline({ paused: true });
            
            // 0 -> 0.16 (Residuo): Wiggling chaos
            particles.forEach(p => {
                masterTl.to(p.cap, {
                    x: p.p1_x + (Math.random()-0.5)*10,
                    y: p.p1_y + (Math.random()-0.5)*10,
                    duration: 0.16,
                    ease: "sine.inOut"
                }, 0);
            });
            
            // 0.16 -> 0.33 (Clasificar): Align into columns
            particles.forEach(p => {
                masterTl.to(p.cap, {
                    x: p.p2_x,
                    y: p.p2_y,
                    duration: 0.17,
                    ease: "power2.inOut"
                }, 0.16);
            });
            
            // 0.33 -> 0.50 (Triturar): Fall through blade
            masterTl.to('#shredder-blade', { opacity: 1, duration: 0.02 }, 0.33);
            
            particles.forEach((p, index) => {
                const staggerStart = 0.33 + (index * 0.004); // stagger fall
                
                // Fall to blade
                masterTl.to(p.cap, { y: 0, duration: 0.05, ease: "power1.in" }, staggerStart);
                // Swap cap to flake
                masterTl.set(p.cap, { opacity: 0 }, staggerStart + 0.05);
                masterTl.set(p.flake, { opacity: 1, x: p.p2_x, y: 0 }, staggerStart + 0.05);
                // Flake falls to pile
                masterTl.to(p.flake, {
                    x: p.p3_x,
                    y: p.p3_y,
                    rotation: p.flake._gsTransform?.rotation || 0 + 180,
                    duration: 0.1,
                    ease: "bounce.out"
                }, staggerStart + 0.05);
            });
            masterTl.to('#shredder-blade', { opacity: 0, duration: 0.02 }, 0.50);
            
            // 0.50 -> 0.66 (Prensar): Plates squeeze
            masterTl.to('#press-plate-top', { opacity: 1, y: 0, duration: 0.02 }, 0.50);
            masterTl.to('#press-plate-bot', { opacity: 1, y: 0, duration: 0.02 }, 0.50);
            
            masterTl.to('#press-plate-top', { y: 25, duration: 0.12, ease: "power2.inOut" }, 0.52);
            masterTl.to('#press-plate-bot', { y: -25, duration: 0.12, ease: "power2.inOut" }, 0.52);
            
            // Flakes squash into solid block
            masterTl.to(flakesContainer, { scaleY: 0.1, transformOrigin: "50% 100%", opacity: 0, duration: 0.06, ease: "power2.in" }, 0.58);
            masterTl.to('#solid-block', { opacity: 1, duration: 0.04 }, 0.60);
            
            // Plates release
            masterTl.to('#press-plate-top', { y: -10, opacity: 0, duration: 0.06 }, 0.64);
            masterTl.to('#press-plate-bot', { y: 10, opacity: 0, duration: 0.06 }, 0.64);
            
            // 0.66 -> 0.83 (Corte CNC): Laser trace
            masterTl.set('#cnc-laser', { opacity: 1 }, 0.66);
            masterTl.set('#cnc-path', { opacity: 1 }, 0.66);
            
            // Trace the path (dashoffset 100 -> 0)
            masterTl.to('#cnc-path', { strokeDashoffset: 0, duration: 0.15, ease: "none" }, 0.66);
            
            // Move laser dot along the same path approximately
            // Path: M -15,-10 L 15,-10 L 18,10 L -18,10 Z
            masterTl.fromTo('#cnc-laser', { x: -15, y: -10 }, { x: 15, y: -10, duration: 0.05, ease: "none" }, 0.66);
            masterTl.to('#cnc-laser', { x: 18, y: 10, duration: 0.03, ease: "none" }, 0.71);
            masterTl.to('#cnc-laser', { x: -18, y: 10, duration: 0.05, ease: "none" }, 0.74);
            masterTl.to('#cnc-laser', { x: -15, y: -10, duration: 0.02, ease: "none" }, 0.79);
            masterTl.set('#cnc-laser', { opacity: 0 }, 0.81);
            masterTl.set('#cnc-path', { opacity: 0 }, 0.81);
            
            // Reveal Final Stool
            masterTl.to('#solid-block', { opacity: 0, duration: 0.02 }, 0.81);
            masterTl.to('#final-stool', { opacity: 1, duration: 0.02 }, 0.81);
            
            // 0.83 -> 1.0 (Armar): Scale up and text appears
            masterTl.to('#final-stool', { scale: 1.5, duration: 0.15, ease: "back.out(1.5)", transformOrigin: "center" }, 0.83);
            masterTl.to('#circular-text-group', { opacity: 1, rotation: 360, duration: 0.17, ease: "power2.out", transformOrigin: "0 0" }, 0.83);
            
            
            // Progress logic
            let currentPercent = 0;
            let pageHasLoaded = false;
            const durationMs = 8500; // 8.5 seconds premium load
            let startTime = null;
            
            const messages = [
                "RESIDUO", "CLASIFICANDO", "TRITURANDO", "PRENSANDO", "CORTE CNC", "ARMADO FINAL"
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
                // Circumference is ~691.15
                arc.setAttribute('stroke-dashoffset', 691.15 - (currentPercent/100)*691.15);
                
                // Update master timeline
                masterTl.progress(currentPercent / 100);
                
                // Update nodes and texts
                for(let i=0; i<6; i++) {
                    const node = document.getElementById(\`node-\${i}\`);
                    const nodeText = node.nextElementSibling;
                    if(currentPercent >= i * (100/6)) {
                        node.setAttribute('fill', '#111111');
                        node.setAttribute('stroke', '#111111');
                        nodeText.setAttribute('fill', '#000000');
                    } else {
                        node.setAttribute('fill', '#ffffff');
                        node.setAttribute('stroke', '#94a3b8');
                        nodeText.setAttribute('fill', '#94a3b8');
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
console.log('Successfully updated index.html with WHITE THEME PRELOADER V3');
