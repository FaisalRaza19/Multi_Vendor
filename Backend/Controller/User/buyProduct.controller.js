import { Shops } from "../../Models/Admin Models/Admin.model.js";
import { User } from "../../Models/User Models/user.model.js";
import { v4 as uuidv4 } from "uuid";

const generateUniqueOrderId = async (user, shopOrders) => {
    let uniqueId;
    let isUnique = false;

    while (!isUnique) {
        uniqueId = uuidv4();

        // Check in user's existing orders
        const userOrderExists = user.orders.some(order => order.similarOrderId === uniqueId);

        // Check in each shop's existing orders
        let shopOrderExists = false;
        for (const shopId of shopOrders.keys()) {
            const shop = await Shops.findById(shopId);
            if (shop && shop.Orders.some(order => order.similarOrderId === uniqueId)) {
                shopOrderExists = true;
                break;
            }
        }

        // If the ID is unique, break the loop
        if (!userOrderExists && !shopOrderExists) {
            isUnique = true;
        }
    }

    return uniqueId;
};

const createOrder = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) return res.status(401).json({ message: "Unauthorized user." });

        // Find user
        const user = await User.findById(userId).select("-password -refreshToken");
        if (!user) return res.status(404).json({ message: "User not found." });

        // Extract data correctly from 'credential'
        const { shippingAddress, payment, products } = req.body.credential;
        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: "At least one product is required." });
        }

        let cartItems = [];
        const shopOrders = new Map();

        for (const item of products) {
            const { shopInfo, _id: productId, quantity, actualPrice, giveOffer, offerPrice, productTitle, category, images, productDescription } = item;

            // Ensure shopInfo exists and extract shopId
            const shopId = shopInfo?.shopId;
            if (!productId || !shopId || isNaN(Number(quantity)) || Number(quantity) < 1) {
                return res.status(400).json({ message: "Invalid product data: Missing 'productId', 'shopId', or valid 'quantity'." });
            }

            // Check if shop exists
            const shop = await Shops.findById(shopId).select("-password -refreshToken");
            if (!shop) return res.status(400).json({ message: "Shop not found." });

            // Determine final price
            const price = giveOffer ? offerPrice : actualPrice;

            // Prepare cart item
            const cartItem = {
                productId,
                productTitle,
                productDescription,
                shopInfo,
                productImages: images,
                category,
                quantity: Number(quantity),
                productPrice: price,
                totalPrice: price * quantity,
            };

            cartItems.push(cartItem);

            // Group products by shop
            if (!shopOrders.has(shopId)) shopOrders.set(shopId, []);
            shopOrders.get(shopId).push(cartItem);
        }

        // Generate a unique order ID
        const similarOrderId = await generateUniqueOrderId(user, shopOrders);

        // Calculate grand total
        const grandTotalPrice = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);

        // Create order object
        const order = {
            similarOrderId,
            items: cartItems,
            shippingAddress,
            user: {
                name: user.fullName,
                userName: user.userName,
                avatar: user.avatar,
            },
            totalPrice: grandTotalPrice,
            paymentInfo: payment,
        };

        // Save order to user
        user.orders.push(order);
        await user.save();

        // Save orders to each shop
        for (const [shopId, shopOrderItems] of shopOrders) {
            const shop = await Shops.findById(shopId);
            if (!shop) return res.status(400).json({ message: "Shop not found." });

            const shopOrder = {
                similarOrderId, 
                items: shopOrderItems,
                totalPrice: shopOrderItems.reduce((acc, item) => acc + item.totalPrice, 0),
                shippingAddress,
                user: {
                    userId : user._id.toString(), 
                    name: user.fullName,
                    userName: user.userName,
                    avatar: user.avatar,
                },
                paymentInfo: payment,
            };

            shop.Orders.push(shopOrder);
            await shop.save();
        }

        return res.status(200).json({
            status: 200,
            message: "Order created successfully",
            data: { order, shopOrders, grandTotalPrice },
        });

    } catch (error) {
        console.error("Error during order creation:", error);
        return res.status(500).json({ message: "Internal server error.", error: error.message });
    }
};

export { createOrder };


