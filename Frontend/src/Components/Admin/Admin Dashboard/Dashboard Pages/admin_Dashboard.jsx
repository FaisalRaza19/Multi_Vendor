import React, { useContext, useEffect, useState } from 'react';
import { FiChevronRight } from 'react-icons/fi';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { ContextApi } from "../../../../Context/Context.jsx";

const AdminDashboard = ({ shopId, setOrder }) => {
  const [id, setId] = useState(null);
  const { getShop } = useContext(ContextApi).adminAuth;
  const [data, setData] = useState(null);
  const [productLength, setProductLength] = useState(0);
  const [order, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch shop data
  const fetchShop = async () => {
    try {
      setLoading(true);
      const response = await getShop(shopId);
      const shopData = response?.data?.shop;

      if (shopData) {
        setId(shopData._id);
        setData(shopData);
        setProductLength(shopData.products.length || 0);
        setOrder(shopData.Orders || []);
        const sortedOrders = [...shopData.Orders]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);

        setOrders(sortedOrders);
      }
    } catch (error) {
      console.error("Error fetching shop:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShop();
  }, [shopId]);

  return (
    <div className="p-4 space-y-8 lg:p-7">
      <h1 className="text-2xl font-semibold">Overview</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="p-6 bg-white">
          <h3 className="text-sm text-gray-600">
            Account Balance <span className="text-gray-400">(with 10% service charge)</span>
          </h3>
          <p className="text-2xl font-semibold lg:text-3xl">$115.83</p>
          <button className="mt-4 text-blue-500 hover:underline">Withdraw Money</button>
        </div>

        <div className="p-6 bg-white">
          <h3 className="text-sm text-gray-600">All Orders</h3>
          <p className="text-2xl font-semibold lg:text-3xl">{order.length || 0}</p>
          <Link to={`/Shop/${id}/orders`}>
            <button className="mt-4 text-blue-500 hover:underline">View Orders</button>
          </Link>
        </div>

        <div className="p-6 bg-white">
          <h3 className="text-sm text-gray-600">All Products</h3>
          <p className="text-2xl font-semibold lg:text-3xl">{productLength}</p>
          <Link to={`/Shop/${id}/products`}>
            <button className="mt-4 text-blue-500 hover:underline">View Products</button>
          </Link>
        </div>
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
            {loading ? (
              <tbody>
                <tr>
                  <td colSpan="6" className="p-5">
                    <div className="flex justify-center items-center">
                      <AiOutlineLoading3Quarters size={30} className="text-green-500 animate-spin" />
                    </div>
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {order.length > 0 ? (
                  order.map((orderItem) => (
                    <tr key={orderItem._id} className="border-b">
                      <td className="px-6 py-4 text-sm whitespace-nowrap">{orderItem.similarOrderId}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 text-xs rounded ${orderItem.status === 'Refund Success'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                            }`}
                        >
                          {orderItem.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">{orderItem.items?.length || 0}</td>
                      <td className="px-6 py-4 text-sm">${orderItem.totalPrice?.toFixed(2) || '0.00'}</td>
                      <td className="px-6 py-4">
                        <Link to={`/Shop/${shopId}/order/${orderItem._id}`}>
                          <FiChevronRight className="w-5 h-5 text-gray-400" />
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-5 text-gray-500">Orders Not Found</td>
                  </tr>
                )}
              </tbody>

            )}
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

