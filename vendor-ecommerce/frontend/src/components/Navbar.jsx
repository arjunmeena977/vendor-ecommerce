import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/userStore';
import { useCartStore } from '../store/cartStore';
import { ShoppingCart, User as UserIcon, LogOut, PackageSearch, ShieldCheck } from 'lucide-react';

export default function Navbar() {
    const { user, logout } = useUserStore();
    const { cartItems } = useCartStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        useCartStore.getState().reloadCart();
        navigate('/login');
    };

    return (
        <nav className="glass-nav border-b border-white/5 bg-background/60 backdrop-blur-xl">
            <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-4">
                <Link to="/" className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2 hover:opacity-80 transition-opacity shrink-0">
                    <span className="bg-gradient-to-br from-primary to-secondary text-transparent bg-clip-text font-black text-2xl md:text-3xl">L</span>
                    <span className="font-semibold tracking-wide hidden sm:block">LuxeMarket</span>
                </Link>

                <div className="flex items-center gap-3 md:gap-8 overflow-x-auto no-scrollbar py-2">
                    <Link to="/" className="text-sm font-medium text-gray hover:text-white transition-colors">Shop</Link>

                    {user?.role === 'ADMIN' && (
                        <Link to="/admin" className="text-sm font-medium text-primary hover:text-white transition-colors flex items-center gap-1.5">
                            <ShieldCheck size={18} /> Admin
                        </Link>
                    )}

                    {user?.role === 'VENDOR' && (
                        <Link to="/vendor" className="text-sm font-medium text-secondary hover:text-white transition-colors flex items-center gap-1.5">
                            <PackageSearch size={18} /> Dashboard
                        </Link>
                    )}

                    <Link to="/cart" className="relative text-gray hover:text-white transition-colors group">
                        <ShoppingCart size={22} className="group-hover:scale-110 transition-transform" />
                        {cartItems.length > 0 && (
                            <span className="absolute -top-2 -right-2 bg-gradient-to-r from-primary to-secondary text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center shadow-lg shadow-primary/30">
                                {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                            </span>
                        )}
                    </Link>

                    {user && (
                        <Link to="/orders" className="text-sm font-medium text-gray hover:text-white transition-colors">
                            Orders
                        </Link>
                    )}

                    <div className="h-8 w-px bg-white/10"></div>

                    {user ? (
                        <div className="flex items-center gap-3 md:gap-5 shrink-0">
                            <span className="text-xs md:text-sm font-medium text-white flex items-center gap-1.5 md:gap-2 bg-white/5 py-1.5 px-3 rounded-full border border-white/5 whitespace-nowrap">
                                <UserIcon size={16} className="text-primary hidden md:block" /> {user.name.split(' ')[0]}
                            </span>
                            <button onClick={handleLogout} className="text-sm text-gray hover:text-danger transition-colors flex items-center gap-1.5 p-2 rounded-full hover:bg-danger/10">
                                <LogOut size={18} />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3 md:gap-4 shrink-0">
                            <Link to="/login" className="text-sm font-medium text-gray hover:text-white transition-colors whitespace-nowrap">Log In</Link>
                            <Link to="/register" className="btn btn-primary text-xs md:text-sm py-1.5 md:py-2 px-4 md:px-6 rounded-full font-semibold whitespace-nowrap">Sign Up</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
