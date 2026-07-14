const fs = require('fs');
const path = require('path');

const directory = 'c:/Users/anton/Downloads/web.github.io-main/web.github.io-main';

const newFontLink = '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">';
const newTailwindConfig = "<script>tailwind.config = { theme: { extend: { colors: { 'bg-light': '#fafafa', 'text-dark': '#0f172a', 'rp-teal': '#79C7C7', 'rp-mint': '#A3E6BA', 'rp-blue-light': '#f8f9fa', 'rp-gray-soft': '#dddddd' }, fontFamily: { sans: ['Inter', 'sans-serif'], heading: ['Outfit', 'sans-serif'], brand: ['Inter', 'sans-serif'], serif: ['Outfit', 'sans-serif'] } } } }</script>";

const fontRegex = /<link\s+href="https:\/\/fonts\.googleapis\.com[^"]*"[^>]*>/gi;
const tailwindRegex = /<script>\s*tailwind\.config\s*=\s*\{.*?<\/script>/gis;

function walkDir(dir) {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            // No node_modules, no .git
            if (file !== 'node_modules' && file !== '.git') {
                walkDir(fullPath);
            }
        } else if (fullPath.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;

            if (fontRegex.test(content)) {
                content = content.replace(fontRegex, newFontLink);
                modified = true;
            }
            if (tailwindRegex.test(content)) {
                content = content.replace(tailwindRegex, newTailwindConfig);
                modified = true;
            }

            content = content.replace(/font-family:\s*'Montserrat',\s*sans-serif;/gi, "font-family: 'Inter', sans-serif;");
            content = content.replace(/font-family:\s*'Patua One',\s*cursive;/gi, "font-family: 'Outfit', sans-serif;");

            fs.writeFileSync(fullPath, content, 'utf8');
        }
    });
}

walkDir(directory);

const cssPath = path.join(directory, 'css/custom.css');
if (fs.existsSync(cssPath)) {
    let css = fs.readFileSync(cssPath, 'utf8');
    css = css.replace(/font-family:\s*'Montserrat',\s*sans-serif;/gi, "font-family: 'Inter', sans-serif;");
    css = css.replace(/font-family:\s*'Patua One',\s*cursive;/gi, "font-family: 'Outfit', sans-serif;");
    fs.writeFileSync(cssPath, css, 'utf8');
}

console.log('Typography updated across all files.');
