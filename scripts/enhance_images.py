import os
import io
from PIL import Image, ImageEnhance, ImageFilter
from rembg import remove, new_session

RAW_DIR = "raw_images"
OUT_DIR = "public/products"

if not os.path.exists(OUT_DIR):
    os.makedirs(OUT_DIR)

session = new_session()

def enhance_image(in_path, out_path):
    print(f"Processing: {in_path}")
    
    with open(in_path, 'rb') as i:
        input_data = i.read()
    
    # 1. Background Removal
    # For low-res, sometimes alpha_matting adds too much softness. 
    # Let's try without it first or with much smaller thresholds for sharper edges.
    result_data = remove(
        input_data, 
        session=session,
        alpha_matting=False # Trying without it for harder edges on low-res
    )
    
    img = Image.open(io.BytesIO(result_data)).convert("RGBA")
    
    # 2. Crop to content
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
    
    # 3. Aggressive Enhancement for 100-crore look
    # Pre-sharpening
    img = img.filter(ImageFilter.UnsharpMask(radius=2, percent=150, threshold=3))
    
    # Contrast boost (stronger)
    enhancer_c = ImageEnhance.Contrast(img)
    img = enhancer_c.enhance(1.1)
    
    # Sharpness boost
    enhancer_s = ImageEnhance.Sharpness(img)
    img = enhancer_s.enhance(1.5)
    
    # 4. Standardize Canvas
    # We'll use 800x800 as a more realistic target for low-res sources to avoid extreme stretching blur
    canvas_size = 800 
    new_img = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
    
    w, h = img.size
    # Don't scale up past 1.5x of original to prevent excessive blur
    max_scale = 1.5
    target_ratio = min((canvas_size * 0.85) / w, (canvas_size * 0.85) / h)
    
    # If the original is very small, we might want to scale it less
    # but for consistent UI we need a certain size. 
    # Let's find a middle ground.
    scale_factor = target_ratio
    
    img = img.resize((int(w * scale_factor), int(h * scale_factor)), Image.Resampling.LANCZOS)
    
    # Final sharpening after resize
    img = img.filter(ImageFilter.SHARPEN)
    
    # Center the image
    w, h = img.size
    offset = ((canvas_size - w) // 2, (canvas_size - h) // 2)
    new_img.paste(img, offset, img)
    
    new_img.save(out_path, format="PNG", optimize=True)

count = 1
for filename in sorted(os.listdir(RAW_DIR)):
    if filename.lower().endswith(('.jpg', '.jpeg', '.png')):
        in_p = os.path.join(RAW_DIR, filename)
        out_p = os.path.join(OUT_DIR, f"product_{count}.png")
        try:
            enhance_image(in_p, out_p)
            count += 1
        except Exception as e:
            print(f"Error enhancing {filename}: {e}")

print(f"Aggressively Enhanced {count - 1} images.")
