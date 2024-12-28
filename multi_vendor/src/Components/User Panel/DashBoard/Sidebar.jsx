import React, { useContext, useEffect } from "react";
import { menuItems } from "../../../Static/static.jsx";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ContextApi } from "../../../Context/Context.jsx";

const Sidebar = ({ isAuth }) => {
    const { LogOut } = useContext(ContextApi)
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleLogout = async () => {
            if (location.pathname.startsWith("/dashboard/logout")) {
                try {
                    await LogOut({ navigate, isAuth });
                } catch (error) {
                    console.error("Error during logout:", error);
                }
            }
        };

        handleLogout();
    }, [location.pathname, navigate, isAuth, LogOut]);

    return (
        <div className="w-64 bg-white p-4 shadow-sm rounded-[10px] pt-8 m-12 mt-36">
            {menuItems.map((item) => (
                <Link to={item.path} key={item.id}>
                    <div
                        className={`flex items-center cursor-pointer w-full mb-8 ${location.pathname === item.path ? "text-red-500" : "text-gray-700"
                            }`}
                    >
                        {item.icon}
                        <span className="pl-3 text-xl">{item.label}</span>
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default Sidebar;