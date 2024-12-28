import React, { useRef } from 'react';
import { FaHeart, FaEye, FaShoppingCart, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { productData as items } from "../../../../Static/static.jsx";
import { Link } from "react-router"

const BestDealsPage = () => {
    const scrollContainerRef = useRef(null);

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

    return (
        <div className="p-4">
            <div className="flex items-center mb-4">
                <h2 className="text-2xl font-bold">Best Deals</h2>
            </div>

            <div className="relative">
                <div ref={scrollContainerRef} className="flex space-x-4 overflow-hidden mb-6">
                    {items.map((e) => (
                        <div key={e.id} className="min-w-[270px] flex-shrink-0 ml-7 border rounded p-2 shadow-md text-sm mb-6">
                            <Link to={`/product/${e.id}`} className='flex justify-center'>
                                <img src={e.image_Url[0].url || e.image_Url[1].url} alt="" className="w-52 h-52 object-cover mb-5" />
                            </Link>
                            <Link to={`/shop/${e.shop.name}`}>
                                <h3 className="text-gray-500 truncate text-sm mb-1">{e.shop.name}</h3>
                            </Link>
                            <h2 className="font-semibold truncate mb-2">{e.name.slice(0, 30)}...</h2>
                            <div className="flex items-center justify-between mb-2">
                                {e.discount_price && (
                                    <span className="text-gray-400 line-through">${e.discount_price}</span>
                                )}
                                <span className="text-green-500 ml-4 font-bold">${e.price || 50}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500 text-sm">{e.total_sell} sold</span>
                                <div className="flex space-x-2">
                                    <FaHeart size={20} className="text-gray-400 hover:text-red-500 cursor-pointer" />
                                    <FaEye size={20} className="text-gray-400 hover:text-blue-500 cursor-pointer" />
                                    <FaShoppingCart size={20} className="text-gray-400 hover:text-green-500 cursor-pointer" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Navigation Arrows */}
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
            </div>
        </div>
    );
};

export default BestDealsPage;
