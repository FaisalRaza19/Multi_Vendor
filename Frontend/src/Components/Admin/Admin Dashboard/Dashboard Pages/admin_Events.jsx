import React, { useState, useEffect, useContext } from 'react'
import { FaEye, FaEdit, FaTrash, FaTimes, FaArrowLeft, FaArrowRight, FaUpload } from 'react-icons/fa'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { ContextApi } from '../../../../Context/Context'
import { categoriesData as categories } from "../../../../Static/static.jsx"

const admin_Events = () => {
    const {showAlert} = useContext(ContextApi)
    const {getShop} = useContext(ContextApi).adminAuth
    const {deleteEvents, editEvent } = useContext(ContextApi).adminEvents
    const [products, setProducts] = useState([])
    const [viewProduct, setViewProduct] = useState(null);
    const [delEvent, setDelEvent] = useState();
    const [editProduct, setEditProduct] = useState(null)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [Loading, setLoading] = useState(false);

    // get events 
    const getEvents = async () => {
        setLoading(true);
        try {
            const data = await getShop();
            setLoading(true);
            setProducts(data.data.shop.events);
        } catch (error) {
            console.error("Error during fetch shop:", error);
        } finally {
            setLoading(false);
        };
    }

    useEffect(() => {
        getEvents();
        const timer = setInterval(() => {
            setProducts(prevProducts =>
                prevProducts.map(product => ({
                    ...product,
                    endDate: new Date(product.endDate - 1000)
                }))
            )
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    // delete event
    const handleDelete = async (id) => {
        setLoading(true);
        try {
            const data = await deleteEvents(id)
            showAlert(data);
            setProducts(data.data)
            setLoading(true);
            setDelEvent(false)
        } catch (err) {
            console.log("Error durin del product")
        } finally {
            setLoading(false);
        }
    }

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true)
        if (!editProduct) {
            console.error("Form data is missing.");
            return;
        }
        try {
            const productData = {
                eventId: editProduct?._id,
                productTitle: editProduct?.productTitle,
                productDescription: editProduct?.productDescription,
                actualPrice: editProduct?.actualPrice,
                offerPercent: editProduct?.offerPercent || null,
                stock: editProduct?.stock,
                publicId: editProduct?.images?.map((img) => ({ public_id: img?.public_id })),
                eventImages: editProduct?.images?.map((img) => img?.file).filter((file) => file !== null),
                startDate: editProduct?.eventStart,
                endDate: editProduct?.eventEnd,
                category : editProduct?.category,
            };

            const updatedProduct = await editEvent(productData);
            setProducts((prevProducts) =>
                prevProducts.map((product) =>
                    product._id === updatedProduct.data._id ? updatedProduct.data : product
                )
            );
            showAlert(updatedProduct)
        } catch (error) {
            console.error("Error during product save:", error.message);
        } finally {
            setEditProduct(false);
            setLoading(false)
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditProduct((e) => ({ ...e, [name]: value }))
    };

    const nextImage = () => {
        if (viewProduct) {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % viewProduct.images.length)
        }
    }

    const prevImage = () => {
        if (viewProduct) {
            setCurrentImageIndex((prevIndex) => (prevIndex - 1 + viewProduct.images.length) % viewProduct.images.length)
        }
    }

    const formatDate = (date) => {
        const parsedDate = new Date(date);

        if (isNaN(parsedDate.getTime())) {
            throw new Error('Invalid Date');
        }

        const year = parsedDate.getFullYear();
        const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
        const day = String(parsedDate.getDate()).padStart(2, '0');
        const hours = String(parsedDate.getHours()).padStart(2, '0');
        const minutes = String(parsedDate.getMinutes()).padStart(2, '0');

        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    const getTimeLeft = (date) => {
        if (!date) {
            return 'Invalid Date';
        }

        const eventDate = date instanceof Date ? date : new Date(date);

        // Validate the date
        if (isNaN(eventDate.getTime())) {
            return 'Invalid Date';
        }

        const now = new Date();
        const timeLeft = eventDate.getTime() - now.getTime();

        if (timeLeft <= 0) {
            return 'Expired';
        }

        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        const pad = (num) => num.toString().padStart(2, '0');

        return `${days}d ${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
    };

    const handleImageUpload = (e) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const fileArray = Array.from(files);

        // Ensure a maximum of 4 images can be uploaded.
        if ((editProduct?.images?.length || 0) + fileArray.length > 4) {
            alert("You can only upload up to 4 images.");
            return;
        }

        // Create new image objects with file and URL.
        const newImages = fileArray.map((file) => ({
            file,
            url: URL.createObjectURL(file),
        }));

        // Update state with the new images.
        setEditProduct((prev) => {
            if (!prev) return null;
            return { ...prev, images: [...prev.images, ...newImages] };
        });
    };

    const handleRemoveImage = (index) => {
        if (editProduct) {
            const newImages = editProduct.images.filter((_, i) => i !== index)
            setEditProduct({
                ...editProduct,
                images: newImages
            })
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br to-amber-100 p-4">
            <div className="container mx-auto">
                <h1 className="text-4xl font-bold mb-8">All Events</h1>
                <div className="overflow-x-auto bg-white rounded-lg shadow-xl">
                    <table className="min-w-full">
                        <thead className="bg-gray-300 text-black">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold uppercase">Image</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold uppercase">Title</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold uppercase">Actual Price</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold uppercase">Offer (%)</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold uppercase">Offer Price</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold uppercase">Event Start</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold uppercase">Event End</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold uppercase">Actions</th>
                            </tr>
                        </thead>
                        {Loading ? (
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
                                {products.length > 0 ? products.map((product) => (
                                    <tr key={product?._id} className="border-b border-indigo-200 hover:bg-indigo-50 transition-colors">
                                        <td className="px-4 py-3">
                                            <img src={product.images[0]?.url} alt="" className="w-16 h-16 object-cover rounded-lg shadow-md" />
                                        </td>
                                        <td className="px-4 py-3 font-medium">{product.productTitle.slice(0, 20)}...</td>
                                        <td className="px-4 py-3">${product.actualPrice}</td>
                                        <td className="px-4 py-3 font-semibold">{product.offerPercent}%</td>
                                        <td className="px-4 py-3 font-semibold">${product.offerPrice.toFixed(2)}</td>
                                        <td className="px-4 py-3 font-mono">{getTimeLeft(product.eventStart)}</td>
                                        <td className="px-4 py-3 font-mono">{getTimeLeft(product.eventEnd)}</td>
                                        <td className="px-4 py-3">
                                            <button onClick={() => setViewProduct(product)} className="text-blue-500 hover:text-blue-700 mr-2 transition-colors">
                                                <FaEye size={18} />
                                            </button>
                                            <button onClick={() => setEditProduct(product)} className="text-green-500 hover:text-green-700 mr-2 transition-colors">
                                                <FaEdit size={18} />
                                            </button>
                                            <button onClick={() => { setDelEvent(product) }} className="text-red-500 hover:text-red-700 transition-colors">
                                                <FaTrash size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                )) :
                                    <tr>
                                        <td colSpan="6" className="p-5">
                                            <span className="flex items-center justify-center text-xl">Product Not Found</span>
                                        </td>
                                    </tr>
                                }
                            </tbody>
                        )}
                    </table>
                </div>
            </div>

            {/* delete pop up  */}
            {delEvent && (
                <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                        <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
                        <p className="mb-6">Are you sure you want to delete this product with this productId : "{delEvent._id}"</p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(delEvent._id)}
                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                            >
                                {Loading ? <AiOutlineLoading3Quarters size={20} className="text-white animate-spin" /> : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )
            }

            {/* view pop up  */}
            {viewProduct && (
                <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-full overflow-y-auto">
                        <div className="flex m-4 justify-between">
                            <h2 className="text-3xl font-bold">{viewProduct.productTitle}</h2>
                            <button onClick={() => setViewProduct(null)} className="top-2 right-2 text-gray-500 hover:text-gray-700 z-10">
                                <FaTimes size={24} />
                            </button>
                        </div>
                        <div className="relative">
                            <div className="relative h-64 sm:h-96 bg-indigo-100">
                                <img src={viewProduct.images[currentImageIndex].url} alt="" className="w-full h-full object-contain" />
                                <button onClick={prevImage} className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-indigo-100 transition-colors">
                                    <FaArrowLeft />
                                </button>
                                <button onClick={nextImage} className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-indigo-100 transition-colors">
                                    <FaArrowRight />
                                </button>
                            </div>
                            <div className="flex space-x-2 overflow-x-auto mb-3 ml-6 mt-4">
                                {viewProduct.images.map((image, index) => (
                                    <img
                                        key={index}
                                        src={image.url}
                                        alt=""
                                        className={`w-20 h-20 object-cover cursor-pointer rounded-md ${index === currentImageIndex ? 'ring-2 ring-indigo-500' : ''}`}
                                        onClick={() => setCurrentImageIndex(index)}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="p-6">
                            <p className="text-gray-600 mb-4">{viewProduct.productDescription}</p>
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-2xl">Price :
                                    <span className='text-blue-600 line-through ml-2'>${viewProduct.actualPrice.toFixed(2)}</span>
                                    <span className='ml-4'>${viewProduct.offerPrice.toFixed(2)}</span>
                                </span>
                                <span className="text-xl font-bold text-amber-600">{viewProduct.offerPercent}% OFF</span>
                            </div>
                            <div className="mb-2">
                                <p>Category :
                                    <span className="text-blue-400 ml-1">
                                        {viewProduct.category}
                                    </span>
                                </p>
                                <p>Start Date :
                                    <span className="text-blue-400 ml-1">
                                        {viewProduct.eventStart ? formatDate(viewProduct.eventStart) : 'Event Start'}
                                    </span>
                                </p>
                                <p>End Date :
                                    <span className="text-blue-400 ml-1">
                                        {viewProduct.eventEnd ? formatDate(viewProduct.eventEnd) : 'Event End'}
                                    </span>
                                </p>
                                <p>Time Left : <span className='text-blue-400'>{getTimeLeft(viewProduct.eventEnd)}</span></p>
                            </div>
                        </div>
                        <div className="ml-6 mb-2">
                            <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => setEditProduct(viewProduct)}>
                                Edit
                            </button>
                        </div>
                    </div>
                </div>
            )
            }

            {/* edit product pop up  */}
            {editProduct && (
                <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-full overflow-y-auto">
                        <div className="p-6 relative">
                            <button onClick={() => setEditProduct(null)} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
                                <FaTimes size={24} />
                            </button>
                            <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
                            <form onSubmit={handleSave} key={editProduct._key}>
                                <div className="mb-4">
                                    <label htmlFor="title" className="block font-bold mb-2">Title</label>
                                    <input
                                        type="text"
                                        id="productTitle"
                                        name="productTitle"
                                        value={editProduct.productTitle}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="description" className="block font-bold mb-2">Description</label>
                                    <textarea
                                        id="productDescription"
                                        name="productDescription"
                                        value={editProduct.productDescription}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        rows={3}
                                        required
                                    ></textarea>
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="price" className="block font-bold mb-2">Price</label>
                                    <input
                                        type="number"
                                        id="actualPrice"
                                        name="actualPrice"
                                        value={editProduct.actualPrice}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="offerPercent" className="block font-bold mb-2">Offer Percent</label>
                                    <input
                                        type="number"
                                        id="offerPercent"
                                        name="offerPercent"
                                        value={editProduct.offerPercent}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                                        value={editProduct.category}
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
                                <div className="mb-4">
                                    <label htmlFor="eventStart" className="block font-bold mb-2">End Date</label>
                                    <input
                                        type="datetime-local"
                                        id="eventStart"
                                        name="eventStart"
                                        value={formatDate(editProduct.eventStart)}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="eventEnd" className="block font-bold mb-2">End Date</label>
                                    <input
                                        type="datetime-local"
                                        id="eventEnd"
                                        name="eventEnd"
                                        value={formatDate(editProduct.eventEnd)}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block font-bold mb-2">Images</label>
                                    <div className="grid grid-cols-3 gap-4 mb-2">
                                        {editProduct.images.map((image, index) => (
                                            <div key={index} className="relative">
                                                <img src={image.url || URL.createObjectURL(image)} alt="" className="w-full h-32 object-cover rounded-lg" />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveImage(index)}
                                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                                >
                                                    <FaTimes size={12} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex w-full">
                                        <input
                                            id="eventImages"
                                            type="file"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                            multiple
                                            accept="image/*"
                                        />
                                        <label
                                            htmlFor="eventImages"
                                            className={`cursor-pointer p-3 rounded shadow flex items-center ${editProduct.images.length >= 4
                                                ? "bg-gray-400 cursor-not-allowed text-gray-500"
                                                : "bg-yellow-500 hover:bg-yellow-600 text-gray-800"
                                                }`}
                                        >
                                            <FaUpload className="mr-2" />
                                            {editProduct.images.length >= 4 ? "Limit Reached" : "Upload Image"}
                                        </label>
                                    </div>
                                </div>
                                <div className="flex justify-end space-x-2">
                                    <button
                                        type="button"
                                        onClick={() => setEditProduct(null)}
                                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                                    >
                                        {Loading ? <AiOutlineLoading3Quarters size={20} className="text-white animate-spin" /> : "Save"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )
            }
        </div >
    )
}

export default admin_Events
