import { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Link } from 'react-router';
import { products } from "../../../../Static/static.jsx"

const PopularProducts = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const nextProduct = () => {
    setCurrentIndex((prev) => (prev === products.length - 1 ? 0 : prev + 1));
  };

  const previousProduct = () => {
    setCurrentIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1));
  };

  const currentProduct = products[currentIndex];
  const targetDate = currentProduct.endDate;

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      // Prevent negative timer values
      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="w-full max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">Popular Events</h2>
        <div className="relative bg-white rounded-lg shadow-lg p-6">
          <Link to={currentProduct.url + currentProduct.id}>
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="relative w-full md:w-1/2 aspect-square">
                <img
                  src={currentProduct.image}
                  alt={currentProduct.name}
                  className="object-contain w-full h-full max-w-full"
                  priority
                />
              </div>
              <div className="w-full md:w-1/2 space-y-4">
                <h3 className="text-2xl font-semibold">{currentProduct.name}</h3>
                <p className="text-gray-600">{currentProduct.description}</p>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 line-through">${currentProduct.originalPrice}</span>
                  <span className="text-2xl font-bold">${currentProduct.currentPrice}</span>
                  <span className="ml-auto text-green-500">{currentProduct.soldCount} sold</span>
                </div>
                <div>
                  <span className="text-indigo-600">
                    {timeLeft.days} days {timeLeft.hours} hours {timeLeft.minutes} minutes {timeLeft.seconds} seconds
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {/* Navigation Arrows */}
          <button
            onClick={previousProduct}
            disabled={currentIndex === 0}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
            aria-label="Previous product"
          >
            <FaChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextProduct}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
            aria-label="Next product"
          >
            <FaChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </main>
  );
};

export default PopularProducts;