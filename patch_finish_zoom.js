const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, 'index.html');
let content = fs.readFileSync(targetFile, 'utf8');

const oldFinishLoading = `            function finishLoading() {
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
            }`;

const newFinishLoading = `            function finishLoading() {
                percentEl.textContent = '100';
                if (barEl) barEl.style.width = '100%';
                if (stepperLineEl) stepperLineEl.setAttribute('stroke-dashoffset', '0');
                
                // Zoom-in effect for the final stool
                if (typeof gsap !== 'undefined') {
                    gsap.to('#step-node-0, #step-node-1, #step-node-2, #step-node-3, #step-node-4, #step-node-5', { opacity: 0, duration: 0.4 });
                    gsap.to('#stepper-arc, #loader-bg-percent, #loading-text, .loader-logo-wrap', { opacity: 0, duration: 0.4 });
                    // The rings
                    gsap.to('#preloader-animation > circle', { opacity: 0, duration: 0.4 });
                    
                    // Zoom the stool towards the screen
                    gsap.to('#phase-ensamblar', { 
                        scale: 3, 
                        opacity: 0,
                        duration: 1.0, 
                        ease: "power2.in",
                        transformOrigin: "100px 100px" 
                    });
                }
                
                setTimeout(() => {
                    preloader.style.opacity = '0';
                    setTimeout(() => {
                        preloader.style.display = 'none';
                        document.body.classList.add('loaded');
                        if (typeof initializeGsapAnimations === 'function') {
                            initializeGsapAnimations();
                        }
                    }, 500);
                }, 900);
            }`;

if(content.includes(oldFinishLoading)) {
    content = content.replace(oldFinishLoading, newFinishLoading);
    fs.writeFileSync(targetFile, content);
    console.log('Successfully patched finishLoading with zoom effect');
} else {
    console.log('Could not find finishLoading to patch');
}
