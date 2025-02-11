import Cookies from "js-cookie";

const generateUniqueID = () => Math.random().toString(36).substr(2, 9);

export const addToCart = (product) => {
    try {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        const existingIndex = cart.findIndex(item => item._id === product?._id);

        if (existingIndex !== -1) {
            cart[existingIndex].quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        // Store updated cart
        localStorage.setItem("cart", JSON.stringify(cart));

        // Set a unique cart session ID in cookies (valid for 7 days)
        if (!Cookies.get("cartID")) {
            Cookies.set("cartID", generateUniqueID(), { expires: 7 });
        }

        // Calculate total unique items in the cart
        const totalItems = cart.length;

        return {
            status: 200,
            message: "Product added to cart successfully",
            totalItems,
            cart
        };
    } catch (error) {
        return { status: 500, message: "Failed to add product to cart" };
    }
};

export const removeFromCart = (productId) => {
    try {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart = cart.filter(item => item._id !== productId);

        localStorage.setItem("cart", JSON.stringify(cart));

        return {
            status: 200,
            message: "Product removed from cart successfully",
            cart
        };
    } catch (error) {
        return { status: 500, message: "Failed to remove product from cart" };
    }
};

export const calculateCartTotal = () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let totalAmount = 0;

    cart = cart.map(item => {
        const price = item.offerPrice || item.actualPrice;
        const totalProductPrice = price * item.quantity;

        totalAmount += totalProductPrice;

        return { ...item, totalProductPrice };
    });

    return { cart, totalAmount };
};
