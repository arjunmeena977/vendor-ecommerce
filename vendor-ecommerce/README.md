# LuxeMarket: Multi-Vendor E-commerce Platform

A modern, full-stack multi-vendor e-commerce platform built with the MERN stack (MongoDB, Express, React, Node.js). 
This platform allows vendors to register, upload products, and manage their store, while customers can browse and purchase items. It also includes an Admin dashboard for platform moderation.

## 🚀 Features

### Customer Features
* **Authentication**: Secure registration and login.
* **Shopping**: Browse all products, search functionality, detailed product pages.
* **Cart & Checkout**: Add items to cart, dummy checkout flow with delivery address input (Cash on Delivery).
* **Order Tracking**: View past orders and track their delivery status (Pending, Shipped, Delivered).

### Vendor Features
* **Vendor Dashboard**: Dedicated space for vendors to manage their business.
* **Product Management**: Add, edit, or delete products.
* **Image Uploads**: Direct image file uploads for products.
* **Order Management**: View received orders and update their fulfillment status.
* **Analytics**: Simple counters for total products and total sales.

### Admin Features
* **Platform Moderation**: Dedicated Admin Dashboard.
* **Vendor Approval**: Approve or reject new vendor registrations.
* **Catalog View**: View all products across the platform with detailed tables.
* **Global Orders**: View all transactions made across the marketplace.

---

## 🛠️ Technology Stack

* **Frontend**: React (Vite), Tailwind CSS, Zustand (State Management), React Router, Lucide React (Icons), Axios.
* **Backend**: Node.js, Express.js.
* **Database**: MongoDB (Mongoose ORM).
* **Authentication**: JSON Web Tokens (JWT) & bcryptjs.
* **File Uploads**: Multer (Local storage for product images).
ver
---

## ⚙️ Local Setup & Installation

### Prerequisites
1. Ensure you have **Node.js** installed (v16+ recommended).
2. Install **MongoDB** locally (and keep it running) or have a MongoDB Atlas connection string.

### 1. Clone & Install Dependencies
First, open your terminal and navigate to the project folders to install all necessary packages.

**Backend Setup:**
```bash
cd backend
npm install
```

**Frontend Setup:**
```bash
cd frontend
npm install
```

### 2. Configure Environment Variables
In the `backend` folder, ensure you have a `.env` file with the following variables:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/vendor-ecommerce
JWT_SECRET=your_super_secret_jwt_key
```

### 3. Run the Application
You need to run both the backend server and the frontend development server simultaneously.

**Start the Backend (Terminal 1):**
```bash
cd backend
npm run dev
```
*(The backend runs on `http://localhost:5000`)*

**Start the Frontend (Terminal 2):**
```bash
cd frontend
npm run dev
```
*(The frontend runs on `http://localhost:5173`)*

---

## 🧪 Testing Guide

We have included pre-configured demo accounts to make testing easiest. When you visit the Login page (`http://localhost:5173/login`), you will see three "Quick Testing Login" buttons.

### Seeding Demo Data (Optional but Recommended)
If the database is empty, you can run these seed scripts from the `backend` folder to populate demo data:
```bash
cd backend
node seedUser.js      # Seeds the Admin user
node seedCustomer.js  # Seeds a Test Customer account
node seedData.js      # Seeds a Demo Vendor and 10 premium products
```

### Testing Flows

**1. Testing the User Flow (Customer)**
* Click the **Customer** quick login button on the login page.
* Browse the homepage and view the premium product catalog.
* Add items from different vendors to your shopping cart.
* Proceed to checkout, enter an address, and place an order (COD).
* Go to the **Orders** tab in the navigation bar to see your order history and status.

**2. Testing the Vendor Flow**
* Click the **Vendor** quick login button (Luxe Studios).
* You will be taken to the Vendor Dashboard.
* **Add a Product**: Upload an image, set a price (in Rupee ₹), title, and stock.
* Check the "Recent Orders" section. This will show any orders that customers have placed for your products. Try updating the status from *Pending* to *Shipped* or *Delivered*.

**3. Testing the Admin Flow**
* Click the **Admin** quick login button.
* Go to the Admin Dashboard.
* **Manage Vendors**: View all registered vendors. You can approve or reject pending vendor accounts here.
* **All Products**: View a detailed, global table of every product on the platform.
* **Global Orders**: View every order placed by any customer, tracking the entire platform's economy.

---

## 📁 Folder Structure

```
vendor-ecommerce/
│
├── backend/                  # Express/Node JS Source Code
│   ├── controllers/          # Business logic for routes
│   ├── middleware/           # auth checks, multer setup
│   ├── models/               # MongoDB Mongoose Schemas (User, Product, Order)
│   ├── routes/               # Express API endpoints
│   ├── uploads/              # Locally stored product images
│   ├── index.js              # Server entry point
│   └── seedData.js           # Demo data seeder script
│
├── frontend/                 # React (Vite) Source Code
│   ├── public/         
│   ├── src/
│   │   ├── components/       # Reusable UI parts (Navbar)
│   │   ├── pages/            # Full page views (Home, Dashboard, Cart, etc.)
│   │   ├── store/            # Zustand global state (cartStore, userStore)
│   │   ├── App.jsx           # Main routing component
│   │   ├── index.css         # Global styles & Tailwind
│   │   └── main.jsx          # React DOM entry
│   ├── tailwind.config.js    # UI Theming and plugins
│   └── package.json
│
└── README.md
```
