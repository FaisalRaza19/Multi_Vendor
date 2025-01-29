import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { ContextApi } from '../../../Context/Context.jsx'
import { FiMenu, FiGift, FiTag, FiShoppingBag, FiPackage, FiMessageSquare, FiLogOut, FiUser } from 'react-icons/fi'

const adminNavbar = ({isAuth}) => {
    const {shopId} = useParams();
    const {showAlert,toggleSidebar} = useContext(ContextApi);
    const {getShop,ShopLogOut } = useContext(ContextApi).adminAuth
    const [imagePreview, setImagePreview] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();


    // fetch shop
    const fetchShop = async () => {
        try {
            const data = await getShop(shopId);
            showAlert(data)
            setImagePreview(data.data.shop.shopLogo?.url || "/public/pic.jpg");
        } catch (error) {
            throw error.message
        }
    }

    // logout shop 
    const logOut = async () => {
        try {
           const data = await ShopLogOut({isAuth,navigate});
           showAlert(data);
        } catch (error) {
            console.error("Error logOut the shop:", error);
        }
    }

    useEffect(() => {
        fetchShop();
    }, []);
    return (
        <nav className="sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-white border-b lg:px-6 ">
            <div className="flex items-center space-x-4">
                <button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden"
                    onClick={toggleSidebar}
                >
                    <FiMenu className="w-5 h-5" />
                </button>
                <Link to="/" className="text-2xl font-bold text-orange-500">
                    <img
                        src="https://shopo.quomodothemes.website/assets/images/logo.svg"
                        alt=""
                    />
                </Link>
            </div>
            <div className="flex items-center space-x-3 md:space-x-6">
                <Link to="/gifts" variant="ghost" size="icon" className="hidden md:flex">
                    <FiGift className="w-5 h-5 text-gray-600" />
                </Link>
                <Link to="/p" variant="ghost" size="icon" className="hidden md:flex">
                    <FiTag className="w-5 h-5 text-gray-600" />
                </Link>
                <Link to="/Shop/products" variant="ghost" size="icon" className="hidden md:flex">
                    <FiShoppingBag className="w-5 h-5 text-gray-600" />
                </Link>
                <Link to="/Shop/orders" variant="ghost" size="icon" className="hidden md:flex">
                    <FiPackage className="w-5 h-5 text-gray-600" />
                </Link>
                <Link to="/e" variant="ghost" size="icon" className="hidden md:flex">
                    <FiMessageSquare className="w-5 h-5 text-gray-600" />
                </Link>
                <div className="relative">
                    <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center focus:outline-none">
                        <img src={imagePreview} alt="" className="w-10 h-10 rounded-full object-cover border-gray-50 " />
                    </button>
                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md overflow-hidden shadow-xl z-10">
                            <Link to="/Shop/settings" className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center" onClick={() => setDropdownOpen(false)}>
                                <FiUser className="mr-2" />
                                Edit Profile
                            </Link>
                            <button onClick={logOut} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center">
                                <FiLogOut className="mr-2" />
                                Log out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default adminNavbar
