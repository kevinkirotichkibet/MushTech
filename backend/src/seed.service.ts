import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { Product, ProductDocument } from './products/product.schema';
import { User, UserDocument } from './users/user.schema';
import { SEED_PRODUCTS } from './seed-data';

// Runs once per start-up and only fills in what is missing, so it is safe to leave on:
//  - adds the launch products when the products collection is empty
//  - creates the admin login from ADMIN_EMAIL / ADMIN_PASSWORD when that account does not exist yet
// Set AUTO_SEED=false to turn it off. It never overwrites existing data or passwords.
@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly log = new Logger('Seed');

  constructor(
    @InjectModel(Product.name) private products: Model<ProductDocument>,
    @InjectModel(User.name) private users: Model<UserDocument>,
  ) {}

  async onApplicationBootstrap() {
    if (process.env.AUTO_SEED === 'false') return;
    try {
      if ((await this.products.countDocuments()) === 0) {
        await this.products.insertMany(SEED_PRODUCTS);
        this.log.log(`Seeded ${SEED_PRODUCTS.length} products`);
      }

      const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
      const password = process.env.ADMIN_PASSWORD;
      if (email && password) {
        if (password.length < 10) {
          this.log.warn('ADMIN_PASSWORD is shorter than 10 characters, admin account not created');
        } else if (!(await this.users.exists({ email }))) {
          await this.users.create({ name: 'Admin', email, passwordHash: await bcrypt.hash(password, 10), role: 'admin' });
          this.log.log(`Admin account created: ${email}`);
        }
      }
    } catch (e: any) {
      // never stop the API from starting because of seeding
      this.log.error(`Auto-seed skipped: ${e?.message ?? e}`);
    }
  }
}
