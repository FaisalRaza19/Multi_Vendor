import { api } from "../Api's.js";

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
            const errorDetails = await response.json();
            return {message : errorDetails.message};
        }

        const data = await response.json();
        return data;
    } catch (error) {
        return error.message;
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
            const errorDetails = await response.json();
            return {message : errorDetails.message};
        }

        const data = await response.json();
        return data;
    } catch (error) {
        return error.message;
    }
};

// get all products
export const getAllProducts = async () => {
    try {
        const response = await fetch(api.getAllProducts, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include",
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            return {message : errorDetails.message};
        }

        const data = await response.json();
        return data;
    } catch (error) {
        return error.message
    }
};

// get product through id
export const fetchProductById = async ({productId}) => {
    try {
        const response = await fetch(`${api.getProductById}/${productId}`, {
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
        return error.message;
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
            const errorDetails = await response.json();
            return {message : errorDetails.message};
        }

        const data = await response.json();
        return data;
    } catch (error) {
        return error.message;
    }
};
