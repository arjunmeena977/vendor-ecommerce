import { create } from 'zustand';

// Helper function to get the correct cart key for the current user
const getCartKey = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');
    return userInfo ? `cartItems_${userInfo._id}` : 'cartItems_guest';
};

export const useCartStore = create((set) => ({
    cartItems: JSON.parse(localStorage.getItem(getCartKey()) || '[]'),

    // Method to force reload the cart when a user logs in or out
    reloadCart: () => {
        set({ cartItems: JSON.parse(localStorage.getItem(getCartKey()) || '[]') });
    },

    addToCart: (product, qty = 1) => {
        set((state) => {
            const existing = state.cartItems.find(x => x.product === product._id);
            let newCart;
            if (existing) {
                newCart = state.cartItems.map(x => x.product === existing.product ? { ...existing, qty: existing.qty + qty } : x);
            } else {
                newCart = [...state.cartItems, { product: product._id, title: product.title, price: product.price, imageUrl: product.imageUrl, qty }];
            }
            localStorage.setItem(getCartKey(), JSON.stringify(newCart));
            return { cartItems: newCart };
        });
    },
    removeFromCart: (id) => {
        set((state) => {
            const newCart = state.cartItems.filter(x => x.product !== id);
            localStorage.setItem(getCartKey(), JSON.stringify(newCart));
            return { cartItems: newCart };
        });
    },
    clearCart: () => {
        localStorage.removeItem(getCartKey());
        set({ cartItems: [] });
    }
}));
