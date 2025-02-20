import React, { useState, useEffect, useContext } from "react"
import { ContextApi } from "../../../Context/Context"
import { Country, State, City } from "country-state-city"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { FaCheckCircle, FaTrash, FaPlus, FaMinus, FaCheck, FaTruck, FaCreditCard } from "react-icons/fa"
import { motion, AnimatePresence } from "framer-motion"
// Initialize Stripe
const key = import.meta.env.VITE_STRIPE_PUBLIC_KEY
const stripePromise = loadStripe(key)

const CheckoutPage = () => {
  const { showAlert, cart, cartTotal, setCart, removeFromCart, updateQuantity, order } = useContext(ContextApi)
  const { placeOrder, givePayment } = order
  const [step, setStep] = useState(1)
  const [selectedAddressId, setSelectedAddressId] = useState(null)
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
  })
  const [paymentMethod, setPaymentMethod] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)
  const [coupon, setCoupon] = useState("")
  const [products, setProducts] = useState(cart)
  const [formErrors, setFormErrors] = useState({})
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    setProducts(cart)
  }, [cart])

  const savedAddresses = [
    { id: 1, name: "Home", street: "123 Main St", city: "Anytown", state: "CA", country: "US", zipCode: "12345" },
    { id: 2, name: "Work", street: "456 Office Blvd", city: "Workville", state: "NY", country: "US", zipCode: "67890" },
  ]

  const [countries, setCountries] = useState([])
  const [states, setStates] = useState([])
  const [cities, setCities] = useState([])

  useEffect(() => {
    setCountries(Country.getAllCountries())
  }, [])

  useEffect(() => {
    if (address.country) {
      setStates(State.getStatesOfCountry(address.country))
    }
  }, [address.country])

  useEffect(() => {
    if (address.country && address.state) {
      setCities(City.getCitiesOfState(address.country, address.state))
    }
  }, [address.country, address.state])

  const handleAddressSelect = (addressId) => {
    setSelectedAddressId(addressId)
    const selectedAddress = savedAddresses.find((addr) => addr.id === addressId)
    if (selectedAddress) {
      setAddress({
        street: selectedAddress.street,
        city: selectedAddress.city,
        state: selectedAddress.state,
        country: selectedAddress.country,
        zipCode: selectedAddress.zipCode,
      })
    }
  }

  const handleAddressChange = (e) => {
    const { name, value } = e.target
    setAddress((prev) => {
      const newAddress = { ...prev, [name]: value }
      if (name === "country") {
        newAddress.state = ""
        newAddress.city = ""
      } else if (name === "state") {
        newAddress.city = ""
      }
      return newAddress
    })
    setFormErrors((prev) => ({ ...prev, [name]: "" }))
  }

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method)
  }

  const validateAddress = () => {
    const errors = {}
    if (!address.street.trim()) errors.street = "Street address is required"
    if (!address.city.trim()) errors.city = "City is required"
    if (!address.state.trim()) errors.state = "State is required"
    if (!address.country.trim()) errors.country = "Country is required"
    if (!address.zipCode.trim()) errors.zipCode = "Zip code is required"
    else if (!/^\d{5}(-\d{4})?$/.test(address.zipCode)) errors.zipCode = "Invalid zip code format"
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsProcessing(true)
    try {
      const orderData = {
        shippingAddress: address,
        products,
        paymentMethod,
      }

      if (paymentMethod === "cod") {
        const orderResponse = await placeOrder({ credential: orderData });
        if (orderResponse.status == 200) {
          localStorage.removeItem("cart");
          setCart([]);
          setIsSuccess(true)
          showAlert(orderResponse)
        } else {
          throw new Error("Failed to place order")
        }
      } else if (paymentMethod === "stripe") {
        showAlert("Please complete the payment to place your order.", "success")
      }
    } catch (error) {
      showAlert(error.message)
    } finally {
      setIsProcessing(false)
    }
  }

  const StripeCheckoutForm = () => {
    const stripe = useStripe()
    const elements = useElements()

    const handleStripeSubmit = async (e) => {
      e.preventDefault()
      if (!stripe || !elements) {
        console.error("Stripe or Elements not loaded");
        return
      }

      const cardElement = elements.getElement(CardElement)
      if (!cardElement) {
        console.log("Error during cardElement");
        return;
      }

      setIsProcessing(true)
      try {
        const data = await givePayment({ amount: cartTotal })
        const result = await stripe.confirmCardPayment(data.data.client_secret, {
          payment_method: { card: cardElement },
        });
        if (result.error) {
          showAlert(result.error)
          return;
        }
        console.log(result)
        const orderData = {
          shippingAddress: address,
          products,
          paymentMethod,
        }
        console.log(orderData)
        const orderResponse = await placeOrder({ credential: orderData })
        console.log(orderResponse);
        if (orderResponse.status == 200) {
          localStorage.removeItem("cart");
          setCart([]);
          setIsSuccess(true)
          showAlert(orderResponse)
        } else {
          throw new Error("Payment successful but failed to place order")
        }
      } catch (error) {
        console.log(error);
        return error
      } finally {
        setIsProcessing(false)
      }
    }

    return (
      <form onSubmit={handleStripeSubmit} className="mt-4 grid grid-cols-1 gap-4">
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">Card Details</label>
          <CardElement className="p-3 border rounded-md" />
        </div>
        <div className="col-span-1">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={!stripe || isProcessing}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200 disabled:opacity-50"
          >
            {isProcessing ? "Processing..." : "Pay and Place Order"}
          </motion.button>
        </div>
      </form>
    )
  }

  const ProductSummary = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-lg p-6"
    >
      <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
      <AnimatePresence>
        {products.map((product) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-between mb-4"
          >
            <div className="flex items-center">
              <img
                src={product.images[0].url || "/placeholder.svg"}
                alt={product.productTitle}
                className="w-20 h-20 object-cover rounded mr-4"
              />
              <div>
                <h3 className="font-semibold">{product.productTitle}</h3>
                <p className="text-gray-600">${product.offerPrice || product.actualPrice}</p>
                <div className="flex items-center mt-2">
                  <button
                    onClick={() => updateQuantity(product._id, product.quantity - 1)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FaMinus />
                  </button>
                  <span className="mx-2">{product.quantity}</span>
                  <button
                    onClick={() => updateQuantity(product._id, product.quantity + 1)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>
            </div>
            <button onClick={() => removeFromCart(product._id)} className="text-red-500 hover:text-red-700">
              <FaTrash />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
      <div className="mt-4">
        <input
          type="text"
          placeholder="Coupon Code"
          value={coupon}
          onChange={(e) => setCoupon(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />
        <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded w-full hover:bg-gray-300 transition duration-200">
          Apply Coupon
        </button>
      </div>
      <div className="border-t pt-4 mt-4">
        <div className="flex justify-between mb-2">
          <span>Subtotal:</span>
          <span>${cartTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold">
          <span>Total:</span>
          <span>${cartTotal.toFixed(2)}</span>
        </div>
      </div>
    </motion.div>
  )

  const StepIndicator = ({ currentStep, totalSteps }) => (
    <div className="flex justify-between mb-8">
      {Array.from({ length: totalSteps }, (_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
          className={`step flex flex-col items-center ${i + 1 <= currentStep ? "text-blue-500" : "text-gray-400"}`}
        >
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${i + 1 < currentStep ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
          >
            {i + 1 < currentStep ? <FaCheck /> : i + 1}
          </div>
          <span className="text-sm">{i === 0 ? "Address" : i === 1 ? "Payment" : "Confirmation"}</span>
        </motion.div>
      ))}
    </div>
  )

  if (isSuccess) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full"
        >
          <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Order Placed Successfully!</h2>
          <p className="mb-4 text-gray-600">Thank you for your purchase. Your order is on its way!</p>
          <p className="text-gray-500">Estimated delivery time: 3-5 business days</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl mt-32">
      <StepIndicator currentStep={step} totalSteps={3} />

      <div className="flex flex-wrap -mx-4">
        <div className="w-full lg:w-2/3 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-lg p-6 mb-6"
          >
            {step === 1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                <h2 className="text-2xl font-bold mb-4">Shipping Address</h2>
                <div className="mb-6">
                  <label htmlFor="savedAddress" className="block text-sm font-medium text-gray-700 mb-2">
                    Select a saved address
                  </label>
                  <select
                    id="savedAddress"
                    className="w-full p-2 border rounded"
                    onChange={(e) => handleAddressSelect(Number(e.target.value))}
                    value={selectedAddressId || ""}
                  >
                    <option value="">Select an address</option>
                    {savedAddresses.map((addr) => (
                      <option key={addr.id} value={addr.id}>
                        {addr.name} - {addr.street}, {addr.city}
                      </option>
                    ))}
                  </select>
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    if (validateAddress()) {
                      setStep(2)
                    }
                  }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <div className="col-span-2">
                    <label className="block mb-2">Street Address</label>
                    <input
                      type="text"
                      name="street"
                      value={address.street}
                      onChange={handleAddressChange}
                      className={`w-full p-2 border rounded ${formErrors.street ? "border-red-500" : ""}`}
                    />
                    {formErrors.street && <p className="text-red-500 text-sm mt-1">{formErrors.street}</p>}
                  </div>
                  <div>
                    <label className="block mb-2">Country</label>
                    <select
                      name="country"
                      value={address.country}
                      onChange={handleAddressChange}
                      className={`w-full p-2 border rounded ${formErrors.country ? "border-red-500" : ""}`}
                    >
                      <option value="">Select Country</option>
                      {countries.map((country) => (
                        <option key={country.isoCode} value={country.isoCode}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                    {formErrors.country && <p className="text-red-500 text-sm mt-1">{formErrors.country}</p>}
                  </div>
                  <div>
                    <label className="block mb-2">State</label>
                    <select
                      name="state"
                      value={address.state}
                      onChange={handleAddressChange}
                      className={`w-full p-2 border rounded ${formErrors.state ? "border-red-500" : ""}`}
                    >
                      <option value="">Select State</option>
                      {states.map((state) => (
                        <option key={state.isoCode} value={state.isoCode}>
                          {state.name}
                        </option>
                      ))}
                    </select>
                    {formErrors.state && <p className="text-red-500 text-sm mt-1">{formErrors.state}</p>}
                  </div>
                  <div>
                    <label className="block mb-2">City</label>
                    <select
                      name="city"
                      value={address.city}
                      onChange={handleAddressChange}
                      className={`w-full p-2 border rounded ${formErrors.city ? "border-red-500" : ""}`}
                    >
                      <option value="">Select City</option>
                      {cities.map((city) => (
                        <option key={city.name} value={city.name}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                    {formErrors.city && <p className="text-red-500 text-sm mt-1">{formErrors.city}</p>}
                  </div>
                  <div>
                    <label className="block mb-2">Zip Code</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={address.zipCode}
                      onChange={handleAddressChange}
                      className={`w-full p-2 border rounded ${formErrors.zipCode ? "border-red-500" : ""}`}
                    />
                    {formErrors.zipCode && <p className="text-red-500 text-sm mt-1">{formErrors.zipCode}</p>}
                  </div>
                  <div className="col-span-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition duration-200"
                    >
                      Proceed to Payment
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                <h2 className="text-2xl font-bold mb-4">Payment Method</h2>
                <div className="mb-4 space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={() => handlePaymentMethodChange("cod")}
                      className="form-radio"
                    />
                    <span>Cash on Delivery</span>
                    <FaTruck className="text-gray-500 ml-2" />
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      value="stripe"
                      checked={paymentMethod === "stripe"}
                      onChange={() => handlePaymentMethodChange("stripe")}
                      className="form-radio"
                    />
                    <span>Credit Card (Stripe)</span>
                    <FaCreditCard className="text-gray-500 ml-2" />
                  </label>
                </div>
                {paymentMethod === "cod" && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSubmit}
                    disabled={isProcessing}
                    className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition duration-200 disabled:opacity-50"
                  >
                    {isProcessing ? "Processing..." : "Place Order"}
                  </motion.button>
                )}
                {paymentMethod === "stripe" && (
                  <Elements stripe={stripePromise}>
                    <StripeCheckoutForm />
                  </Elements>
                )}
              </motion.div>
            )}
          </motion.div>
        </div>
        <div className="w-full lg:w-1/3 px-4">
          <ProductSummary />
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage

