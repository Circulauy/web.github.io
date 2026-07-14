const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, 'index.html');
let content = fs.readFileSync(targetFile, 'utf8');

// Patch 1: Fix Clasificar jittering
const oldClasificarLogic = `                        if (cap.type === 'clasificar') {
                            if (cap.cy < 60) {
                                cap.cy += cap.speed;
                            } else if (Math.abs(cap.cx - cap.targetX) > 2) {
                                cap.cx += (cap.targetX > cap.cx ? cap.speed : -cap.speed);
                            } else {
                                cap.cy += cap.speed;
                            }
                            cap.el.setAttribute("cx", cap.cx);
                            cap.el.setAttribute("cy", cap.cy);`;

const newClasificarLogic = `                        if (cap.type === 'clasificar') {
                            if (cap.cy < 60) {
                                cap.cy += cap.speed;
                            } else if (Math.abs(cap.cx - cap.targetX) > cap.speed) {
                                cap.cx += (cap.targetX > cap.cx ? cap.speed : -cap.speed);
                            } else {
                                cap.cx = cap.targetX;
                                cap.cy += cap.speed;
                            }
                            cap.el.setAttribute("cx", cap.cx);
                            cap.el.setAttribute("cy", cap.cy);`;

if(content.includes(oldClasificarLogic)) {
    content = content.replace(oldClasificarLogic, newClasificarLogic);
    console.log('Patched Clasificar logic');
} else {
    console.log('Could not find Clasificar logic to patch');
}

// Patch 2: Fix Flake rotation orbit bug when generating flakes
const oldFlakeGen = `                                    rect.setAttribute("transform", \`rotate(\${Math.random()*360} \${fx} \${fy})\`);
                                    document.getElementById('falling-flakes').appendChild(rect);
                                    fallingFlakes.push({ el: rect, x: fx, y: fy, speedY: 2 + Math.random()*2, speedX: (Math.random()-0.5)*0.5, color: cap.color });`;

const newFlakeGen = `                                    const rot = Math.random()*360;
                                    rect.setAttribute("transform", \`rotate(\${rot} \${fx} \${fy})\`);
                                    document.getElementById('falling-flakes').appendChild(rect);
                                    fallingFlakes.push({ el: rect, x: fx, y: fy, speedY: 2 + Math.random()*2, speedX: (Math.random()-0.5)*0.5, color: cap.color, rot: rot });`;

if(content.includes(oldFlakeGen)) {
    content = content.replace(oldFlakeGen, newFlakeGen);
    console.log('Patched Flake generation logic');
} else {
    // maybe speedX is still 3? (if my previous patch failed or something)
    const fallbackFlakeGen = `                                    rect.setAttribute("transform", \`rotate(\${Math.random()*360} \${fx} \${fy})\`);
                                    document.getElementById('falling-flakes').appendChild(rect);
                                    fallingFlakes.push({ el: rect, x: fx, y: fy, speedY: 2 + Math.random()*2, speedX: (Math.random()-0.5)*3, color: cap.color });`;
    if(content.includes(fallbackFlakeGen)) {
        content = content.replace(fallbackFlakeGen, newFlakeGen);
        console.log('Patched Flake generation logic (from fallback)');
    } else {
        console.log('Could not find Flake generation logic to patch');
    }
}

// Patch 3: Fix Flake rotation orbit bug when falling
const oldFlakeFall = `                        flake.el.setAttribute("x", flake.x);
                        flake.el.setAttribute("y", flake.y);
                        
                        if (flake.y > 175) {`;

const newFlakeFall = `                        flake.el.setAttribute("x", flake.x);
                        flake.el.setAttribute("y", flake.y);
                        flake.el.setAttribute("transform", \`rotate(\${flake.rot} \${flake.x} \${flake.y})\`);
                        
                        if (flake.y > 175) {`;

if(content.includes(oldFlakeFall)) {
    content = content.replace(oldFlakeFall, newFlakeFall);
    console.log('Patched Flake fall logic');
} else {
    const fallbackFlakeFall = `                        flake.el.setAttribute("x", flake.x);
                        flake.el.setAttribute("y", flake.y);
                        
                        if (flake.y > 180) {`;
    if(content.includes(fallbackFlakeFall)) {
        content = content.replace(fallbackFlakeFall, newFlakeFall.replace('175', '180'));
        console.log('Patched Flake fall logic (from fallback)');
    } else {
        console.log('Could not find Flake fall logic to patch');
    }
}

fs.writeFileSync(targetFile, content);
