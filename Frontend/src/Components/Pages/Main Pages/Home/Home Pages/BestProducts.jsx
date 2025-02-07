import React, { useState, useRef, useContext, useEffect } from 'react';
import { FaHeart, FaEye, FaShoppingCart, FaArrowLeft, FaArrowRight, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { Link } from "react-router";
import { ContextApi } from '../../../../../Context/Context';

const BestProducts = () => {
    const scrollContainerRef = useRef(null);
    const { getAllProducts } = useContext(ContextApi).adminProducts;
    const [items, setItems] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState({});
    const [itemLength, setItemLength] = useState(0);
    const [Loading, setLoading] = useState(false);

    const getProducts = async () => {
        try {
            const data = await getAllProducts();
            setLoading(true)
            const extartData = data.allProducts.sort((a, b) => {
                const product1 = a.offerPrice || a.actualPrice
                const product2 = b.offerPrice || b.actualPrice
                return product1 - product2
            }).slice(0, 10);
            setItemLength(extartData.length)
            setItems(extartData);
        } catch (error) {
            return error.message
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getProducts();
    }, []);

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -370, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 370, behavior: 'smooth' });
        }
    };

    const changeImage = (id, direction) => {
        setCurrentImageIndex((prev) => {
            const newIndex = { ...prev };
            const item = items.find((i) => i.id === id);
            if (item) {
                const totalImages = item.images.length;
                const currentIndex = prev[id] || 0;
                newIndex[id] =
                    direction === "next"
                        ? (currentIndex + 1) % totalImages
                        : (currentIndex - 1 + totalImages) % totalImages;
            }
            return newIndex;
        });
    };

    return (
        <div className="p-4">
            <div className="flex items-center mb-4">
                <h2 className="text-2xl font-bold">Best Deals</h2>
            </div>

            {Loading ? (
                <div className="flex items-center justify-center">
                    <AiOutlineLoading3Quarters size={45} className="text-green-500 animate-spin" />
                </div>
            ) : (
                <div className="relative">
                    <div ref={scrollContainerRef} className="flex space-x-4 overflow-hidden mb-6">
                        {items.map((e) => (
                            <div key={e?._id} className="min-w-[270px] flex-shrink-0 ml-7 border rounded p-2 shadow-md text-sm mb-6">
                                <Link to={`/product/${e?.category?.replace(/\s+/g, "-")}/${e?._id}`} className='flex justify-center'>
                                    <img src={e?.images[0]?.url || ""} alt="" className="w-40 h-40 object-cover rounded-lg mb-6" />
                                </Link>
                                <Link to={`/admin_Shop/${e.shopInfo?.shopId}`}>
                                    <h3 className="text-gray-500 truncate text-sm mb-1">{e?.shopInfo?.shopName || "shopName"}</h3>
                                </Link>
                                <h2 className="font-semibold truncate mb-2">{e?.productTitle.slice(0, 30)}...</h2>
                                <div className="flex items-center justify-between mb-2">
                                    {e?.giveOffer ? (
                                        <>
                                            <span className="text-gray-400 line-through">${e?.actualPrice || 0}</span>
                                            <span className="text-green-500 ml-20 font-bold">${e?.offerPrice || 0}</span>
                                        </>
                                    ) : (
                                        <span className="text-green-500 font-bold">${e?.actualPrice || 0}</span>
                                    )}
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500 text-sm">{e?.total_sell || 0} sold</span>
                                    <div className="flex space-x-2">
                                        <FaHeart size={20} className="text-gray-400 hover:text-red-500 cursor-pointer" />
                                        <FaEye size={20} onClick={() => { setSelectedProduct(e) }} className="text-gray-400 hover:text-blue-500 cursor-pointer" />
                                        <FaShoppingCart size={20} className="text-gray-400 hover:text-green-500 cursor-pointer" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Navigation Arrows */}
                    {itemLength > 4 ? (
                        <>

                            <button
                                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-500 text-white p-2 rounded disabled:opacity-50"
                                onClick={scrollLeft}
                                disabled={items.length < 0}
                            >
                                <FaArrowLeft />
                            </button>
                            <button
                                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-500 text-white p-2 rounded disabled:opacity-50"
                                onClick={scrollRight}
                            >
                                <FaArrowRight />
                            </button>
                        </>
                    ) : null}
                </div>
            )}

            {/* Product Popup */}
            <div>
                {selectedProduct && (
                    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-4">
                                <button onClick={() => setSelectedProduct(null)} className="text-gray-600 hover:text-gray-800">
                                    <FaArrowLeft size={24} />
                                </button>
                            </div>
                            <div className="p-4">
                                <div className="relative h-64">
                                    <img
                                        src={selectedProduct?.images[currentImageIndex[selectedProduct?.id]]?.url || ""}
                                        alt=""
                                        className="w-full h-full object-contain rounded-lg"
                                    />
                                    {selectedProduct?.images.length > 1 && (
                                        <>
                                            <button
                                                onClick={() => changeImage(selectedProduct.id, "prev")}
                                                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
                                            >
                                                <FaChevronLeft />
                                            </button>
                                            <button
                                                onClick={() => changeImage(selectedProduct.id, "next")}
                                                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
                                            >
                                                <FaChevronRight />
                                            </button>
                                        </>
                                    )}
                                </div>
                                <div className="flex mt-4 overflow-x-auto">
                                    {selectedProduct?.images.map((image, index) => (
                                        <img
                                            key={index}
                                            src={image?.url || "/placeholder.svg"}
                                            alt=""
                                            className={`w-16 h-16 object-cover rounded-lg mr-2 cursor-pointer ${index === (currentImageIndex[selectedProduct.id] || 0) ? "border-2 border-blue-500" : ""
                                                }`}
                                            onClick={() => setCurrentImageIndex({ ...currentImageIndex, [selectedProduct.id]: index })}
                                        />
                                    ))}
                                </div>
                                <h2 className="text-2xl font-bold mt-4">{selectedProduct?.productTitle}</h2>
                                <p className="text-gray-600 mt-2">{selectedProduct?.productDescription}</p>
                                <div className="mt-4">
                                    {selectedProduct?.giveOffer ? (
                                        <div className="flex justify-between">
                                            <div className="flex">
                                                <p className="text-xl text-gray-500 font-bold line-through">${selectedProduct?.actualPrice.toFixed(2)}</p>
                                                <p className="text-xl font-bold ml-4">${selectedProduct?.offerPrice.toFixed(2)}</p>
                                            </div>
                                            <p className="text-xl text-green-500 font-bold ml-4">{selectedProduct?.offerPercent.toFixed(1)}% OFF</p>
                                        </div>
                                    ) : (
                                        <p className="text-xl font-bold">${selectedProduct?.actualPrice.toFixed(2)}</p>
                                    )}
                                </div>
                                <button className="w-full bg-blue-500 text-white py-2 rounded-lg mt-4 hover:bg-blue-600 transition-colors">
                                    <FaShoppingCart className="inline-block mr-2" /> Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BestProducts;
