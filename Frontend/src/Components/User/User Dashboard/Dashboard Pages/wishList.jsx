import React, { useContext, useEffect, useState } from "react";
import { FaShoppingCart, FaTrash, FaTimes } from "react-icons/fa";
import { ContextApi } from "../../../../Context/Context";
import { Link } from "react-router-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const WishList = () => {
    const [products, setProducts] = useState([]);
    const { FetchUser} = useContext(ContextApi).userAuth;
    const {removeToWishList} = useContext(ContextApi).userWishList;
    const [loading, setLoading] = useState(false);
    const [deletingProduct, setDeletingProduct] = useState(null);
    const [removing, setRemoving] = useState(false);

    // Fetch user wishlist
    const fetchUser = async () => {
        try {
            setLoading(true);
            const data = await FetchUser();
            setProducts(data?.data?.favouriteList || []);
        } catch (error) {
            return error;
        } finally {
            setLoading(false);
        }
    };

    // Remove product from wishlist
    const handleRemove = async (id) => {
        try {
            setRemoving(true);
            const response = await removeToWishList({ id });
            if (response?.status === 200) {
                setProducts((prev) => prev.filter((product) => product._id !== id));
            }
        } catch (error) {
            return error;
        } finally {
            setRemoving(false);
            setDeletingProduct(null);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 py-8 mt-28">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold mb-6 text-center">My Wishlist</h1>
                <div className="bg-white rounded-lg shadow overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="p-3 text-left">Product</th>
                                <th className="p-3 text-left">Title</th>
                                <th className="p-3 text-left">Shop Name</th>
                                <th className="p-3 text-right">Actual Price</th>
                                <th className="p-3 text-right">Offer %</th>
                                <th className="p-3 text-right">Offer Price</th>
                                <th className="p-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        {loading ? (
                            <tbody>
                                <tr>
                                    <td colSpan="7" className="p-4 text-center">
                                        <AiOutlineLoading3Quarters size={28} className="animate-spin text-green-500" />
                                    </td>
                                </tr>
                            </tbody>
                        ) : products.length > 0 ? (
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product?._id} className="border-b border-gray-200 hover:bg-gray-50">
                                        <td className="p-3">
                                            <Link to={`/product/${product?.category?.replace(/\s+/g, "-")}/${product?._id}`} className="flex justify-center">
                                                <img src={product?.images[0]?.url || "/placeholder.svg"} className="w-20 h-20 object-cover rounded" />
                                            </Link>
                                        </td>
                                        <td className="p-3 font-medium">{product?.productTitle?.slice(0, 18) || "Product"}...</td>
                                        <td className="p-3 font-medium">
                                            <Link to={`/admin_Shop/${product?.shopInfo?.shopId}`}>
                                                {product?.shopInfo?.shopName || "Shop"}
                                            </Link>
                                        </td>
                                        <td className="p-3 text-right">
                                            {product?.offerPrice ? (
                                                <span className="line-through text-gray-500">${product?.actualPrice || 0}</span>
                                            ) : (
                                                <span className="text-green-600 font-bold">${product?.actualPrice || 0}</span>
                                            )}
                                        </td>
                                        <td className="p-3 text-right font-bold text-green-600">{product?.offerPercent || 0}%</td>
                                        <td className="p-3 text-right font-bold text-green-600">${product?.offerPrice?.toFixed(2) || 0}</td>
                                        <td className="p-3">
                                            <div className="flex justify-center space-x-2">
                                                <button
                                                    className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                                                    title="Add to Cart"
                                                >
                                                    <FaShoppingCart />
                                                </button>
                                                <button
                                                    onClick={() => setDeletingProduct(product)}
                                                    className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                                                    title="Remove from Wishlist"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        ) : (
                            <tbody>
                                <tr>
                                    <td colSpan="7" className="p-4 text-center">Wish List is empty</td>
                                </tr>
                            </tbody>
                        )}
                    </table>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {deletingProduct && (
                <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Remove from Wishlist</h2>
                            <button onClick={() => setDeletingProduct(null)} className="text-gray-500 hover:text-gray-700">
                                <FaTimes />
                            </button>
                        </div>
                        <p className="mb-4">Are you sure you want to remove this item from your wishlist?</p>
                        <div className="flex justify-end space-x-2">
                            <button
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition duration-300 focus:outline-none"
                                onClick={() => setDeletingProduct(null)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300 focus:outline-none"
                                onClick={() => handleRemove(deletingProduct?._id)}
                            >
                                {removing ? <AiOutlineLoading3Quarters size={20} className="animate-spin" /> : "Remove"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WishList;
