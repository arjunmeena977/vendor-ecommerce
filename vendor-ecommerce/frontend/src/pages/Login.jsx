import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUserStore } from '../store/userStore';
import { useCartStore } from '../store/cartStore';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const login = useUserStore(state => state.login);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const result = await login(email, password);
        if (result.success) {
            useCartStore.getState().reloadCart();
            navigate('/');
        } else {
            setError(result.message);
        }
        setLoading(false);
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4 relative overflow-hidden animate-fade-in">
            {/* Animated Background Elements */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none mix-blend-screen animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl pointer-events-none mix-blend-screen animate-pulse" style={{ animationDelay: '2s' }}></div>

            <div className="card max-w-md w-full p-8 relative z-10 animate-slide-up border-t-white/10 border-l-white/10">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary mb-6 shadow-lg shadow-primary/30">
                        <span className="text-2xl font-black text-white">LM</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
                    <p className="text-gray text-sm">Sign in to your LuxeMarket account</p>
                </div>

                {error && (
                    <div className="bg-danger/10 border border-danger/20 text-danger p-4 rounded-xl mb-6 text-sm flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-danger flex-shrink-0"></div>
                        {error}
                    </div>
                )}

                <div className="mb-6">
                    <p className="text-xs text-center text-gray/70 uppercase tracking-widest font-semibold mb-3">Quick Testing Login</p>
                    <div className="flex gap-2 justify-center">
                        <button onClick={() => { setEmail('admin@luxe.com'); setPassword('admin123'); }} className="text-xs font-semibold py-1.5 px-3 rounded-md bg-surfaceLight border border-white/10 hover:bg-primary/20 hover:text-primary transition-colors hover:border-primary/30 flex-1">Admin</button>
                        <button onClick={() => { setEmail('demovendor@luxe.com'); setPassword('vendor123'); }} className="text-xs font-semibold py-1.5 px-3 rounded-md bg-surfaceLight border border-white/10 hover:bg-secondary/20 hover:text-secondary transition-colors hover:border-secondary/30 flex-1">Vendor</button>
                        <button onClick={() => { setEmail('customer@luxe.com'); setPassword('customer123'); }} className="text-xs font-semibold py-1.5 px-3 rounded-md bg-surfaceLight border border-white/10 hover:bg-success/20 hover:text-success transition-colors hover:border-success/30 flex-1">Customer</button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input type="email" required className="form-input bg-surface border-white/5 focus:bg-background/50" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@example.com" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input type="password" required className="form-input bg-surface border-white/5 focus:bg-background/50" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
                    </div>

                    <div className="flex items-center justify-between mt-2 mb-6">
                        <label className="flex items-center gap-2 text-sm text-gray cursor-pointer">
                            <input type="checkbox" className="rounded border-gray/30 bg-surface text-primary focus:ring-primary/30" />
                            Remember me
                        </label>
                        <a href="#" className="text-sm text-primary hover:text-white transition-colors">Forgot password?</a>
                    </div>

                    <button type="submit" disabled={loading} className="btn btn-primary w-full py-3.5 text-base shadow-xl">
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>

                    <p className="text-center text-sm text-gray mt-8">
                        Don't have an account? <Link to="/register" className="text-white hover:text-primary transition-colors font-semibold ml-1">Create one</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
