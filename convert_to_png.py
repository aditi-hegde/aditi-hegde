import os
import argparse
from PIL import Image
import pillow_heif

def convert_heic_to_png(heic_path):
    try:
        heif_file = pillow_heif.read_heif(heic_path)
        image = Image.frombytes(
            heif_file.mode,
            heif_file.size,
            heif_file.data,
        )

        output_path = os.path.splitext(heic_path)[0] + ".png"
        image.save(output_path, "PNG")
        print(f"Converted to PNG: {output_path}")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Convert HEIC to PNG using pillow-heif")
    parser.add_argument("heic_path", help="Path to .heic file")
    args = parser.parse_args()

    convert_heic_to_png(args.heic_path)

