import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super-secret-key');

            req.user = await User.findById(decoded.id).select('-passwordHash');
            if (!req.user) {
                return res.status(401).json({ message: 'User not found' });
            }
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.role === 'ADMIN') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};

const vendor = (req, res, next) => {
    if (req.user && req.user.role === 'VENDOR') {
        if (req.user.vendorStatus === 'APPROVED' || req.originalUrl.includes('/me')) {
            next();
        } else {
            res.status(403).json({ message: 'Vendor account not approved yet.' });
        }
    } else {
        res.status(403).json({ message: 'Not authorized as a vendor' });
    }
};

export { protect, admin, vendor };
