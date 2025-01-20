import { api } from "./Api's.js";

// add product
export const addProducts = async ({ productData }) => {
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
        const response = await fetch(api.addProducts, {
            method: "POST",
            headers: {
                'token': token,
            },
            body: formData,
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error(`Failed to add product: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error during adding product:", error.message);
        throw error;
    }
};

// del product
export const deleteProduct = async (productId) => {
    try {
        const token = localStorage.getItem("admin_token");

        // Perform the API request
        const response = await fetch(api.deleteProduct, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'token': token,
            },
            body: JSON.stringify({ productId }),
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error(`Failed to add product: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error during adding product:", error.message);
        throw error;
    }
};

// get product
export const getProduct = async () => {
    try {
        const response = await fetch(api.getAllProducts, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error(`Failed to add product: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error during adding product:", error.message);
        throw error;
    }
};

// edit product 
export const editProduct = async (productData) => {
    try {
        const token = localStorage.getItem("admin_token");

        const formData = new FormData();
        Object.entries(productData).forEach(([key, value]) => {
            if (key === "productImages" && Array.isArray(value)) {
                value.forEach((image) => {
                    if (image) formData.append("productImages", image);
                });
            } else if (key === "publicId" && Array.isArray(value)) {
                value.forEach((id) => {
                    if (id?.public_id) formData.append("publicId[]", id.public_id);
                });
            } else if (value !== undefined && value !== null) {
                formData.append(key, value);
            }
        });

        const response = await fetch(api.editProduct, {
            method: "POST",
            headers: {
                "token": token
            },
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to edit product: ${errorText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error updating product:", error.message);
        throw error;
    }
};


// events

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
            throw new Error(`Failed to add events: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error during adding event:", error.message);
        throw error;
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
            throw new Error(`Failed to add product: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error during adding product:", error.message);
        throw error;
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
            const errorText = await response.text();
            throw new Error(`Failed to edit product: ${errorText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error updating product:", error.message);
        throw error;
    }
};
