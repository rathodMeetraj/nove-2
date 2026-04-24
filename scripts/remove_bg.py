import os
import json
from rembg import remove
from PIL import Image
import io

RAW_DIR = "raw_images"
OUT_DIR = "public/products"

if not os.path.exists(OUT_DIR):
    os.makedirs(OUT_DIR)

products = []
price = 5999
colors = ["Silver", "Midnight Black"] # Apple-inspired default colors

count = 1
for filename in os.listdir(RAW_DIR):
    if filename.lower().endswith(('.jpg', '.jpeg', '.png')):
        in_path = os.path.join(RAW_DIR, filename)
        out_filename = f"product_{count}.png"
        out_path = os.path.join(OUT_DIR, out_filename)
        
        # Read image
        try:
            with open(in_path, 'rb') as i:
                input_data = i.read()
            
            # Remove background
            print(f"Processing {filename}...")
            output_data = remove(input_data)
            
            # Save output as PNG
            img = Image.open(io.BytesIO(output_data)).convert("RGBA")
            # Downscale slightly for web optimization if it's too large, or just save
            img.thumbnail((1024, 1024))
            img.save(out_path, format="PNG")
            
            # Add to products mock data
            products.append({
                "id": str(count),
                "name": f"NOVE Classic Collection {count:02d}",
                "price": price,
                "image": f"/products/{out_filename}",
                "colors": colors,
                "description": "Experience luxury with NOVE's glass-inspired aesthetics and premium craftsmanship."
            })
            
            count += 1
        except Exception as e:
            print(f"Error processing {filename}: {e}")

# Generate mock data
with open("src/data/products.json", "w") as f:
    # Ensure src/data exists
    os.makedirs(os.path.dirname("src/data/products.json"), exist_ok=True)
    json.dump(products, f, indent=4)

print(f"Processed {count - 1} images successfully.")
