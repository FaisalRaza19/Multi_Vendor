import { api } from "../Api's.js";
import { jwtDecode } from "jwt-decode";
// user create chat
export const user_CreateChat = async ({ sellerId, navigate }) => {
    try {
        const token = localStorage.getItem("multi_token");
        const response = await fetch(api.userCreateChat, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({ sellerId }),
            credentials: 'include',
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            return { message: errorDetails.message.message || errorDetails.message };
        }

        const data = await response.json();
        navigate(`/user-dashboard/inbox`);
        return data;
    } catch (error) {
        return error.message
    }
};

// seller create chat
export const seller_CreateChat = async ({ userId,navigate,shopId}) => {
    try {
        const token = localStorage.getItem("admin_token");
        const response = await fetch(api.sellerCreateChat, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                token,
            },
            body: JSON.stringify({ userId }),
            credentials: 'include',
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            return { message: errorDetails.message.message || errorDetails.message };
        }

        const data = await response.json();
        navigate(`/Shop/${shopId}/inbox`)
        return data;
    } catch (error) {
        return error.message
    }
};

// send message
export const sendMessage = async (newMessage) => {
    try {
        const formData = new FormData();
        Object.entries(newMessage).forEach(([key, value]) => {
            if (key == "images") {
                value.forEach((file) => formData.append(key, file));
            } else {
                formData.append(key, value);
            }
        });
        const response = await fetch(api.sendMessage, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            return { message: errorDetails.message.message || errorDetails.message };
        }

        const data = await response.json();
        return data;
    } catch (error) {
        return error.message
    }
};

// edit message
export const editMessage = async (credential) => {
    try {
        const response = await fetch(api.editMessage, {
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
        return data;
    } catch (error) {
        return error.message
    }
};

// edit message
export const delMessage = async (credential) => {
    try {
        const response = await fetch(api.delMessage, {
            method: "DELETE",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credential),
            credentials: 'include',
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            return { message: errorDetails.message.message || errorDetails.message };
        }

        const data = await response.json();
        return data;
    } catch (error) {
        return error.message
    }
};

// user get chats
export const user_getChats = async (setUserId) => {
    try {
        const token = localStorage.getItem("multi_token");
        if (token) {
            const decodedToken = jwtDecode(token);
            setUserId(decodedToken.userId)
        }
        const response = await fetch(api.userGetChat, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
            },
            credentials: 'include',
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            return { message: errorDetails.message.message || errorDetails.message };
        }

        const data = await response.json();
        return data;
    } catch (error) {
        return error.message
    }
};

// seller get chats
export const seller_getChats = async (setUserId) => {
    try {
        const token = localStorage.getItem("admin_token");
        if (token) {
            const decodedToken = jwtDecode(token);
            setUserId(decodedToken.adminId)
        }
        const response = await fetch(api.sellerGetChat, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                token,
            },
            credentials: 'include',
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            return { message: errorDetails.message.message || errorDetails.message };
        }

        const data = await response.json();
        return data;
    } catch (error) {
        return error.message
    }
};
