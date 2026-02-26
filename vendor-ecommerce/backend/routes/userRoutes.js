import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

const router = express.Router();

// @desc    Fetch all public products
// @route   GET /api/user/products
// @access  Public
router.get('/products', async (req, res) => {
    try {
        const keyword = req.query.keyword
            ? {
                title: { $regex: req.query.keyword, $options: 'i' },
            }
            : {};

        const products = await Product.find({ ...keyword, isActive: true })
            .populate('vendor', 'name');

        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Fetch single product detail
// @route   GET /api/user/products/:id
// @access  Public
router.get('/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('vendor', 'name');
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Place an order
// @route   POST /api/user/orders
// @access  Private
router.post('/orders', protect, async (req, res) => {
    try {
        const { orderItems, address } = req.body;

        if (orderItems && orderItems.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        // Group items by vendor since vendors manage their own orders
        const vendorGroups = {};

        for (const item of orderItems) {
            const product = await Product.findById(item.product);
            if (!product) continue;

            const vendorId = product.vendor.toString();
            if (!vendorGroups[vendorId]) {
                vendorGroups[vendorId] = { items: [], totalAmount: 0 };
            }

            vendorGroups[vendorId].items.push({
                product: product._id,
                qty: item.qty,
                priceAtPurchase: product.price
            });

            vendorGroups[vendorId].totalAmount += product.price * item.qty;

            // Deduct stock
            product.stock -= item.qty;
            await product.save();
        }

        // Create an order instance for each vendor
        const createdOrders = [];
        for (const [vendorId, group] of Object.entries(vendorGroups)) {
            const order = new Order({
                user: req.user._id,
                vendor: vendorId,
                items: group.items,
                totalAmount: group.totalAmount,
                address
            });
            const createdOrder = await order.save();
            createdOrders.push(createdOrder);
        }

        res.status(201).json({ message: 'Orders placed successfully', orders: createdOrders });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get user's past orders
// @route   GET /api/user/orders
// @access  Private
router.get('/orders', protect, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate('vendor', 'name')
            .populate('items.product', 'title imageUrl');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
