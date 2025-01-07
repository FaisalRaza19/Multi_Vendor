import { createContext, useState } from "react";
import {
    Register, CodeVerify, ResendCode, Login, FetchUser, verifyJWT, UpdateAvatar, UpdateProfile, VerifyProfile, LogOut
} from "./Context_Pages/User_auth.jsx";
import {
    registerShop, shopVerify, ShopLogin, adminResendCode, getShop, UpdateShopLogo, UpdateShopProfile, verifyShopProfile,
    ShopLogOut, ShopVerifyJWT
} from "./Context_Pages/Admin_auth.jsx";
export const ContextApi = createContext();

export const ContextProvider = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false)

    const toggleSidebar = () => setIsOpen(!isOpen)
    const value = {
        Register, CodeVerify, ResendCode, Login, FetchUser, verifyJWT, UpdateAvatar, UpdateProfile, VerifyProfile, LogOut,
        isOpen, toggleSidebar, registerShop, shopVerify, ShopLogin, adminResendCode, getShop, UpdateShopLogo, UpdateShopProfile,
        verifyShopProfile, ShopLogOut, ShopVerifyJWT
    };
    return (
        <ContextApi.Provider value={value}>
            {children}
        </ContextApi.Provider>
    );
};