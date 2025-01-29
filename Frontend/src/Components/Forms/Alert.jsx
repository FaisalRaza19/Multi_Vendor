import React, { useState, useEffect, useContext } from "react";
import { FaCheckCircle, FaTimesCircle, FaTimes } from "react-icons/fa";
import { ContextApi } from "../../Context/Context";

const ALERT_DURATION = 5000;

const Alert = () => {
    const {alert,onClose} = useContext(ContextApi);
    const [timeLeft, setTimeLeft] = useState(ALERT_DURATION);

    useEffect(() => {
        if (alert) {
            setTimeLeft(ALERT_DURATION);
            const timer = setInterval(() => {
                setTimeLeft((prevTime) => {
                    if (prevTime <= 100) {
                        clearInterval(timer);
                        return 0;
                    }
                    return prevTime - 100;
                });
            }, 100);

            const timeout = setTimeout(() => {
                onClose(); // Call onClose after the duration ends
            }, ALERT_DURATION);

            return () => {
                clearInterval(timer);
                clearTimeout(timeout);
            };
        }
    }, [alert, onClose]);

    if (!alert) return null;

    return (
        <div className="flex absolute flex-col items-center justify-center z-50">
            <div
                className={`fixed top-4 right-4 p-4 rounded shadow-lg flex flex-col w-80 transition-all duration-300 ease-in-out ${alert.status === 200 ? "bg-green-100" : "bg-red-100"
                    }`}
            >
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                        {alert.status === 200 ? (
                            <FaCheckCircle className="text-green-500 mr-2" />
                        ) : (
                            <FaTimesCircle className="text-red-500 mr-2" />
                        )}
                        <span
                            className={`${alert.status === 200 ? "text-green-700" : "text-red-700"
                                }`}
                        >
                            {alert.message}
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <FaTimes />
                    </button>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                        className={`h-1.5 rounded-full transition-all duration-100 ${alert.status === 200 ? "bg-green-500" : "bg-red-500"
                            }`}
                        style={{ width: `${(timeLeft / ALERT_DURATION) * 100}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default Alert;
