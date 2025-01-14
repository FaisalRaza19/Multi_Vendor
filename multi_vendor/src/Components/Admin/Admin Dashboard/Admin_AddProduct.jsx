import React, { useContext, useState } from "react";
import { FaUpload, FaCheckCircle, FaTag, FaTrash } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { ContextApi } from "../../../Context/Context.jsx";

const Admin_AddProduct = () => {
  const { addProducts } = useContext(ContextApi);
  const [formData, setFormData] = useState({
    productTitle: "",
    productDescription: "",
    actualPrice: "",
    giveOffer: false,
    offerPercent: null,
    stock: "",
    productImages: [],
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (formData.productImages.length + files.length > 4) {
      alert("You can only upload up to 4 images.");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      productImages: [...prev.productImages, ...files],
    }));
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      productImages: prev.productImages.filter((_, i) => i !== index),
    }));
  };

  const calculateDiscountedPrice = () => {
    const { actualPrice, offerPercent } = formData;
    if (!actualPrice || !offerPercent) return 0;
    return actualPrice - (actualPrice * offerPercent) / 100;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const productData = formData;
      const data = await addProducts({productData});
    } catch (error) {
      console.error("Error during product addition:", error);
      alert("Failed to add the product. Please try again.");
    } finally {
      setFormData({
        productTitle: "",
        actualPrice: "",
        giveOffer: false,
        offerPercent: "",
        productDescription: "",
        stock: "",
        productImages: [],
      });
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-gradient-to-r from-gray-100 to-white rounded-lg">
      <h2 className="text-2xl font-bold mb-6 flex items-center text-black">
        <FaTag className="mr-2" />
        Add Product
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-medium mb-2">Product Title</label>
          <input
            type="text"
            name="productTitle"
            value={formData.productTitle}
            onChange={handleChange}
            className="w-full p-3 rounded bg-white text-gray-800 shadow focus:outline-none focus:ring focus:ring-black"
            placeholder="Enter product title"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-2">Description</label>
          <textarea
            name="productDescription"
            value={formData.productDescription}
            onChange={handleChange}
            rows="3"
            className="w-full p-3 rounded bg-white text-gray-800 shadow focus:outline-none focus:ring focus:ring-black"
            placeholder="Enter product description"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-2">Actual Price ($)</label>
          <input
            type="number"
            name="actualPrice"
            value={formData.actualPrice}
            onChange={handleChange}
            className="w-full p-3 rounded bg-white text-gray-800 shadow focus:outline-none focus:ring focus:ring-black"
            placeholder="Enter actual price"
            step={0.1}
            min="0.1"
            required
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="giveOffer"
            checked={formData.giveOffer}
            onChange={handleChange}
            className="mr-2"
          />
          <label className="font-medium">Give Offer</label>
        </div>

        {formData.giveOffer && (
          <div>
            <label className="block font-medium mb-2">Offer Percentage (%)</label>
            <input
              type="number"
              name="offerPercent"
              value={formData.offerPercent}
              onChange={handleChange}
              className="w-full p-3 rounded bg-white text-gray-800 shadow focus:outline-none focus:ring focus:ring-yellow-400"
              placeholder="Enter offer percentage"
              step={0.1}
              min="2"
              max="100"
              required
            />
          </div>
        )}

        <div>
          <label className="block font-medium mb-2">Stock Status</label>
          <select
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            className="w-full p-3 rounded bg-white text-gray-800 shadow focus:outline-none focus:ring focus:ring-black"
          >
            <option value="">Select Stock Status</option>
            <option value="In Stock">In Stock</option>
            <option value="Out of Stock">Out of Stock</option>
            <option value="Limited Stock">Limited Stock</option>
          </select>
        </div>

        <div className="space-y-2">
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.productImages.map((file, index) => (
              <div key={index} className="relative group">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Product ${index + 1}`}
                  className="w-20 h-20 object-cover rounded"
                />
                <button
                  type="button"
                  className="absolute bg-white top-0 right-0 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleRemoveImage(index)}
                >
                  <FaTrash size={17} />
                </button>
              </div>
            ))}
          </div>
          <div className="flex items-center space-x-4">
            <input
              id="productImage"
              type="file"
              onChange={handleImageUpload}
              className="hidden"
              multiple
              accept="image/*"
            />
            <label
              htmlFor="productImage"
              className={`cursor-pointer p-3 rounded shadow flex items-center ${formData.productImages.length >= 4
                ? "bg-gray-400 cursor-not-allowed text-gray-500"
                : "bg-yellow-500 hover:bg-yellow-600 text-gray-800"
                }`}
            >
              <FaUpload className="mr-2" />
              {formData.productImages.length >= 4 ? "Limit Reached" : "Upload Image"}
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 py-3 rounded shadow hover:bg-green-600 flex items-center justify-center"
        >
          {loading ? (
            <AiOutlineLoading3Quarters size={20} className="text-white animate-spin" />
          ) : (
            <>
              <FaCheckCircle className="mr-2" />
              Add Product
            </>
          )}
        </button>
      </form>

      {formData.giveOffer && formData.actualPrice && (
        <div className="mt-6 p-4 bg-white rounded text-gray-800 shadow">
          <p className="font-medium">
            Discounted Price:{" "}
            <span className="text-green-600 font-bold">
              ${calculateDiscountedPrice().toFixed(2)}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default Admin_AddProduct;

