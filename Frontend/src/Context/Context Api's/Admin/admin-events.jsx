import { api } from "../Api's.js"

// add event
export const addEvents = async ({ productData }) => {
    try {
        const token = localStorage.getItem("admin_token");

        const formData = new FormData();
        Object.entries(productData).forEach(([key, value]) => {
            if (key == "productImages") {
                value.forEach((file) => formData.append(key, file));
            } else {
                formData.append(key, value);
            }
        });

        // Perform the API request
        const response = await fetch(api.addEvents, {
            method: "POST",
            headers: {
                'token': token,
            },
            body: formData,
            credentials: "include",
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

// del event
export const deleteEvents = async (eventId) => {
    try {
        const token = localStorage.getItem("admin_token");

        // Perform the API request
        const response = await fetch(api.delEvents, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'token': token,
            },
            body: JSON.stringify({ eventId }),
            credentials: "include",
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            return {message : errorDetails.message};;
        }

        const data = await response.json();
        return data;
    } catch (error) {
        return error.message
    }
};

// edit product 
export const editEvent = async (productData) => {
    try {
        const token = localStorage.getItem("admin_token");

        const formData = new FormData();
        Object.entries(productData).forEach(([key, value]) => {
            if (key === "eventImages" && Array.isArray(value)) {
                value.forEach((image) => {
                    if (image) formData.append("eventImages", image);
                });
            } else if (key === "publicId" && Array.isArray(value)) {
                value.forEach((id) => {
                    if (id?.public_id) formData.append("publicId[]", id.public_id);
                });
            } else if (value !== undefined && value !== null) {
                formData.append(key, value);
            }
        });

        const response = await fetch(api.editEvent, {
            method: "POST",
            headers: {
                "token": token
            },
            body: formData,
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            return {message : errorDetails.message};;
        }

        const data = await response.json();
        return data;
    } catch (error) {
        return error.message
    }
};

// get all events present in every shop
export const fetchAllEvents = async () => {
    try {
        const response = await fetch(api.getAllEvents, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            return {message : errorDetails.message};;
        }

        const data = await response.json();

        return data;
    } catch (error) {
        return error.message;
    }
};

// fetch particular product through id 
export const fetchEventById = async ({eventId}) => {
    try {
        const response = await fetch(`${api.getEventById}/${eventId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            return {message : errorDetails.message};;
        }

        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        return error.message;
    }
};

