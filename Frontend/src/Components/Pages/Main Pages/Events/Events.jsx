import React, { useState, useEffect, useContext } from 'react';
import { ContextApi } from '../../../../Context/Context.jsx';
import { timeLeft } from '../../../../utils/timeLeft.jsx';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const Events = () => {
    const { showAlert, adminEvents } = useContext(ContextApi);
    const { fetchAllEvents } = adminEvents;
    const [items, setItems] = useState([]);
    const [visibleProducts, setVisibleProducts] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentImageIndex, setCurrentImageIndex] = useState({});
    const [loading, setLoading] = useState(false);
    const [totalEvents, setTotalEvents] = useState(0);

    const productsPerPage = 10;
    const totalPages = Math.ceil(totalEvents / productsPerPage);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const data = await fetchAllEvents();
            const updatedEvents = data.allEvents.map(event => ({
                ...event,
                timeLeft: timeLeft(event.eventStart)
            }));
            setItems(updatedEvents);
            setTotalEvents(updatedEvents.length);
            showAlert(data);
        } catch (error) {
            console.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setItems(prevEvents => prevEvents.map(e => ({
                ...e,
                timeLeft: timeLeft(e.eventStart)
            })));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + visibleProducts;
    const displayedProducts = items.slice(startIndex, endIndex);

    const handleShowMore = () => {
        setVisibleProducts(prev => Math.min(prev + 5, productsPerPage));
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        setVisibleProducts(10);
    };

    const changeImage = (id, direction) => {
        setCurrentImageIndex(prev => {
            const item = items.find(e => e._id === id);
            if (!item || !item.images.length) return prev;

            const totalImages = item.images.length;
            const currentIndex = prev[id] || 0;

            return {
                ...prev,
                [id]: direction === "next"
                    ? (currentIndex + 1) % totalImages
                    : (currentIndex - 1 + totalImages) % totalImages
            };
        });
    };

    return (
        <div className="p-4">
            {loading ? (
                <div className="h-screen mt-32 flex items-center justify-center">
                    <AiOutlineLoading3Quarters size={45} className="text-green-500 animate-spin" />
                </div>
            ) : (
                <div className="relative mt-32">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-6">
                        {displayedProducts.map(e => (
                            <div key={e._id} className="min-w-[270px] flex-shrink-0 ml-7 border rounded p-2 shadow-md text-sm mb-6 relative">
                                <div className="flex justify-center relative">
                                    {e.images?.length > 1 && (
                                        <button onClick={() => changeImage(e._id, "prev")} className="absolute top-20 left-0 bg-black bg-opacity-50 p-2 rounded-full">
                                            <FaChevronLeft className="text-white" />
                                        </button>
                                    )}
                                    <Link to={`/event/${e?.category?.replace(/\s+/g, "-")}/${e._id}`}>
                                        <img src={e?.images?.[currentImageIndex[e._id] || 0]?.url || ""} className="w-ful h-40 object-contain mb-3" />
                                    </Link>
                                    {e.images?.length > 1 && (
                                        <button onClick={() => changeImage(e._id, "next")} className="absolute top-20 right-0 bg-black bg-opacity-50 p-2 rounded-full">
                                            <FaChevronRight className="text-white" />
                                        </button>
                                    )}
                                </div>
                                <Link to={`/admin_Shop/${e?.shopInfo?.shopId}`}>
                                    <h3 className="text-gray-500 truncate text-sm mb-1">{e?.shopInfo?.shopName || "Shop Name"}</h3>
                                </Link>
                                <h2 className="font-semibold truncate mb-2">{e?.productTitle?.slice(0, 30) || ""}...</h2>
                                <div className="mb-2">
                                    {e?.offerPrice ? (
                                        <div className='flex relative justify-between'>
                                            <div className="flex gap-5">
                                                <span className="text-gray-400 line-through">${e?.actualPrice || 0}</span>
                                                <span className="text-green-500 font-bold">${e?.offerPrice || 0}</span>
                                            </div>
                                            <span className="text-green-500 font-bold">{e?.offerPercent || 0}% off</span>
                                        </div>
                                    ) : (
                                        <span className="text-green-500 font-bold">${e?.actualPrice || 0}</span>
                                    )}
                                </div>
                                <span className='font-bold'>{e.timeLeft}</span>
                                <button
                                    className={`w-full py-1 mt-2 rounded-lg ${new Date(e.eventStart) > new Date() ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
                                    disabled={new Date(e.eventStart) > new Date()}
                                >
                                    {new Date(e.eventStart) > new Date() ? 'Coming Soon' : 'Add To Cart'}
                                </button>
                            </div>
                        ))}
                    </div>
                    {visibleProducts < productsPerPage && endIndex < totalEvents && (
                        <div className="text-center mt-6">
                            <button onClick={handleShowMore} className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-600 transition">
                                Show More
                            </button>
                        </div>
                    )}
                    {totalPages > 1 && (
                        <div className="flex justify-center mt-6 space-x-2">
                            {Array.from({ length: totalPages }, (_, index) => (
                                <button
                                    key={index + 1}
                                    onClick={() => handlePageChange(index + 1)}
                                    className={`px-4 py-2 rounded-lg shadow-md transition ${currentPage === index + 1
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-200 hover:bg-gray-300"
                                        }`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Events;

