const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, 'index.html');
let content = fs.readFileSync(targetFile, 'utf8');

const oldZoom = `                    // Zoom the stool towards the screen
                    gsap.to('#phase-ensamblar', { 
                        scale: 3, 
                        opacity: 0,
                        duration: 1.0, 
                        ease: "power2.in",
                        transformOrigin: "100px 100px" 
                    });`;

const newZoom = `                    // Zoom the stool towards the screen perfectly centered
                    gsap.to('#phase-ensamblar', { 
                        scale: 3, 
                        opacity: 0,
                        duration: 1.0, 
                        ease: "power2.in",
                        svgOrigin: "100 100" 
                    });`;

if(content.includes(oldZoom)) {
    content = content.replace(oldZoom, newZoom);
    fs.writeFileSync(targetFile, content);
    console.log('Successfully patched zoom with svgOrigin');
} else {
    console.log('Could not find zoom to patch');
}
