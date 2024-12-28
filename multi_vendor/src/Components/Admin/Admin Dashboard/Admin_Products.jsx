import React, { useState } from "react";
import { FaEye, FaTimes } from "react-icons/fa";

const Admin_Products = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const products = [
    {
      id: 1,
      img: "https://via.placeholder.com/50",
      title: "Product 1",
      price: 100,
      totalSold: 50,
      description: "This is product 1 description.",
      ratings: 4.5,
      reviews: 10,
    },
    {
      id: 2,
      img: "https://via.placeholder.com/50",
      title: "Product 2",
      price: 200,
      totalSold: 30,
      description: "This is product 2 description.",
      ratings: 4.8,
      reviews: 15,
    },
  ];

  const [formData, setFormData] = useState(null);

  const handleEdit = (product) => {
    setFormData({
      img: product.img,
      title: product.title,
      price: product.price,
      description: product.description,
      offer: false,
      discount: 0,
    });
    setIsEditing(true);
  };

  const calculateOfferPrice = () => {
    if (!formData) return 0;
    return formData.price - (formData.price * formData.discount) / 100;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Product Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-lg p-4">
        <table className="table-auto w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Image</th>
              <th className="p-2">Title</th>
              <th className="p-2">Price</th>
              <th className="p-2">Total Sold</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b">
                <td className="p-2">
                  <img
                    src={product.img}
                    alt={product.title}
                    className="w-12 h-12"
                  />
                </td>
                <td className="p-2">{product.title}</td>
                <td className="p-2">${product.price}</td>
                <td className="p-2">{product.totalSold}</td>
                <td className="p-2 text-center">
                  <FaEye
                    className="text-blue-500 cursor-pointer"
                    onClick={() => setSelectedProduct(product)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Product Detail Popup */}
      {selectedProduct && !isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{selectedProduct.title}</h2>
              <FaTimes
                className="cursor-pointer"
                onClick={() => setSelectedProduct(null)}
              />
            </div>
            <img
              src={selectedProduct.img}
              alt={selectedProduct.title}
              className="w-full h-64 object-cover mb-4"
            />
            <p>{selectedProduct.description}</p>
            <p className="text-gray-600 my-2">
              Price: ${selectedProduct.price}
            </p>
            <p className="text-gray-600">Ratings: {selectedProduct.ratings}</p>
            <p className="text-gray-600">Reviews: {selectedProduct.reviews}</p>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
              onClick={() => handleEdit(selectedProduct)}
            >
              Edit
            </button>
          </div>
        </div>
      )}

      {/* Edit Form Popup */}
      {isEditing && formData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Edit Product</h2>
              <FaTimes
                className="cursor-pointer"
                onClick={() => {
                  setIsEditing(false);
                  setFormData(null);
                }}
              />
            </div>
            <form>
              <div className="mb-4">
                <label className="block mb-2">Image URL</label>
                <input
                  type="text"
                  name="img"
                  value={formData.img}
                  onChange={handleChange}
                  className="border p-2 w-full rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="border p-2 w-full rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Price</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="border p-2 w-full rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="border p-2 w-full rounded"
                ></textarea>
              </div>
              <div className="mb-4 flex items-center">
                <input
                  type="checkbox"
                  name="offer"
                  checked={formData.offer}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label>Offer</label>
              </div>
              {formData.offer && (
                <div className="mb-4">
                  <label className="block mb-2">Discount Percentage</label>
                  <input
                    type="number"
                    name="discount"
                    value={formData.discount}
                    onChange={handleChange}
                    className="border p-2 w-full rounded"
                  />
                  <p className="text-gray-600 mt-2">
                    Offer Price: ${calculateOfferPrice().toFixed(2)}
                  </p>
                </div>
              )}
              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin_Products;