const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, 'index.html');
let content = fs.readFileSync(targetFile, 'utf8');

// Patch 1: Fix Press bounds
const oldPress = `                    if (phaseProgress < 0.4) {
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
                    }`;

const newPress = `                    if (phaseProgress < 0.4) {
                        let pressY = (phaseProgress / 0.4) * 10;
                        if(pressHead) pressHead.setAttribute('y', 115 + pressY);
                        if(pressShaft) pressShaft.setAttribute('y2', 115 + pressY);
                    } else if (phaseProgress < 0.7) {
                        if(solidSheet) solidSheet.setAttribute('opacity', ((phaseProgress - 0.4) / 0.3).toFixed(2));
                    } else {
                        let pressY = 10 - ((phaseProgress - 0.7) / 0.3) * 10;
                        if(pressHead) pressHead.setAttribute('y', 115 + pressY);
                        if(pressShaft) pressShaft.setAttribute('y2', 115 + pressY);
                        if(solidSheet) solidSheet.setAttribute('opacity', '1');
                    }`;
content = content.replace(oldPress, newPress);

// Patch 2: Fix flake removal height
const oldFlakeRemove = `                        if (flake.y > 180) {
                            flake.el.remove();`;
const newFlakeRemove = `                        if (flake.y > 175) {
                            flake.el.remove();`;
content = content.replace(oldFlakeRemove, newFlakeRemove);

// Patch 3: Fix flake drift speed
const oldFlakeSpeed = `speedX: (Math.random()-0.5)*3`;
const newFlakeSpeed = `speedX: (Math.random()-0.5)*0.5`;
content = content.replace(oldFlakeSpeed, newFlakeSpeed);

// Patch 4: Fix cap generation width
const oldCapGen = `const cx = 100 + (Math.random() - 0.5) * 40;`;
const newCapGen = `const cx = 100 + (Math.random() - 0.5) * 30;`;
content = content.replace(oldCapGen, newCapGen);

// Patch 5: Fix cap drift towards center
const oldCapDrift = `                            if (cap.cy > 50 && cap.cy < 90) {
                                cap.cx += (100 - cap.cx) * 0.1;
                            }`;
const newCapDrift = `                            if (cap.cy > 40 && cap.cy < 90) {
                                cap.cx += (100 - cap.cx) * 0.15;
                            }`;
content = content.replace(oldCapDrift, newCapDrift);

fs.writeFileSync(targetFile, content);
console.log('Successfully patched index.html bounds');
