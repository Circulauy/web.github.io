import fitz
import os

pdf_path = r"C:\Users\anton\Downloads\catalogo de regalos empresariales 2026.pdf"
output_dir = r"c:\Users\anton\Downloads\web.github.io-main\web.github.io-main\images\catalogo"

doc = fitz.open(pdf_path)
for page_index in range(len(doc)):
    page = doc[page_index]
    image_list = page.get_images(full=True)
    if image_list:
        print(f"Page {page_index}: found {len(image_list)} images")
    for image_index, img in enumerate(image_list, start=1):
        xref = img[0]
        base_image = doc.extract_image(xref)
        image_bytes = base_image["image"]
        image_ext = base_image["ext"]
        
        image_filename = f"page_{page_index}_img_{image_index}.{image_ext}"
        image_path = os.path.join(output_dir, image_filename)
        
        with open(image_path, "wb") as f:
            f.write(image_bytes)
        print(f"Saved {image_path}")
