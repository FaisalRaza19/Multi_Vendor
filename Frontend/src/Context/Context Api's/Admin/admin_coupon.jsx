import { api } from "../Api's";

// create coupon 
export const createCoupon = async ({ credential }) => {
    try {
        const token = localStorage.getItem("admin_token");
        const response = await fetch(api.createCoupon, {
            method: "POST",
            headers: {
                'token': token,
            },
            body: JSON.stringify(credential),
            credentials: "include",
        });

        if (!response.ok){
            const errorDetails = await response.json();
            return errorDetails.message;
        }

        const data = await response.json();
        return data;
    } catch (error) {
        return error.message
    }
} 

// delete coupon 
export const deleteCoupon = async ({ credential }) => {
    try {
        const token = localStorage.getItem("admin_token");
        const response = await fetch(api.deleteCoupon, {
            method: "POST",
            headers: {
                'token': token,
            },
            body: JSON.stringify(credential),
            credentials: "include",
        });

        if (!response.ok){
            const errorDetails = await response.json();
            return errorDetails.message;
        }

        const data = await response.json();
        return data;
    } catch (error) {
        return error.message
    }
} 

