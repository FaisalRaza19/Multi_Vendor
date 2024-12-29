import React, { useState } from "react";
import { FaUpload, FaCheckCircle, FaTag, FaCalendarAlt } from "react-icons/fa";

const Admin_CreateEvent = () => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        actualPrice: "",
        offer: false,
        offerPercent: 0,
        inStock: "In Stock",
        image: null,
        eventStartDate: "",
        eventEndDate: "",
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleImageUpload = (e) => {
        setFormData({ ...formData, image: e.target.files[0] });
    };

    const calculateDiscountedPrice = () => {
        const { actualPrice, offerPercent } = formData;
        return actualPrice - (actualPrice * offerPercent) / 100;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Product Details:", {
            ...formData,
            discountedPrice: formData.offer ? calculateDiscountedPrice() : null,
        });
        alert("Product Added Successfully!");
        setFormData({
            title: "",
            description: "",
            actualPrice: "",
            offer: false,
            offerPercent: 0,
            inStock: "In Stock",
            image: null,
            eventStartDate: "",
            eventEndDate: "",
        });
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
                        name="title"
                        value={formData.title}
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
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="3"
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

                {/* Event Start Date */}
                <div>
                    <label className="block font-medium mb-2">Event Start Date</label>
                    <div className="flex items-center space-x-2">
                        <FaCalendarAlt />
                        <input
                            type="date"
                            name="eventStartDate"
                            value={formData.eventStartDate}
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
                            type="date"
                            name="eventEndDate"
                            value={formData.eventEndDate}
                            onChange={handleChange}
                            className="w-full p-3 rounded bg-white text-gray-800 shadow focus:outline-none focus:ring focus:ring-black"
                            required
                        />
                    </div>
                </div>

                {/* Offer Checkbox */}
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        name="offer"
                        checked={formData.offer}
                        onChange={handleChange}
                        className="mr-2"
                    />
                    <label className="font-medium">Give Offer</label>
                </div>

                {/* Offer Percentage */}
                {formData.offer && (
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
                )}

                {/* Stock Status Dropdown */}
                <div>
                    <label className="block font-medium mb-2">Stock Status</label>
                    <select
                        name="inStock"
                        value={formData.inStock}
                        onChange={handleChange}
                        className="w-full p-3 rounded bg-white text-gray-800 shadow focus:outline-none focus:ring focus:ring-black"
                    >
                        <option value="In Stock">In Stock</option>
                        <option value="Out of Stock">Out of Stock</option>
                        <option value="Limited Stock">Limited Stock</option>
                    </select>
                </div>

                {/* Product Image Upload */}
                <div>
                    <label className="block font-medium mb-2">Product Image</label>
                    <div className="flex items-center space-x-4">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="productImage"
                        />
                        <label
                            htmlFor="productImage"
                            className="cursor-pointer p-3 bg-yellow-500 rounded shadow hover:bg-yellow-600 flex items-center text-gray-800"
                        >
                            <FaUpload className="mr-2" />
                            Upload Image
                        </label>
                        {formData.image && (
                            <span className="text-sm text-gray-200">
                                {formData.image.name}
                            </span>
                        )}
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-green-500 py-3 rounded shadow hover:bg-green-600 flex items-center justify-center"
                >
                    <FaCheckCircle className="mr-2" />
                    Add Event
                </button>
            </form>

            {/* Display Discounted Price */}
            {formData.offer && formData.actualPrice && (
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

export default Admin_CreateEvent;
