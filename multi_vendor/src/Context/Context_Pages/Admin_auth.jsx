import { api } from "./Api's.js";

// get info 
export const registerShop = async ({ formData, navigate }) => {
    try {
        const response = await fetch(api.registerShop, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
            credentials: 'include',
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            throw new Error(errorDetails.message || `Failed to register user: ${response.statusText}`);
        }

        const data = await response.json();
        navigate("/Shop/email-verify");
        return data;
    } catch (error) {
        console.error("Error during register Shop:", error.message);
        throw error;
    }
}

// CodeVerify 
export const shopVerify = async ({ otp, navigate, isAuth }) => {
    try {
        const response = await fetch(api.shopVerify, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ otp }),
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error(data.message || 'Invalid OTP');
        }

        const data = await response.json();
        isAuth(true);
        localStorage.setItem("admin_token", data.data.accessToken);
        navigate("/Shop/dashboard");
        return data;
    } catch (error) {
        console.error("Error during OTP verification:", error.message);
        throw error;
    }
};

// resend code 
export const adminResendCode = async () => {
    try {
        const response = await fetch(api.resendCode, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error(data.message || 'Invalid OTP');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error during OTP verification:", error.message);
        throw error;
    }
};

// login in to shop 
export const ShopLogin = async ({ credential, navigate, isAuth }) => {
    try {
        const response = await fetch(api.ShopLogin, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credential),
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            throw new Error(errorDetails.message || `Failed to login the shop: ${response.statusText}`);
        }

        const data = await response.json();
        localStorage.setItem("admin_token", data.data.accessToken);
        isAuth(true);
        navigate("/Shop/dashboard");
        getShop()
        return data;
    } catch (error) {
        console.error("Error during login shop:", error.message);
        throw error;
    }
};

// get shop 
export const getShop = async () => {
    try {
        const token = localStorage.getItem("admin_token");
        const response = await fetch(api.getShop, {
            method: "GET",
            headers: { "token": token, },
        });

        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong to get shop');
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error("Error during fetch shop:", error.message);
        throw error;
    }
};

// update shop logo 
export const UpdateShopLogo = async (file) => {
    if (!file) {
        alert("Please select a file to upload.");
        return;
    }
    try {
        const token = localStorage.getItem("admin_token");
        const formData = new FormData();
        formData.append("shopLogo", file);
        const response = await fetch(api.editShopLogo, {
            method: "POST",
            headers: {
                "token": token,
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error(data.message || 'Error to update avatar');
        }
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error("Error during update avatar:", error.message);
        throw error;
    }
};

// edit shop profile 
export const UpdateShopProfile = async ({ exactData, navigate }) => {
    try {
        const token = localStorage.getItem("admin_token");
        const response = await fetch(api.editShopProfile, {
            method: "POST",
            headers: {
                "token": token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(exactData),
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error(data.message || 'Error to update avatar');
        }
        const data = await response.json();
        if (data.message !== "Shop edit Successfully") {
            navigate("/Shop/profile-verify")
        }
        return data;
    } catch (error) {
        console.error("Error during update shop:", error);
        throw error;
    }
};

// verify updated profile
export const verifyShopProfile = async ({ otp, navigate }) => {
    try {
        const token = localStorage.getItem("admin_token");
        const response = await fetch(api.verifyShopProfile, {
            method: "POST",
            headers: {
                "token": token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ otp }),
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error(data.message || 'Error to update avatar');
        }
        const data = await response.json();
        getShop();
        navigate("/Shop/dashboard")
        return data;
    } catch (error) {
        console.error("Error during update shop:", error);
        throw error;
    }
};

// logout the shop
export const ShopLogOut = async ({ navigate, isAuth }) => {
    try {
        const token = localStorage.getItem("admin_token");

        const response = await fetch(api.ShopLogOut, {
            method: "POST",
            headers: {
                "token": token,
            },
        });

        if (!response.ok) {
            throw new Error(data.message || 'Error to update avatar');
        }
        const data = await response.json();
        isAuth(false);
        localStorage.removeItem("admin_token");
        navigate("/Shop-login")
        return data;
    } catch (error) {
        console.error("Error during update avatar:", error.message);
        throw error;
    }
};

// verify token 
export const ShopVerifyJWT = async () => {
    try {
        const token = localStorage.getItem("admin_token");
        if (!token) {
            console.error("No token found in local storage.");
            return false;
        }
        const response = await fetch(api.ShopVerifyJWT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "token": token,
            },
        });

        if (!response.ok) {
            console.log('Token is invalid');
            return false;
        }
        return true;
    } catch (error) {
        console.error("Error during update avatar:", error.message);
        throw error;
    }
};