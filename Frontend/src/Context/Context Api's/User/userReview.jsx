import { api } from "../Api's.js";


export const addReview = async ({ id, message }) => {
    try {
        const token = localStorage.getItem("multi_token")
        const response = await fetch(`${api.giveReview}/${id}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
            },
            body: JSON.stringify({ message }),
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
}

export const delReview = async ({ id, messageId }) => {
    try {
        const token = localStorage.getItem("multi_token")
        const response = await fetch(`${api.delReview}/${id}`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
            },
            body: JSON.stringify({ messageId }),
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
}

export const editReview = async ({ id, messageId,message }) => {
    try {
        const token = localStorage.getItem("multi_token")
        const response = await fetch(`${api.editReview}/${id}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
            },
            body: JSON.stringify({ messageId,message }),
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
}

export const giveLike = async ({ id, messageId}) => {
    try {
        const token = localStorage.getItem("multi_token")
        const response = await fetch(`${api.giveLike}/${id}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
            },
            body: JSON.stringify({ messageId}),
            credentials: 'include',
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            return { message: errorDetails.message.message || errorDetails.message };
        }

        const data = await response.json();
        console.log(data)
        return data;
    } catch (error) {
        return error.message
    }
}

export const giveUnLike = async ({ id, messageId}) => {
    try {
        const token = localStorage.getItem("multi_token")
        const response = await fetch(`${api.giveUnLike}/${id}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
            },
            body: JSON.stringify({ messageId}),
            credentials: 'include',
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            return { message: errorDetails.message.message || errorDetails.message };
        }

        const data = await response.json();
        console.log(data)
        return data;
    } catch (error) {
        return error.message
    }
}


