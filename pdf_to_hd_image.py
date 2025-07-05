import argparse
import os
import fitz  # PyMuPDF
from PIL import Image

def pdf_page_to_hd_image(pdf_path, page_number, zoom=3):
    # Load PDF
    try:
        doc = fitz.open(pdf_path)
    except Exception as e:
        print(f"Error opening PDF: {e}")
        return

    if page_number < 1 or page_number > len(doc):
        print(f"Page number must be between 1 and {len(doc)}")
        return

    page = doc.load_page(page_number - 1)  # 0-indexed

    # Render to high-res image
    mat = fitz.Matrix(zoom, zoom)
    pix = page.get_pixmap(matrix=mat)

    # Construct output filename
    output_path = os.path.splitext(pdf_path)[0] + f"_page{page_number}_hd.png"

    # Save image
    pix.save(output_path)
    print(f"Saved HD image: {output_path}")

    # Optional: Enhance or set DPI
    image = Image.open(output_path).convert("RGB")
    image.save(output_path, dpi=(300, 300))

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Extract a page from PDF and save as HD image.")
    parser.add_argument("pdf_path", help="Path to the PDF file")
    parser.add_argument("page", type=int, help="Page number to extract (1-based index)")

    args = parser.parse_args()
    pdf_page_to_hd_image(args.pdf_path, args.page)

