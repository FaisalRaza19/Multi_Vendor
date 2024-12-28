import React from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { Link } from 'react-router-dom'

const orders = [
    {
        id: '643b069f269a3e46475fff',
        status: 'Refund Success',
        quantity: 1,
        total: 20.9
    },
    {
        id: '643a6c6df53539699e74',
        status: 'Delivered',
        quantity: 2,
        total: 74.8
    },
    {
        id: '643f73aeff6da914fe2609f',
        status: 'Delivered',
        quantity: 1,
        total: 53.9
    }
]

const AdminOrders = () => {
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
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.id} className="border-b">
                                    <td className="px-6 py-4 text-sm whitespace-nowrap">{order.id}</td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`px-2 py-1 text-xs rounded ${
                                                order.status === 'Refund Success'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-blue-100 text-blue-800'
                                            }`}
                                        >
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm">{order.quantity}</td>
                                    <td className="px-6 py-4 text-sm">US$ {order.total}</td>
                                    <td className="px-6 py-4">
                                        <Link to={`/Shop/order/${order.id}`}>
                                            <FiChevronRight className="w-5 h-5 text-gray-400 cursor-pointer" />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="flex items-center justify-between px-6 py-3 border-t">
                        <p className="text-sm text-gray-500">1-3 of 3</p>
                        <div className="flex space-x-1">
                            <button className="p-1 rounded hover:bg-gray-100" disabled>
                                <FiChevronLeft className="w-5 h-5" />
                            </button>
                            <button className="p-1 rounded hover:bg-gray-100" disabled>
                                <FiChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminOrders;
