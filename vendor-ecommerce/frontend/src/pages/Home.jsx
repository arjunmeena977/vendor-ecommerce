import React, { useEffect, useState } from 'react';
import { api } from '../store/userStore';
import { useCartStore } from '../store/cartStore';
import { ShoppingCart, Search, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const addToCart = useCartStore(state => state.addToCart);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const { data } = await api.get(`/user/products${search ? `?keyword=${search}` : ''}`);
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products', error);
            }
            setLoading(false);
        };
        fetchProducts();
    }, [search]);

    const handleSearch = (e) => {
        e.preventDefault();
        // The effect runs automatically because search state updates
    };

    return (
        <div className="container mx-auto px-4 py-8 animate-fade-in">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-3xl bg-surface/30 border border-white/5 p-8 md:p-16 mb-16 mt-6 animate-slide-up">
                <div className="absolute inset-0 bg-gradient-premium pointer-events-none"></div>
                <div className="text-center max-w-3xl mx-auto relative z-10">
                    <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary border border-primary/20 text-sm font-semibold mb-6 tracking-wider uppercase">Welcome to LuxeMarket</span>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white tracking-tight leading-tight">
                        Discover Premium <br />
                        <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">Multi-Vendor Goods</span>
                    </h1>
                    <p className="text-gray text-lg md:text-xl mb-10 max-w-2xl mx-auto font-light">
                        Curated collections from top-rated artisans and vendors worldwide. Experience quality without compromise.
                    </p>

                    <form onSubmit={handleSearch} className="relative max-w-xl mx-auto group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative flex items-center bg-surfaceLight rounded-full p-1 border border-white/10 shadow-2xl">
                            <Search className="text-gray ml-4 mr-2" size={24} />
                            <input
                                type="text"
                                placeholder="Search exclusive products..."
                                className="bg-transparent border-none text-white w-full py-3 px-2 focus:outline-none focus:ring-0 placeholder-gray/50 text-lg"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <button type="submit" className="btn btn-primary rounded-full px-8 py-3">Explore</button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Products Grid */}
            <div className="mb-10 flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Featured Collections</h2>
                    <p className="text-gray mt-2">Handpicked items just for you</p>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                        <div key={n} className="card h-96 animate-pulse bg-surface/40 flex flex-col pt-8">
                            <div className="h-48 bg-white/5 mx-6 rounded-xl mb-4"></div>
                            <div className="h-4 bg-white/5 mx-6 rounded mb-2 w-1/3"></div>
                            <div className="h-6 bg-white/5 mx-6 rounded mb-4 w-3/4"></div>
                            <div className="h-8 bg-white/5 mx-6 rounded mt-auto mb-6"></div>
                        </div>
                    ))}
                </div>
            ) : products.length === 0 ? (
                <div className="text-center py-24 bg-surface/30 rounded-3xl border border-white/5 shadow-2xl">
                    <div className="w-24 h-24 bg-surfaceLight rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                        <ShoppingCart className="text-gray" size={40} />
                    </div>
                    <h3 className="text-2xl font-semibold text-white mb-3">No products found</h3>
                    <p className="text-gray text-lg max-w-md mx-auto">We couldn't find any items matching your search. Try adjusting your filters.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.map((product, index) => (
                        <div key={product._id} className="card group hover:-translate-y-2 transition-all duration-500 flex flex-col" style={{ animationDelay: `${index * 50}ms` }}>
                            <div className="aspect-[4/3] bg-surfaceLight relative overflow-hidden flex-shrink-0">
                                {product.imageUrl ? (
                                    <img src={product.imageUrl.startsWith('/uploads') ? `http://localhost:5000${product.imageUrl}` : product.imageUrl} alt={product.title} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700 ease-in-out opacity-90 group-hover:opacity-100" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray/30 bg-gradient-premium">No Image Available</div>
                                )}
                                <div className="absolute top-4 right-4 bg-surface/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold border border-white/10 shadow-lg">
                                    ₹{product.price.toFixed(2)}
                                </div>
                            </div>
                            <div className="card-body p-6 flex flex-col flex-grow relative border-t border-white/5">
                                <div className="absolute -top-5 left-6 bg-surface border border-white/10 px-3 py-1 rounded-full text-xs text-primary font-semibold shadow-lg backdrop-blur-md flex items-center gap-1">
                                    <ShieldCheck size={12} /> {product.vendor?.name || 'Luxe Vendor'}
                                </div>

                                <h3 className="font-semibold text-xl text-white mb-2 line-clamp-2 mt-2 leading-snug group-hover:text-primary transition-colors">{product.title}</h3>

                                <div className="mt-auto pt-6 flex gap-3">
                                    <Link to={`/product/${product._id}`} className="btn btn-secondary flex-1 text-center py-2.5 text-sm">View Details</Link>
                                    <button
                                        onClick={() => addToCart(product)}
                                        disabled={product.stock <= 0}
                                        className="btn btn-primary flex-1 py-2.5 text-sm flex items-center justify-center gap-2 group/btn"
                                    >
                                        <ShoppingCart size={16} className="group-hover/btn:scale-110 transition-transform" />
                                        {product.stock > 0 ? 'Add' : 'Out'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
