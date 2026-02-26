import React, { useEffect, useState } from 'react';
import { useUserStore, api } from '../store/userStore';

export default function VendorDashboard() {
    const { user } = useUserStore();
    const [activeTab, setActiveTab] = useState('PRODUCTS');

    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);

    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ id: null, title: '', description: '', price: '', stock: '', imageUrl: '' });

    useEffect(() => {
        if (user?.vendorStatus === 'APPROVED') {
            fetchData();
        }
    }, [user, activeTab]);

    const fetchData = async () => {
        try {
            if (activeTab === 'PRODUCTS') {
                const { data } = await api.get('/vendor/products');
                setProducts(data);
            } else {
                const { data } = await api.get('/vendor/orders');
                setOrders(data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('price', formData.price);
            data.append('stock', formData.stock);

            if (formData.image) {
                data.append('image', formData.image);
            }

            if (formData.id) {
                await api.put(`/vendor/products/${formData.id}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await api.post('/vendor/products', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            setShowForm(false);
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || 'Error saving product');
        }
    };

    const deleteProduct = async (id) => {
        if (window.confirm('Delete this product?')) {
            try {
                await api.delete(`/vendor/products/${id}`);
                fetchData();
            } catch (error) {
                alert('Error deleting product');
            }
        }
    };

    const updateOrderStatus = async (id, status) => {
        try {
            await api.patch(`/vendor/orders/${id}/status`, { status });
            fetchData();
        } catch (error) {
            alert('Error updating order');
        }
    };

    if (user?.vendorStatus === 'PENDING') {
        return (
            <div className="container mx-auto px-4 py-20 text-center animate-fade-in">
                <div className="card max-w-lg mx-auto p-12 bg-yellow-500/10 border-yellow-500/20">
                    <h2 className="text-3xl font-bold text-yellow-500 mb-4">Approval Pending</h2>
                    <p className="text-gray/80 text-lg">Your vendor account is under review by our administrators. Check back later.</p>
                </div>
            </div>
        );
    }

    if (user?.vendorStatus === 'REJECTED') {
        return (
            <div className="container mx-auto px-4 py-20 text-center animate-fade-in">
                <div className="card max-w-lg mx-auto p-12 bg-danger/10 border-danger/20">
                    <h2 className="text-3xl font-bold text-danger mb-4">Application Rejected</h2>
                    <p className="text-gray/80 text-lg">Unfortunately, your vendor application was not approved.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-layout animate-fade-in bg-background relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-secondary/5 rounded-full blur-3xl pointer-events-none -z-10"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none -z-10 -translate-x-1/2"></div>

            <div className="sidebar border-r border-white/5 bg-surface/40 backdrop-blur-2xl relative z-10 shadow-2xl">
                <div className="px-8 mb-10 mt-4 relative">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-premium opacity-50 z-0 pointer-events-none"></div>
                    <h2 className="text-xs uppercase tracking-widest text-primary font-bold mb-3 relative z-10 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span> Vendor Panel
                    </h2>
                    <div className="text-2xl font-black text-white truncate relative z-10 drop-shadow-md">{user?.name}</div>
                </div>
                <div className="sidebar-nav px-4 space-y-2">
                    <button onClick={() => setActiveTab('PRODUCTS')} className={`sidebar-link w-full text-left py-3.5 px-5 rounded-xl transition-all duration-300 ${activeTab === 'PRODUCTS' ? 'bg-primary/20 text-white border border-primary/30 shadow-[0_0_15px_rgba(139,92,246,0.15)] font-semibold' : 'text-gray hover:text-white hover:bg-white/5 border border-transparent'}`}>
                        Manage Products
                    </button>
                    <button onClick={() => setActiveTab('ORDERS')} className={`sidebar-link w-full text-left py-3.5 px-5 rounded-xl transition-all duration-300 ${activeTab === 'ORDERS' ? 'bg-primary/20 text-white border border-primary/30 shadow-[0_0_15px_rgba(139,92,246,0.15)] font-semibold' : 'text-gray hover:text-white hover:bg-white/5 border border-transparent'}`}>
                        Customer Orders
                    </button>
                </div>
            </div>

            <div className="dashboard-content relative z-10">
                <div className="flex justify-between items-center mb-6 md:mb-10 bg-surface/30 p-5 md:p-6 rounded-3xl border border-white/5 backdrop-blur-md shadow-lg flex-wrap gap-4">
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-white flex items-center gap-4">
                        {activeTab === 'PRODUCTS' ? 'Your Products' : 'Customer Orders'}
                    </h1>
                    {activeTab === 'PRODUCTS' && !showForm && (
                        <button onClick={() => {
                            setFormData({ id: null, title: '', description: '', price: '', stock: '', image: null });
                            setShowForm(true);
                        }} className="btn btn-primary px-4 md:px-6 py-2.5 md:py-3 font-semibold shadow-lg shadow-primary/20 relative overflow-hidden group">
                            <span className="relative z-10 flex items-center gap-2">Add New Product</span>
                        </button>
                    )}
                </div>

                {/* Mobile Navigation */}
                <div className="md:hidden flex overflow-x-auto gap-3 pb-2 mb-6 -mt-2 no-scrollbar">
                    <button onClick={() => setActiveTab('PRODUCTS')} className={`whitespace-nowrap py-2 px-5 rounded-xl font-semibold text-sm transition-all ${activeTab === 'PRODUCTS' ? 'bg-primary/20 text-white border border-primary/30 shadow-lg shadow-primary/10' : 'bg-surfaceLight text-gray border border-white/5'}`}>Manage Products</button>
                    <button onClick={() => setActiveTab('ORDERS')} className={`whitespace-nowrap py-2 px-5 rounded-xl font-semibold text-sm transition-all ${activeTab === 'ORDERS' ? 'bg-primary/20 text-white border border-primary/30 shadow-lg shadow-primary/10' : 'bg-surfaceLight text-gray border border-white/5'}`}>Customer Orders</button>
                </div>

                {activeTab === 'PRODUCTS' && showForm && (
                    <div className="card max-w-3xl mb-8 animate-slide-up border-t-white/10 border-l-white/10 shadow-2xl overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
                        <div className="card-header flex justify-between bg-surfaceLight/50 border-b border-white/5 py-5 px-8 backdrop-blur-md">
                            <span className="font-bold text-xl text-white">{formData.id ? 'Edit Product' : 'Create New Product'}</span>
                            <button onClick={() => setShowForm(false)} className="text-sm font-medium text-gray hover:text-white px-3 py-1 rounded-full hover:bg-white/10 transition-colors">Cancel</button>
                        </div>
                        <div className="p-8 relative z-10">
                            <form onSubmit={handleFormSubmit} className="space-y-6">
                                <div className="form-group">
                                    <label className="form-label font-medium text-gray/80">Product Title</label>
                                    <input type="text" required className="form-input bg-background/50 border-white/10 focus:bg-background shadow-inner" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="E.g., Premium Leather Bag" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label font-medium text-gray/80">Description</label>
                                    <textarea required className="form-textarea bg-background/50 border-white/10 focus:bg-background shadow-inner min-h-[150px]" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Detailed description of the product..." />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="form-group">
                                        <label className="form-label font-medium text-gray/80">Price (₹)</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray font-bold">₹</span>
                                            <input type="number" step="0.01" required className="form-input pl-10 bg-background/50 border-white/10 focus:bg-background shadow-inner text-lg" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} placeholder="0.00" />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label font-medium text-gray/80">Initial Stock</label>
                                        <input type="number" required className="form-input bg-background/50 border-white/10 focus:bg-background shadow-inner text-lg" value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} placeholder="10" />
                                    </div>
                                </div>
                                <div className="form-group mb-8">
                                    <label className="form-label font-medium text-gray/80">Product Image Upload</label>
                                    <input type="file" accept="image/*" className="form-input bg-background/50 border-white/10 focus:bg-background shadow-inner file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/20 file:text-primary hover:file:bg-primary/30 transition-all cursor-pointer" onChange={e => setFormData({ ...formData, image: e.target.files[0] })} />
                                </div>
                                <button type="submit" className="btn btn-primary w-full md:w-auto px-10 py-4 text-base shadow-[0_0_20px_rgba(139,92,246,0.2)] hover:shadow-[0_0_30px_rgba(236,72,153,0.3)]">
                                    {formData.id ? 'Save Changes' : 'Publish Product'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {activeTab === 'PRODUCTS' && !showForm && (
                    <div className="card overflow-hidden border-t-white/10 border-l-white/10 shadow-2xl bg-surface/60 backdrop-blur-xl">
                        <div className="overflow-x-auto w-full">
                            <table className="w-full min-w-[800px]">
                                <thead>
                                    <tr className="bg-surfaceLight/40">
                                        <th className="py-5 px-6 font-semibold text-gray/90 tracking-wider">Image</th>
                                        <th className="py-5 px-6 font-semibold text-gray/90 tracking-wider w-1/3">Title</th>
                                        <th className="py-5 px-6 font-semibold text-gray/90 tracking-wider">Price</th>
                                        <th className="py-5 px-6 font-semibold text-gray/90 tracking-wider">Stock</th>
                                        <th className="py-5 px-6 font-semibold text-gray/90 tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {products.length === 0 ? (
                                        <tr><td colSpan="5" className="text-center py-16 text-gray/80 text-lg">No products found. Start adding some to your catalog!</td></tr>
                                    ) : products.map(p => (
                                        <tr key={p._id} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="w-24 px-6 py-4">
                                                <div className="w-16 h-16 rounded-xl bg-surfaceLight border border-white/5 overflow-hidden shadow-inner flex items-center justify-center">
                                                    {p.imageUrl ? <img src={p.imageUrl.startsWith('/uploads') ? `http://localhost:5000${p.imageUrl}` : p.imageUrl} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" /> : <span className="text-xs text-gray/50">No img</span>}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-white/90 text-lg line-clamp-2">{p.title}</td>
                                            <td className="px-6 py-4">
                                                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary text-lg">
                                                    ₹{p.price.toFixed(2)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 bg-surfaceLight border border-white/5 rounded-lg font-medium ${p.stock <= 5 ? 'text-danger' : 'text-gray'}`}>{p.stock}</span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-3">
                                                    <button onClick={() => {
                                                        setFormData({ id: p._id, title: p.title, description: p.description, price: p.price, stock: p.stock, imageUrl: p.imageUrl || '' });
                                                        setShowForm(true);
                                                    }} className="btn bg-surfaceLight border border-white/10 hover:border-white/20 text-white text-sm py-2 px-4 shadow-sm hover:shadow-md transition-all">Edit</button>
                                                    <button onClick={() => deleteProduct(p._id)} className="btn bg-danger/10 hover:bg-danger/20 border border-danger/20 text-danger text-sm py-2 px-4 transition-all">Delete</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'ORDERS' && (
                    <div className="card overflow-hidden border-t-white/10 border-l-white/10 shadow-2xl bg-surface/60 backdrop-blur-xl">
                        <div className="overflow-x-auto w-full">
                            <table className="w-full min-w-[900px]">
                                <thead>
                                    <tr className="bg-surfaceLight/40">
                                        <th className="py-5 px-6 font-semibold text-gray/90 tracking-wider">Order ID</th>
                                        <th className="py-5 px-6 font-semibold text-gray/90 tracking-wider">Customer Info</th>
                                        <th className="py-5 px-6 font-semibold text-gray/90 tracking-wider">Total</th>
                                        <th className="py-5 px-6 font-semibold text-gray/90 tracking-wider">Status</th>
                                        <th className="py-5 px-6 font-semibold text-gray/90 tracking-wider">Shipping Address</th>
                                        <th className="py-5 px-6 font-semibold text-gray/90 tracking-wider text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {orders.length === 0 ? (
                                        <tr><td colSpan="6" className="text-center py-16 text-gray/80 text-lg">You haven't received any orders yet.</td></tr>
                                    ) : orders.map(o => (
                                        <tr key={o._id} className="hover:bg-white/[0.02] transition-colors">
                                            <td className="px-6 py-5 text-sm text-gray/70 font-mono tracking-wider bg-black/10">#{o._id.substring(0, 8)}</td>
                                            <td className="px-6 py-5">
                                                <div className="font-semibold text-white/90 mb-0.5">{o.user?.name}</div>
                                                <div className="text-xs text-gray/70 flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-primary/50"></div>{o.user?.email}</div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary text-lg">
                                                    ₹{o.totalAmount.toFixed(2)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold border tracking-wide uppercase shadow-sm ${o.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20 shadow-yellow-500/10' :
                                                    o.status === 'SHIPPED' ? 'bg-primary/10 text-primary border-primary/20 shadow-primary/10' :
                                                        'bg-success/10 text-success border-success/20 shadow-success/10'
                                                    }`}>
                                                    {o.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-sm max-w-[200px] truncate text-gray/80 font-light" title={o.address}>{o.address}</td>
                                            <td className="px-6 py-5 text-right">
                                                <select
                                                    className="form-select w-36 py-2 text-sm bg-surfaceLight border-white/10 focus:border-primary/50 text-white font-medium shadow-inner"
                                                    value={o.status}
                                                    onChange={(e) => updateOrderStatus(o._id, e.target.value)}
                                                >
                                                    <option value="PENDING">Pending</option>
                                                    <option value="SHIPPED">Shipped</option>
                                                    <option value="DELIVERED">Delivered</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
