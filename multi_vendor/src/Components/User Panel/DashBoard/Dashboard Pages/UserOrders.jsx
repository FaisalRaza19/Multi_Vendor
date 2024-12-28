import React, { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { FaArrowRightLong } from "react-icons/fa6";
import { MdClose } from "react-icons/md";

const UserOrders = () => {
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [expandedItem, setExpandedItem] = useState(null);

    const orders = [
        {
            id: "7463hvbfchhtr28820",
            status: "Processing",
            items: [
                {
                    id: 1,
                    img: "https://via.placeholder.com/50",
                    title: "Item 1",
                    description: "This is a description of Item 1.",
                    price: 45,
                    quantity: 3,
                },
                {
                    id: 2,
                    img: "https://via.placeholder.com/50",
                    title: "Item 2",
                    description: "This is a description of Item 2.",
                    price: 35,
                    quantity: 2,
                },
            ],
            itemsQty: 5,
            total: "US$ 205",
        },
        {
            id: "7463hvbfchhtr2bvbv0",
            status: "Processing",
            items: [
                {
                    id: 1,
                    img: "https://via.placeholder.com/50",
                    title: "Item A",
                    description: "This is a description of Item A.",
                    price: 50,
                    quantity: 2,
                },
                {
                    id: 2,
                    img: "https://via.placeholder.com/50",
                    title: "Item B",
                    description: "This is a description of Item B.",
                    price: 25,
                    quantity: 1,
                },
            ],
            itemsQty: 3,
            total: "US$ 125",
        },
    ];

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
                                key={order.id}
                                className="border-b hover:bg-gray-100 transition"
                            >
                                <td className="px-4 py-2 text-gray-700 truncate max-w-xs">
                                    {order.id}
                                </td>
                                <td className="px-4 py-2 text-gray-700">
                                    {order.status}
                                </td>
                                <td className="px-4 py-2 text-gray-700 text-center">
                                    {order.itemsQty}
                                </td>
                                <td className="px-4 py-2 text-gray-700">
                                    {order.total}
                                </td>
                                <td className="px-4 py-2 text-right">
                                    <button
                                        className="text-gray-500 hover:text-gray-700"
                                        onClick={() => handleOrderClick(order)}
                                    >
                                        <FaArrowRightLong size={20}/>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
                                    key={item.id}
                                    className="border rounded-lg p-4 flex flex-col"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <img
                                                src={item.img}
                                                alt={item.title}
                                                className="w-16 h-16 object-cover rounded-md mr-4"
                                            />
                                            <div>
                                                <h3 className="text-lg font-semibold">
                                                    {item.title}
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    Price: ${item.price} | Quantity:{" "}
                                                    {item.quantity} | Total: $
                                                    {item.price * item.quantity}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleItemClick(item.id)}
                                            className="text-gray-500 hover:text-gray-700"
                                        >
                                            <FiChevronDown
                                                size={20}
                                                className={`transition-transform ${expandedItem === item.id
                                                    ? "rotate-180"
                                                    : ""
                                                    }`}
                                            />
                                        </button>
                                    </div>
                                    {expandedItem === item.id && (
                                        <p className="mt-2 ml-20 text-gray-700">
                                            {item.description}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserOrders;
