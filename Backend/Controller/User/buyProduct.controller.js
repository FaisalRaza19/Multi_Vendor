import { Shops } from "../../Models/Admin Models/Admin.model.js";
import { User } from "../../Models/User Models/user.model.js";

// Handle checkout for multiple items in the cart
const createOrder = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) return res.status(401).json({ message: "Unauthorized user." });
        // find user 
        const user = await User.findById(userId).select("-password -refreshToken");
        if (!user) {
            return res.status(404).json({ message: "User not found." })
        };

        // get data 
        const { products, shippingAddress, paymentInfo } = req.body;
        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: "At least one product is required." });
        }

        // add,get and set products
        let cartItems = [];
        // store products
        const productCache = new Map();
        // store shop Products 
        const shopOrders = new Map();

        for (let i = 0; i < products.length; i++) {
            const { shopId, productId, quantity } = products[i];
            // verify data 
            const quantityNumber = Number(quantity);
            if (!productId || isNaN(quantityNumber) || quantityNumber < 1) {
                return res.status(400).json({ message: `Invalid product data: 'productId' and a minimum 'quantity' of 1 are required.`, });
            }

            // check item 
            const existingItem = cartItems.find((e) => e?.productId === productId);
            if (existingItem) {
                existingItem.quantity += quantityNumber;
                existingItem.totalPrice += existingItem.productPrice * existingItem.quantity;
            } else {
                // find shop 
                const shop = await Shops.findById({ "_id": shopId }).select("-password -refreshToken -personalInfo -phoneNumber");
                if (!shop) {
                    return res.status(400).json({ message: "shop not found", });
                }
                let product;
                if (productCache.has(productId)) {
                    product = productCache.get(productId);
                } else {
                    // find product 
                    product = shop.products.find((e) => e._id.toString() === productId);
                    if (!product) {
                        return res.status(400).json({ message: "product not found", });
                    }
                    productCache.set(productId, product);
                }
                // get price
                const price = product.giveOffer === false ? product.actualPrice : product.offerPrice;
                // push item
                cartItems.push({
                    productId,
                    productTitle: product.productTitle,
                    productDescription: product.productDescription,
                    shopInfo: product.shopInfo,
                    productImages: product.images,
                    category: product.category,
                    quantity: quantityNumber,
                    productPrice: price,
                    totalPrice: price * quantityNumber,
                });
                // Group products by shopId for order processing
                if (!shopOrders.has(shopId)) {
                    shopOrders.set(shopId, []);
                }
                shopOrders.get(shopId).push({
                    productId,
                    productTitle: product.productTitle,
                    productDescription: product.productDescription,
                    shopInfo: product.shopInfo,
                    productImages: product.images,
                    category: product.category,
                    quantity: quantityNumber,
                    productPrice: price,
                    totalPrice: price * quantityNumber,
                });
            }
        }

        // grand total 
        const grandTotalPrice = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);

        const order = {
            items: cartItems,
            shippingAddress: {
                country: shippingAddress.country,
                state: shippingAddress.state,
                city: shippingAddress.city,
                zipCode: shippingAddress.zipCode,
                homeAdress: shippingAddress.homeAdress,
            },
            user: {
                name: user.fullName,
                userName: user.userName,
                avatar: user.avatar
            },
            totalPrice: grandTotalPrice,
            paymentInfo,
        };

        user.orders.push(order);
        user.save();

        // Add the grouped order items to each shop's order array
        for (const [shopId, shopOrderItems] of shopOrders) {
            const shop = await Shops.findById(shopId);
            if (!shop) {
                return res.status(400).json({ message: "Shop not found." });
            }

            // Create an order object for the shop
            const shopOrder = {
                items: shopOrderItems,
                totalPrice: shopOrderItems.reduce((acc, item) => acc + item.totalPrice, 0),
                shippingAddress: {
                    country: shippingAddress.country,
                    state: shippingAddress.state,
                    city: shippingAddress.city,
                    zipCode: shippingAddress.zipCode,
                    homeAdress: shippingAddress.homeAdress,
                },
                user: {
                    name: user.fullName,
                    userName: user.userName,
                    avatar: user.avatar
                },
                paymentInfo,
            };

            // Push the order to the shop's orders
            shop.Orders.push(shopOrder);
            await shop.save();
        }

        return res.status(200).json({ message: "Data retrived successfully", data: { order, "shop Order": shopOrders, grandTotalPrice } })
    } catch (error) {
        return res.status(500).json({message: "Internal server error during checkout.",error: error.message,});
    }
};


export { createOrder };