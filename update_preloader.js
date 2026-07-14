const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, 'index.html');
let content = fs.readFileSync(targetFile, 'utf8');

const newHTML = `    <div id="preloader" class="fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-opacity duration-700 bg-white">
        <div class="flex flex-col items-center w-full max-w-[240px]">
            <!-- Brand Logo -->
            <div class="mb-10">
                <img src="images/logo.png" alt="Circula" class="h-10 w-auto object-contain">
            </div>
            
            <!-- Minimalist Progress Bar -->
            <div class="w-full h-[2px] bg-gray-100 rounded-full overflow-hidden mb-4">
                <div id="loader-bar-fill" class="h-full bg-rp-teal w-0 transition-all duration-300 ease-out"></div>
            </div>
            
            <!-- Percentage & Text -->
            <div class="flex justify-between w-full items-center">
                <p class="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-brand">Cargando...</p>
                <div id="loader-percent" class="text-sm font-semibold text-gray-800 font-brand">0%</div>
            </div>
        </div>
    </div>`;

const newJS = `    <script>
        // --- PRELOADER MINIMALISTA Y PREMIUM ---
        (function() {
            window.preloaderInitialized = true;
            
            const percentEl = document.getElementById('loader-percent');
            const barEl = document.getElementById('loader-bar-fill');
            const preloader = document.getElementById('preloader');
            
            if (!preloader || !percentEl || !barEl) return;
            
            let currentPercent = 0;
            let pageHasLoaded = false;
            const duration = 2500; // 2.5 seconds max artificial loading for premium feel
            let startTime = null;
            
            function tick(timestamp) {
                if (!startTime) startTime = timestamp;
                const elapsed = timestamp - startTime;
                
                let progress = (elapsed / duration) * 100;
                
                // Hold at 99% until page is actually loaded
                if (progress > 99 && !pageHasLoaded) {
                    progress = 99;
                }
                
                if (progress >= 100) {
                    currentPercent = 100;
                } else {
                    currentPercent = progress;
                }
                
                const displayPercent = Math.floor(currentPercent);
                percentEl.textContent = \`\${displayPercent}%\`;
                barEl.style.width = \`\${displayPercent}%\`;
                
                if (currentPercent < 100) {
                    requestAnimationFrame(tick);
                } else {
                    finishLoading();
                }
            }
            
            requestAnimationFrame(tick);
            
            function finishLoading() {
                // Ensure 100% is shown before fading out
                percentEl.textContent = '100%';
                barEl.style.width = '100%';
                
                setTimeout(() => {
                    preloader.style.opacity = '0';
                    setTimeout(() => {
                        preloader.style.display = 'none';
                        document.body.classList.add('loaded');
                        if (typeof initializeGsapAnimations === 'function') {
                            initializeGsapAnimations();
                        }
                    }, 700); // Wait for transition-opacity duration
                }, 300); // Small pause at 100%
            }
            
            window.addEventListener('load', () => {
                pageHasLoaded = true;
            });
            
            // Fallback timeout
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

// Regex to replace the entire <div id="preloader">...</div>
const htmlRegex = /<div id="preloader">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;
// Let's use a simpler replacement strategy. Find start and end indices.

let startIndex = content.indexOf('<div id="preloader">');
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
console.log('Successfully updated index.html with minimal preloader');
