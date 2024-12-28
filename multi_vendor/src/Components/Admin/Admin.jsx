import React from 'react'
import Admin_Navbar from './Admin_Navbar'
import Admin_Sidebar from './Admin_Sidebar'
import Admin_Dashboard from './Admin Dashboard/Admin_Dashboard'
import { Routes, Route, Navigate } from 'react-router'
import Admin_Orders from './Admin Dashboard/Admin_Orders'
import Admin_OrderDetails from './Admin Dashboard/Admin_OrderDetails'
import Admin_Profile from './Admin Dashboard/Admin_Profile'

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