import { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { navItems, categoriesData } from "../../../Static/static.jsx";
import {
    MdSearch,
    MdFavorite,
    MdShoppingCart,
    MdPerson,
    MdExpandMore,
    MdArrowForward,
    MdMenu,
    MdClose,
} from "react-icons/md";
import { ContextApi } from "../../../Context/Context.jsx";

const Navbar = ({ path }) => {
    const { FetchUser } = useContext(ContextApi);
    const [isOpen, setIsOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false);
    const [cartQuantity, setCartQuantity] = useState(0);
    const [wishlistQuantity, setWishlistQuantity] = useState(0);
    const [imagePreview, setImagePreview] = useState("");
    const pathname = useLocation();

    const fetchUser = async () => {
        try {
            const data = await FetchUser();
            console.log(data)
            setImagePreview(data.avatar?.url || "/public/pic.jpg");
        } catch (err) {
            console.error("Error fetching user data:", err);
            setError("Failed to load user data.");
        }
    }

    useEffect(() => {
        fetchUser();
    }, [])

    return (
        <>
            <div className="flex flex-col h-auto">
                <header className="border-b fixed top-0 left-0 right-0 bg-white shadow-md z-10">
                    <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                        <Link to="/" className="text-2xl font-bold text-orange-500">
                            <img
                                src="https://shopo.quomodothemes.website/assets/images/logo.svg"
                                alt=""
                            />
                        </Link>
                        <div className="hidden md:block flex-1 max-w-xl mx-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search Product..."
                                    className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <MdSearch
                                    className="absolute right-3 top-2.5 text-gray-400"
                                    size={20}
                                />
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link
                                to="/Shop"
                                className="hidden md:flex bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors items-center space-x-2"
                            >
                                <span>Become Seller</span>
                                <MdArrowForward size={16} />
                            </Link>
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="md:hidden text-gray-600 hover:text-gray-900"
                            >
                                {isMobileMenuOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
                            </button>
                        </div>
                    </div>
                    <nav className="bg-indigo-600 hidden md:block">
                        <div className="container mx-auto px-4 py-2">
                            <div className="flex items-center justify-between">
                                <div className="relative">
                                    <button
                                        onClick={() => setIsOpen(!isOpen)}
                                        className="flex items-center space-x-1 text-white px-4 py-2 rounded hover:bg-indigo-700"
                                    >
                                        <span>All Categories</span>
                                        <MdExpandMore size={20} />
                                    </button>
                                    {isOpen && (
                                        <div className="absolute top-full left-0 w-64 bg-white rounded-lg shadow-lg py-2 z-50">
                                            {categoriesData.map((category) => (
                                                <Link
                                                    key={category.id}
                                                    to={`/category/${category.title.toLowerCase()}`}
                                                    className="flex items-center space-x-3 px-4 py-2 text-gray-800 hover:bg-gray-100"
                                                >
                                                    <img
                                                        src={category.image_Url}
                                                        alt={category.name}
                                                        width={40}
                                                        height={40}
                                                        className="rounded"
                                                    />
                                                    <span>{category.title}</span>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center space-x-6">
                                    {navItems.map((item) => (
                                        <Link
                                            key={item.title}
                                            to={item.url}
                                            className={`text-white hover:text-gray-200 ${pathname === item.url ? "text-green-700" : ""
                                                }`}
                                        >
                                            {item.title}
                                        </Link>
                                    ))}
                                </div>
                                <div className="flex items-center space-x-4">
                                    <button className="text-white hover:text-gray-200 relative">
                                        <MdFavorite size={30} />
                                        {wishlistQuantity >= 0 && (
                                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                                {wishlistQuantity}
                                            </span>
                                        )}
                                    </button>
                                    <button className="text-white hover:text-gray-200 relative">
                                        <MdShoppingCart size={30} />
                                        {cartQuantity >= 0 && (
                                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                                {cartQuantity}
                                            </span>
                                        )}
                                    </button>
                                    <Link to={path} className="border-gray-50 rounded-full overflow-hidden">
                                        <img
                                            src={imagePreview}
                                            alt=""
                                            className="w-10 h-10"
                                        />
                                    </Link>

                                </div>
                            </div>
                        </div>
                    </nav>
                </header>
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-white shadow-lg relative">
                        <div className="container mx-auto px-4 py-4 mt-14">
                            <div className="mb-4">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search Product..."
                                        className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <MdSearch
                                        className="absolute right-3 top-2.5 text-gray-400"
                                        size={20}
                                    />
                                </div>
                            </div>
                            <div className="mb-4">
                                <button
                                    onClick={() => setIsMobileCategoriesOpen(!isMobileCategoriesOpen)}
                                    className="flex items-center justify-between w-full px-4 py-2 text-gray-800 bg-gray-100 rounded-lg"
                                >
                                    <span>All Categories</span>
                                    <MdExpandMore size={20} />
                                </button>
                                {isMobileCategoriesOpen && (
                                    <div className="mt-2 space-y-2">
                                        {categoriesData.map((category) => (
                                            <Link
                                                key={category.id}
                                                to={`/category/${category.title.toLowerCase()}`}
                                                className="flex items-center space-x-3 px-4 py-2 text-gray-800 hover:bg-gray-100 rounded-lg"
                                            >
                                                <img
                                                    src={category.image_Url}
                                                    alt={category.title}
                                                    width={40}
                                                    height={40}
                                                    className="rounded"
                                                />
                                                <span>{category.title}</span>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="space-y-2">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.title}
                                        to={item.url}
                                        className={`block px-4 py-2 rounded-lg ${pathname === item.url
                                            ? "bg-indigo-600 text-white"
                                            : "text-gray-800 hover:bg-gray-100"
                                            }`}
                                    >
                                        {item.title}
                                    </Link>
                                ))}
                                <Link
                                    to="/become-seller"
                                    className="flex items-center justify-between px-4 py-2 text-gray-800 bg-gray-100 rounded-lg hover:bg-gray-200"
                                >
                                    <span>Become Seller</span>
                                    <MdArrowForward size={16} />
                                </Link>
                            </div>
                            <div className="mt-4 flex justify-around">
                                <button className="text-gray-600 hover:text-gray-900 relative">
                                    <MdFavorite size={24} />
                                    {wishlistQuantity >= 0 && (
                                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                            {wishlistQuantity}
                                        </span>
                                    )}
                                </button>
                                <button className="text-gray-600 hover:text-gray-900 relative">
                                    <MdShoppingCart size={24} />
                                    {cartQuantity >= 0 && (
                                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                            {cartQuantity}
                                        </span>
                                    )}
                                </button>
                                <Link to={path}>
                                    <button className="text-gray-600 hover:text-gray-900">
                                        <MdPerson size={24} />
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Navbar;