import React, { useState, useEffect, useCallback, useContext } from "react";
import { FaTag, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { ContextApi } from "../../../../../Context/Context.jsx";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const PopularEvents = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [items, setItems] = useState([]);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });
  const [loading, setLoading] = useState(false);
  const [eventLength, setEventLength] = useState(0)
  const { fetchAllEvents } = useContext(ContextApi).adminEvents;

  const getEvents = async () => {
    try {
      setLoading(true);
      const data = await fetchAllEvents();
      const extractData = data?.allEvents.sort((a, b) => {
        const product1 = a.offerPrice || a.actualPrice
        const product2 = b.offerPrice || b.actualPrice
        return product1 - product2
      }).slice(0, 10);
      setEventLength(extractData.length)
      setItems(extractData);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getEvents();
  }, []);

  useEffect(() => {
    if (items.length > 0) {
      const updateCountdown = () => {
        const now = Date.now();
        const end = new Date(items[currentIndex]?.eventEnd).getTime();
        const diff = end - now;

        if (diff > 0) {
          setTimeLeft({
            days: Math.floor(diff / (1000 * 60 * 60 * 24)),
            hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((diff / (1000 * 60)) % 60),
            seconds: Math.floor((diff / 1000) % 60),
            isExpired: false,
          });
        } else {
          setTimeLeft({
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            isExpired: true,
          });
        }
      };

      updateCountdown();
      const timer = setInterval(updateCountdown, 1000);
      return () => clearInterval(timer);
    }
  }, [currentIndex, items]);

  const handleNavigation = useCallback(
    (direction) => {
      setCurrentIndex((prevIndex) => (prevIndex + direction + items.length) % items.length);
    },
    [items.length]
  );

  useEffect(() => {
    const autoSlide = setInterval(() => handleNavigation(1), 5000);
    return () => clearInterval(autoSlide);
  }, [handleNavigation]);

  const currentItem = items[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">Popular Events</h1>

        {loading ? (
          <div className="flex justify-center">
            <AiOutlineLoading3Quarters className="animate-spin text-3xl text-gray-600" />
          </div>
        ) : (
          <>
            <div className="relative">
              {currentItem ? (
                <div className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
                  <Link to={`/event/${currentItem?.category?.replace(/\s+/g, "-")}/${currentItem?._id}`} className="mb-16">
                    <img
                      src={currentItem?.images[0]?.url || "/placeholder.svg"}
                      alt={currentItem?.productTitle || "Event"}
                      className="object-contain w-full h-64"
                    />
                  </Link>
                  <div className="p-6">
                    <h2 className="text-xl font-bold mb-2 text-gray-800">{currentItem?.productTitle}</h2>
                    <p className="text-gray-600 mb-4">{currentItem?.productDescription}</p>
                    <div className="flex justify-between items-end">
                      {timeLeft.isExpired ? (
                        <p className="text-lg font-bold">${currentItem?.actualPrice.toFixed(2)}</p>
                      ) : (
                        <div>
                          {currentItem?.offerPercent > 0 && (
                            <p className="text-green-500 font-bold text-sm flex items-center">
                              <FaTag className="mr-1" /> {currentItem?.offerPercent}% OFF
                            </p>
                          )}
                          <p className="text-lg">
                            <span className="line-through text-gray-500 mr-2">${currentItem?.actualPrice.toFixed(2)}</span>
                            <span className="font-bold">${currentItem?.offerPrice.toFixed(2)}</span>
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 mt-2">
                      {timeLeft.isExpired ? (
                        <span className="text-red-500 font-bold">Expired</span>
                      ) : (
                        <div className="flex space-x-2">
                          {Object.entries(timeLeft).slice(0, 4).map(([unit, value]) => (
                            <div key={unit} className="flex flex-col items-center">
                              <span className="font-bold">{value}</span>
                              <span className="text-xs text-gray-500">{unit}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-center text-gray-500">No events available.</p>
              )}
              {eventLength > 1 ? (
                <div className="absolute inset-y-0 left-0 right-0 flex justify-between items-center px-4 pointer-events-none">
                  <button
                    onClick={() => handleNavigation(-1)}
                    className="p-3 bg-white rounded-full shadow-md hover:bg-gray-100 hover:scale-110 pointer-events-auto"
                    aria-label="Previous"
                  >
                    <FaChevronLeft className="w-6 h-6 text-gray-800" />
                  </button>
                  <button
                    onClick={() => handleNavigation(1)}
                    className="p-3 bg-white rounded-full shadow-md hover:bg-gray-100 hover:scale-110 pointer-events-auto"
                    aria-label="Next"
                  >
                    <FaChevronRight className="w-6 h-6 text-gray-800" />
                  </button>
                </div>
              ) : null}
            </div>
            <div className="mt-8 flex justify-center">
              {items.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full mx-1 ${index === currentIndex ? "bg-purple-500" : "bg-gray-300"}`}
                  aria-label={`Go to event ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PopularEvents;
