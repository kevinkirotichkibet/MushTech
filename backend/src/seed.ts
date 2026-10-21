import 'reflect-metadata';
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { Product, ProductSchema } from './products/product.schema';
import { User, UserSchema } from './users/user.schema';
import { SEED_PRODUCTS } from './seed-data';
dotenv.config();

const data = SEED_PRODUCTS;

(async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_URI is not set (backend/.env)');
  await mongoose.connect(uri);
  const Products = mongoose.model(Product.name, ProductSchema);
  const Users = mongoose.model(User.name, UserSchema);

  // Products: only added when the collection is empty, unless SEED_RESET=true
  if (process.env.SEED_RESET === 'true') await Products.deleteMany({});
  if ((await Products.countDocuments()) === 0) {
    await Products.insertMany(data);
    console.log(`Seeded ${data.length} products`);
  } else {
    console.log('Products already exist, skipped (set SEED_RESET=true to replace them)');
  }

  // Admin account from ADMIN_EMAIL / ADMIN_PASSWORD (re-running resets the password)
  const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (ADMIN_EMAIL && ADMIN_PASSWORD) {
    if (ADMIN_PASSWORD.length < 10) throw new Error('ADMIN_PASSWORD must be at least 10 characters');
    await Users.findOneAndUpdate(
      { email: ADMIN_EMAIL.trim().toLowerCase() },
      { $set: { name: 'Admin', role: 'admin', passwordHash: await bcrypt.hash(ADMIN_PASSWORD, 10) } },
      { upsert: true, setDefaultsOnInsert: true },
    );
    console.log(`Admin account ready: ${ADMIN_EMAIL}`);
  } else {
    console.log('ADMIN_EMAIL / ADMIN_PASSWORD not set, no admin created');
  }
  await mongoose.disconnect();
})().catch((e) => { console.error(e.message); process.exit(1); });
