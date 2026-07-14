import os
import re

directory = 'c:/Users/anton/Downloads/web.github.io-main/web.github.io-main'

# The new config and fonts strings
new_font_link = '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">'
new_tailwind_config = "<script>tailwind.config = { theme: { extend: { colors: { 'bg-light': '#fafafa', 'text-dark': '#0f172a', 'rp-teal': '#79C7C7', 'rp-mint': '#A3E6BA', 'rp-blue-light': '#f8f9fa', 'rp-gray-soft': '#dddddd' }, fontFamily: { sans: ['Inter', 'sans-serif'], heading: ['Outfit', 'sans-serif'], brand: ['Inter', 'sans-serif'], serif: ['Outfit', 'sans-serif'] } } } }</script>"

font_regex = re.compile(r'<link\s+href="https://fonts\.googleapis\.com[^"]*"[^>]*>', re.IGNORECASE)
tailwind_regex = re.compile(r'<script>\s*tailwind\.config\s*=\s*\{.*?</script>', re.IGNORECASE | re.DOTALL)

for root, dirs, files in os.walk(directory):
    for file in files:
        if file.endswith('.html'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Replace fonts
            content = font_regex.sub(new_font_link, content)
            
            # Replace tailwind config
            content = tailwind_regex.sub(new_tailwind_config, content)
            
            # Additional replacement for inline style overrides (font-brand)
            content = content.replace("font-family: 'Montserrat', sans-serif;", "font-family: 'Inter', sans-serif;")
            content = content.replace("font-family: 'Patua One', cursive;", "font-family: 'Outfit', sans-serif;")
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)

# Update css/custom.css
css_path = os.path.join(directory, 'css/custom.css')
if os.path.exists(css_path):
    with open(css_path, 'r', encoding='utf-8') as f:
        css = f.read()
    css = css.replace("font-family: 'Montserrat', sans-serif;", "font-family: 'Inter', sans-serif;")
    css = css.replace("font-family: 'Patua One', cursive;", "font-family: 'Outfit', sans-serif;")
    with open(css_path, 'w', encoding='utf-8') as f:
        f.write(css)

print('Typography updated across all files.')
