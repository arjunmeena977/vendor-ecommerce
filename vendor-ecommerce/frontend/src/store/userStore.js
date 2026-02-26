import { create } from 'zustand';
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
});

// Configure Axios to automatically attach JWT token
api.interceptors.request.use((config) => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');
    if (userInfo && userInfo.token) {
        config.headers.Authorization = `Bearer ${userInfo.token}`;
    }
    return config;
});

export { api };

const IS_DEMO_MODE = true;

if (IS_DEMO_MODE) {
    console.warn('RUNNING IN DEMO MODE. ALL API CALLS ARE MOCKED.');

    // We'll dynamically import demoData to avoid circular dependencies or loading it unnecessarily in production
    import('./demoData.js').then(demoData => {
        const mockAdapter = (config) => {
            return new Promise((resolve, reject) => {
                setTimeout(() => { // Simulate network delay
                    const url = config.url;
                    const method = config.method.toUpperCase();

                    try {
                        let responseData = null;

                        // Authentication
                        if (url.includes('/auth/login') && method === 'POST') {
                            const { email, password } = JSON.parse(config.data);
                            const user = demoData.demoUsers.find(u => u.email === email);
                            if (user && password) {
                                responseData = user;
                            } else {
                                return reject({ response: { data: { message: 'Invalid credentials' } } });
                            }
                        }
                        else if (url.includes('/auth/register') && method === 'POST') {
                            const { name, email, password, role } = JSON.parse(config.data);
                            responseData = { _id: 'new_demo_user', name, email, role, token: 'demo_token' };
                        }

                        // User / Public
                        else if (url.includes('/user/products') && method === 'GET') {
                            if (url.includes('keyword=')) {
                                const keyword = new URLSearchParams(url.split('?')[1]).get('keyword').toLowerCase();
                                responseData = demoData.demoProducts.filter(p => p.title.toLowerCase().includes(keyword) || p.description.toLowerCase().includes(keyword));
                            } else {
                                responseData = demoData.demoProducts;
                            }
                        }
                        else if (url.includes('/user/products/') && method === 'GET') {
                            const id = url.split('/').pop();
                            const product = demoData.demoProducts.find(p => p._id === id);
                            if (product) responseData = product;
                            else return reject({ response: { status: 404, data: { message: 'Product not found' } } });
                        }
                        else if (url.includes('/user/orders') && method === 'POST') {
                            responseData = { message: 'Order created successfully (Demo Mode)' };
                        }
                        else if (url.includes('/user/orders') && method === 'GET') {
                            const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');
                            responseData = demoData.demoOrders.filter(o => o.user._id === userInfo?._id);
                            if (!responseData.length && userInfo?.role === 'CUSTOMER') {
                                // Fallback mock for customer
                                responseData = demoData.demoOrders.filter(o => o.user.email === 'customer@luxe.com');
                            }
                        }

                        // Vendor
                        else if (url.includes('/vendor/products') && method === 'GET') {
                            responseData = demoData.demoProducts;
                        }
                        else if (url.includes('/vendor/products') && method === 'POST') {
                            responseData = { message: 'Product added (Demo Mode)' };
                        }
                        else if (url.includes('/vendor/products/') && method === 'PUT') {
                            responseData = { message: 'Product updated (Demo Mode)' };
                        }
                        else if (url.includes('/vendor/products/') && method === 'DELETE') {
                            responseData = { message: 'Product deleted (Demo Mode)' };
                        }
                        else if (url.includes('/vendor/orders') && method === 'GET') {
                            responseData = demoData.demoOrders;
                        }
                        else if (url.includes('/vendor/orders/') && method === 'PATCH') {
                            responseData = { message: 'Order status updated (Demo Mode)' };
                        }

                        // Admin
                        else if (url.includes('/admin/stats') && method === 'GET') {
                            responseData = demoData.demoAdminStats;
                        }
                        else if (url.includes('/admin/vendors/pending') && method === 'GET') {
                            responseData = demoData.demoPendingVendors;
                        }
                        else if (url.includes('/admin/vendors') && method === 'GET') {
                            // Filter users who have role VENDOR
                            responseData = demoData.demoUsers.filter(u => u.role === 'VENDOR');
                            // Add pending vendors to the list for the admin to see
                            responseData = [...responseData, ...demoData.demoPendingVendors];
                        }
                        else if (url.includes('/admin/vendors/') && method === 'PATCH') {
                            responseData = { message: 'Vendor status updated (Demo Mode)' };
                        }
                        else if (url.includes('/admin/products') && method === 'GET') {
                            responseData = demoData.demoProducts;
                        }
                        else if (url.includes('/admin/orders') && method === 'GET') {
                            responseData = demoData.demoOrders;
                        }

                        else {
                            console.warn(`Unmocked API call: ${method} ${url}`);
                            responseData = []; // Default safe response
                        }

                        resolve({ data: responseData, status: 200 });
                    } catch (err) {
                        console.error('Demo Mock Error:', err);
                        reject(err);
                    }
                }, 400); // 400ms delay to feel realistic
            });
        };

        // Override the default adapter
        api.defaults.adapter = mockAdapter;
    });
}

export const useUserStore = create((set) => ({
    user: JSON.parse(localStorage.getItem('userInfo') || 'null'),
    login: async (email, password) => {
        try {
            const { data } = await api.post('/auth/login', { email, password });
            localStorage.setItem('userInfo', JSON.stringify(data));
            set({ user: data });
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || error.message };
        }
    },
    register: async (name, email, password, role) => {
        try {
            const { data } = await api.post('/auth/register', { name, email, password, role });
            localStorage.setItem('userInfo', JSON.stringify(data));
            set({ user: data });
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || error.message };
        }
    },
    logout: () => {
        localStorage.removeItem('userInfo');
        set({ user: null });
        window.location.href = '/login';
    }
}));
