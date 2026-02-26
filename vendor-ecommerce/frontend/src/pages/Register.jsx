import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUserStore } from '../store/userStore';
import { useCartStore } from '../store/cartStore';

export default function Register() {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'USER' });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const register = useUserStore(state => state.register);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const result = await register(formData.name, formData.email, formData.password, formData.role);
        if (result.success) {
            useCartStore.getState().reloadCart();
            navigate('/');
        } else {
            setError(result.message);
        }
        setLoading(false);
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4 py-12 relative overflow-hidden animate-fade-in">
            {/* Animated Background Elements */}
            <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-3xl pointer-events-none mix-blend-screen animate-pulse -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-3xl pointer-events-none mix-blend-screen animate-pulse" style={{ animationDelay: '1.5s' }}></div>

            <div className="card max-w-md w-full p-8 relative z-10 animate-slide-up border-t-white/10 border-l-white/10 shadow-2xl">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-white mb-2">Join LuxeMarket</h1>
                    <p className="text-gray text-sm">Create an account to start shopping or selling</p>
                </div>

                {error && (
                    <div className="bg-danger/10 border border-danger/20 text-danger p-4 rounded-xl mb-6 text-sm flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-danger flex-shrink-0"></div>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="form-group mb-2">
                        <label className="form-label">Account Type</label>
                        <select className="form-select bg-surface border-white/5 focus:bg-background/50" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}>
                            <option value="USER">Customer Account</option>
                            <option value="VENDOR">Vendor (Seller) Account</option>
                        </select>
                    </div>
                    <div className="form-group mb-2">
                        <label className="form-label">Full Name</label>
                        <input type="text" required className="form-input bg-surface border-white/5 focus:bg-background/50" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="John Doe" />
                    </div>
                    <div className="form-group mb-2">
                        <label className="form-label">Email Address</label>
                        <input type="email" required className="form-input bg-surface border-white/5 focus:bg-background/50" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="name@example.com" />
                    </div>
                    <div className="form-group mb-8">
                        <label className="form-label">Password</label>
                        <input type="password" required minLength="6" className="form-input bg-surface border-white/5 focus:bg-background/50" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} placeholder="••••••••" />
                        <p className="text-xs text-gray/70 mt-2 ml-1">Must be at least 6 characters</p>
                    </div>

                    <button type="submit" disabled={loading} className="btn btn-primary w-full py-3.5 text-base shadow-xl">
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>

                    <p className="text-center text-sm text-gray mt-8">
                        Already have an account? <Link to="/login" className="text-white hover:text-primary transition-colors font-semibold ml-1">Log in</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
