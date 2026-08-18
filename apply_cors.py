import os
import glob
import re

functions_dir = r"c:\Users\anton\Downloads\web.github.io-main\web.github.io-main\netlify\functions"
js_files = glob.glob(os.path.join(functions_dir, "*.js"))

for js_file in js_files:
    if os.path.basename(js_file) == "cors.js":
        continue
    
    with open(js_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Check if there are any CORS wildcard left
    if '"Access-Control-Allow-Origin": "*"' in content or "'Access-Control-Allow-Origin': '*'" in content:
        # First, insert the allowedOrigin definition right after exports.handler = async (event
        
        # We look for `exports.handler = async (event, context) => {` or similar
        handler_pattern = r"(exports\.handler\s*=\s*async\s*(?:function\s*)?\(\s*event\s*(?:,\s*context\s*)?\)\s*=>?\s*\{)"
        
        # Replace the first occurrence
        match = re.search(handler_pattern, content)
        if match:
            insertion = "\n    const allowedOrigin = require('./utils/cors').getAllowedOrigin(event);\n"
            content = content[:match.end()] + insertion + content[match.end():]
        
        # Now replace all wildcards with `allowedOrigin` (no quotes around allowedOrigin because it's a variable)
        content = content.replace('"Access-Control-Allow-Origin": "*"', '"Access-Control-Allow-Origin": allowedOrigin')
        content = content.replace("'Access-Control-Allow-Origin': '*'", "'Access-Control-Allow-Origin': allowedOrigin")

        # In OPTIONS handler, we might want to also include the allowed methods/headers from the module, 
        # but just restricting the origin is the main task.
        
        with open(js_file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated CORS in {os.path.basename(js_file)}")
