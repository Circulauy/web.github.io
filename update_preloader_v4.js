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
            
            <!-- SVG Animation -->
            <div class="relative w-[340px] h-[340px] sm:w-[420px] sm:h-[420px]">
                <svg id="preloader-animation" class="w-full h-full" viewBox="-60 -60 320 320" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <!-- Flake Shape -->
                        <polygon id="flake-shape" points="0,-2 2,1 -1,2" />
                    </defs>

                    <!-- Technical Rings -->
                    <circle cx="100" cy="100" r="110" stroke="#e2e8f0" stroke-width="1" fill="none" />
                    <circle cx="100" cy="100" r="95" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="2 6" fill="none" />
                    
                    <!-- Progress Arc -->
                    <path id="stepper-arc" d="M 100,-10 A 110,110 0 1,1 99.9,-10" stroke="#0f172a" stroke-width="2" stroke-dasharray="691.15" stroke-dashoffset="691.15" fill="none" stroke-linecap="round" />

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
                        <line id="press-plate-top" x1="-45" y1="-40" x2="45" y2="-40" stroke="#0f172a" stroke-width="4" stroke-linecap="round" opacity="0" />
                        <line id="press-plate-bot" x1="-45" y1="40" x2="45" y2="40" stroke="#0f172a" stroke-width="4" stroke-linecap="round" opacity="0" />
                        
                        <!-- Phase 4: Marbled Pressed Sheet -->
                        <g id="pressed-sheet-group" opacity="0">
                            <rect x="-40" y="-15" width="80" height="30" rx="2" fill="#1e293b" stroke="#475569" stroke-width="1" />
                            <rect x="-30" y="-10" width="3" height="3" transform="rotate(15 -30 -10)" fill="#79C7C7" />
                            <rect x="-15" y="2" width="2" height="4" transform="rotate(45 -15 2)" fill="#a3e6ba" />
                            <rect x="20" y="-5" width="4" height="2" transform="rotate(-30 20 -5)" fill="#79C7C7" />
                            <rect x="35" y="8" width="3" height="3" transform="rotate(10 35 8)" fill="#cbd5e1" />
                            <rect x="0" y="-8" width="3" height="2" transform="rotate(75 0 -8)" fill="#cbd5e1" />
                            <rect x="15" y="-12" width="2" height="3" transform="rotate(25 15 -12)" fill="#a3e6ba" />
                        </g>
                        
                        <!-- Phase 5: CNC Laser and Path -->
                        <path id="cnc-cut-path" d="M -25 15 V-15 H 25 V15 M -10 15 V-5 H 10 V15" stroke="#79C7C7" stroke-width="1.5" stroke-dasharray="200" stroke-dashoffset="200" stroke-linecap="round" fill="none" opacity="0" />
                        <g id="laser-head" transform="translate(-25, 15)" opacity="0">
                            <circle cx="0" cy="0" r="2.5" fill="#79C7C7" />
                            <circle cx="0" cy="0" r="5" stroke="#79C7C7" stroke-width="1" opacity="0.4" class="animate-ping" />
                        </g>
                        
                        <!-- Phase 6: Final Stool -->
                        <g id="final-stool-group" opacity="0">
                            <path id="stool-legs" d="M -25 20 L -15 -25 H 15 L 25 20 H 10 L 5 -5 H -5 L -10 20 Z" fill="#1e293b" stroke="#334155" stroke-width="1" />
                            <ellipse id="stool-seat" cx="0" cy="-25" rx="30" ry="8" fill="#1e293b" stroke="#475569" stroke-width="1" />
                            <ellipse id="stool-seat-fleck1" cx="-15" cy="-26" rx="1.5" ry="0.6" fill="#79C7C7" />
                            <ellipse id="stool-seat-fleck2" cx="2" cy="-24" rx="2" ry="0.8" fill="#a3e6ba" />
                            <ellipse id="stool-seat-fleck3" cx="12" cy="-27" rx="1.2" ry="0.5" fill="#cbd5e1" />
                        </g>
                        
                        <!-- Circular Text -->
                        <g id="circular-text-group" opacity="0">
                            <path id="text-path" d="M -50,0 A 50,50 0 1,1 50,0 A 50,50 0 1,1 -50,0" fill="none" />
                            <text font-family="'Inter', sans-serif" font-size="7" font-weight="700" fill="#0f172a" letter-spacing="4">
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
        // --- PRELOADER GEOMÉTRICO (WHITE THEME V4) ---
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
            
            // Palette matches the marbled stool flecks
            const colors = ['#79C7C7', '#a3e6ba', '#cbd5e1'];
            
            const particles = [];
            for (let i = 0; i < numParticles; i++) {
                const color = colors[Math.floor(Math.random() * colors.length)];
                
                // Cap
                const cap = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                cap.setAttribute("r", "2.5");
                cap.setAttribute("fill", color);
                capsContainer.appendChild(cap);
                
                // Flake
                const flake = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
                flake.setAttribute("points", "0,-2 2,1 -1,2");
                flake.setAttribute("fill", color);
                flake.setAttribute("opacity", "0");
                flakesContainer.appendChild(flake);
                
                particles.push({
                    cap: cap,
                    flake: flake,
                    color: color,
                    // P1: Chaos
                    p1_x: (Math.random() - 0.5) * 40,
                    p1_y: -40 + Math.random() * 25,
                    // P2: Ordered columns
                    p2_x: (i % 3 - 1) * 12,
                    p2_y: -40 + Math.floor(i / 3) * 6,
                    // P3: Flake piled at bottom
                    p3_x: (Math.random() - 0.5) * 45,
                    p3_y: 5 + Math.random() * 20
                });
            }
            
            particles.forEach(p => {
                gsap.set(p.cap, { x: p.p1_x, y: p.p1_y });
                gsap.set(p.flake, { x: p.p1_x, y: p.p1_y, rotation: Math.random() * 360 });
            });

            // Master Timeline mapping 0 to 1
            const masterTl = gsap.timeline({ paused: true });
            
            // 0 -> 0.16 (Residuo)
            particles.forEach(p => {
                masterTl.to(p.cap, {
                    x: p.p1_x + (Math.random()-0.5)*10,
                    y: p.p1_y + (Math.random()-0.5)*10,
                    duration: 0.16,
                    ease: "sine.inOut"
                }, 0);
            });
            
            // 0.16 -> 0.33 (Clasificar)
            particles.forEach(p => {
                masterTl.to(p.cap, {
                    x: p.p2_x,
                    y: p.p2_y,
                    duration: 0.17,
                    ease: "power2.inOut"
                }, 0.16);
            });
            
            // 0.33 -> 0.50 (Triturar)
            masterTl.to('#shredder-blade', { opacity: 1, duration: 0.02 }, 0.33);
            particles.forEach((p, index) => {
                const staggerStart = 0.33 + (index * 0.004); 
                masterTl.to(p.cap, { y: 0, duration: 0.05, ease: "power1.in" }, staggerStart);
                masterTl.set(p.cap, { opacity: 0 }, staggerStart + 0.05);
                masterTl.set(p.flake, { opacity: 1, x: p.p2_x, y: 0 }, staggerStart + 0.05);
                masterTl.to(p.flake, {
                    x: p.p3_x,
                    y: p.p3_y,
                    rotation: p.flake._gsTransform?.rotation || 0 + 180,
                    duration: 0.1,
                    ease: "bounce.out"
                }, staggerStart + 0.05);
            });
            masterTl.to('#shredder-blade', { opacity: 0, duration: 0.02 }, 0.50);
            
            // 0.50 -> 0.66 (Prensar)
            masterTl.to('#press-plate-top', { opacity: 1, y: 0, duration: 0.02 }, 0.50);
            masterTl.to('#press-plate-bot', { opacity: 1, y: 0, duration: 0.02 }, 0.50);
            
            masterTl.to('#press-plate-top', { y: 35, duration: 0.12, ease: "power2.inOut" }, 0.52);
            masterTl.to('#press-plate-bot', { y: -35, duration: 0.12, ease: "power2.inOut" }, 0.52);
            
            // Squash to marbled sheet
            masterTl.to(flakesContainer, { scaleY: 0.1, opacity: 0, duration: 0.06, ease: "power2.in" }, 0.58);
            masterTl.to('#pressed-sheet-group', { opacity: 1, duration: 0.04 }, 0.60);
            
            masterTl.to('#press-plate-top', { y: -10, opacity: 0, duration: 0.06 }, 0.64);
            masterTl.to('#press-plate-bot', { y: 10, opacity: 0, duration: 0.06 }, 0.64);
            
            // 0.66 -> 0.83 (Corte CNC)
            masterTl.set('#laser-head', { opacity: 1 }, 0.66);
            masterTl.set('#cnc-cut-path', { opacity: 1 }, 0.66);
            
            // Path: M -25 15 V-15 H 25 V15 M -10 15 V-5 H 10 V15
            masterTl.to('#cnc-cut-path', { strokeDashoffset: 0, duration: 0.15, ease: "none" }, 0.66);
            
            // Laser path trace
            // Segment 1: -25,15 to -25,-15
            masterTl.to('#laser-head', { y: -15, duration: 0.03, ease: "none" }, 0.66);
            // Segment 2: -25,-15 to 25,-15
            masterTl.to('#laser-head', { x: 25, duration: 0.05, ease: "none" }, 0.69);
            // Segment 3: 25,-15 to 25,15
            masterTl.to('#laser-head', { y: 15, duration: 0.03, ease: "none" }, 0.74);
            // Jump to inner cutout
            masterTl.set('#laser-head', { x: -10, y: 15 }, 0.77);
            // Segment 4: -10,15 to -10,-5
            masterTl.to('#laser-head', { y: -5, duration: 0.02, ease: "none" }, 0.77);
            // Segment 5: -10,-5 to 10,-5
            masterTl.to('#laser-head', { x: 10, duration: 0.02, ease: "none" }, 0.79);
            // Segment 6: 10,-5 to 10,15
            masterTl.to('#laser-head', { y: 15, duration: 0.02, ease: "none" }, 0.81);
            
            masterTl.set('#laser-head', { opacity: 0 }, 0.83);
            masterTl.set('#cnc-cut-path', { opacity: 0 }, 0.83);
            masterTl.to('#pressed-sheet-group', { opacity: 0.3, duration: 0.05 }, 0.78);
            
            // 0.83 -> 1.0 (Armar)
            masterTl.to('#pressed-sheet-group', { opacity: 0, duration: 0.02 }, 0.83);
            masterTl.to('#final-stool-group', { opacity: 1, duration: 0.02 }, 0.83);
            
            masterTl.to('#final-stool-group', { y: 10, duration: 0.15, ease: "back.out(1.5)" }, 0.83);
            masterTl.to('#circular-text-group', { opacity: 1, rotation: 360, duration: 0.17, ease: "power2.out", transformOrigin: "0 0" }, 0.83);
            
            
            // Progress logic
            let currentPercent = 0;
            let pageHasLoaded = false;
            const durationMs = 8500;
            let startTime = null;
            
            const messages = [
                "RESIDUO", "CLASIFICANDO", "TRITURANDO", "PRENSANDO", "CORTE CNC", "ARMADO FINAL"
            ];
            
            function tick(timestamp) {
                if (!startTime) startTime = timestamp;
                const elapsed = timestamp - startTime;
                let progress = (elapsed / durationMs) * 100;
                
                if (progress > 99 && !pageHasLoaded) progress = 99;
                if (progress >= 100) currentPercent = 100;
                else currentPercent = progress;
                
                percentEl.textContent = Math.floor(currentPercent);
                arc.setAttribute('stroke-dashoffset', 691.15 - (currentPercent/100)*691.15);
                masterTl.progress(currentPercent / 100);
                
                for(let i=0; i<6; i++) {
                    const node = document.getElementById(\`node-\${i}\`);
                    const nodeText = node.nextElementSibling;
                    if(currentPercent >= i * (100/6)) {
                        node.setAttribute('fill', '#0f172a');
                        node.setAttribute('stroke', '#0f172a');
                        nodeText.setAttribute('fill', '#0f172a');
                    } else {
                        node.setAttribute('fill', '#ffffff');
                        node.setAttribute('stroke', '#94a3b8');
                        nodeText.setAttribute('fill', '#94a3b8');
                    }
                }
                
                const msgIdx = Math.min(5, Math.floor(currentPercent / (100/6)));
                textEl.textContent = messages[msgIdx];
                
                if (currentPercent < 100) requestAnimationFrame(tick);
                else finishLoading();
            }
            
            requestAnimationFrame(tick);
            
            function finishLoading() {
                percentEl.textContent = '100';
                setTimeout(() => {
                    preloader.style.opacity = '0';
                    setTimeout(() => {
                        preloader.style.display = 'none';
                        document.body.classList.add('loaded');
                        if (typeof initializeGsapAnimations === 'function') initializeGsapAnimations();
                    }, 700);
                }, 500);
            }
            
            window.addEventListener('load', () => pageHasLoaded = true);
            setTimeout(() => {
                if (preloader.style.display !== 'none') pageHasLoaded = true;
            }, durationMs + 3000);
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
console.log('Successfully updated index.html with V4 preloader');
