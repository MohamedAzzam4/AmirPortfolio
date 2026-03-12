import os
from PIL import Image

PORTFOLIO_DIR = r"F:\Programming\Antigravity-Projects\AmirPortfolio\images\portfolio"
TARGET_WIDTH = 800

def resize_image(path):
    try:
        with Image.open(path) as img:
            # Only resize if the image is wider than TARGET_WIDTH
            if img.width > TARGET_WIDTH:
                print(f"Resizing {path} (Original: {img.width}x{img.height})")
                
                # Calculate new height maintaining aspect ratio
                w_percent = (TARGET_WIDTH / float(img.width))
                h_size = int((float(img.height) * float(w_percent)))
                
                # Resize image
                resized_img = img.resize((TARGET_WIDTH, h_size), Image.Resampling.LANCZOS)
                
                # Overwrite original with optimization (for JPEG)
                if path.lower().endswith('.jpg') or path.lower().endswith('.jpeg'):
                    resized_img.save(path, "JPEG", optimize=True, quality=80)
                elif path.lower().endswith('.png'):
                    resized_img.save(path, "PNG", optimize=True)
                print(f"Successfully optimized {os.path.basename(path)}")
            else:
                print(f"Skipping {path} (Already optimized: {img.width}x{img.height})")
    except Exception as e:
        print(f"Error processing {path}: {e}")

def main():
    if not os.path.exists(PORTFOLIO_DIR):
        print(f"Portfolio directory not found: {PORTFOLIO_DIR}")
        return

    # Walk through all directories inside portfolio
    for root, dirs, files in os.walk(PORTFOLIO_DIR):
        for file in files:
            # specifically target the main thumbnails the lighthouse report complained about
            if file.lower() in ['main.jpg', 'main.jpeg', 'main.png']:
                full_path = os.path.join(root, file)
                resize_image(full_path)

if __name__ == "__main__":
    main()
