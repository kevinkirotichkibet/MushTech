// Launch catalogue, used by both the manual seed script and the automatic first-start seeding.
export const SEED_PRODUCTS = [
  // available now
  { name: 'Oyster Mushrooms', variety: 'oyster', description: 'Fresh oyster mushroom clusters with a soft, savoury bite.', pricePerKg: 9, stockKg: 80, imageUrl: '/images/cluster.webp' },
  { name: 'Button Mushrooms', variety: 'button', description: 'Classic white button mushrooms, mild and versatile.', pricePerKg: 8, stockKg: 60 },
  // coming soon (visible in the shop, cannot be ordered)
  { name: 'Pink Oyster', variety: 'pink', description: 'A delicate pink oyster variety.', pricePerKg: 0, stockKg: 0, comingSoon: true },
  { name: 'Blue Oyster', variety: 'blue', description: 'A blue-grey oyster variety.', pricePerKg: 0, stockKg: 0, comingSoon: true },
  { name: 'Golden Oyster', variety: 'golden', description: 'A bright yellow oyster variety.', pricePerKg: 0, stockKg: 0, comingSoon: true },
  { name: 'King Oyster', variety: 'king', description: 'A large, thick-stemmed oyster variety.', pricePerKg: 0, stockKg: 0, comingSoon: true },
];
