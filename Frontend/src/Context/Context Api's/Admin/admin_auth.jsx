import { api } from "../Api's.js";

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
            return {message : errorDetails.message.message || errorDetails.message};
        }

        const data = await response.json();
        navigate("/Shop-emailVerify");
        return data;
    } catch (error) {
        return error.message;
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
            const errorDetails = await response.json();
            return {message : errorDetails.message};
        }

        const data = await response.json();
        console.log(data);
        isAuth(true);
        localStorage.setItem("admin_token", data.data.accessToken);
        navigate("/Shop/dashboard/:id");
        return data;
    } catch (error) {
        return error.message;
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
            const errorDetails = await response.json();
            return {message : errorDetails.message};
        }

        const data = await response.json();
        return data;
    } catch (error) {
        return error.message;
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
            return {message :errorDetails.message};
        }

        const data = await response.json();
        localStorage.setItem("admin_token", data.data.accessToken);
        isAuth(true);
        navigate(`/Shop/${data.data?.userLogin?._id}/dashboard`);
        getShop()
        return data;
    } catch (error) {
        return error.message;
    }
};

// get shop through token and id 
export const getShop = async (shopId) => {
    try {
        const token = localStorage.getItem("admin_token");
        const response = await fetch(`${api.getShop}/${shopId}`, {
            method: "GET",
            headers: { "token": token, },
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            return {message : errorDetails.message};
        }

        const data = await response.json();
        return data;
    } catch (error) {
        return error.message;
    }
};

// user get shop through id
export const userGetShop = async (shopId) => {
    try {
        const response = await fetch(`${api.userGetShop}/${shopId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            return {message : errorDetails.message};
        }

        const data = await response.json();
        return data;
    } catch (error) {
        return error;
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
            const errorDetails = await response.json();
            return {message : errorDetails.message};
        }
        const data = await response.json();
        return data;
    } catch (error) {
        return error.message;
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
            const errorDetails = await response.json();
            return errorDetails.message;
        }
        const data = await response.json();
        
        if (data.message !== "Shop edit Successfully") {
            navigate("/admin-VerifyProfile")
        }
        return data;
    } catch (error) {
        return error.message;
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
            const errorDetails = await response.json();
            return errorDetails.message;
        }
        const data = await response.json();
        getShop();
        navigate("/Shop/:id/dashboard")
        return data;
    } catch (error) {
        return error.message;
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
            const errorDetails = await response.json();
            return errorDetails.message;
        }
        const data = await response.json();
        isAuth(false);
        localStorage.removeItem("admin_token");
        navigate("/Shop-login")
        return data;
    } catch (error) {
        return error.message;
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
            const errorDetails = await response.json();
            return { isValid: false, message: errorDetails.message };
        }
        return { isValid: true, message: "Token verified successfully." };
    } catch (error) {
        return error.message;
    }
};
