import React, { useState } from "react"
import { MdAdd, MdDelete, MdClose, MdExpandMore, MdPercent } from "react-icons/md"

// Sample products data
const products = [
  { id: "P001", name: "Wireless Headphones" },
  { id: "P002", name: "Smart Watch" },
  { id: "P003", name: "Laptop" },
  { id: "P004", name: "Smartphone" },
  { id: "P005", name: "Tablet" },
]

const admin_CreateCoupon = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProducts, setSelectedProducts] = useState([])
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false)
  const [errors, setErrors] = useState({})
  const [coupons, setCoupons] = useState([
    {
      id: "CPN001",
      name: "SUMMER2024",
      value: 20,
      expirationDate: "2024-06-30",
      products: ["P001", "P002"],
      status: "active",
    },
    {
      id: "CPN002",
      name: "EXPIRED50",
      value: 50,
      expirationDate: "2024-01-01",
      products: ["P003"],
      status: "expired",
    },
  ])

  const [formData, setFormData] = useState({
    name: "",
    value: "",
    expirationDate: "",
  })

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name) {
      newErrors.name = "Coupon name is required"
    }
    if (!formData.value) {
      newErrors.value = "Value is required"
    } else if (Number(formData.value) <= 0 || Number(formData.value) > 100) {
      newErrors.value = "Value must be between 1 and 100"
    }
    if (!formData.expirationDate) {
      newErrors.expirationDate = "Expiration date is required"
    }
    if (selectedProducts.length === 0) {
      newErrors.products = "Select at least one product"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (validateForm()) {
      const newCoupon = {
        id: `CPN${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        name: formData.name,
        value: Number(formData.value),
        expirationDate: formData.expirationDate,
        products: selectedProducts,
        status: new Date(formData.expirationDate) > new Date() ? "active" : "expired",
      }

      setCoupons([...coupons, newCoupon])
      setIsModalOpen(false)
      resetForm()
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      value: "",
      expirationDate: "",
    })
    setSelectedProducts([])
    setErrors({})
  }

  const handleDelete = (couponId) => {
    setCoupons(coupons.filter((coupon) => coupon.id !== couponId))
  }

  const toggleProduct = (productId) => {
    setSelectedProducts((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Coupon Management</h1>
            <p className="text-sm text-gray-500">Create and manage your discount coupons</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <MdAdd className="h-5 w-5" />
            Add New
          </button>
        </div>

        {/* Coupons Table */}
        <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-gray-500">Coupon ID</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-gray-500">Name</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-gray-500">Value</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-gray-500">Products</th>
                  <th className="whitespace-nowrap px-4 py-3 text-right text-sm font-medium text-gray-500">Action</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((coupon) => (
                  <tr key={coupon.id} className="border-b">
                    <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">{coupon.id}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">{coupon.name}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">{coupon.value}%</td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium
                        ${coupon.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                      >
                        {coupon.status === "active" ? "Active" : "Expired"}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                      {coupon.products.length} products
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right">
                      <button
                        onClick={() => handleDelete(coupon.id)}
                        className="rounded-full p-1 text-gray-400 hover:bg-red-50 hover:text-red-500"
                      >
                        <MdDelete className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create Coupon Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

              <div className="inline-block w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-bottom shadow-xl transition-all sm:my-8 sm:align-middle">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Create New Coupon</h3>
                  <button
                    onClick={() => {
                      setIsModalOpen(false)
                      resetForm()
                    }}
                    className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                  >
                    <MdClose className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Coupon Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Coupon Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`mt-1 block w-full rounded-lg border px-3 py-2 text-sm
                        ${errors.name ? "border-red-300" : "border-gray-300"}
                        focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                      placeholder="Enter coupon name"
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                  </div>

                  {/* Value */}
                  <div>
                    <label htmlFor="value" className="block text-sm font-medium text-gray-700">
                      Discount Value (%)
                    </label>
                    <div className="relative mt-1">
                      <input
                        type="number"
                        id="value"
                        value={formData.value}
                        onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                        className={`block w-full rounded-lg border px-3 py-2 pr-10 text-sm
                          ${errors.value ? "border-red-300" : "border-gray-300"}
                          focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                        placeholder="Enter discount value"
                      />
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <MdPercent className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    {errors.value && <p className="mt-1 text-sm text-red-500">{errors.value}</p>}
                  </div>

                  {/* Expiration Date */}
                  <div>
                    <label htmlFor="expirationDate" className="block text-sm font-medium text-gray-700">
                      Expiration Date
                    </label>
                    <input
                      type="date"
                      id="expirationDate"
                      value={formData.expirationDate}
                      onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
                      className={`mt-1 block w-full rounded-lg border px-3 py-2 text-sm
                        ${errors.expirationDate ? "border-red-300" : "border-gray-300"}
                        focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                    />
                    {errors.expirationDate && <p className="mt-1 text-sm text-red-500">{errors.expirationDate}</p>}
                  </div>

                  {/* Product Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Select Products</label>
                    <div className="relative mt-1">
                      <button
                        type="button"
                        onClick={() => setIsProductDropdownOpen(!isProductDropdownOpen)}
                        className={`relative w-full rounded-lg border px-3 py-2 text-left text-sm
                          ${errors.products ? "border-red-300" : "border-gray-300"}
                          focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                      >
                        <span className="block truncate">
                          {selectedProducts.length ? `${selectedProducts.length} products selected` : "Select products"}
                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                          <MdExpandMore className="h-5 w-5 text-gray-400" />
                        </span>
                      </button>

                      {isProductDropdownOpen && (
                        <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-300 bg-white shadow-lg">
                          <div className="p-2">
                            {products.map((product) => (
                              <div
                                key={product.id}
                                className="flex cursor-pointer items-center px-3 py-2 hover:bg-gray-100"
                                onClick={() => toggleProduct(product.id)}
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedProducts.includes(product.id)}
                                  onChange={() => {}}
                                  className="h-4 w-4 rounded border-gray-300 text-blue-600"
                                />
                                <label className="ml-2 text-sm text-gray-700">{product.name}</label>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    {errors.products && <p className="mt-1 text-sm text-red-500">{errors.products}</p>}
                  </div>

                  {/* Submit Button */}
                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setIsModalOpen(false)
                        resetForm()
                      }}
                      className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Create Coupon
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default admin_CreateCoupon;
