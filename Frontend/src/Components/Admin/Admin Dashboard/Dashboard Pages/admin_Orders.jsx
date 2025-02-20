import React, { useState, useContext, useEffect } from 'react'
import {FiChevronRight } from 'react-icons/fi';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { Link } from 'react-router-dom'
import { ContextApi } from "../../../../Context/Context.jsx"

const admin_Orders = ({ shopId, setOrder }) => {
    const { getShop } = useContext(ContextApi).adminAuth;
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const data = await getShop({ shopId });
                setOrder(data.data.shop.Orders)
                setOrders(data.data.shop.Orders);
            } catch (error) {
                return error
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    },[]);

    return (
        <div className="p-4 space-y-8 lg:p-7">
            <div className="space-y-4">
                <h1 className="text-3xl ml-2 text-gray-600">All Orders</h1>
                <div className="overflow-x-auto rounded-lg border bg-white">
                    <table className="min-w-full">
                        <thead>
                            <tr className="border-b">
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Order ID</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Items Qty</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Total</th>
                                <th className="px-6 py-3"></th>
                            </tr>
                        </thead>
                        {loading ? (
                            <tbody>
                                <tr>
                                    <td colSpan="6" className="p-5">
                                        <div className="flex justify-center items-center">
                                            <AiOutlineLoading3Quarters size={30} className="text-green-500 animate-spin" />
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        ) : (
                            <tbody>
                                {orders.length > 0 ? orders.map((order) => (
                                    <tr key={order._id} className="border-b">
                                        <td className="px-6 py-4 text-sm whitespace-nowrap">{order.similarOrderId}</td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-2 py-1 text-xs rounded ${order.status === 'Refund Success'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-blue-100 text-blue-800'
                                                    }`}
                                            >
                                                {order.status || "Processing"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm">{order.items.length || 0}</td>
                                        <td className="px-6 py-4 text-sm">US$ {order.totalPrice || 0}</td>
                                        <td className="px-6 py-4">
                                            <Link to={`/Shop/${shopId}/order/${order._id}`}>
                                                <FiChevronRight className="w-5 h-5 text-gray-400 cursor-pointer" />
                                            </Link>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-5 text-gray-500">Orders Not Found</td>
                                    </tr>
                                )}
                            </tbody>
                        )}
                    </table>
                </div>
            </div>
        </div>
    )
}

export default admin_Orders
