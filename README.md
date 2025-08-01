# 🛒 Multi-Vendor E-Commerce Web App

A full-featured multi-vendor e-commerce platform built using the **MERN Stack** (MongoDB, Express.js, React.js, Node.js). It allows buyers and sellers to register, manage their products and events, place orders, track them, and make payments. The application also supports favorite lists and real-time features.

---

## 📌 Table of Contents

- [Demo](#-demo)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [Folder Structure](#-folder-structure)
- [Screenshots](#-screenshots)
- [License](#-license)

---

## 🎥 Demo

Live Demo: [yourdemo.com](https://yourdemo.com)  
Frontend GitHub: [Multi_Vendor Frontend](https://github.com/FaisalRaza19/Multi_Vendor)  
Backend GitHub: [Multi_Vendor Backend](https://github.com/FaisalRaza19/Multi_Vendor)

---

## ✅ Features

### 👥 User Authentication & Roles
- Separate login/register for **Buyers** and **Sellers**
- JWT-based authentication and route protection
- Profile management for both user types

### 🛍 Product Management (Seller Only)
- Add, edit, and delete products
- Upload product images (Cloudinary integration)
- Set pricing, stock quantity, and categories

### 📅 Event Management (Seller Only)
- Add promotional events
- Edit and delete events
- Showcase active events on the homepage

### ❤️ Wishlist / Favorites
- Buyers can add products to a favorites list
- Easily access and manage favorites from profile

### 🛒 Shopping & Orders
- Add items to cart
- Secure **Stripe Payment** integration
- Place order and receive confirmation
- View past orders and their details

### 🚚 Order Tracking
- Buyers can track their order status
- Sellers can update order status (e.g., "Processing", "Shipped", "Delivered")

### 💬 Real-Time Chat
- Socket.IO-based messaging between buyers and sellers
- Conversations per order/product

---

## ⚙️ Tech Stack

**Frontend:**
- React.js
- Redux Toolkit
- Tailwind CSS
- Axios

**Backend:**
- Node.js
- Express.js
- MongoDB (Mongoose)
- Cloudinary (Image upload)
- Stripe (Payments)
- JWT (Authentication)
- Socket.IO (Chat)

---

## 🧪 Installation

### Prerequisites
- Node.js
- MongoDB
- Cloudinary Account
- Stripe API keys

### Clone the Repositories
```bash
git clone https://github.com/FaisalRaza19/Multi_Vendor
cd Multi_Vendor
