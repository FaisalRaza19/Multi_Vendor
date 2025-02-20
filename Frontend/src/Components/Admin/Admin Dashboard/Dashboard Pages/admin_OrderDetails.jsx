import React, { useContext, useState } from 'react';
import { useParams } from 'react-router';
import { ContextApi } from "../../../../Context/Context.jsx";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const orderStatuses = ['Processing', 'Shipped', 'Delivered'];

const AdminOrderDetails = ({ order, shopId }) => {
    const { showAlert } = useContext(ContextApi);
    const { changeStatus } = useContext(ContextApi).order;
    const { id } = useParams();
    const [loading, setLoading] = useState(false);

    // Find the order details based on ID
    const orderDetails = order.find((e) => e._id === id);
    const [status, setStatus] = useState(orderDetails?.status || 'Processing');

    // Handle status selection change
    const handleStatusChange = (e) => {
        setStatus(e.target.value);
    };

    // Handle status update request
    const handleStatusUpdate = async (e) => {
        e.preventDefault();
        if (orderDetails.status === "Delivered") {
            showAlert({message : "Product is alredy Deliverd"})
            return;
        }

        setLoading(true);
        try {
            const credential = {
                status,
                similarOrderId: orderDetails.similarOrderId,
            };

            // API call to update status
            const data = await changeStatus({ credential, shopId });

            if (data?.success) {
                console.log("Status updated:", data);
                setStatus(status); // Update UI if successful
            } else {
                console.error("Failed to update status");
            }
        } catch (error) {
            console.error("Error updating status:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 space-y-8 lg:p-7">
            <h1 className="text-3xl ml-2 text-gray-600">Order Details</h1>
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="space-y-6">
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">Products</h2>
                        {orderDetails?.items.map((product) => (
                            <div key={product.productId} className="flex flex-col md:flex-row md:space-x-6 mb-6 pb-6 border-b">
                                <div className="md:w-1/3 mb-4 md:mb-0">
                                    <img src={product.productImages[0].url} width={300} height={300} className="rounded-lg" />
                                </div>
                                <div className="md:w-2/3 space-y-2">
                                    <h3 className="text-xl font-semibold">{product.productTitle}</h3>
                                    <p className="text-gray-600">{product.productDescription}</p>
                                    <p><strong>Quantity:</strong> {product.quantity}</p>
                                    <p><strong>Price:</strong> US$ {product.productPrice}</p>
                                    <p><strong>Subtotal:</strong> US$ {(product.quantity * product.productPrice).toFixed(2)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="space-y-2">
                        <p><strong>Order ID:</strong> {orderDetails?._id}</p>
                        <p><strong>Order Placed:</strong> {orderDetails?.createdAt}</p>
                        <p><strong>Total Amount:</strong> $ {orderDetails?.totalPrice}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">Delivery Address:</h3>
                        <p>{orderDetails?.shippingAddress.street}</p>
                        <p>{orderDetails?.shippingAddress.city}, {orderDetails?.shippingAddress.state}</p>
                        <p>{orderDetails?.shippingAddress.country}, {orderDetails?.shippingAddress.zipCode}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <label htmlFor="status" className="font-semibold">Status:</label>
                        <select
                            id="status"
                            value={status}
                            onChange={handleStatusChange}
                            className="border rounded p-2"
                            disabled={orderDetails?.status === "Delivered"}
                        >
                            {orderStatuses.map((s) => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>
                    <button
                        onClick={handleStatusUpdate}
                        className={`px-4 py-2 rounded flex items-center ${orderDetails?.status === "Delivered"
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-500 text-white hover:bg-blue-600"
                            }`}
                        disabled={loading || orderDetails?.status === "Delivered"}
                    >
                        {loading ? <AiOutlineLoading3Quarters size={26} className='animate-spin' /> : "Update Status"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminOrderDetails;
