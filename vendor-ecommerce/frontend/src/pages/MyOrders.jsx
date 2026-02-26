import React, { useEffect, useState } from 'react';
import { useUserStore, api } from '../store/userStore';
import { Package, Clock, CheckCircle2, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MyOrders() {
    const { user } = useUserStore();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchOrders();
        }
    }, [user]);

    const fetchOrders = async () => {
        try {
            const { data } = await api.get('/user/orders');
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="container py-20 flex justify-center">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="container py-20 flex flex-col items-center justify-center animate-fade-in">
                <Package size={64} className="text-gray/50 mb-6" />
                <h2 className="text-2xl font-bold mb-2 text-white">No Orders Yet</h2>
                <p className="text-gray mb-8">You haven't placed any orders on LuxeMarket yet.</p>
                <Link to="/" className="btn btn-primary px-8">Start Shopping</Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 animate-fade-in relative">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none -z-10"></div>

            <div className="flex items-center gap-4 mb-10">
                <div className="bg-primary/20 p-3 rounded-2xl">
                    <Package size={28} className="text-primary" />
                </div>
                <h1 className="text-4xl font-bold tracking-tight text-white">My Orders</h1>
            </div>

            <div className="space-y-6">
                {orders.map(order => (
                    <div key={order._id} className="card p-6 shadow-xl border-t-white/10 border-l-white/10 bg-surface/60 backdrop-blur-xl">
                        <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 mb-6 pb-6 border-b border-white/5">
                            <div>
                                <p className="text-sm font-semibold text-gray mb-1">Order ID</p>
                                <p className="font-mono text-white/90">{order._id}</p>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray mb-1">Date Placed</p>
                                <p className="text-white/90">{new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray mb-1">Total</p>
                                <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">₹{order.totalAmount.toFixed(2)}</p>
                            </div>
                            <div className="lg:text-right">
                                <p className="text-sm font-semibold text-gray mb-1">Status</p>
                                <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold border shadow-sm ${order.status === 'DELIVERED' ? 'bg-success/10 text-success border-success/20 shadow-success/10' :
                                        order.status === 'SHIPPED' ? 'bg-primary/10 text-primary border-primary/20 shadow-primary/10' :
                                            'bg-yellow-500/10 text-yellow-500 border-yellow-500/20 shadow-yellow-500/10'
                                    }`}>
                                    {order.status === 'DELIVERED' && <CheckCircle2 size={16} />}
                                    {order.status === 'SHIPPED' && <Truck size={16} />}
                                    {order.status === 'PENDING' && <Clock size={16} className="animate-spin-slow" />}
                                    {order.status}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {order.items.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-4 p-4 rounded-xl bg-surfaceLight/30 border border-white/5 group">
                                    <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-surfaceLight relative">
                                        {item.product?.imageUrl ? (
                                            <img src={item.product.imageUrl.startsWith('/uploads') ? `http://localhost:5000${item.product.imageUrl}` : item.product.imageUrl} alt={item.product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-[10px] text-gray/50">No Img</div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-white truncate mb-1">{item.product?.title || 'Unknown Product'}</p>
                                        <p className="text-sm text-gray">Qty: <span className="text-white font-medium">{item.qty}</span></p>
                                    </div>
                                    <div className="font-bold text-white/90 shrink-0">
                                        ₹{item.priceAtPurchase.toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
