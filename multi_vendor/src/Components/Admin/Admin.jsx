import React from 'react'
import Admin_Navbar from './Admin_Navbar.jsx'
import Admin_Sidebar from './Admin_Sidebar.jsx'
import Admin_Dashboard from './Admin Dashboard/Admin_Dashboard.jsx'
import { Routes, Route, Navigate } from 'react-router'
import Admin_Orders from './Admin Dashboard/Admin_Orders.jsx'
import Admin_OrderDetails from './Admin Dashboard/Admin_OrderDetails.jsx'
import Admin_Products from "./Admin Dashboard/Admin_Products.jsx"
import Admin_Profile from './Admin Dashboard/Admin_Profile.jsx'
import Admin_AddProduct from './Admin Dashboard/Admin_AddProduct.jsx'
import Admin_CreateEvent from './Admin Dashboard/Admin_CreateEvent.jsx'

const Admin = () => {
    return (
        <>
            <div className="min-h-screen bg-gray-50">
                <Admin_Navbar />
                <div className='relative flex'>
                    <Admin_Sidebar />
                    <main className="flex-1 lg:ml-72">
                        <Routes>
                            <Route path="/" element={<Navigate to="/Shop/dashboard" />} />
                            <Route path="/dashboard" element={<Admin_Dashboard />} />
                            <Route path="/orders" element={<Admin_Orders />} />
                            <Route path="/products" element={<Admin_Products />} />
                            <Route path="/create-product" element={<Admin_AddProduct />} />
                            <Route path="/create-event" element={<Admin_CreateEvent />} />
                            <Route path="/order/:id" element={<Admin_OrderDetails />} />
                            <Route path="/settings" element={<Admin_Profile/>}/>
                        </Routes>
                    </main>
                </div>
            </div>
        </>
    )
}

export default Admin