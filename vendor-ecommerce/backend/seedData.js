import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Product from './models/Product.js';
import dotenv from 'dotenv';

dotenv.config();

const seedDemoData = async () => {
    try {
        const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/vendor-ecommerce';
        await mongoose.connect(MONGODB_URI);

        console.log('Connected to DB. Seeding demo data...');

        // 1. Create a Demo Vendor
        let vendor = await User.findOne({ email: 'demovendor@luxe.com' });
        if (!vendor) {
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash('vendor123', salt);

            vendor = await User.create({
                name: 'Luxe Studios',
                email: 'demovendor@luxe.com',
                passwordHash,
                role: 'VENDOR',
                vendorStatus: 'APPROVED'
            });
            console.log('Demo Vendor created.');
        } else {
            console.log('Demo Vendor already exists.');
        }

        // 2. Create Demo Products
        const demoProducts = [
            {
                vendor: vendor._id,
                title: 'Minimalist Ceramic Vase',
                description: 'A handcrafted ceramic vase perfect for modern living spaces. Features a smooth matte finish and organic shapes.',
                price: 45.00,
                stock: 25,
                imageUrl: 'https://images.unsplash.com/photo-1581783898377-1c85bf937427?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            },
            {
                vendor: vendor._id,
                title: 'Premium Leather Smart Wallet',
                description: 'Ultra-slim leather wallet with RFID protection. Holds up to 8 cards and cash seamlessly without the bulk.',
                price: 89.99,
                stock: 50,
                imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            },
            {
                vendor: vendor._id,
                title: 'Noise Cancelling Wireless Headphones',
                description: 'Experience pure audio with these top-tier over-ear headphones. Features 30-hour battery life and active noise cancellation.',
                price: 299.00,
                stock: 15,
                imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            },
            {
                vendor: vendor._id,
                title: 'Organic Cotton Throw Blanket',
                description: 'Cozy up with our 100% organic cotton throw. Ethically made and perfectly sized for couches or beds.',
                price: 65.50,
                stock: 40,
                imageUrl: 'https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            },
            {
                vendor: vendor._id,
                title: 'Artisan Roasted Coffee Beans',
                description: 'Single-origin Ethiopian coffee beans roasted to perfection. Notes of blueberry, jasmine, and dark chocolate.',
                price: 22.00,
                stock: 100,
                imageUrl: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            },
            {
                vendor: vendor._id,
                title: 'Matte Black Desk Lamp',
                description: 'A sleek, adjustable LED desk lamp with multiple brightness settings and color temperatures. Ideal for focused work.',
                price: 115.00,
                stock: 20,
                imageUrl: 'https://images.unsplash.com/photo-1534978051782-bd42f9b16899?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            },
            {
                vendor: vendor._id,
                title: 'Terracotta Plant Pot',
                description: 'Classic terracotta planter with a modern twist. Includes a drainage hole and a matching saucer.',
                price: 35.00,
                stock: 60,
                imageUrl: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            },
            {
                vendor: vendor._id,
                title: 'Mechanical Keyboard with Cherry MX Switches',
                description: 'Customizable RGB mechanical keyboard. Anodized aluminum frame packed with durable, tactile switches.',
                price: 150.00,
                stock: 12,
                imageUrl: 'https://images.unsplash.com/photo-1595225476474-87563907a212?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            },
            {
                vendor: vendor._id,
                title: 'Stainless Steel Water Bottle',
                description: 'Vacuum insulated water bottle that keeps drinks cold for 24 hours or hot for 12 hours. Leak-proof cap.',
                price: 28.99,
                stock: 80,
                imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            },
            {
                vendor: vendor._id,
                title: 'Hand-poured Soy Candle',
                description: 'Relax with the soothing scent of sandalwood and vanilla. 50-hour burn time with a crackling wooden wick.',
                price: 18.50,
                stock: 150,
                imageUrl: 'https://images.unsplash.com/photo-1603006905393-277150aee714?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            }
        ];

        // Delete existing demo products to prevent duplicates on rerun
        await Product.deleteMany({ title: { $in: demoProducts.map(p => p.title) } });

        await Product.insertMany(demoProducts);
        console.log('Successfully seeded 10 demo products!');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
}

seedDemoData();
