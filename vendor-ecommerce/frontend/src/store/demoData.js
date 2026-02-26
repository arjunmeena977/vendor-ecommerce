export const demoUsers = [
    {
        _id: 'admin_demo_id',
        name: 'Admin User',
        email: 'admin@luxe.com',
        role: 'ADMIN',
        token: 'demo_admin_token'
    },
    {
        _id: 'vendor_demo_id',
        name: 'Luxe Studios',
        email: 'demovendor@luxe.com',
        role: 'VENDOR',
        vendorStatus: 'APPROVED',
        token: 'demo_vendor_token'
    },
    {
        _id: 'customer_demo_id',
        name: 'Demo Customer',
        email: 'customer@luxe.com',
        role: 'CUSTOMER',
        token: 'demo_customer_token'
    }
];

export const demoProducts = [
    {
        _id: 'prod_1',
        vendor: { _id: 'vendor_demo_id', name: 'Luxe Studios' },
        title: 'Minimalist Ceramic Vase',
        description: 'A handcrafted ceramic vase perfect for modern living spaces. Features a smooth matte finish and organic shapes.',
        price: 45.00,
        stock: 25,
        imageUrl: 'https://images.unsplash.com/photo-1581783898377-1c85bf937427?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
        _id: 'prod_2',
        vendor: { _id: 'vendor_demo_id', name: 'Luxe Studios' },
        title: 'Premium Leather Smart Wallet',
        description: 'Ultra-slim leather wallet with RFID protection. Holds up to 8 cards and cash seamlessly without the bulk.',
        price: 89.99,
        stock: 50,
        imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
        _id: 'prod_3',
        vendor: { _id: 'vendor_demo_id', name: 'Luxe Studios' },
        title: 'Noise Cancelling Wireless Headphones',
        description: 'Experience pure audio with these top-tier over-ear headphones. Features 30-hour battery life and active noise cancellation.',
        price: 299.00,
        stock: 15,
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
        _id: 'prod_4',
        vendor: { _id: 'vendor_demo_id', name: 'Luxe Studios' },
        title: 'Organic Cotton Throw Blanket',
        description: 'Cozy up with our 100% organic cotton throw. Ethically made and perfectly sized for couches or beds.',
        price: 65.50,
        stock: 40,
        imageUrl: 'https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
        _id: 'prod_5',
        vendor: { _id: 'vendor_demo_id', name: 'Luxe Studios' },
        title: 'Artisan Roasted Coffee Beans',
        description: 'Single-origin Ethiopian coffee beans roasted to perfection. Notes of blueberry, jasmine, and dark chocolate.',
        price: 22.00,
        stock: 100,
        imageUrl: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
        _id: 'prod_6',
        vendor: { _id: 'vendor_demo_id', name: 'Luxe Studios' },
        title: 'Matte Black Desk Lamp',
        description: 'A sleek, adjustable LED desk lamp with multiple brightness settings and color temperatures. Ideal for focused work.',
        price: 115.00,
        stock: 20,
        imageUrl: 'https://images.unsplash.com/photo-1534978051782-bd42f9b16899?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
        _id: 'prod_7',
        vendor: { _id: 'vendor_demo_id', name: 'Luxe Studios' },
        title: 'Terracotta Plant Pot',
        description: 'Classic terracotta planter with a modern twist. Includes a drainage hole and a matching saucer.',
        price: 35.00,
        stock: 60,
        imageUrl: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
        _id: 'prod_8',
        vendor: { _id: 'vendor_demo_id', name: 'Luxe Studios' },
        title: 'Mechanical Keyboard with Cherry MX Switches',
        description: 'Customizable RGB mechanical keyboard. Anodized aluminum frame packed with durable, tactile switches.',
        price: 150.00,
        stock: 12,
        imageUrl: 'https://images.unsplash.com/photo-1595225476474-87563907a212?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
        _id: 'prod_9',
        vendor: { _id: 'vendor_demo_id', name: 'Luxe Studios' },
        title: 'Stainless Steel Water Bottle',
        description: 'Vacuum insulated water bottle that keeps drinks cold for 24 hours or hot for 12 hours. Leak-proof cap.',
        price: 28.99,
        stock: 80,
        imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
        _id: 'prod_10',
        vendor: { _id: 'vendor_demo_id', name: 'Luxe Studios' },
        title: 'Hand-poured Soy Candle',
        description: 'Relax with the soothing scent of sandalwood and vanilla. 50-hour burn time with a crackling wooden wick.',
        price: 18.50,
        stock: 150,
        imageUrl: 'https://images.unsplash.com/photo-1603006905393-277150aee714?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }
];

export const demoOrders = [
    {
        _id: 'order_1',
        user: { _id: 'customer_demo_id', name: 'Demo Customer', email: 'customer@luxe.com' },
        items: [
            { product: demoProducts[0], qty: 2, priceAtPurchase: 45.00 },
            { product: demoProducts[3], qty: 1, priceAtPurchase: 65.50 }
        ],
        totalAmount: 155.50,
        status: 'PENDING',
        address: '123 Demo St, Mytown, NY 10001',
        vendor: 'vendor_demo_id',
        createdAt: new Date().toISOString()
    },
    {
        _id: 'order_2',
        user: { _id: 'customer_demo_id', name: 'Demo Customer', email: 'customer@luxe.com' },
        items: [
            { product: demoProducts[2], qty: 1, priceAtPurchase: 299.00 }
        ],
        totalAmount: 299.00,
        status: 'SHIPPED',
        address: '123 Demo St, Mytown, NY 10001',
        vendor: 'vendor_demo_id',
        createdAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
        _id: 'order_3',
        user: { _id: 'customer_demo_id', name: 'Demo Customer', email: 'customer@luxe.com' },
        items: [
            { product: demoProducts[8], qty: 3, priceAtPurchase: 28.99 }
        ],
        totalAmount: 86.97,
        status: 'DELIVERED',
        address: '123 Demo St, Mytown, NY 10001',
        vendor: 'vendor_demo_id',
        createdAt: new Date(Date.now() - 172800000).toISOString()
    }
];

export const demoAdminStats = {
    totalUsers: { number: 1250, change: '+12%', isPositive: true },
    totalVendors: { number: 48, change: '+5%', isPositive: true },
    totalRevenue: { number: 125430, change: '+24%', isPositive: true },
    totalOrders: { number: 342, change: '-2%', isPositive: false }
};

export const demoPendingVendors = [
    {
        _id: 'pending_vendor_1',
        name: 'Artisan Crafts Co.',
        email: 'hello@artisancrafts.com',
        role: 'VENDOR',
        vendorStatus: 'PENDING',
        createdAt: new Date().toISOString()
    },
    {
        _id: 'pending_vendor_2',
        name: 'Tech Gadgets Hub',
        email: 'contact@techhub.io',
        role: 'VENDOR',
        vendorStatus: 'PENDING',
        createdAt: new Date(Date.now() - 86400000).toISOString()
    }
];
