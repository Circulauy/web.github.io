import os
import glob
import re

functions_dir = r"c:\Users\anton\Downloads\web.github.io-main\web.github.io-main\netlify\functions"
js_files = ["contact_form.js", "create-preference.js", "mp-webhook.js", "send-email.js"]

for js_filename in js_files:
    js_file = os.path.join(functions_dir, js_filename)
    with open(js_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Check if we already wrapped it
    if "const originalHandler =" in content:
        continue

    # Rename exports.handler to const originalHandler
    content = re.sub(r'exports\.handler\s*=\s*async\s*(?:function\s*)?\(\s*event\s*(?:,\s*context\s*)?\)\s*=>?\s*\{', 
                     'const originalHandler = async (event, context) => {', 
                     content, count=1)
    
    wrapper = """

exports.handler = async (event, context) => {
    const corsUtils = require('./utils/cors');
    if (event.httpMethod === "OPTIONS") {
        return {
            statusCode: 200,
            headers: corsUtils.getCorsHeaders(event),
            body: ""
        };
    }
    const response = await originalHandler(event, context);
    if (response && typeof response === 'object') {
        response.headers = { ...response.headers, ...corsUtils.getCorsHeaders(event) };
    }
    return response;
};
"""
    content += wrapper
    
    with open(js_file, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Wrapped {js_filename}")
