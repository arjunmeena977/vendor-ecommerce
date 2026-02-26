import React, { useState } from 'react';
import { useCartStore } from '../store/cartStore';
import { useUserStore, api } from '../store/userStore';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Cart() {
    const { cartItems, removeFromCart, clearCart } = useCartStore();
    const { user } = useUserStore();
    const navigate = useNavigate();

    const [address, setAddress] = useState('');
    const [placingOrder, setPlacingOrder] = useState(false);

    const total = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);

    const handleCheckout = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        if (!address.trim()) {
            alert('Please provide a shipping address');
            return;
        }

        setPlacingOrder(true);
        try {
            await api.post('/user/orders', {
                orderItems: cartItems.map(item => ({ product: item.product, qty: item.qty })),
                address
            });
            clearCart();
            alert('Order Placed Successfully!');
            navigate('/');
        } catch (error) {
            alert(error.response?.data?.message || 'Error placing order');
        }
        setPlacingOrder(false);
    };

    if (cartItems.length === 0) {
        return (
            <div className="container flex flex-col items-center justify-center min-h-[500px] animate-fade-in">
                <ShoppingBag size={64} className="text-gray/50 mb-6" />
                <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
                <p className="text-gray mb-8">Looks like you haven't added anything yet.</p>
                <Link to="/" className="btn btn-primary px-8">Start Shopping</Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 animate-fade-in relative">
            {/* Background effects */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none -z-10"></div>

            <div className="flex items-center gap-4 mb-10">
                <div className="bg-primary/20 p-3 rounded-2xl">
                    <ShoppingBag size={28} className="text-primary" />
                </div>
                <h1 className="text-4xl font-bold tracking-tight">Your Cart</h1>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 relative items-start">
                {/* Cart Items List */}
                <div className="flex-1 lg:max-w-[calc(100%-420px)]">
                    <div className="card shadow-2xl border-t-white/10 border-l-white/10 rounded-3xl overflow-hidden">
                        <div className="bg-surfaceLight/50 px-8 py-5 flex items-center justify-between border-b border-white/5 backdrop-blur-md">
                            <span className="font-semibold text-lg text-white/90">Items ({cartItems.length})</span>
                            <button onClick={clearCart} className="text-sm font-medium text-danger hover:text-white bg-danger/10 hover:bg-danger px-4 py-1.5 rounded-full transition-all">Clear All</button>
                        </div>
                        <div className="divide-y divide-white/5">
                            {cartItems.map(item => (
                                <div key={item.product} className="p-6 md:p-8 flex items-center gap-6 md:gap-8 group hover:bg-surfaceLight/30 transition-colors">
                                    <div className="w-28 h-28 bg-surfaceLight rounded-2xl border border-white/5 shrink-0 overflow-hidden relative shadow-inner">
                                        <div className="absolute inset-0 bg-gradient-premium opacity-50 z-0"></div>
                                        {item.imageUrl ? (
                                            <img src={item.imageUrl.startsWith('/uploads') ? `http://localhost:5000${item.imageUrl}` : item.imageUrl} alt={item.title} className="w-full h-full object-cover relative z-10 group-hover:scale-110 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-xs text-gray/50 relative z-10">
                                                <ShoppingBag size={20} className="mb-1 opacity-20" /> No Img
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <Link to={`/product/${item.product}`} className="font-semibold text-xl text-white hover:text-primary transition-colors block mb-1 truncate">{item.title}</Link>
                                        <div className="inline-flex items-center gap-2 bg-background/50 px-3 py-1 rounded-lg border border-white/5 mb-3">
                                            <span className="text-gray text-sm">Qty:</span>
                                            <span className="font-bold text-white">{item.qty}</span>
                                        </div>
                                        <div className="font-black text-2xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">₹{item.price.toFixed(2)}</div>
                                    </div>
                                    <div className="shrink-0 flex flex-col items-end gap-4 h-full">
                                        <div className="font-bold text-lg text-white/90 group-hover:text-white transition-colors">
                                            ₹{(item.qty * item.price).toFixed(2)}
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.product)}
                                            className="p-3 bg-surface border border-white/5 text-gray hover:text-danger hover:bg-danger/10 hover:border-danger/20 rounded-xl transition-all shadow-sm"
                                            title="Remove item"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Checkout Summary */}
                <div className="w-full lg:w-[400px] shrink-0 sticky top-28">
                    <div className="card shadow-2xl border-t-white/10 border-l-white/10 rounded-3xl overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-2xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
                        <div className="bg-surfaceLight/50 px-8 py-5 border-b border-white/5 backdrop-blur-md">
                            <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                                Order Summary
                            </h2>
                        </div>
                        <div className="p-8 relative z-10">
                            <div className="flex justify-between items-center mb-4 text-gray text-base">
                                <span>Subtotal</span>
                                <span className="font-medium text-white">₹{total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center mb-6 pb-6 border-b border-white/10 text-gray text-base">
                                <span>Estimated Shipping</span>
                                <span className="px-3 py-1 bg-success/10 text-success rounded-lg font-semibold border border-success/20 text-sm tracking-wide uppercase">Free</span>
                            </div>

                            <div className="flex justify-between items-end mb-8">
                                <span className="text-lg font-medium text-gray">Total Pay</span>
                                <span className="text-4xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent drop-shadow-sm">
                                    ₹{total.toFixed(2)}
                                </span>
                            </div>

                            <div className="form-group mb-8">
                                <label className="form-label font-semibold text-white/90 mb-3 flex items-center gap-2">
                                    Shipping Details <span className="text-primary text-xs">*</span>
                                </label>
                                <textarea
                                    className="form-textarea min-h-[100px] bg-surface border-white/10 focus:bg-background/80 shadow-inner rounded-2xl text-base"
                                    placeholder="Enter full delivery address, apartment, suite, etc..."
                                    value={address}
                                    onChange={e => setAddress(e.target.value)}
                                ></textarea>
                            </div>

                            <button
                                onClick={handleCheckout}
                                disabled={placingOrder}
                                className="btn btn-primary w-full py-4 text-lg shadow-[0_0_30px_rgba(139,92,246,0.2)] hover:shadow-[0_0_40px_rgba(236,72,153,0.4)] flex justify-center items-center gap-3 rounded-2xl relative overflow-hidden group"
                            >
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out z-0"></div>
                                <span className="relative z-10 flex items-center gap-2 font-bold tracking-wide">
                                    {placingOrder ? 'Processing...' : (
                                        <>Complete Checkout <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></>
                                    )}
                                </span>
                            </button>

                            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray/70">
                                <ShieldCheck size={16} className="text-success/70" />
                                Secure Checkout with Cash on Delivery
                            </div>

                            {!user && (
                                <div className="mt-6 p-4 bg-danger/10 border border-danger/20 rounded-xl text-center text-sm text-danger/90 animate-pulse">
                                    Please <Link to="/login" className="font-bold underline">log in</Link> to complete your purchase.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
