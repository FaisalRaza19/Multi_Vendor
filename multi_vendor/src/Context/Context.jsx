import { createContext, useState } from "react";
// user auth route 
import {
    Register, CodeVerify, ResendCode, Login, FetchUser, verifyJWT, UpdateAvatar, UpdateProfile, VerifyProfile, LogOut
} from "./Context_Pages/User_auth.jsx";
// admin routes 
import {
    registerShop, shopVerify, ShopLogin, adminResendCode, getShop, UpdateShopLogo, UpdateShopProfile, verifyShopProfile,
    ShopLogOut, ShopVerifyJWT
} from "./Context_Pages/Admin_auth.jsx";
// add products routes 
import { addProducts, deleteProduct, editProduct, addEvents,deleteEvents,editEvent} from "./Context_Pages/Admin_Products.jsx";
export const ContextApi = createContext();

export const ContextProvider = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false)

    const toggleSidebar = () => setIsOpen(!isOpen)
    const value = {
        Register, CodeVerify, ResendCode, Login, FetchUser, verifyJWT, UpdateAvatar, UpdateProfile, VerifyProfile, LogOut,
        isOpen, toggleSidebar, registerShop, shopVerify, ShopLogin, adminResendCode, getShop, UpdateShopLogo, UpdateShopProfile,
        verifyShopProfile, ShopLogOut, ShopVerifyJWT, addProducts, deleteProduct, editProduct,addEvents,deleteEvents,editEvent
    };
    return (
        <ContextApi.Provider value={value}>
            {children}
        </ContextApi.Provider>
    );
};