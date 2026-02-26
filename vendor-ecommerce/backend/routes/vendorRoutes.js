import express from 'express';
import { protect, vendor } from '../middleware/authMiddleware.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Configure Multer for image uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed'));
        }
    }
});

// @desc    Get vendor's products
// @route   GET /api/vendor/products
// @access  Private/Vendor
router.get('/products', protect, vendor, async (req, res) => {
    try {
        const products = await Product.find({ vendor: req.user._id });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Create a product
// @route   POST /api/vendor/products
// @access  Private/Vendor
router.post('/products', protect, vendor, upload.single('image'), async (req, res) => {
    try {
        const { title, description, price, stock } = req.body;

        let imageUrl = '';
        if (req.file) {
            imageUrl = `/${req.file.path.replace(/\\/g, '/')}`;
        }

        const product = new Product({
            vendor: req.user._id,
            title,
            description,
            price,
            stock,
            imageUrl
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update a product
// @route   PUT /api/vendor/products/:id
// @access  Private/Vendor
router.put('/products/:id', protect, vendor, upload.single('image'), async (req, res) => {
    try {
        const { title, description, price, stock, isActive } = req.body;
        const product = await Product.findById(req.params.id);

        if (product && product.vendor.toString() === req.user._id.toString()) {
            product.title = title || product.title;
            product.description = description || product.description;
            product.price = price !== undefined ? price : product.price;
            product.stock = stock !== undefined ? stock : product.stock;
            product.isActive = isActive !== undefined ? isActive : product.isActive;

            if (req.file) {
                product.imageUrl = `/${req.file.path.replace(/\\/g, '/')}`;
            }

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found or unauthorized' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Delete a product
// @route   DELETE /api/vendor/products/:id
// @access  Private/Vendor
router.delete('/products/:id', protect, vendor, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product && product.vendor.toString() === req.user._id.toString()) {
            await Product.deleteOne({ _id: product._id });
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found or unauthorized' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get vendor's received orders
// @route   GET /api/vendor/orders
// @access  Private/Vendor
router.get('/orders', protect, vendor, async (req, res) => {
    try {
        const orders = await Order.find({ vendor: req.user._id })
            .populate('user', 'name email')
            .populate('items.product', 'title');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update order status
// @route   PATCH /api/vendor/orders/:id/status
// @access  Private/Vendor
router.patch('/orders/:id/status', protect, vendor, async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);

        if (order && order.vendor.toString() === req.user._id.toString()) {
            order.status = status;
            await order.save();
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found or unauthorized' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
