import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../store/userStore';
import { useCartStore } from '../store/cartStore';
import { ShoppingCart, ArrowLeft, PackageCheck, ShieldCheck } from 'lucide-react';

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [qty, setQty] = useState(1);
    const addToCart = useCartStore(state => state.addToCart);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await api.get(`/user/products/${id}`);
                setProduct(data);
            } catch (error) {
                console.error(error);
            }
            setLoading(false);
        };
        fetchProduct();
    }, [id]);

    if (loading) return <div className="container mx-auto p-8"><div className="h-64 bg-surface/50 animate-pulse rounded-xl"></div></div>;

    if (!product) return (
        <div className="container text-center py-20">
            <h2 className="text-2xl font-bold bg-danger/10 text-danger inline-block px-6 py-3 rounded-lg">Product Not Found</h2>
            <div className="mt-6"><button onClick={() => navigate(-1)} className="btn btn-secondary flex items-center gap-2 mx-auto"><ArrowLeft size={16} /> Go Back</button></div>
        </div>
    );

    const handleAddToCart = () => {
        addToCart(product, qty);
        navigate('/cart');
    };

    return (
        <div className="container mx-auto px-4 py-8 animate-fade-in">
            <button onClick={() => navigate(-1)} className="text-gray hover:text-white flex items-center gap-2 mb-8 transition-colors group">
                <div className="bg-surfaceLight p-2 rounded-full group-hover:bg-primary/20 transition-colors">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                </div>
                Back to Catalog
            </button>

            <div className="card md:grid md:grid-cols-2 gap-0 overflow-hidden border-t-white/10 border-l-white/10 animate-slide-up shadow-2xl">
                {/* Image Section */}
                <div className="bg-surfaceLight/50 relative flex items-center justify-center p-8 min-h-[400px]">
                    <div className="absolute inset-0 bg-gradient-premium opacity-50 pointer-events-none"></div>
                    {product.imageUrl ? (
                        <img src={product.imageUrl.startsWith('/uploads') ? `http://localhost:5000${product.imageUrl}` : product.imageUrl} alt={product.title} className="w-full h-full object-cover rounded-2xl shadow-2xl relative z-10 hover:scale-105 transition-transform duration-700" />
                    ) : (
                        <div className="text-gray/50 text-lg font-medium flex flex-col items-center relative z-10 bg-surface p-12 rounded-3xl border border-white/5 shadow-inner">
                            <PackageCheck size={64} className="mb-6 text-primary/50" />
                            No Image Available
                        </div>
                    )}
                </div>

                {/* Details Section */}
                <div className="flex flex-col justify-center p-8 md:p-12 bg-surface/80 backdrop-blur-md relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>

                    <div className="relative z-10">
                        <div className="badge badge-primary inline-flex mb-6 text-sm py-1.5 px-4"><ShieldCheck size={14} className="mr-1.5" /> Sold by {product.vendor?.name || 'Exclusive Vendor'}</div>
                        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight tracking-tight">{product.title}</h1>
                        <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-8 inline-block">₹{product.price.toFixed(2)}</p>

                        <div className="prose prose-invert border-y border-white/10 py-8 mb-8 text-gray/90 leading-relaxed text-lg font-light">
                            {product.description || "Experience the pinnacle of craftsmanship with this exclusive item, available only at LuxeMarket."}
                        </div>

                        <div className="flex items-center gap-8 mb-10 p-6 bg-surfaceLight/30 rounded-2xl border border-white/5">
                            <div>
                                <span className="block text-sm text-gray font-semibold mb-3 tracking-wide uppercase">Availability</span>
                                {product.stock > 0 ? (
                                    <span className="badge badge-success px-4 py-1.5 text-sm shadow-lg shadow-success/10"><div className="w-1.5 h-1.5 rounded-full bg-success mr-2 animate-pulse"></div> In Stock ({product.stock})</span>
                                ) : (
                                    <span className="badge badge-danger px-4 py-1.5 text-sm"><div className="w-1.5 h-1.5 rounded-full bg-danger mr-2"></div> Out of Stock</span>
                                )}
                            </div>

                            {product.stock > 0 && (
                                <div className="border-l border-white/10 pl-8">
                                    <span className="block text-sm text-gray font-semibold mb-3 tracking-wide uppercase">Quantity</span>
                                    <select
                                        className="form-select w-28 py-2 bg-surface border-white/10 font-medium text-lg text-center"
                                        value={qty}
                                        onChange={(e) => setQty(Number(e.target.value))}
                                    >
                                        {[...Array(Math.min(product.stock, 10)).keys()].map((x) => (
                                            <option key={x + 1} value={x + 1}>{x + 1}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={handleAddToCart}
                            disabled={product.stock === 0}
                            className={`btn w-full py-4 text-lg font-bold flex items-center justify-center gap-3 transition-all duration-300 ${product.stock === 0
                                ? 'bg-surfaceLight text-gray cursor-not-allowed border border-white/5'
                                : 'btn-primary shadow-xl hover:-translate-y-1'
                                }`}
                        >
                            <ShoppingCart size={24} className={product.stock > 0 ? 'animate-bounce' : ''} />
                            {product.stock > 0 ? 'Add to Cart' : 'Currently Unavailable'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
