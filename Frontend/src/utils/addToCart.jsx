import Cookies from "js-cookie";

export const addToCart = (product) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingIndex = cart.findIndex(item => item.id === product.id);

    if (existingIndex !== -1) {
        cart[existingIndex].quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    // Store cart session ID in cookies (valid for 7 days)
    if (!Cookies.get("cartID")) {
        Cookies.set("cartID", generateUniqueID(), { expires: 7 });
    }

    alert(`${product?.productTitle} added to cart! 🛒`);
};

// Generate a random cart session ID
const generateUniqueID = () => {
    return Math.random().toString(36).substr(2, 9);
};
