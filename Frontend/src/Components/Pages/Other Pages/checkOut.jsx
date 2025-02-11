import React, { useState } from "react"
import { FaMapMarkerAlt, FaCreditCard, FaCheckCircle, FaTrash, FaTicketAlt } from "react-icons/fa"
import { motion } from "framer-motion"

// Mock data for saved addresses and products
const savedAddresses = [
    { id: 1, address: "123 Main St, New York, NY 10001" },
    { id: 2, address: "456 Elm St, Los Angeles, CA 90001" },
]

const products = [
    { id: 1, name: "Product 1", price: 19.99, quantity: 2 },
    { id: 2, name: "Product 2", price: 29.99, quantity: 1 },
]

const Checkout = () => {
    const [step, setStep] = useState("address")
    const [address, setAddress] = useState({
        country: "",
        state: "",
        city: "",
        zipCode: "",
        homeAddress: "",
    })
    const [selectedSavedAddress, setSelectedSavedAddress] = useState(null)
    const [paymentMethod, setPaymentMethod] = useState("cod")
    const [errors, setErrors] = useState({})
    const [voucherCode, setVoucherCode] = useState("")

    const validateAddress = () => {
        const newErrors = {}
        if (!selectedSavedAddress) {
            Object.keys(address).forEach((key) => {
                if (!address[key]) {
                    newErrors[key] = "This field is required"
                }
            })
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleAddressSubmit = () => {
        if (validateAddress()) {
            setStep("payment")
        }
    }

    const handlePaymentSubmit = () => {
        // Here you would typically process the payment
        // For this example, we'll just move to the success step
        setStep("success")
    }

    const calculateTotal = () => {
        return products.reduce((total, product) => total + product.price * product.quantity, 0)
    }

    const renderAddressStep = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <h2 className="text-2xl font-bold mb-4">Shipping Address</h2>
                <div className="mb-4">
                    <label className="block mb-2">Use saved address:</label>
                    <select
                        className="w-full p-2 border rounded"
                        onChange={(e) =>
                            setSelectedSavedAddress(savedAddresses.find((addr) => addr.id === Number.parseInt(e.target.value)))
                        }
                    >
                        <option value="">Select an address</option>
                        {savedAddresses.map((addr) => (
                            <option key={addr.id} value={addr.id}>
                                {addr.address}
                            </option>
                        ))}
                    </select>
                </div>
                {!selectedSavedAddress && (
                    <form>
                        {["country", "state", "city", "zipCode", "homeAddress"].map((field) => (
                            <div key={field} className="mb-4">
                                <label className="block mb-2">{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
                                <input
                                    type="text"
                                    className={`w-full p-2 border rounded ${errors[field] ? "border-red-500" : ""}`}
                                    value={address[field]}
                                    onChange={(e) => setAddress({ ...address, [field]: e.target.value })}
                                />
                                {errors[field] && <p className="text-red-500 text-sm mt-1">{errors[field]}</p>}
                            </div>
                        ))}
                    </form>
                )}
                <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2">Select on Map:</h3>
                    <div className="bg-gray-200 h-64 flex items-center justify-center">
                        <FaMapMarkerAlt className="text-4xl text-gray-400" />
                        <span className="ml-2">Map placeholder</span>
                    </div>
                </div>
            </div>
            {renderCartSummary()}
        </div>
    )

    const renderPaymentStep = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <h2 className="text-2xl font-bold mb-4">Payment Method</h2>
                <div className="space-y-4">
                    <label className="flex items-center space-x-2">
                        <input type="radio" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} />
                        <span>Cash on Delivery</span>
                    </label>
                    <label className="flex items-center space-x-2">
                        <input type="radio" checked={paymentMethod === "stripe"} onChange={() => setPaymentMethod("stripe")} />
                        <span>Stripe</span>
                    </label>
                </div>
                {paymentMethod === "stripe" && (
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold mb-2">Card Details:</h3>
                        <div className="space-y-4">
                            <input type="text" placeholder="Card Number" className="w-full p-2 border rounded" />
                            <div className="grid grid-cols-2 gap-4">
                                <input type="text" placeholder="MM/YY" className="w-full p-2 border rounded" />
                                <input type="text" placeholder="CVC" className="w-full p-2 border rounded" />
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {renderCartSummary()}
        </div>
    )

    const renderSuccessStep = () => (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
        >
            <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Order Placed Successfully!</h2>
            <p>Thank you for your purchase. Your order will be shipped soon.</p>
        </motion.div>
    )

    const renderCartSummary = () => (
        <div className="bg-gray-100 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
            {products.map((product) => (
                <div key={product.id} className="flex justify-between items-center mb-2">
                    <span>
                        {product.name} (x{product.quantity})
                    </span>
                    <div className="flex items-center">
                        <span className="mr-2">${(product.price * product.quantity).toFixed(2)}</span>
                        <FaTrash className="text-red-500 cursor-pointer" />
                    </div>
                </div>
            ))}
            <div className="mt-4">
                <div className="flex items-center">
                    <input
                        type="text"
                        placeholder="Voucher code"
                        className="flex-grow p-2 border rounded-l"
                        value={voucherCode}
                        onChange={(e) => setVoucherCode(e.target.value)}
                    />
                    <button className="bg-blue-500 text-white p-2 rounded-r">
                        <FaTicketAlt />
                    </button>
                </div>
            </div>
            <div className="mt-4 text-xl font-semibold">Total: ${calculateTotal().toFixed(2)}</div>
        </div>
    )

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between mb-8">
                <div className={`flex items-center ${step === "address" ? "text-blue-500" : "text-gray-500"}`}>
                    <FaMapMarkerAlt className="mr-2" />
                    <span>Address</span>
                </div>
                <div className={`flex items-center ${step === "payment" ? "text-blue-500" : "text-gray-500"}`}>
                    <FaCreditCard className="mr-2" />
                    <span>Payment</span>
                </div>
                <div className={`flex items-center ${step === "success" ? "text-blue-500" : "text-gray-500"}`}>
                    <FaCheckCircle className="mr-2" />
                    <span>Success</span>
                </div>
            </div>

            {step === "address" && renderAddressStep()}
            {step === "payment" && renderPaymentStep()}
            {step === "success" && renderSuccessStep()}

            {step !== "success" && (
                <div className="mt-8">
                    <button
                        className="bg-blue-500 text-white px-6 py-2 rounded"
                        onClick={step === "address" ? handleAddressSubmit : handlePaymentSubmit}
                    >
                        {step === "address" ? "Proceed to Payment" : "Place Order"}
                    </button>
                </div>
            )}
        </div>
    )
}

export default Checkout

