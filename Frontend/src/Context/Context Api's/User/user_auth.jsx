import { api } from "../Api's.js";

// Updated Register Function
export const Register = async ({ credential, navigate }) => {
    try {
        const response = await fetch(api.register, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credential),
            credentials: 'include',
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            return { message: errorDetails.message.message || errorDetails.message };
        }

        const data = await response.json();
        navigate("/emailVerify");
        return data;
    } catch (error) {
        return error.message
    }
};

// Updated CodeVerify Function
export const CodeVerify = async ({ otp, navigate, isAuth }) => {
    try {
        const response = await fetch(api.codeVerify, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code: otp }),
            credentials: 'include',
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            return { message: errorDetails.message };
        }

        const data = await response.json();
        isAuth(true);
        localStorage.setItem("multi_token", data.data.accessToken);
        navigate("/user-dashboard");
        return data;
    } catch (error) {
        return error.message;
    }
};

// resend code 
export const ResendCode = async () => {
    try {
        const response = await fetch(api.ResendCode, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: 'include',
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            return errorDetails.message;
        }

        const data = await response.json();
        return data;
    } catch (error) {
        return error.message
    }
};

// login user
export const Login = async ({ credential, navigate, isAuth }) => {
    try {
        const response = await fetch(api.login, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credential),
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            return errorDetails.message;
        }

        const data = await response.json();
        localStorage.setItem("multi_token", data.data.accessToken)
        isAuth(true);
        navigate("/user-dashboard");
        FetchUser();
        return data;
    } catch (error) {
        return error.message;
    }
};

// fetch user 
export const FetchUser = async () => {
    try {
        const token = localStorage.getItem("multi_token");
        const response = await fetch(api.getUser, {
            method: "GET",
            headers: {
                "Authorization": token,
            },
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            return { status: errorDetails.status, message: errorDetails.message }
        }
        const data = await response.json();
        return data;
    } catch (error) {
        return error;
    }
};

// update avatar 
export const UpdateAvatar = async (file) => {
    if (!file) {
        return { message: "Please select a file to upload." };
    }
    try {
        const token = localStorage.getItem("multi_token");
        const formData = new FormData();
        formData.append("avatar", file);
        const response = await fetch(api.avatar, {
            method: "POST",
            headers: {
                "Authorization": token,
            },
            body: formData,
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            return { message: errorDetails.message };
        }
        const data = await response.json();
        return data;
    } catch (error) {
        return error.message;
    }
};

// edit profile 
export const UpdateProfile = async ({ formData, navigate }) => {
    try {
        const token = localStorage.getItem("multi_token");
        const response = await fetch(api.editProfile, {
            method: "POST",
            headers: {
                "Authorization": token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData),
            credentials: 'include',
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            return { message: errorDetails.message };
        }
        const data = await response.json();
        if (data.message !== "Profile updated successfully") {
            navigate("/verifyProfile")
        }
        return data;
    } catch (error) {
        return error.message;
    }
};

// if user change email send code and verify
export const VerifyProfile = async ({ otp, navigate }) => {
    try {
        const token = localStorage.getItem("multi_token");

        const response = await fetch(api.verifyProfile, {
            method: "POST",
            headers: {
                "Authorization": token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ code: otp }),
            credentials: 'include',
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            return errorDetails.message;
        }
        const data = await response.json();
        navigate("/user-dashboard")
        return data;
    } catch (error) {
        return error.message;
    }
};

// logout user 
export const LogOut = async ({ navigate, isAuth }) => {
    try {
        const token = localStorage.getItem("multi_token");

        const response = await fetch(api.LogOut, {
            method: "POST",
            headers: {
                "Authorization": token,
                "Content-Type": "application/json"
            },
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            return { message: errorDetails.message };
        }
        const data = await response.json();
        isAuth(false);
        localStorage.removeItem("multi_token");
        navigate("/login")
        return data;
    } catch (error) {
        return error.message;
    }
};

// verify token 
export const verifyJWT = async () => {
    try {
        const token = localStorage.getItem("multi_token");
        if (!token) {
            console.error("No token found in local storage.");
            return { isValid: false, message: "No token found." };
        }
        const response = await fetch(api.verifyJWT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token,
            },
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            return { isValid: false, message: errorDetails.message };
        }
        return { isValid: true, message: "Token verified successfully." };
    } catch (error) {
        console.error("Error verifying JWT:", error);
        return { isValid: false, message: error.message };
    }
};


// user wish list 
export const addToWishList = async ({ id }) => {
    try {
        const token = localStorage.getItem("multi_token");
        const response = await fetch(api.addToWishList, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                "Authorization": token,
            },
            body: JSON.stringify({ id }),
            credentials: 'include',
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            return { message: errorDetails.message.message || errorDetails.message };
        }

        const data = await response.json();
        await FetchUser()
        return data;
    } catch (error) {
        return error.message
    }
};

export const removeToWishList = async ({ id }) => {
    try {
        const token = localStorage.getItem("multi_token");
        const response = await fetch(api.removeToWishList, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                "Authorization": token,
            },
            body: JSON.stringify({ id }),
            credentials: 'include',
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            return { message: errorDetails.message.message || errorDetails.message };
        }

        const data = await response.json();
        await FetchUser();
        return data;
    } catch (error) {
        return error.message
    }
};