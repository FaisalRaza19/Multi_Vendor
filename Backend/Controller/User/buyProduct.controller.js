import { Shops } from "../../Models/Admin.model.js";
import { User } from "../../Models/user.model.js";
import { payment } from "../../utils/payment.js";
import CryptoJS from "crypto-js";

// Encrypt account number for security
function encryptNumber(number, secretKey) {
    return CryptoJS.AES.encrypt(number.toString(), secretKey).toString();
}

// Validate address and zip code formats
function validateAddressWithSpaces(address) {
    return /^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/.test(address.trim());
}

function validateZipCode(zipCode) {
    return /^\d{5}(-\d{4})?$/.test(zipCode.trim());
}

// Add multiple products to the cart
const addToCart = async (req, res) => {
    try {
        const { products } = req.body;

        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: "At least one product is required." });
        }

        // Retrieve existing cart from session or initialize
        let cartItems = [];

        // Cache to avoid redundant database calls for the same product
        const productCache = new Map();

        for (let i = 0; i < products.length; i++) {
            const { productId, quantity } = products[i];

            // Ensure quantity is converted to a number and validate input
            const quantityNumber = Number(quantity);
            if (!productId || isNaN(quantityNumber) || quantityNumber < 1) {
                return res.status(400).json({
                    message: `Invalid product data: 'productId' and a minimum 'quantity' of 1 are required.`,
                });
            }

            // Check if the product is already in the cart
            const existingItem = cartItems.find((e) => e.productId === productId);

            if (existingItem) {
                // Update quantity and total price for existing cart item
                existingItem.quantity += quantityNumber;
                existingItem.totalPrice = existingItem.price * existingItem.quantity;
            } else {
                // Fetch product details (use cache if already fetched)
                const shop = await Shops.findOne({ "products._id": productId });
                if (!shop) {
                    return res.status(404).json({ message: `Shop not found for product ID: ${productId}` });
                }
                let product;
                if (productCache.has(productId)) {
                    product = productCache.get(productId);
                } else {

                    product = shop.products.id(productId);
                    if (!product) {
                        return res.status(404).json({ message: `Product not found for product ID: ${productId}` });
                    }

                    productCache.set(productId, product); // Cache the product
                }

                // Determine price based on offers
                const price =
                    product.giveOffer === "did not give Offer" || !product.offerPrice
                        ? product.actualPrice
                        : product.offerPrice;

                // Add new product to the cart
                cartItems.push({
                    productId,
                    image: product.productImage,
                    name: product.productTitle,
                    quantity: quantityNumber,
                    price,
                    totalPrice: price * quantityNumber,
                    shopId: shop._id,
                });
            }
        }

        // Calculate the grand total price
        const grandTotalPrice = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);

        // Update the session with the modified cart
        req.session.cartItems = cartItems;
        req.session.grandTotalPrice = grandTotalPrice;

        return res.status(200).json({
            message: "Products added to cart.",
            cartItems,
            grandTotalPrice,
        });
    } catch (error) {
        console.error("Error in addToCart:", error);
        return res.status(500).json({
            message: "Internal server error while adding products to cart.",
        });
    }
};

// Handle checkout for multiple items in the cart
const checkOut = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) return res.status(401).json({ message: "Unauthorized user." });

        const {country,state,city,zipCode,homeAddress,paymentMethod,bankName,accountHolderName,accountNumber} = req.body;

        if ([country, state, city, zipCode, homeAddress, paymentMethod].some((field) => !field?.trim())) {
            return res.status(400).json({ message: "All address and payment fields are required." });
        }

        const { cartItems, grandTotalPrice } = req.session;
        if (!cartItems || cartItems.length === 0) {
            return res.status(400).json({ message: "Cart session expired. Please add items to the cart again." });
        }

        // Group products by shopId
        const shopOrders = cartItems.reduce((acc, item) => {
            if (!acc[item.shopId]) {
                acc[item.shopId] = [];
            }
            acc[item.shopId].push({
                productId: item.productId,
                productImage: { url: item.image.url },
                productTitle: item.name,
                productPrice: item.price,
                eachProductQuantity: item.quantity,
                totalPrice: item.totalPrice,
            });
            return acc;
        }, {});

        const userOrderData = {
            products: cartItems.map((item) => ({
                productId: item.productId,
                productImage: { url: item.image.url },
                productTitle: item.name,
                productPrice: item.price,
                eachProductQuantity: item.quantity,
                totalPrice: item.totalPrice,
                shopId: item.shopId,
            })),
            userAddress: { country, state, city, zipCode, homeAddress },
            paymentMethod,
            totalBill: grandTotalPrice,
            paymentDetails: {},
        };

        if (paymentMethod === "cash on delivery") {
            // Save order in User's collection
            await User.findByIdAndUpdate(userId, { $push: { orders: userOrderData } }, { new: true });

            // Save order for each shop
            await Promise.all(
                Object.entries(shopOrders).map(async ([shopId, products]) => {
                    await Shops.findByIdAndUpdate(
                        shopId,
                        {
                            $push: {
                                Orders: {
                                    orderDate: new Date(),
                                    products,
                                    userAddress: { country, state, city, zipCode, homeAddress },
                                    paymentMethod,
                                    totalBill: products.reduce((sum, item) => sum + item.totalPrice, 0),
                                },
                            },
                        },
                        { new: true }
                    );
                })
            );

            return res.status(200).json({ message: "Order placed successfully.", order: userOrderData });
        } else {
            if (!bankName || !accountHolderName || !accountNumber) {
                return res.status(400).json({ message: "Bank details are required for online payment." });
            }

            const encryptedAccountNumber = encryptNumber(accountNumber, process.env.SECRET_KEY);

            // Simulate payment processing
            const paymentResult = await payment(grandTotalPrice);
            if (!paymentResult.success) {
                return res.status(400).json({ message: "Payment processing failed. Please try again." });
            }

            userOrderData.paymentDetails = {
                bankName,
                accountHolderName,
                encryptedAccountNumber,
                paymentStatus: paymentResult.status,
            };

            // Save order in User's collection
            await User.findByIdAndUpdate(userId, { $push: { orders: userOrderData } }, { new: true });

            // Save order for each shop
            await Promise.all(
                Object.entries(shopOrders).map(async ([shopId, products]) => {
                    await Shops.findByIdAndUpdate(
                        shopId,
                        {
                            $push: {
                                Orders: {
                                    orderDate: new Date(),
                                    products,
                                    userAddress: { country, state, city, zipCode, homeAddress },
                                    paymentMethod,
                                    totalBill: products.reduce((sum, item) => sum + item.totalPrice, 0),
                                },
                            },
                        },
                        { new: true }
                    );
                })
            );

            return res.status(200).json({ message: "Order placed successfully.", order: userOrderData });
        }
    } catch (error) {
        console.error("Error during checkout:", error);
        return res.status(500).json({
            message: "Internal server error during checkout.",
            error: error.message,
        });
    }
};


export { addToCart, checkOut };