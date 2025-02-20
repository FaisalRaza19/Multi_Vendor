import React, { useContext, useEffect, useState, useCallback } from "react";
import { Link, useLocation } from "react-router";
import { navItems, categoriesData } from "../../../Static/static.jsx";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FiX, FiMinus, FiPlus, FiTrash2 } from "react-icons/fi"
import { MdSearch, MdFavorite, MdShoppingCart, MdPerson, MdExpandMore, MdArrowForward, MdMenu, MdClose, } from "react-icons/md";
import { ContextApi } from "../../../Context/Context.jsx"
import { debounce } from "lodash";

const Navbar = ({ path, shopPath, isAuth }) => {
    const { showAlert, cart, cartTotal, removeFromCart, updateQuantity, } = useContext(ContextApi);
    const { FetchUser } = useContext(ContextApi).userAuth;
    const { getAllProducts } = useContext(ContextApi).adminProducts;
    const [isOpen, setIsOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false);
    const [wishlistQuantity, setWishlistQuantity] = useState(0);
    const [imagePreview, setImagePreview] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dataNotFound, setDataNotFound] = useState(false);
    const [open, setOpen] = useState(false)
    const [cartData, setCartData] = useState([]);

    const pathname = useLocation();

    useEffect(() => {
        setCartData(cart)
    }, [cart]);

    const fetchUser = async () => {
        try {
            const data = await FetchUser();
            showAlert(data);
            setWishlistQuantity(data.data?.favouriteList.length)
            setImagePreview(data.data?.avatar?.url || "public/pic.jpg");
        } catch (error) {
            throw error
        }
    }

    useEffect(() => {
        fetchUser();
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const products = await getAllProducts();
                setAllProducts(products.allProducts || []);
            } catch (error) {
                console.error("Error fetching products", error);
            }
        };
        fetchProducts();
    }, [getAllProducts]);

    const debouncedSearch = useCallback(
        debounce((query) => {
            if (!query.trim()) {
                setFilteredProducts([]);
                setDataNotFound(false);
                return;
            }

            const results = allProducts.filter(product =>
                product?.productTitle.toLowerCase().includes(query.toLowerCase())
            );

            setFilteredProducts(results);
            setDataNotFound(results.length === 0);
        }, 500),
        [allProducts]
    );

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        setLoading(true);
        debouncedSearch(query);
        setTimeout(() => setLoading(false), 500);
    };

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
                                    value={searchQuery}
                                    onChange={handleSearch}
                                    type="text"
                                    placeholder="Search Product..."
                                    className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <MdSearch className="absolute right-3 top-2.5 text-gray-400" size={20} />
                                {searchQuery && (
                                    <div className="absolute w-full bg-white border rounded-lg shadow-md mt-1 overflow-y-auto max-h-80">
                                        {loading ? (
                                            <div className="flex items-center justify-center p-4">
                                                <AiOutlineLoading3Quarters size={37} className="animate-spin text-gray-600" />
                                            </div>
                                        ) : filteredProducts.length === 0 ? (
                                            <div className="p-4 text-gray-500 text-center">Data not found</div>
                                        ) : (
                                            filteredProducts.map((product) => (
                                                <Link
                                                    onClick={() => setSearchQuery("")}
                                                    key={product?._id}
                                                    to={`/product/${product?.category?.replace(/\s+/g, "-")}/${product?._id}`}
                                                    className="block px-4 py-2 hover:bg-gray-100"
                                                >
                                                    <div className="flex gap-5 items-center">
                                                        <img src={product?.images?.[0]?.url || "/pic.jpg"} className="w-16 h-16 object-contain" />
                                                        <span className="truncate">{product?.productTitle?.slice(0, 50) || "Title"}...</span>
                                                    </div>
                                                </Link>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link
                                to={shopPath}
                                className="hidden md:flex bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors items-center space-x-2"
                            >
                                <span>{shopPath == "/Shop-login" ? "Become Seller" : "Go to Dashboard"}</span>
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
                                    <Link to={"/user-dashboard/wishlist"}>
                                        <button className="text-white hover:text-gray-200 relative">
                                            <MdFavorite size={30} />
                                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                                {wishlistQuantity || 0}
                                            </span>
                                        </button>
                                    </Link>
                                    <button className="text-white hover:text-gray-200 relative" onClick={() => setOpen(true)}>
                                        <MdShoppingCart size={30} />
                                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                            {cart.length || 0}
                                        </span>
                                    </button>
                                    <Link to={path} className="border-gray-50 rounded-full overflow-hidden">
                                        <img
                                            src={imagePreview || "/public/pic.jpg"}
                                            alt=""
                                            className="w-10 h-10"
                                        />
                                    </Link>

                                </div>
                            </div>
                            {open && <div className="fixed inset-0 bg-opacity-50 z-40" onClick={() => setOpen(false)}></div>}
                            <div
                                className={`fixed right-0 top-0 h-full w-80 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "translate-x-full"
                                    }`}
                            >
                                <div className="flex flex-col h-full">
                                    <div className="flex justify-between items-center p-4 border-b">
                                        <h2 className="text-lg font-semibold">Your Cart</h2>
                                        <button
                                            onClick={() => setOpen(false)}
                                            className="p-2 text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-md"
                                            aria-label="Close cart"
                                        >
                                            <FiX className="w-6 h-6" />
                                        </button>
                                    </div>

                                    <div className="flex-grow p-4 overflow-y-auto">
                                        {cart.length > 0 ? (
                                            cartData.map((item) => (
                                                <div key={item._id} className="flex items-center gap-2 mb-4 pb-4 border-b">
                                                    <img src={item.images[0]?.url || "/placeholder.jpg"} className="w-16 h-16 object-cover rounded-lg" />
                                                    <div className="flex-grow">
                                                        <h3 className="text-sm font-medium">
                                                            {item?.productTitle.length > 20 ? `${item.productTitle.slice(0, 20)}...` : item.productTitle}
                                                        </h3>
                                                        <div className="flex items-center mt-1">
                                                            <button
                                                                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                                className="text-gray-500 hover:text-gray-700"
                                                            >
                                                                <FiMinus className="w-4 h-4" />
                                                            </button>
                                                            <span className="mx-2 text-sm">{item.quantity}</span>
                                                            <button
                                                                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                                                className="text-gray-500 hover:text-gray-700"
                                                            >
                                                                <FiPlus className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                        <p className="text-sm text-gray-600 mt-1">${((item.offerPrice || item.actualPrice) * item.quantity).toFixed(2)}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => removeFromCart(item._id)}
                                                        className="text-red-500 hover:text-red-700"
                                                        aria-label="Remove item"
                                                    >
                                                        <FiTrash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-center text-gray-500 py-4">Your cart is empty</p>
                                        )}
                                    </div>

                                    {cart.length > 0 && (
                                        <div className="p-4 border-t">
                                            <div className="flex justify-between items-center mb-4">
                                                <span className="font-semibold">Total:</span>
                                                <span className="font-bold">${cartTotal}</span>
                                            </div>
                                            <Link to="/checkOut" onClick={()=> setOpen(false)}>
                                                <button
                                                    className={`w-full text-white py-2 px-4 rounded-md transition duration-300 
                                                        ${isAuth ? "bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50" : "bg-gray-400 cursor-not-allowed"}`}
                                                    disabled={!isAuth}
                                                >
                                                    Checkout
                                                </button>

                                            </Link>
                                        </div>
                                    )}
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
                                        value={searchQuery}
                                        onChange={handleSearch}
                                        type="text"
                                        placeholder="Search Product..."
                                        className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <MdSearch className="absolute right-3 top-2.5 text-gray-400" size={20} />
                                    {searchQuery && (
                                        <div className="absolute w-full bg-white border rounded-lg shadow-md mt-1 overflow-y-auto max-h-80">
                                            {loading ? (
                                                <div className="flex items-center justify-center p-4">
                                                    <AiOutlineLoading3Quarters size={37} className="animate-spin text-gray-600" />
                                                </div>
                                            ) : filteredProducts.length === 0 ? (
                                                <div className="p-4 text-gray-500 text-center">Data not found</div>
                                            ) : (
                                                filteredProducts.map((product) => (
                                                    <Link
                                                        onClick={() => setSearchQuery("")}
                                                        key={product?._id}
                                                        to={`/product/${product?.category?.replace(/\s+/g, "-")}/${product?._id}`}
                                                        className="block px-4 py-2 hover:bg-gray-100"
                                                    >
                                                        <div className="flex gap-5 items-center">
                                                            <img src={product?.images?.[0]?.url || "/pic.jpg"} className="w-16 h-16 object-contain" />
                                                            <span className="truncate">{product?.productTitle?.slice(0, 50) || "Title"}...</span>
                                                        </div>
                                                    </Link>
                                                ))
                                            )}
                                        </div>
                                    )}
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
                                            {wishlistQuantity || 0}
                                        </span>
                                    )}
                                </button>
                                <button className="text-gray-600 hover:text-gray-900 relative" onClick={() => setOpen(true)}>
                                    <MdShoppingCart size={24} />
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                        {cart.length || 0}
                                    </span>
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
            </div >
        </>
    );
};

export default Navbar;
