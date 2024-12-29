import { useContext } from 'react'
import { Link } from 'react-router'
import { ContextApi } from '../../Context/Context'
import { FiMenu, FiGift, FiTag, FiShoppingBag, FiPackage, FiMessageSquare, FiShoppingCart } from 'react-icons/fi'

const Admin_Navbar = () => {
    const { toggleSidebar } = useContext(ContextApi)

    return (
        <nav className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-white border-b lg:px-6 ">
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
                <div className="relative border-gray-50 rounded-full overflow-hidden">
                    <Link to="*">
                        <img
                            src="/public/pic.jpg"
                            alt=""
                            className="w-10 h-10"
                        />
                    </Link>
                </div>
            </div>
        </nav>
    )
}

export default Admin_Navbar;
