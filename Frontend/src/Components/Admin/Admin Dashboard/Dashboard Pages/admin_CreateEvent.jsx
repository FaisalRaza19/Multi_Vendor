import React, { useContext, useState } from "react";
import { FaUpload, FaCheckCircle, FaTag, FaCalendarAlt, FaTrash } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { ContextApi } from "../../../../Context/Context.jsx";
import { categoriesData as categories } from "../../../../Static/static.jsx"

const admin_CreateEvent = () => {
    const { showAlert } = useContext(ContextApi);
    const { addEvents } = useContext(ContextApi).adminEvents;
    const [formData, setFormData] = useState({
        productTitle: "",
        productDescription: "",
        actualPrice: "",
        offerPercent: "",
        stock: "",
        productImages: [],
        startDate: "",
        endDate: "",
        category : "",
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
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
        const value = actualPrice - (actualPrice * offerPercent) / 100;
        return value
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const productData = formData;
            const data = await addEvents({ productData })
            showAlert(data);
        } catch (error) {
            console.log("Error during add event", error)
        } finally {
            setFormData({
                productTitle: "",
                productDescription: "",
                actualPrice: "",
                offerPercent: "",
                stock: "",
                productImages: [],
                startDate: "",
                endDate: "",
                category : "",
            });
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-gradient-to-r rounded-lg bg-white">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
                <FaTag className="mr-2" />
                Add Event
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Product Title */}
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

                {/* Product Description */}
                <div>
                    <label className="block font-medium mb-2">Description</label>
                    <textarea
                        name="productDescription"
                        value={formData.productDescription}
                        onChange={handleChange}
                        rows="6"
                        className="w-full p-3 rounded bg-white text-gray-800 shadow focus:outline-none focus:ring focus:ring-black"
                        placeholder="Enter product description"
                        required
                    />
                </div>

                {/* Actual Price */}
                <div>
                    <label className="block font-medium mb-2">Actual Price ($)</label>
                    <input
                        type="number"
                        name="actualPrice"
                        value={formData.actualPrice}
                        onChange={handleChange}
                        className="w-full p-3 rounded bg-white text-gray-800 shadow focus:outline-none focus:ring focus:ring-black"
                        placeholder="Enter actual price"
                        required
                    />
                </div>

                {/* category  */}
                <div className="mb-4">
                    <label className="block font-medium mb-2" htmlFor="category">
                        Category
                    </label>
                    <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full p-3 rounded bg-white text-gray-800 shadow focus:outline-none focus:ring focus:ring-black"
                    >
                        <option value="" disabled>
                            Select a category
                        </option>
                        {categories.map((e, index) => (
                            <option key={index} value={e.title}>
                                {e.title}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Event Start Date */}
                <div>
                    <label className="block font-medium mb-2">Event Start Date</label>
                    <div className="flex items-center space-x-2">
                        <FaCalendarAlt />
                        <input
                            type="datetime-local"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                            className="w-full p-3 rounded bg-white text-gray-800 shadow focus:outline-none focus:ring focus:ring-black"
                            required
                        />
                    </div>
                </div>

                {/* Event End Date */}
                <div>
                    <label className="block font-medium mb-2">Event End Date</label>
                    <div className="flex items-center space-x-2">
                        <FaCalendarAlt />
                        <input
                            type="datetime-local"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleChange}
                            className="w-full p-3 rounded bg-white text-gray-800 shadow focus:outline-none focus:ring focus:ring-black"
                            required
                        />
                    </div>
                </div>


                <div>
                    <label className="block font-medium mb-2">Offer Percentage (%)</label>
                    <input
                        type="number"
                        name="offerPercent"
                        value={formData.offerPercent}
                        onChange={handleChange}
                        className="w-full p-3 rounded bg-white text-gray-800 shadow focus:outline-none focus:ring focus:ring-yellow-400"
                        placeholder="Enter offer percentage"
                        required
                    />
                </div>

                {/* Stock Status Dropdown */}
                <div>
                    <label className="block font-medium mb-2">Stock Status</label>
                    <select
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        className="w-full p-3 rounded bg-white text-gray-800 shadow focus:outline-none focus:ring focus:ring-black"
                    >
                        <option value="">Chose Stock</option>
                        <option value="In Stock">In Stock</option>
                        <option value="Out of Stock">Out of Stock</option>
                        <option value="Limited Stock">Limited Stock</option>
                    </select>
                </div>

                {/* Product Image Upload */}
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

                {/* Submit Button */}
                <button type="submit" className="w-full bg-green-500 py-3 rounded shadow hover:bg-green-600 flex items-center justify-center">
                    {loading ? (
                        <AiOutlineLoading3Quarters size={20} className="text-white animate-spin" />
                    ) : (
                        <>
                            <FaCheckCircle className="mr-2" />
                            Add Event
                        </>
                    )}
                </button>
            </form>

            {/* Display Discounted Price */}
            {formData.actualPrice && formData.offerPercent && (
                <div className="mt-6 p-4 bg-white rounded text-gray-800 shadow">
                    <p className="font-medium">
                        Discounted Price:{" "}
                        <span className="text-green-600 font-bold">
                            ${calculateDiscountedPrice().toFixed(2) || 0}
                        </span>
                    </p>
                </div>
            )}
        </div>
    );
};

export default admin_CreateEvent
