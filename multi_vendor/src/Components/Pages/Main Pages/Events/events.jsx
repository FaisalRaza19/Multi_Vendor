import { useState, useEffect } from "react";
import { Link } from "react-router";
import { products } from "../../../../Static/static.jsx";

const Events = () => {
    const [timeLeft, setTimeLeft] = useState({});

    // calculate how much time are left 
    const calculateTimeLeft = (targetDate) => {
        const now = new Date().getTime();
        const distance = new Date(targetDate).getTime() - now;

        if (distance < 0) {
            return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }

        return {
            days: Math.floor(distance / (1000 * 60 * 60 * 24)),
            hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((distance % (1000 * 60)) / 1000),
        };
    };

    // update the timer every second of every product 
    useEffect(() => {
        setInterval(() => {
            const updatedTimeLeft = {};
            products.forEach((product) => {
                updatedTimeLeft[product.id] = calculateTimeLeft(product.endDate);
            });
            setTimeLeft(updatedTimeLeft);
        }, 1000);
    }, []);

    return (
        <main className="min-h-screen bg-gray-50 py-8 mt-28">
            <div className="w-full max-w-7xl mx-auto px-4">
                <h2 className="text-3xl font-bold mb-8">Popular Events</h2>
                <div className="relative grid gap-8">
                    {products.map((currentProduct) => (
                        <div
                            key={currentProduct.id}
                            className="flex flex-col md:flex-row gap-8 items-center bg-white rounded-lg shadow-lg p-6"
                        >
                            <div className="relative w-full md:w-1/2 aspect-square">
                                <Link to={`${currentProduct.url}${currentProduct.id}`}>
                                    <img
                                        src={currentProduct.image}
                                        alt={currentProduct.name}
                                        className="object-contain w-full h-full max-w-full"
                                    />
                                </Link>
                            </div>
                            <div className="w-full md:w-1/2 space-y-4">
                                <h3 className="text-2xl font-semibold">{currentProduct.name}</h3>
                                <p className="text-gray-600">{currentProduct.description}</p>
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-400 line-through">
                                        ${currentProduct.originalPrice}
                                    </span>
                                    <span className="text-2xl font-bold">
                                        ${currentProduct.currentPrice}
                                    </span>
                                    <span className="ml-auto text-green-500">
                                        {currentProduct.soldCount} sold
                                    </span>
                                </div>
                                <div>
                                    <span className="text-indigo-600">
                                        {timeLeft[currentProduct.id]?.days || 0} days {" "}
                                        {timeLeft[currentProduct.id]?.hours || 0} hours {" "}
                                        {timeLeft[currentProduct.id]?.minutes || 0} minutes {" "}
                                        {timeLeft[currentProduct.id]?.seconds || 0} seconds
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
};

export default Events;