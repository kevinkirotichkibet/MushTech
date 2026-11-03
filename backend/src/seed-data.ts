// Launch catalogue, used by both the manual seed script and the automatic first-start seeding.
// Only oyster mushrooms to start. More mushrooms are added from the admin panel (Products > Add a mushroom).
// The price is a placeholder in Kenya shillings: set the real one in the admin Products page.
export const SEED_PRODUCTS = [
  { name: 'Oyster Mushrooms', variety: 'oyster', description: 'Fresh oyster mushroom clusters with a soft, savoury bite.', pricePerKg: 1000, stockKg: 80, minOrderKg: 0.25, stepKg: 0.25, imageUrl: '/images/oyster.webp' },
];
