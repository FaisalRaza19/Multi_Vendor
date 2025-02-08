import React, { createContext, useState } from "react";
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

import {addToWishList,removeToWishList} from "./Context Api's/User/userWishList.jsx"

export const ContextApi = createContext();


export const ContextProvider = ({ children }) => {
    const [alert, setAlert] = useState();
    const [isOpen, setIsOpen] = useState(false);

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
    const userWishList = {addToWishList,removeToWishList};

    const onClose = () => setAlert(null);
    const showAlert = (data) => {
        setAlert(data);
    }
    const toggleSidebar = () => setIsOpen(!isOpen)
    return (
        <ContextApi.Provider value={{
            toggleSidebar, isOpen, alert, showAlert, onClose, userAuth, adminAuth,
            adminProducts, adminEvents, adminCoupon, userReviews,userWishList
        }}>
            {children}
        </ContextApi.Provider>
    )
}