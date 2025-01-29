import React, { useState } from 'react'
import { useParams } from 'react-router'

const orderStatuses = ['Processing', 'Shipped', 'Delivered', 'Refunded']

const admin_OrderDetails = () => {
    const { id } = useParams();
    const [status, setStatus] = useState('Delivered')

    const orderDetails = {
        id: id,
        products: [
            {
                id: id + "1",
                title: 'Sample Product 1',
                description: 'This is a sample product description.',
                image: '/placeholder.svg',
                quantity: 2,
                price: 29.99
            },
            {
                id: id + "2",
                title: 'Sample Product 2',
                description: 'Another sample product description.',
                image: '/placeholder.svg',
                quantity: 1,
                price: 49.99
            }
        ],
        orderPlacedDate: '2023-05-15',
        deliveryAddress: {
            street: '123 Main St',
            city: 'Anytown',
            state: 'State',
            country: 'Country',
            zipCode: '12345'
        },
        total: 109.97
    }

    const handleStatusUpdate = (e) => {
        setStatus(e.target.value)
    }

    return (
        <div className="p-4 space-y-8 lg:p-7">
            <h1 className="text-3xl ml-2 text-gray-600">Order Details</h1>
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="space-y-6">
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">Products</h2>
                        {orderDetails.products.map((product) => (
                            <div key={product.id} className="flex flex-col md:flex-row md:space-x-6 mb-6 pb-6 border-b">
                                <div className="md:w-1/3 mb-4 md:mb-0">
                                    <img src={product.image} alt={product.title} width={300} height={300} className="rounded-lg" />
                                </div>
                                <div className="md:w-2/3 space-y-2">
                                    <h3 className="text-xl font-semibold">{product.title}</h3>
                                    <p className="text-gray-600">{product.description}</p>
                                    <p><strong>Quantity:</strong> {product.quantity}</p>
                                    <p><strong>Price:</strong> US$ {product.price.toFixed(2)}</p>
                                    <p><strong>Subtotal:</strong> US$ {(product.quantity * product.price).toFixed(2)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="space-y-2">
                        <p><strong>Order ID:</strong> {orderDetails.id}</p>
                        <p><strong>Order Placed:</strong> {orderDetails.orderPlacedDate}</p>
                        <p><strong>Total Amount:</strong> US$ {orderDetails.total.toFixed(2)}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">Delivery Address:</h3>
                        <p>{orderDetails.deliveryAddress.street}</p>
                        <p>{orderDetails.deliveryAddress.city}, {orderDetails.deliveryAddress.state}</p>
                        <p>{orderDetails.deliveryAddress.country}, {orderDetails.deliveryAddress.zipCode}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <label htmlFor="status" className="font-semibold">Status:</label>
                        <select
                            id="status"
                            value={status}
                            onChange={handleStatusUpdate}
                            className="border rounded p-2"
                        >
                            {orderStatuses.map((s) => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                        Update Status
                    </button>
                </div>
            </div>
        </div>
    )
}

export default admin_OrderDetails
