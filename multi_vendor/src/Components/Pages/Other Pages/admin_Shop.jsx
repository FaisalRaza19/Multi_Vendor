import { useState, useEffect } from "react"
import { FaArrowLeft, FaShoppingBag, FaCalendarAlt, FaEye, FaHeart, FaShoppingCart, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { fetchShop } from "../../../Redux/Redux Store/products&Events";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router";

const admin_Shop = () => {
  const { id } = useParams();
  const [items, setItems] = useState({});
  const dispatch = useDispatch();
  const [showProducts, setShowProducts] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [hoveredEvent, setHoveredEvent] = useState(null)
  const [currentImageIndex, setCurrentImageIndex] = useState({})
  const { shop, status, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchShop(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (status === "succeeded") {
      setItems(shop.data?.shop);
      const timer = setInterval(() => {
        setItems(prevItems => ({
          ...prevItems,
          events: prevItems.events.map(event => ({
            ...event,
            timeLeft: getTimeLeft(event.eventEnd),
          })),
        }));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [shop, status]);

  const products = items?.products || [];
  const events = items?.events || [];



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

  const changeImage = (id, direction) => {
    setCurrentImageIndex((prev) => {
      const newIndex = { ...prev }
      const item = [...items.products, ...items.events].find((i) => i.id === id)
      if (item) {
        const totalImages = item.images.length
        const currentIndex = prev[id] || 0
        newIndex[id] =
          direction === "next" ? (currentIndex + 1) % totalImages : (currentIndex - 1 + totalImages) % totalImages
      }
      return newIndex
    })
  }
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {status === "loading" ? (
        <div className="flex justify-center items-center w-full h-full">
          <AiOutlineLoading3Quarters size={70} className="text-green-500 animate-spin" />
        </div>
      ) : status === "succeeded" ? (
        <>
          {/* Sidebar */}
          <div className="bg-white shadow-lg overflow-hidden">
            <div className="w-72 h-full flex flex-col">
              <div className="p-4 flex justify-between items-center">
                <Link to="/">
                  <button className="text-gray-600 hover:text-gray-800">
                    <FaArrowLeft size={24} />
                  </button>
                </Link>
              </div>
              <div className="flex-1 overflow-y-auto p-4 mt-3">
                <h2 className="text-2xl font-bold mb-5">{items?.shopName || "Shop Name"}</h2>
                <img src={items?.shopLogo?.url || "/placeholder.svg"} alt="" className="w-full h-40 object-cover rounded-lg mb-6" />
                <p className="text-sm text-gray-600">
                  {items?.shopDescription || "Welcome to our shop! We offer a wide range of products and exciting events."}
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <header className="bg-white shadow-md p-4 flex justify-between items-center">
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowProducts(true)}
                  className={`px-4 py-2 rounded-lg ${showProducts ? "bg-blue-500 text-white" : "text-gray-600 hover:bg-gray-100"
                    }`}
                >
                  <FaShoppingBag className="inline-block mr-2" /> Products
                </button>
                <button
                  onClick={() => setShowProducts(false)}
                  className={`px-4 py-2 rounded-lg ${!showProducts ? "bg-blue-500 text-white" : "text-gray-600 hover:bg-gray-100"
                    }`}
                >
                  <FaCalendarAlt className="inline-block mr-2" /> Events
                </button>
              </div>
            </header>

            {/* Content */}
            <main className="flex overflow-y-auto p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {showProducts
                  ? products.map((e) => (
                    <div key={e?._id} className="bg-white w-auto rounded-lg shadow-md p-4">
                      <img src={e?.images[0]?.url || "/placeholder.svg"} alt="" className="w-full h-64 object-cover rounded-lg mb-2" />
                      <h3 className="font-bold text-lg">{e?.productTitle.slice(0, 25)}...</h3>
                      {e?.giveOffer ? (
                        <div className="flex">
                          <p className="text-gray-500 line-through">${e?.actualPrice.toFixed(2)}</p>
                          <p className="text-black ml-5">${e?.offerPrice.toFixed(2)}</p>
                        </div>
                      ) : (
                        <p className="text-gray-600 ">${e?.actualPrice.toFixed(2)}</p>
                      )}
                      <div className="flex justify-between mt-2">
                        <button
                          onClick={() => setSelectedProduct(e)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <FaEye />
                        </button>
                        <button className="text-red-500 hover:text-red-700">
                          <FaHeart />
                        </button>
                        <button className="text-green-500 hover:text-green-700">
                          <FaShoppingCart />
                        </button>
                      </div>
                    </div>
                  ))
                  : events.map((e) => (
                    <div key={e?._id} className="bg-white rounded-lg shadow-md p-4">
                      <div className="relative h-48 mb-2" onMouseEnter={() => setHoveredEvent(e?.id)} onMouseLeave={() => setHoveredEvent(null)}>
                        <img
                          src={e?.images[currentImageIndex[e?.images?.id] || 0]?.url || "/placeholder.svg"}
                          alt=""
                          className="w-full h-full object-contain rounded-lg"
                        />
                        {hoveredEvent === e?.id && e?.images.length > 1 && (
                          <>
                            <button
                              onClick={() => changeImage(e?.id, "prev")}
                              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
                            >
                              <FaChevronLeft />
                            </button>
                            <button
                              onClick={() => changeImage(e?.id, "next")}
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
                            >
                              <FaChevronRight />
                            </button>
                          </>
                        )}
                      </div>
                      <h3 className="font-bold text-lg">{e?.productTitle}</h3>
                      <p className="text-sm text-gray-600 mb-2">{e.productDescription}</p>
                      <p className="text-gray-600">${getTimeLeft(e.eventEnd) === "Expired" ? e.actualPrice : e.offerPrice}</p>
                      <p className="text-sm text-gray-500 mb-2">Starts: {getTimeLeft(e.eventStart)}</p>
                      <p className="text-sm font-semibold mb-2">Time left: {getTimeLeft(e.eventEnd)}</p>
                      <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors">
                        <FaShoppingCart className="inline-block mr-2" /> Add to Cart
                      </button>
                    </div>
                  ))}
              </div>
            </main>
          </div>

          {/* Product Popup */}
          <div>
            {selectedProduct && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-4">
                    <button onClick={() => setSelectedProduct(null)} className="text-gray-600 hover:text-gray-800">
                      <FaArrowLeft size={24} />
                    </button>
                  </div>
                  <div className="p-4">
                    <div className="relative h-64">
                      <img
                        src={selectedProduct?.images[currentImageIndex[selectedProduct.id] || 0]?.url}
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
        </>
      ) : (
        <div className="flex items-center justify-center h-52">
          <p className="text-red-500">{error}</p>
        </div>
      )
      }
    </div>
  )
};

export default admin_Shop;

