import React, { useContext, useRef, useState, useEffect } from "react"
import { FaEye, FaHeart, FaShoppingCart, FaChevronRight, FaChevronLeft } from "react-icons/fa"
import { ContextApi } from "../../../Context/Context"
import { useParams, Link } from "react-router-dom"
import { AiOutlineLoading3Quarters } from "react-icons/ai"
import {timeLeft} from "../../../utils/timeLeft.jsx"

const SuggestedItems = () => {
    const {id,category} = useParams();
    const { getAllProducts } = useContext(ContextApi).adminProducts;
    const { fetchAllEvents } = useContext(ContextApi).adminEvents;
    const [products, setProducts] = useState([]);
    const [events, setEvents] = useState([]);
    const eventsScrollRef = useRef(null)
    const productsScrollRef = useRef(null)
    const [showLeftArrow, setShowLeftArrow] = useState({ events: false, products: false })
    const [showRightArrow, setShowRightArrow] = useState({ events: true, products: true })
    const [Loading, setLoading] = useState(false);

    const getProducts = async () => {
        try {
            setLoading(true);
            const data = await getAllProducts();

            let exactData = data.allProducts.filter((e) => e?._id !== id && e?.category.replace(/-/g, " ") === category);

            if (exactData.length < 10) {
                const remainingCount = 10 - exactData.length;
                const additionalProducts = data.allProducts
                    .filter((e) => e?._id !== id && !exactData.includes(e))
                    .sort(() => Math.random() - 0.5)
                    .slice(0, remainingCount);

                exactData = [...exactData, ...additionalProducts];
            }

            setProducts(exactData);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    const getEvents = async () => {
        try {
            setLoading(true);
            const data = await fetchAllEvents();

            let exactData = data.allEvents.filter((e) => e?._id !== id && e?.category.replace(/-/g, " ") === category);

            if (exactData.length < 10) {
                const remainingCount = 10 - exactData.length;
                const additionalProducts = data.allEvents
                    .filter((e) => e?._id !== id && !exactData.includes(e))
                    .sort(() => Math.random() - 0.5)
                    .slice(0, remainingCount);

                exactData = [...exactData, ...additionalProducts];
            }

            setEvents(exactData);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getProducts()
        getEvents();
    }, [])

    // time left 
    useEffect(() => {
        const interval = setInterval(() => {
            setEvents(prevEvents => prevEvents.map(e => ({
                ...e,
                timeLeft: timeLeft(e.eventStart)
            })));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const scroll = (ref, direction) => {
        if (ref.current) {
            const scrollAmount = direction === "left" ? -200 : 200
            ref.current.scrollBy({ left: scrollAmount, behavior: "smooth" })
        }
    }

    const checkScrollPosition = (ref, section) => {
        if (ref.current) {
            const { scrollLeft, scrollWidth, clientWidth } = ref.current
            setShowLeftArrow((prev) => ({ ...prev, [section]: scrollLeft > 0 }))
            setShowRightArrow((prev) => ({ ...prev, [section]: scrollLeft < scrollWidth - clientWidth - 1 }))
        }
    }

    useEffect(() => {
        const eventsRef = eventsScrollRef.current
        const productsRef = productsScrollRef.current

        const handleScroll = (ref, section) => {
            checkScrollPosition({ current: ref }, section)
        }

        if (eventsRef) {
            eventsRef.addEventListener("scroll", () => handleScroll(eventsRef, "events"))
            checkScrollPosition(eventsScrollRef, "events")
        }

        if (productsRef) {
            productsRef.addEventListener("scroll", () => handleScroll(productsRef, "products"))
            checkScrollPosition(productsScrollRef, "products")
        }

        return () => {
            if (eventsRef) {
                eventsRef.removeEventListener("scroll", () => handleScroll(eventsRef, "events"))
            }
            if (productsRef) {
                productsRef.removeEventListener("scroll", () => handleScroll(productsRef, "products"))
            }
        }
    }, [eventsScrollRef, productsScrollRef]) // Added dependencies to useEffect

    const ScrollButton = ({ onClick, direction }) => (
        <button
            onClick={onClick}
            className={`absolute top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 ${direction === "left" ? "left-0" : "right-0"
                }`}
        >
            {direction === "left" ? (
                <FaChevronLeft className="text-gray-600" />
            ) : (
                <FaChevronRight className="text-gray-600" />
            )}
        </button>
    )


    return (
        <div className="container mx-auto px-4 py-8">
            {/* Events Section */}
            <div className="mb-12">
                <h2 className="text-2xl font-bold mb-4">Related Events</h2>
                {Loading ? (
                    <div className="flex justify-center items-center">
                        <AiOutlineLoading3Quarters size={35} className="animate-spin tex-black" />
                    </div>
                ) : (
                    <div className="relative">
                        <div ref={eventsScrollRef} className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide">
                            {events.map((event) => (
                                <div key={event?._id} className="flex-none w-72 bg-white rounded-lg shadow-md">
                                    <Link to={`/event/${e?.category?.replace(/\s+/g, "-")}/${e._id}`}>
                                        <img src={event?.images[0]?.url || "/placeholder.svg"} className="w-full h-40 object-contain rounded-lg" />
                                    </Link>
                                    <div className="p-4">
                                        <Link to={`/admin_Shop/${event?.shopInfo?.shopId}`}>
                                            <h3 className="text-gray-500 truncate text-sm mb-1">{event?.shopInfo?.shopName || "Shop Name"}</h3>
                                        </Link>
                                        <h3 className="font-semibold text-lg mb-2">{event?.productTitle.slice(0, 30)}...</h3>
                                        {event?.offerPrice ? (
                                            <div className="flex justify-between mb-3">
                                                <div className="flex gap-5">
                                                    <span className="text-sm text-gray-500 line-through mt-[3px]">${event?.actualPrice || 0}</span>
                                                    <span className="text-lg font-bold text-green-600">${event?.offerPrice || 0}</span>
                                                </div>
                                                <span className="text-sm text-red-500 mt-[1px]">{event?.offerPercent || 0}% off</span>
                                            </div>
                                        ) : (
                                            <span className="text-lg font-bold text-green-600 mb-3">${event?.actualPrice}</span>
                                        )}
                                        <span className='font-bold'>{event.timeLeft}</span>
                                        <button
                                            className={`w-full py-1 mt-2 rounded-lg ${new Date(event.eventStart) > new Date() ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
                                            disabled={new Date(event.eventStart) > new Date()}
                                        >
                                            {new Date(event.eventStart) > new Date() ? 'Coming Soon' : 'Add To Cart'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {showLeftArrow.events && <ScrollButton onClick={() => scroll(eventsScrollRef, "left")} direction="left" />}
                        {showRightArrow.events && <ScrollButton onClick={() => scroll(eventsScrollRef, "right")} direction="right" />}
                    </div>
                )}
            </div>

            {/* Products Section */}
            <div>
                <h2 className="text-2xl font-bold mb-4">Related Products</h2>
                {Loading ? (
                    <div className="flex justify-center items-center">
                        <AiOutlineLoading3Quarters size={35} className="animate-spin tex-black" />
                    </div>
                ) : (
                    <div className="relative">
                        <div ref={productsScrollRef} className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide">
                            {products.map((product) => (
                                <div key={product?._id} className="flex-none w-72 bg-white rounded-lg shadow-md p-4">
                                    <Link to={`/product/${product?.category?.replace(/\s+/g, "-")}/${product?._id}`} className="flex justify-center">
                                        <img src={product?.images[0]?.url || "/placeholder.svg"}
                                            className="w-full h-48 object-contain rounded-lg mb-4" />
                                    </Link>
                                    <Link to={`/admin_Shop/${product?.shopInfo?.shopId}`}>
                                        <h3 className="text-gray-500 truncate text-sm mb-1">{product?.shopInfo?.shopName || "Shop Name"}</h3>
                                    </Link>
                                    <h3 className="font-semibold text-lg mb-2">{product?.productTitle.slice(0, 24)}...</h3>
                                    {product?.offerPrice ? (
                                        <div className="flex justify-between mb-3">
                                            <div className="flex gap-5">
                                                <span className="text-sm text-gray-500 line-through mt-[3px]">${product?.actualPrice || 0}</span>
                                                <span className="text-lg font-bold text-green-600">${product?.offerPrice || 0}</span>
                                            </div>
                                            <span className="text-sm text-red-500 mt-[1px]">{product?.offerPercent || 0}% off</span>
                                        </div>
                                    ) : (
                                        <span className="text-lg font-bold text-green-600 mb-3">${product?.actualPrice}</span>
                                    )}
                                    <div className="flex justify-between mb-0">
                                        <button className="p-2 text-gray-600 hover:text-blue-600 transition duration-300">
                                            <FaEye />
                                        </button>
                                        <button className="p-2 text-gray-600 hover:text-red-600 transition duration-300">
                                            <FaHeart />
                                        </button>
                                        <button className="p-2 text-gray-600 hover:text-green-600 transition duration-300">
                                            <FaShoppingCart />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {showLeftArrow.products && (
                            <ScrollButton onClick={() => scroll(productsScrollRef, "left")} direction="left" />
                        )}
                        {showRightArrow.products && (
                            <ScrollButton onClick={() => scroll(productsScrollRef, "right")} direction="right" />
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default SuggestedItems
