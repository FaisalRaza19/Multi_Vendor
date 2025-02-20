import React, { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import { Routes, Route, Navigate } from 'react-router-dom'
import Alert from "../../Forms/Alert.jsx";
import Admin_Navbar from './adminNavbar.jsx'
import Admin_Sidebar from './adminSidebar.jsx'
import AdminProfile from './Dashboard Pages/admin_Profile.jsx'
import Dashboard from './Dashboard Pages/admin_Dashboard.jsx'
import AdminOrders from './Dashboard Pages/admin_Orders.jsx'
import Admin_OrderDetails from './Dashboard Pages/admin_OrderDetails.jsx'
import AdminProducts from './Dashboard Pages/admin_Products.jsx'
import AdminAddProduct from './Dashboard Pages/admin_CreateProduct.jsx'
import AdminEvents from './Dashboard Pages/admin_Events.jsx';
import AdminAddEvent from './Dashboard Pages/admin_CreateEvent.jsx'
import AdminCreateCoupon from './Dashboard Pages/admin_CreateCoupon.jsx'

const Admin = ({ isAuth}) => {
    const [shopId, setShopId] = useState();
    const [order,setOrder] = useState([]);

    const getId = () => {
        const token = localStorage.getItem("admin_token")
        const decodeToken = jwtDecode(token);
        setShopId(decodeToken.adminId)
    }
    useEffect(() => {
        getId()
    }, []);
    return (
        <>
            <div className="z-50">
            <Alert />
            </div>
            <div className="min-h-screen bg-gray-50">
                <Admin_Navbar isAuth={isAuth} shopId={shopId}/>
                <div className='relative flex'>
                    <Admin_Sidebar shopId={shopId} />
                    <main className="flex-1 lg:ml-72">
                        <Routes>
                            <Route path="/" element={<Navigate to={`/Shop/${shopId}/dashboard`} />} />
                            <Route path="/dashboard" element={<Dashboard shopId={shopId} setOrder={setOrder}/>} />
                            <Route path="/settings" element={<AdminProfile/>} />
                            <Route path="/orders" element={<AdminOrders shopId={shopId} setOrder={setOrder}/>} />
                            <Route path="/order/:id" element={<Admin_OrderDetails order={order} shopId={shopId}/>} />
                            <Route path="/products" element={<AdminProducts/>}/>
                            <Route path="/createProduct" element={<AdminAddProduct/>}/>
                            <Route path="/events" element={<AdminEvents/>}/>
                            <Route path="/createEvent" element={<AdminAddEvent/>}/>
                            <Route path="/discounts" element={<AdminCreateCoupon/>}/>
                        </Routes>
                    </main>
                </div>
            </div>

        </>
    )
}

export default Admin;
