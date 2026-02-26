import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['ADMIN', 'VENDOR', 'USER'], default: 'USER' },
    vendorStatus: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: null }, // Only for vendors
}, { timestamps: true });

export default mongoose.model('User', userSchema);
