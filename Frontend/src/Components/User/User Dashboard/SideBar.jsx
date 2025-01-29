import React, { useContext, useState } from "react";
import { menuItems } from "../../../Static/static.jsx";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ContextApi } from "../../../Context/Context.jsx";
import { FaTimes } from "react-icons/fa";
import { AiOutlineLogin, AiOutlineLoading3Quarters } from "react-icons/ai";

const Sidebar = ({ isAuth }) => {
    const { showAlert } = useContext(ContextApi);
    const { LogOut } = useContext(ContextApi).userAuth
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [Loading, setLoading] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogoutClick = () => {
        setIsPopupVisible(true);
    };

    const handleCancel = () => {
        setIsPopupVisible(false);
    };

    const handleLogout = async () => {
        try {
            const data = await LogOut({ navigate, isAuth });
            setLoading(true)
            showAlert(data)
        } catch (error) {
            console.error("Error during logout:", error);
        } finally {
            setLoading(false);
        }

    };


    return (
        <div className="min-w-64 max-w-auto bg-white p-4 shadow-sm rounded-[10px] pt-8 m-12 mt-36">
            {menuItems.map((item) => (
                <Link to={item.path} key={item.id}>
                    <div
                        className={`flex items-center cursor-pointer w-auto mb-8 ${location.pathname === item.path ? "text-red-500" : "text-gray-700"
                            }`}
                    >
                        {item.icon}
                        <span className="pl-3 text-xl">{item.label}</span>
                    </div>
                </Link>
            ))}
            <div className="relative">
                {/* Logout Button */}
                <div className="flex items-center cursor-pointer w-full">
                    <AiOutlineLogin size={20} />
                    <span onClick={handleLogoutClick} className="pl-3 text-gray-700 text-xl">
                        Log Out
                    </span>
                </div>

                {/* Confirmation Popup */}
                {isPopupVisible && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50">
                        <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md relative">
                            <button onClick={handleCancel} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
                                <FaTimes size={20} />
                            </button>

                            <h2 className="text-lg font-semibold text-gray-800 mb-4">
                                Are you sure you want to log out?
                            </h2>
                            <div className="flex justify-end space-x-4">
                                <button onClick={handleCancel} className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition">
                                    Cancel
                                </button>
                                <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded shadow-md hover:bg-red-600 transition">
                                    {Loading ? <AiOutlineLoading3Quarters size={20} className="text-green-500 animate-spin" /> : "Log Out"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Sidebar;