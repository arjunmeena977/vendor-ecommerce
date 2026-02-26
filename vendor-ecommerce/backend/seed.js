import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';

const seedAdmin = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/vendor-ecommerce');

        const adminExists = await User.findOne({ email: 'admin@luxe.com' });

        if (!adminExists) {
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash('admin123', salt);

            await User.create({
                name: 'System Admin',
                email: 'admin@luxe.com',
                passwordHash,
                role: 'ADMIN'
            });
            console.log('Admin user seeded successfully');
        } else {
            console.log('Admin already exists');
        }

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

seedAdmin();
