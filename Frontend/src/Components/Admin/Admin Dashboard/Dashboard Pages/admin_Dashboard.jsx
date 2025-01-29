import React, { useContext, useEffect, useState } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { ContextApi } from "../../../../Context/Context.jsx"
import { orders } from '../../../../Static/static.jsx'
import { Link,useParams } from 'react-router-dom'

const admin_Dashboard = () => {
  const {shopId} = useParams();
  const [id,setId] = useState(null); 
  const { getShop } = useContext(ContextApi).adminAuth;
  const [data, setData] = useState();
  const [productLength, setProductLength] = useState(0);


  // fetch shop 
  const fetchShop = async () => {
    try {
      const data = await getShop(shopId);
      setProductLength(data.data.shop.products.length)
      setData(data.data.shop);
      setId(data.data.shop?._id)
    } catch (error) {
      console.error("Error during fetch shop:", error);
    }
  }

  useEffect(() => {
    fetchShop();
  }, [shopId]);
  return (
    <div className="p-4 space-y-8 lg:p-7">
      <h1 className="text-2xl font-semibold">Overview</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 ">
        <span className="p-6 bg-white">
          <div className="space-y-1">
            <h3 className="text-sm text-gray-600">
              Account Balance <span className="text-gray-400">(with 10% service charge)</span>
            </h3>
            <p className="text-2xl font-semibold lg:text-3xl">$115.83</p>
          </div>
          <button className="mt-4 text-blue-500 hover:underline">
            Withdraw Money
          </button>
        </span>

        <span className="p-6 bg-white">
          <div className="space-y-1">
            <h3 className="text-sm text-gray-600">All Orders</h3>
            <p className="text-2xl font-semibold lg:text-3xl">3</p>
          </div>
          <button className="mt-4 text-blue-500 hover:underline">
            View Orders
          </button>
        </span>

        <span className="p-6 bg-white">
          <div className="space-y-1">
            <h3 className="text-sm text-gray-600">All Products</h3>
            <p className="text-2xl font-semibold lg:text-3xl">{productLength || 0}</p>
          </div>
          <Link to={`/Shop/${id}/products`}>
            <button className="mt-4 text-blue-500 hover:underline">
              View Products
            </button>
          </Link>
        </span>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Latest Orders</h2>
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
                    <span className={`px-2 py-1 text-xs rounded ${order.status === 'Refund Success'
                      ? "bg-green-100 text-green-800"
                      : "bg-blue-100 text-blue-800"
                      }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">{order.quantity}</td>
                  <td className="px-6 py-4 text-sm">US$ {order.total}</td>
                  <td className="px-6 py-4">
                    <FiChevronRight className="w-5 h-5 text-gray-400" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-between px-6 py-3 border-t">
            <p className="text-sm text-gray-500">1-3 of 3</p>
            <div className="flex space-x-1">
              <button variant="ghost" size="icon" disabled>
                <FiChevronLeft className="w-5 h-5" />
              </button>
              <button variant="ghost" size="icon" disabled>
                <FiChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default admin_Dashboard;
