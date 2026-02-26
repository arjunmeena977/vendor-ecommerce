import React, { useEffect, useState } from 'react';
import { useUserStore, api } from '../store/userStore';

export default function AdminDashboard() {
    const { user } = useUserStore();
    const [activeTab, setActiveTab] = useState('VENDORS');
    const [vendors, setVendors] = useState([]);
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        try {
            if (activeTab === 'VENDORS') {
                const { data } = await api.get('/admin/vendors');
                setVendors(data);
            } else if (activeTab === 'PRODUCTS') {
                const { data } = await api.get('/admin/products');
                setProducts(data);
            } else {
                const { data } = await api.get('/admin/orders');
                setOrders(data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleVendorAction = async (id, action) => {
        try {
            await api.patch(`/admin/vendors/${id}/${action}`);
            fetchData();
        } catch (error) {
            alert(`Error trying to ${action} vendor`);
        }
    };

    return (
        <div className="dashboard-layout animate-fade-in bg-background relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-danger/5 rounded-full blur-3xl pointer-events-none -z-10 -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none -z-10 translate-x-1/3 translate-y-1/3"></div>

            <div className="sidebar border-r border-white/5 bg-surface/40 backdrop-blur-2xl relative z-10 shadow-2xl">
                <div className="px-8 mb-10 mt-4 relative">
                    <h2 className="text-xs uppercase tracking-widest text-danger font-bold mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-danger animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]"></span> Admin
                    </h2>
                    <div className="text-2xl font-black text-white truncate drop-shadow-md">{user?.name}</div>
                </div>
                <div className="sidebar-nav px-4 space-y-2">
                    <button onClick={() => setActiveTab('VENDORS')} className={`sidebar-link w-full text-left py-3.5 px-5 rounded-xl transition-all duration-300 ${activeTab === 'VENDORS' ? 'bg-danger/10 text-white border border-danger/20 shadow-[0_0_15px_rgba(239,68,68,0.1)] font-semibold' : 'text-gray hover:text-white hover:bg-white/5 border border-transparent'}`}>Manage Vendors</button>
                    <button onClick={() => setActiveTab('PRODUCTS')} className={`sidebar-link w-full text-left py-3.5 px-5 rounded-xl transition-all duration-300 ${activeTab === 'PRODUCTS' ? 'bg-danger/10 text-white border border-danger/20 shadow-[0_0_15px_rgba(239,68,68,0.1)] font-semibold' : 'text-gray hover:text-white hover:bg-white/5 border border-transparent'}`}>All Products</button>
                    <button onClick={() => setActiveTab('ORDERS')} className={`sidebar-link w-full text-left py-3.5 px-5 rounded-xl transition-all duration-300 ${activeTab === 'ORDERS' ? 'bg-danger/10 text-white border border-danger/20 shadow-[0_0_15px_rgba(239,68,68,0.1)] font-semibold' : 'text-gray hover:text-white hover:bg-white/5 border border-transparent'}`}>Global Orders</button>
                </div>
            </div>

            <div className="dashboard-content relative z-10">
                <div className="mb-10 bg-surface/30 p-6 rounded-3xl border border-white/5 backdrop-blur-md shadow-lg inline-block w-full">
                    <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-white flex items-center gap-3">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray/50">
                            {activeTab === 'VENDORS' ? 'Vendor Management' : activeTab === 'PRODUCTS' ? 'Platform Catalog' : 'Platform Operations'}
                        </span>
                    </h1>
                </div>

                {activeTab === 'VENDORS' && (
                    <div className="card overflow-hidden border-t-white/10 border-l-white/10 shadow-2xl bg-surface/60 backdrop-blur-xl animate-slide-up">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-surfaceLight/40">
                                        <th className="py-5 px-6 font-semibold text-gray/90 tracking-wider">Vendor Info</th>
                                        <th className="py-5 px-6 font-semibold text-gray/90 tracking-wider">Joined At</th>
                                        <th className="py-5 px-6 font-semibold text-gray/90 tracking-wider">Status</th>
                                        <th className="py-5 px-6 font-semibold text-gray/90 tracking-wider text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {vendors.map(v => (
                                        <tr key={v._id} className="hover:bg-white/[0.02] transition-colors">
                                            <td className="px-6 py-5">
                                                <div className="font-semibold text-white/90 text-lg mb-1">{v.name}</div>
                                                <div className="text-sm text-gray/70 flex items-center gap-1.5">{v.email}</div>
                                            </td>
                                            <td className="px-6 py-5 text-gray/80 text-sm font-medium">{new Date(v.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                                            <td className="px-6 py-5">
                                                <span className={`px-3 py-1.5 rounded-full text-xs font-bold border tracking-wide uppercase shadow-sm flex inline-flex items-center gap-2 ${v.vendorStatus === 'APPROVED' ? 'bg-success/10 text-success border-success/20 shadow-success/10' :
                                                    v.vendorStatus === 'REJECTED' ? 'bg-danger/10 text-danger border-danger/20 shadow-danger/10' :
                                                        'bg-yellow-500/10 text-yellow-500 border-yellow-500/20 shadow-yellow-500/10'
                                                    }`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full ${v.vendorStatus === 'APPROVED' ? 'bg-success' : v.vendorStatus === 'REJECTED' ? 'bg-danger' : 'bg-yellow-500 animate-pulse'}`}></div>
                                                    {v.vendorStatus}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-right flex items-center justify-end gap-3 h-full pt-6">
                                                {v.vendorStatus !== 'APPROVED' && (
                                                    <button onClick={() => handleVendorAction(v._id, 'approve')} className="btn bg-success/10 border border-success/20 text-success hover:bg-success/20 text-sm py-2 px-5 shadow-sm transition-all font-semibold">Approve</button>
                                                )}
                                                {v.vendorStatus !== 'REJECTED' && (
                                                    <button onClick={() => handleVendorAction(v._id, 'reject')} className="btn bg-danger/10 border border-danger/20 text-danger hover:bg-danger/20 text-sm py-2 px-5 shadow-sm transition-all font-semibold">Reject</button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {vendors.length === 0 && <tr><td colSpan="5" className="text-center py-16 text-gray/80 text-lg">No vendors registered yet.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Detailed view for Admin Products */}
                {activeTab === 'PRODUCTS' && (
                    <div className="card overflow-hidden border-t-white/10 border-l-white/10 shadow-2xl bg-surface/60 backdrop-blur-xl animate-fade-in">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-surfaceLight/40">
                                        <th className="py-5 px-6 font-semibold text-gray/90 tracking-wider">Product</th>
                                        <th className="py-5 px-6 font-semibold text-gray/90 tracking-wider">Vendor</th>
                                        <th className="py-5 px-6 font-semibold text-gray/90 tracking-wider">Price</th>
                                        <th className="py-5 px-6 font-semibold text-gray/90 tracking-wider">Stock</th>
                                        <th className="py-5 px-6 font-semibold text-gray/90 tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {products.map(p => (
                                        <tr key={p._id} className="hover:bg-white/[0.02] transition-colors">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-xl border border-white/10 shrink-0 bg-surfaceLight overflow-hidden">
                                                        {p.imageUrl ? <img src={p.imageUrl.startsWith('/uploads') ? `http://localhost:5000${p.imageUrl}` : p.imageUrl} alt={p.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[8px] text-gray/50">No Img</div>}
                                                    </div>
                                                    <div className="font-semibold text-white/90 truncate max-w-[200px]">{p.title}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="text-sm font-medium text-white/80">{p.vendor?.name || 'Unknown'}</div>
                                                <div className="text-xs text-gray/60">{p.vendor?.email}</div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary text-lg">
                                                    ₹{p.price.toFixed(2)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className={`px-3 py-1 bg-surfaceLight border border-white/5 rounded-lg font-medium ${p.stock <= 5 ? 'text-danger' : 'text-gray'}`}>{p.stock}</span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${p.isActive ? 'bg-success/20 text-success' : 'bg-gray/20 text-gray'}`}>
                                                    {p.isActive ? 'Active' : 'Hidden'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {products.length === 0 && <tr><td colSpan="5" className="text-center py-16 text-gray/80 text-lg">No products found on the platform.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Detailed view for Admin Orders */}
                {activeTab === 'ORDERS' && (
                    <div className="card overflow-hidden border-t-white/10 border-l-white/10 shadow-2xl bg-surface/60 backdrop-blur-xl animate-fade-in">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-surfaceLight/40">
                                        <th className="py-5 px-6 font-semibold text-gray/90 tracking-wider">Order ID</th>
                                        <th className="py-5 px-6 font-semibold text-gray/90 tracking-wider">Customer</th>
                                        <th className="py-5 px-6 font-semibold text-gray/90 tracking-wider">Vendor</th>
                                        <th className="py-5 px-6 font-semibold text-gray/90 tracking-wider">Total</th>
                                        <th className="py-5 px-6 font-semibold text-gray/90 tracking-wider">Status</th>
                                        <th className="py-5 px-6 font-semibold text-gray/90 tracking-wider">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {orders.map(o => (
                                        <tr key={o._id} className="hover:bg-white/[0.02] transition-colors">
                                            <td className="px-6 py-5 font-mono text-xs text-gray/70">{o._id}</td>
                                            <td className="px-6 py-5">
                                                <div className="text-sm font-medium text-white/80">{o.user?.name || 'Unknown'}</div>
                                                <div className="text-xs text-gray/60">{o.user?.email}</div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="text-sm text-gray/90">{o.vendor?.name || 'Unknown'}</div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary text-base">
                                                    ₹{o.totalAmount.toFixed(2)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold border tracking-wide uppercase shadow-sm flex inline-flex items-center gap-1.5 ${o.status === 'DELIVERED' ? 'bg-success/10 text-success border-success/20 shadow-success/10' :
                                                    o.status === 'SHIPPED' ? 'bg-primary/10 text-primary border-primary/20 shadow-primary/10' :
                                                        'bg-yellow-500/10 text-yellow-500 border-yellow-500/20 shadow-yellow-500/10'
                                                    }`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full ${o.status === 'DELIVERED' ? 'bg-success' : o.status === 'SHIPPED' ? 'bg-primary' : 'bg-yellow-500 animate-pulse'}`}></div>
                                                    {o.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-gray text-sm">
                                                {new Date(o.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                    {orders.length === 0 && <tr><td colSpan="6" className="text-center py-16 text-gray/80 text-lg">No orders found on the platform.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
