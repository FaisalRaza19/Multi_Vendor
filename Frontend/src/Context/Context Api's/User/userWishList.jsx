import { api } from "../Api's.js";
import {FetchUser} from "./user_auth.jsx"

export const addToWishList = async ({id}) => {
    try {
        const token = localStorage.getItem("multi_token");
        const response = await fetch(api.addToWishList, {
            method: "POST",
            headers: { 
                'Content-Type': 'application/json',
                "Authorization": token,
            },
            body: JSON.stringify({id}),
            credentials: 'include',
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            return {message : errorDetails.message.message || errorDetails.message};
        }

        const data = await response.json();
        await FetchUser();
        return data;
    } catch (error) {
        return error.message
    }
};

export const removeToWishList = async ({id}) => {
    try {
        const token = localStorage.getItem("multi_token");
        const response = await fetch(api.removeToWishList, {
            method: "POST",
            headers: { 
                'Content-Type': 'application/json',
                "Authorization": token,
            },
            body: JSON.stringify({id}),
            credentials: 'include',
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            return {message : errorDetails.message.message || errorDetails.message};
        }

        const data = await response.json();
        await FetchUser();
        return data;
    } catch (error) {
        return error.message
    }
};