import React, { createContext, useState, useEffect } from "react";
import {
    Register, CodeVerify, ResendCode, Login, UpdateAvatar, UpdateProfile,
    VerifyProfile, LogOut, FetchUser, verifyJWT
} from "./Context Api's/User/user_auth.jsx";

import {
    registerShop, shopVerify, ShopLogin, adminResendCode, getShop, userGetShop, UpdateShopLogo, UpdateShopProfile, verifyShopProfile,
    ShopLogOut, ShopVerifyJWT
} from "./Context Api's/Admin/admin_auth.jsx";

import { addProducts, deleteProduct, editProduct, getAllProducts, fetchProductById } from "./Context Api's/Admin/admin_products.jsx";

import { createCoupon, deleteCoupon } from "./Context Api's/Admin/admin_coupon.jsx";

import { addEvents, editEvent, deleteEvents, fetchAllEvents, fetchEventById } from "./Context Api's/Admin/admin-events.jsx"

import { addReview, delReview, editReview, giveLike, giveUnLike } from "./Context Api's/User/userReview.jsx";

import { addToWishList, removeToWishList } from "./Context Api's/User/userWishList.jsx";

import { addToCart, removeFromCart} from "./Context Api's/User/cart.jsx";

import {placeOrder,givePayment,changeStatus} from "./Context Api's/User/order.jsx"

export const ContextApi = createContext();


export const ContextProvider = ({ children }) => {
    const [alert, setAlert] = useState();
    const [isOpen, setIsOpen] = useState(false);
    const [cart, setCart] = useState([]);
    const [cartTotal, setCartTotal] = useState(0);

    // Function to calculate subtotal for each product
    const calculateSubtotal = (product) => {
        const price = product.offerPrice || product.actualPrice;
        return price * product.quantity;
    };

    // Load cart from localStorage on page load
    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(storedCart);
        updateCartTotal(storedCart);
    }, []);

    // Function to update cart total
    const updateCartTotal = (updatedCart) => {
        const totalAmount = updatedCart.reduce((sum, item) => sum + calculateSubtotal(item), 0);
        setCartTotal(totalAmount);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    // Function to add product to cart
    const addToCartHandler = (product) => {
        const result = addToCart(product);
        if (result.status === 200) {
            showAlert(result)
            const updatedCart = JSON.parse(localStorage.getItem("cart")) || [];
            setCart(updatedCart);
            updateCartTotal(updatedCart);
        }
    };

    // Function to remove product from cart
    const removeFromCartHandler = (productId) => {
        const result = removeFromCart(productId);
        if (result.status === 200) {
            const updatedCart = JSON.parse(localStorage.getItem("cart")) || [];
            setCart(updatedCart);
            updateCartTotal(updatedCart);
        }
    };

    // Function to update product quantity in cart
    const updateQuantity = (id, newQuantity) => {
        const updatedCart = cart.map((item) =>
            item._id === id ? { ...item, quantity: Math.max(1, newQuantity) } : item
        );
        setCart(updatedCart);
        updateCartTotal(updatedCart);
    };

    const userAuth = {
        Register, CodeVerify, ResendCode, Login, UpdateAvatar, UpdateProfile, VerifyProfile, LogOut, FetchUser, verifyJWT,
        addToWishList, removeToWishList,
    }
    const adminAuth = {
        registerShop, shopVerify, ShopLogin, adminResendCode, getShop, userGetShop, UpdateShopLogo, UpdateShopProfile, verifyShopProfile,
        ShopLogOut, ShopVerifyJWT,
    }
    const adminProducts = { addProducts, deleteProduct, editProduct, getAllProducts, fetchProductById };
    const adminEvents = { addEvents, editEvent, deleteEvents, fetchAllEvents, fetchEventById };
    const adminCoupon = { createCoupon, deleteCoupon };
    const userReviews = { addReview, delReview, editReview, giveLike, giveUnLike };
    const userWishList = { addToWishList, removeToWishList };
    const order = {placeOrder,givePayment,changeStatus};

    const onClose = () => setAlert(null);
    const showAlert = (data) => {
        setAlert(data);
    }
    const toggleSidebar = () => setIsOpen(!isOpen)
    return (
        <ContextApi.Provider value={{
            toggleSidebar, isOpen, alert, showAlert, onClose, userAuth, adminAuth,
            adminProducts, adminEvents, adminCoupon, userReviews, userWishList,
            cart, setCart, cartTotal, addToCart: addToCartHandler, removeFromCart: removeFromCartHandler,updateQuantity,order
        }}>
            {children}
        </ContextApi.Provider>
    )
}