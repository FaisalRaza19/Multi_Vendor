import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { FaTrashAlt } from "react-icons/fa";

const PaymentMethods = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);

    const openForm = () => setIsFormOpen(true);
    const closeForm = () => setIsFormOpen(false);

    return (
        <div className="p-6 mt-28">
            <div className="flex mb-4 justify-between">
                <h1 className="text-2xl mt-5 font-semibold">Payment Methods</h1>
                <button
                    onClick={openForm}
                    className="mt-4 px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800"
                >
                    Add New
                </button>
            </div>
            <div className="bg-white shadow-md rounded-lg p-4 flex justify-between  items-center">
                <img
                    src=""
                    alt="Visa"
                    className="w-10"
                />
                <p className="font-medium">Shahriar Sajeb</p>
                <p>1234 **** **** ****</p>
                <p>08/2022</p>
                <FaTrashAlt className="text-gray-500 cursor-pointer" />
            </div>

            {/* Popup Form */}
            {isFormOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-md w-full relative">
                        {/* Close Icon */}
                        <AiOutlineClose
                            onClick={closeForm}
                            className="absolute top-4 right-4 text-2xl cursor-pointer text-gray-500"
                        />

                        <h2 className="text-xl font-semibold mb-4">Add Card Information</h2>
                        <form>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-2">
                                    Card Number
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter card number"
                                    className="w-full border rounded-lg px-4 py-2"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-2">
                                    Cardholder Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter cardholder name"
                                    className="w-full border rounded-lg px-4 py-2"
                                />
                            </div>
                            <div className="flex gap-4">
                                <div className="w-1/2">
                                    <label className="block text-gray-700 font-medium mb-2">
                                        Expiry Date
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="MM/YY"
                                        className="w-full border rounded-lg px-4 py-2"
                                    />
                                </div>
                                <div className="w-1/2">
                                    <label className="block text-gray-700 font-medium mb-2">
                                        CVV
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter CVV"
                                        className="w-full border rounded-lg px-4 py-2"
                                    />
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={closeForm}
                                    className="px-4 py-2 border rounded-lg text-gray-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                                >
                                    Add
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentMethods;
