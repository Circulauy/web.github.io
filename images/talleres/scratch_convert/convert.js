const fs = require('fs');
const path = require('path');
const heicConvert = require('heic-convert');

const dir = 'C:\\Users\\anton\\Downloads\\web.github.io-main\\web.github.io-main\\images\\talleres\\pack2';

async function run() {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        if (file.toLowerCase().endsWith('.heic')) {
            const inputPath = path.join(dir, file);
            const outputPath = path.join(dir, file.replace(/\.HEIC$/i, '.jpg'));
            console.log(`Converting ${file}...`);
            const inputBuffer = fs.readFileSync(inputPath);
            const outputBuffer = await heicConvert({
                buffer: inputBuffer,
                format: 'JPEG',
                quality: 0.8
            });
            fs.writeFileSync(outputPath, outputBuffer);
            console.log(`Saved ${outputPath}`);
        }
    }
}
run().catch(console.error);
