import React, { useState, useContext, useEffect } from "react"
import { MdShoppingBag, MdLocalShipping, MdDoneAll, MdAccessTime, MdLocationOn, MdCalendarToday, MdArrowForward, MdArrowBack, MdHeadphones, MdMouse, MdMonitor } from "react-icons/md"
import { ContextApi } from "../../../../Context/Context.jsx"
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useNavigate} from "react-router";

const OrderTracking = () => {
    const { showAlert,userAuth,chat} = useContext(ContextApi);
    const { user_CreateChat } = chat;
    const { FetchUser } = userAuth;
    const {sellerId,setSellerId} = useState("");
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [Loading,setLoading] = useState(false);
    const navigate = useNavigate()

    const fetchData = async () => {
        try {
            const data = await FetchUser();
            const sellerId = data.data.orders[0].items[0]?.shopInfo?.shopId;
            setSellerId(sellerId)
            console.log(sellerId);
            setOrders(data.data.orders);
        } catch (error) {
            return error
        }
    }
    useEffect(() => {
        fetchData()
    }, []);

    const chatWithSeller = async (id) => {
        try {
          setLoading(true)
          const data = await user_CreateChat({ sellerId: id,navigate});
          showAlert(data)
        } catch (error) {
          return error
        } finally {
          setLoading(false);
        }
    }

    const handleSelectedOrder = (id) => {
        const selectedOrder = orders.find((e) => e._id === id);
        setSelectedOrder(selectedOrder);
    }

    // Status badge helper
    const getStatusBadge = (status) => {
        switch (status) {
            case "Processing":
                return { className: "bg-blue-100 text-blue-700", text: "Order Placed" }
            case "Shipped":
                return { className: "bg-yellow-100 text-yellow-700 animate-pulse", text: "In Transit" }
            case "Delivered":
                return { className: "bg-green-100 text-green-700", text: "Delivered" }
        }
    }

    // Timeline steps
    const steps = [
        {
            status: "Processing",
            label: "Processing",
            time: "9:30 AM",
            icon: MdShoppingBag,
        },
        {
            status: "Shipped",
            label: "Shipped",
            time: "2:30 PM",
            icon: MdLocalShipping,
        },
        {
            status: "Delivered",
            label: "Delivered",
            time: "-",
            icon: MdDoneAll,
        },
    ]

    const getStepNumber = (status) => {
        return steps.findIndex((step) => step.status === status) + 1
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8 mt-32">
            <div className="mx-auto max-w-5xl">
                {!selectedOrder ? (
                    // Orders Table View
                    <div className="overflow-hidden rounded-xl bg-white shadow-sm">
                        <div className="p-4 md:p-6">
                            <h1 className="text-xl font-semibold text-gray-900 md:text-2xl">My Orders</h1>
                            <p className="text-sm text-gray-500">Track and manage your orders</p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="border-y bg-gray-50">
                                    <tr>
                                        <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-gray-500">
                                            Order ID
                                        </th>
                                        <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                                        <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-gray-500">
                                            Quantity
                                        </th>
                                        <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-gray-500">
                                            Total Price
                                        </th>
                                        <th className="whitespace-nowrap px-4 py-3 text-right text-sm font-medium text-gray-500">Track</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => {
                                        const statusBadge = getStatusBadge(order.status)
                                        return (
                                            <tr key={order._id} className="border-b transition-colors hover:bg-gray-50">
                                                <td className="whitespace-nowrap px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <span className="font-medium text-gray-900">{order.similarOrderId}</span>
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-4 py-3">
                                                    <span
                                                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${statusBadge.className}`}
                                                    >
                                                        {statusBadge.text}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">{order.items.length || 0}</td>
                                                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                                                    ${order.totalPrice || 0}
                                                </td>
                                                <td className="whitespace-nowrap px-4 py-3 text-right">
                                                    <button
                                                        onClick={() => handleSelectedOrder(order._id)}
                                                        className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
                                                    >
                                                        <MdArrowForward className="h-5 w-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    // Order Tracking View
                    <div className="rounded-xl bg-white p-6 shadow-sm">
                        {/* Header with Back Button */}
                        <div className="mb-8 flex items-center gap-4">
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
                            >
                                <MdArrowBack className="h-5 w-5" />
                            </button>
                            <div className="flex flex-1 items-center justify-between">
                                <div>
                                    <h1 className="text-2xl font-semibold text-gray-900">Track Order</h1>
                                    <p className="text-sm text-gray-500">Order #{selectedOrder.similarOrderId}</p>
                                </div>
                                <span
                                    className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${getStatusBadge(selectedOrder.status).className}`}
                                >
                                    {getStatusBadge(selectedOrder.status).text}
                                </span>
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="mb-8">
                            <div className="relative">
                                {/* Progress Bar */}
                                <div className="absolute left-0 top-[22px] h-1 w-full bg-gray-200">
                                    <div
                                        className="h-full bg-blue-600 transition-all duration-500 ease-in-out"
                                        style={{
                                            width: `${((getStepNumber(selectedOrder.status) - 1) / 2) * 100}%`,
                                        }}
                                    />
                                </div>

                                {/* Steps */}
                                <div className="relative flex justify-between">
                                    {steps.map((step, index) => {
                                        const stepNumber = index + 1
                                        const currentStep = getStepNumber(selectedOrder.status)
                                        const isComplete = currentStep > stepNumber
                                        const isCurrent = currentStep === stepNumber
                                        const Icon = step.icon

                                        return (
                                            <div key={step.status} className="text-center">
                                                <div
                                                    className={`
                          relative mb-2 inline-flex h-11 w-11 items-center justify-center rounded-full border-2 
                          ${isComplete || isCurrent ? "border-blue-600 bg-blue-600 text-white" : "border-gray-300 bg-white text-gray-500"}
                          transition-all duration-500
                        `}
                                                >
                                                    <Icon className="h-6 w-6" />
                                                    {isCurrent && (
                                                        <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-yellow-400 animate-ping" />
                                                    )}
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm font-medium text-gray-900">{step.label}</p>
                                                    <p className="text-xs text-gray-500">{step.time}</p>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Order Details */}
                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Product Details */}
                            <div className="rounded-lg border bg-gray-50 p-4">
                                <h2 className="mb-4 text-lg font-semibold text-gray-900">Order Details</h2>
                                <div className="overflow-y-auto">
                                    {selectedOrder.items.map((e) => {
                                        return (
                                            <div className="flex gap-4 mb-4" key={e.productId}>
                                                <div className="flex h-16 w-16 object-contain items-center justify-center rounded-lg">
                                                    <img src={e?.productImages[0]?.url || "./placeholder.jpg"} alt="" />
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-gray-900">{e.productTitle || "Product"}</h3>
                                                    <p className="text-sm text-gray-500">
                                                        Quantity: {e.quantity || 0}
                                                    </p>
                                                    <p className="mt-1 text-sm font-medium text-gray-900">${e.productPrice || 0}</p>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                                <div className="my-4 border-t" />
                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500">Subtotal</span>
                                        <span className="text-gray-900">
                                            ${selectedOrder.totalPrice || 0}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between font-medium">
                                        <span className="text-gray-900">Total</span>
                                        <span className="text-gray-900">${selectedOrder.totalPrice || 0}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Delivery Details */}
                            <div className="rounded-lg border bg-gray-50 p-4">
                                <h2 className="mb-4 text-lg font-semibold text-gray-900">Delivery Details</h2>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <MdCalendarToday className="h-5 w-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Estimated Delivery</p>
                                            <p className="text-sm text-gray-500">Your Product Deliver in 3-4 working days</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <MdLocationOn className="h-5 w-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Delivery Address</p>
                                            <p className="text-sm text-gray-500">{selectedOrder.shippingAddress.street},
                                                {selectedOrder.shippingAddress.city},{selectedOrder.shippingAddress.state},
                                                {selectedOrder.shippingAddress.zipCode},{selectedOrder.shippingAddress.country}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={()=> chatWithSeller(sellerId)} className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                                   {Loading ? <AiOutlineLoading3Quarters size={18} className="animate-spin" /> : "Contact Support"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default OrderTracking

