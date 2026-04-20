export const products = Array.from({ length: 23 }).map((_, i) => {
  const id = i + 1;
  let collection = "Artisan Collection";
  if (id <= 8) collection = "Terra Series";
  else if (id <= 16) collection = "Midnight Series";

  return {
    id: String(id),
    name: `NOVE ${collection.split(' ')[0]} ${String(id).padStart(2, '0')}`,
    price: 5999 + (id % 5) * 1000,
    image: `/products/product_${id}.png`,
    colors: ['Silver', 'Midnight Black'],
    collection: collection,
    description: "Experience luxury with NOVE's glass-inspired aesthetics and premium craftsmanship."
  };
});
