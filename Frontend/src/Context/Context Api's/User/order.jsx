import { api } from "../Api's.js";

// Updated Register Function
export const placeOrder = async ({ credential }) => {
    try {
        const token = localStorage.getItem("multi_token");
        const response = await fetch(api.placeOrder, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({ credential }),
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

export const givePayment = async ({ amount }) => {
    try {
        const token = localStorage.getItem("multi_token");

        const response = await fetch(api.givePayment, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token,
            },
            body: JSON.stringify({ amount }),
            credentials: "include",
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            return { message: errorDetails.message.message || errorDetails.message };
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Payment error:", error);
        return { error: error.message };
    }
};

export const changeStatus = async ({credential,shopId}) => {
    try {
        const token = localStorage.getItem("admin_token");

        const response = await fetch(`${api.changeStatus}/${shopId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                token,
            },
            body: JSON.stringify(credential),
            credentials: "include",
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            return { message: errorDetails.message.message || errorDetails.message };
        }
        const data = await response.json();
        return data;
    } catch (error) {
        return { error: error.message };
    }
};