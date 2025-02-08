import React, { useState, useEffect, useContext } from "react"
import { FaArrowLeft, FaShoppingBag, FaCalendarAlt, FaEye, FaHeart, FaShoppingCart, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { timeLeft } from "../../../utils/timeLeft.jsx"
import { useParams, Link } from "react-router";
import { ContextApi } from "../../../Context/Context";

const admin_Shop = () => {
  const { shopId } = useParams();
  const { showAlert, adminAuth } = useContext(ContextApi);
  const { userGetShop } = adminAuth;
  const [items, setItems] = useState({});
  const [showProducts, setShowProducts] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [hoveredEvent, setHoveredEvent] = useState(null)
  const [currentImageIndex, setCurrentImageIndex] = useState({})
  const [Loading, setLoading] = useState(false);

  const fetchShop = async () => {
    try {
      const data = await userGetShop(shopId);
      setLoading(true);
      setItems(data.data.shop);;
      showAlert(data)
    } catch (error) {
      return error
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchShop()
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setItems((prevItems) => ({
        ...prevItems,
        events: prevItems.events?.map((event) => ({
          ...event,
          timeLeft: timeLeft(event.eventStart),
        })),
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const products = items?.products || [];
  const events = items?.events || [];

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
      {Loading ? (
        <div className="flex justify-center items-center w-full h-full">
          <AiOutlineLoading3Quarters size={70} className="text-green-500 animate-spin" />
        </div>
      ) : (
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
                      <Link to={`/product/${e?.category?.replace(/\s+/g, "-")}/${e?._id}`}>
                        <img src={e?.images[0]?.url || "/placeholder.svg"} alt="" className="w-full h-64 object-contain rounded-lg mb-2" />
                      </Link>
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
                        <Link to={`/event/${e?.category?.replace(/\s+/g, "-")}/${e._id}`}>
                          <img src={e?.images[currentImageIndex[e?.images?.id] || 0]?.url || "/placeholder.svg"} alt="" className="w-full h-full object-contain rounded-lg" />
                        </Link>
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
                      <div className="mb-2">
                        {e?.offerPrice ? (
                          <div className='flex relative justify-between'>
                            <div className="flex gap-5">
                              <span className="text-gray-400 line-through">${e?.actualPrice || 0}</span>
                              <span className="text-green-500 font-bold">${e?.offerPrice || 0}</span>
                            </div>
                            <span className="text-green-500 not-only-of-type:font-bold">{e?.offerPercent || 0}% off</span>
                          </div>
                        ) : (
                          <span className="text-green-500 font-bold">${e?.actualPrice || 0}</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mb-2">Starts: {e.timeLeft}</p>
                      <p className="text-sm font-semibold mb-2">Time left: {e.timeLeft}</p>
                      <button disabled={new Date(e.eventStart) > new Date()} className={`w-full py-1 mt-2 rounded-lg ${new Date(e.eventStart) > new Date() ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}>
                        <FaShoppingCart className="inline-block mr-2" /> {new Date(e.eventStart) > new Date() ? 'Coming Soon' : 'Add To Cart'}
                      </button>
                    </div>
                  ))}
              </div>
            </main>
          </div>

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
      )
      }
    </div>
  )
};

export default admin_Shop;
