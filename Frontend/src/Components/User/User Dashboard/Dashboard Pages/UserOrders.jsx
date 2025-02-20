import React, { useState, useContext, useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";
import { FaArrowRightLong } from "react-icons/fa6";
import { MdClose } from "react-icons/md";
import { ContextApi } from "../../../../Context/Context.jsx"

const UserOrders = () => {
    const { FetchUser } = useContext(ContextApi).userAuth;
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [expandedItem, setExpandedItem] = useState(null);
    const [orders, setOrders] = useState([]);

    const fetchData = async () => {
        try {
            const data = await FetchUser();
            setOrders(data.data.orders);
        } catch (error) {
            return error
        }
    }
    useEffect(() => {
        fetchData()
    }, []);

    const handleOrderClick = (order) => {
        setSelectedOrder(order);
        setExpandedItem(null);
    };

    const handleItemClick = (itemId) => {
        setExpandedItem((prev) => (prev === itemId ? null : itemId));
    };

    return (
        <div className="bg-gray-100 sm:p-8 mt-24 mr-10">
            <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden p-4">
                <table className="w-full text-left">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="px-4 py-2 text-sm font-medium text-gray-600">
                                Order ID
                            </th>
                            <th className="px-4 py-2 text-sm font-medium text-gray-600">
                                Status
                            </th>
                            <th className="px-4 py-2 text-sm font-medium text-gray-600">
                                Items Qty
                            </th>
                            <th className="px-4 py-2 text-sm font-medium text-gray-600">
                                Total
                            </th>
                            <th className="px-4 py-2"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr
                                key={order._id}
                                className="border-b hover:bg-gray-100 transition"
                            >
                                <td className="px-4 py-2 text-gray-700 truncate max-w-xs">
                                    {order._id}
                                </td>
                                <td className="px-4 py-2 text-gray-700">
                                    {order.status || "Processing"}
                                </td>
                                <td className="px-4 py-2 text-gray-700 text-center">
                                    {order.items.length || 0}
                                </td>
                                <td className="px-4 py-2 text-gray-700">
                                    ${order.totalPrice}
                                </td>
                                <td className="px-4 py-2 text-right">
                                    <button
                                        className="text-gray-500 hover:text-gray-700"
                                        onClick={() => handleOrderClick(order)}
                                    >
                                        <FaArrowRightLong size={20} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedOrder && (
                <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white w-full max-w-3xl p-6 rounded-lg shadow-lg overflow-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Order Details</h2>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <MdClose size={24} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {selectedOrder.items.map((item) => (
                                <div
                                    key={item.productId}
                                    className="border rounded-lg p-4 flex flex-col"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <img src={item.productImages[0].url} className="w-16 h-16 object-cover rounded-md mr-4" />
                                            <div>
                                                <h3 className="text-lg font-semibold">
                                                    {item.productTitle}
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    Price: ${item.productPrice} | Quantity:{" "}
                                                    {item.quantity} | Total: $
                                                    {item.productPrice * item.quantity}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleItemClick(item.productId)}
                                            className="text-gray-500 hover:text-gray-700"
                                        >
                                            <FiChevronDown
                                                size={20}
                                                className={`transition-transform ${expandedItem === item.productId
                                                    ? "rotate-180"
                                                    : ""
                                                    }`}
                                            />
                                        </button>
                                    </div>
                                    {expandedItem === item.productId && (
                                        <p className="mt-2 ml-20 text-gray-700">
                                            {item.productDescription}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="grid mt-8">
                            <h1>Country : <span>{selectedOrder.shippingAddress.country || "Us"}</span></h1>
                            <h1>State : <span>{selectedOrder.shippingAddress.state || "California"}</span></h1>
                            <h1>City : <span>{selectedOrder.shippingAddress.city || "Lahore"}</span></h1>
                            <h1>zipCode : <span>{selectedOrder.shippingAddress.zipCode || "87955"}</span></h1>
                            <h1>Home Adress : <span>{selectedOrder.shippingAddress.street || "Us"}</span></h1>
                        </div>
                        <div className="flex mt-2">
                            <h1 className="text-2xl">SubTotal : <span>{selectedOrder.totalPrice}</span></h1>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserOrders;
