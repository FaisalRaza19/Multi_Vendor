import {api} from "./Api's.js";

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
            throw new Error(errorDetails.message || `Failed to register user: ${response.statusText}`);
        }

        const data = await response.json();
        navigate("/code-verify");
        return data;
    } catch (error) {
        console.error("Error during registration:", error.message);
        throw error;
    }
};

// Updated CodeVerify Function
export const CodeVerify = async ({ otp, navigate, setAuth }) => {
    try {
        const response = await fetch(api.codeVerify, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code: otp }),
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error(data.message || 'Invalid OTP');
        }

        const data = await response.json();
        setAuth(true);
        localStorage.setItem("multi_token", data.accessToken);
        navigate("/dashboard");
        return data;
    } catch (error) {
        console.error("Error during OTP verification:", error.message);
        throw error;
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
            throw new Error(data.message || 'Invalid OTP');
        }

        const data = await response.json();
        console.log(data)
        return data;
    } catch (error) {
        console.error("Error during OTP verification:", error.message);
        throw error;
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
            throw new Error(errorDetails.message || `Failed to register user: ${response.statusText}`);
        }

        const data = await response.json();
        localStorage.setItem("multi_token", data.data.accessToken);
        isAuth(true);
        navigate("/dashboard");
        FetchUser();
        return data;
    } catch (error) {
        console.error("Error during registration:", error.message);
        throw error;
    }
};

// fetch user 
export const FetchUser = async() => {
    try {
        const token = localStorage.getItem("multi_token");
        const response = await fetch(api.getUser, {
            method: "GET",
            headers: {
                "Authorization": token,
            },
        });

        if (!response.ok) {
            throw new Error(data.message || 'Invalid token');
        }
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error("Error during Fetch User:", error.message);
        throw error;
    }
};

// update avatar 
export const UpdateAvatar = async (file) => {
    if (!file) {
        alert("Please select a file to upload.");
        return;
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
            throw new Error(data.message || 'Error to update avatar');
        }
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error("Error during update avatar:", error.message);
        throw error;
    }
};

// edit profile 
export const UpdateProfile = async ({ formData,navigate }) => {
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
            throw new Error(data.message || 'Error to update avatar');
        }
        const data = await response.json();
        if (data.message !== "Profile updated successfully") {
            navigate("/email-verify")
        }
        return data.data;
    } catch (error) {
        console.error("Error during update avatar:", error.message);
        throw error;
    }
};

// if user change email send code and verify
export const VerifyProfile = async ({ otp, navigate}) => {
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
            throw new Error(data.message || 'Error to update avatar');
        }
        const data = await response.json();
        navigate("/dashboard")
        return data.data;
    } catch (error) {
        console.error("Error during update avatar:", error.message);
        throw error;
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
            throw new Error(data.message || 'Error to update avatar');
        }
        const data = await response.json();
        console.log(data)
        isAuth(false);
        localStorage.removeItem("multi_token");
        navigate("/login")
        return data;
    } catch (error) {
        console.error("Error during update avatar:", error.message);
        throw error;
    }
};

// verify token 
export const verifyJWT = async () => {
    try {
        const token = localStorage.getItem("multi_token");
        if (!token) {
            console.error("No token found in local storage.");
            return false;
        }
        const response = await fetch(api.verifyJWT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token,
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
