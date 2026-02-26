import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

const router = express.Router();

// @desc    Get all vendors (pending, approved, rejected)
// @route   GET /api/admin/vendors
// @access  Private/Admin
router.get('/vendors', protect, admin, async (req, res) => {
    try {
        const vendors = await User.find({ role: 'VENDOR' }).select('-passwordHash');
        res.json(vendors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Approve a vendor
// @route   PATCH /api/admin/vendors/:id/approve
// @access  Private/Admin
router.patch('/vendors/:id/approve', protect, admin, async (req, res) => {
    try {
        const vendor = await User.findById(req.params.id);
        if (vendor && vendor.role === 'VENDOR') {
            vendor.vendorStatus = 'APPROVED';
            await vendor.save();
            res.json({ message: 'Vendor approved' });
        } else {
            res.status(404).json({ message: 'Vendor not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Reject a vendor
// @route   PATCH /api/admin/vendors/:id/reject
// @access  Private/Admin
router.patch('/vendors/:id/reject', protect, admin, async (req, res) => {
    try {
        const vendor = await User.findById(req.params.id);
        if (vendor && vendor.role === 'VENDOR') {
            vendor.vendorStatus = 'REJECTED';
            await vendor.save();
            res.json({ message: 'Vendor rejected' });
        } else {
            res.status(404).json({ message: 'Vendor not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get all products
// @route   GET /api/admin/products
// @access  Private/Admin
router.get('/products', protect, admin, async (req, res) => {
    try {
        const products = await Product.find({}).populate('vendor', 'name email');
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private/Admin
router.get('/orders', protect, admin, async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate('user', 'name email')
            .populate('vendor', 'name email')
            .populate('items.product', 'title price');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
