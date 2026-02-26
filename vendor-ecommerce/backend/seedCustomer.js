import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const seedCustomer = async () => {
    try {
        const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/vendor-ecommerce';
        await mongoose.connect(MONGODB_URI);

        let customer = await User.findOne({ email: 'customer@luxe.com' });
        if (!customer) {
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash('customer123', salt);

            await User.create({
                name: 'Test Customer',
                email: 'customer@luxe.com',
                passwordHash,
                role: 'USER'
            });
            console.log('Demo Customer created.');
        } else {
            console.log('Demo Customer already exists.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
}

seedCustomer();
