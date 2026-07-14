import os
import re

directory = r"C:\Users\anton\Downloads\web.github.io-main\web.github.io-main"

def update_files():
    count = 0
    pattern = re.compile(r"'rp-teal':\s*'(?:#79C7C7|#79c7c7)'(?!, 'rp-teal-dark')", re.IGNORECASE)
    replacement = r"'rp-teal': '#79C7C7', 'rp-teal-dark': '#3B7A7A'"
    
    for filename in os.listdir(directory):
        if filename.endswith(".html"):
            filepath = os.path.join(directory, filename)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            new_content = pattern.sub(replacement, content)
            
            if new_content != content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Updated {filename}")
                count += 1
    
    print(f"Total files updated: {count}")

if __name__ == '__main__':
    update_files()
