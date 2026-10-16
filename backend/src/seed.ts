import 'reflect-metadata';
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Product, ProductSchema } from './products/product.schema';
dotenv.config();

const data = [
  { name: 'Pink Oyster', variety: 'pink', description: 'Delicate, bacon-like flavour when fried.', pricePerKg: 12, stockKg: 40 },
  { name: 'Blue Oyster', variety: 'blue', description: 'Mild, savoury, great in stir-fries.', pricePerKg: 10, stockKg: 60 },
  { name: 'Grey Oyster', variety: 'grey', description: 'Classic all-rounder with a meaty texture.', pricePerKg: 9, stockKg: 80 },
  { name: 'Golden Oyster', variety: 'golden', description: 'Nutty aroma, vibrant yellow clusters.', pricePerKg: 14, stockKg: 30 },
  { name: 'King Oyster', variety: 'king', description: 'Thick stems, scallop-like when seared.', pricePerKg: 16, stockKg: 25 },
];

(async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mushtech');
  const M = mongoose.model(Product.name, ProductSchema);
  await M.deleteMany({});
  await M.insertMany(data);
  console.log(`Seeded ${data.length} products`);
  await mongoose.disconnect();
})();
