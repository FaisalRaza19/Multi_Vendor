import mongoose from "mongoose";
import { User } from "../../Models/User Models/user.model.js";
import { Shops } from "../../Models/Admin Models/Admin.model.js";

const addToFavourite = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(400).json({ message: "User not found" });
        }

        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ message: "Product ID required." });
        }

        const user = await User.findById(userId).select("-password -refreshToken");
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const productId = new mongoose.Types.ObjectId(id);

        // Check if product is already in the wishlist
        const productIndex = user.favouriteList.findIndex((e) => e._id.toString() === id);
        if (productIndex !== -1) {
            user.favouriteList.splice(productIndex, 1);
            await user.save();
            return res.status(200).json({ status: 200, message: "Product removed from wishlist successfully", data: user.favouriteList });
        }

        // Find the shop
        const shop = await Shops.findOne({ "products._id": productId }).select("-password -personalInfo -phoneNumber -refreshToken -Orders -completedOrder");

        if (!shop) {
            return res.status(400).json({ message: "Shop not found" });
        }

        // Find the product
        const product = shop.products.find((e) => e._id.equals(productId));
        if (!product) {
            return res.status(400).json({ message: "Product not found" });
        }

        // Create wishlist item
        const wishListItem = {
            _id: product._id,
            user : {
                userId : user._id,
            },
            productTitle: product.productTitle,
            productDescription: product.productDescription,
            actualPrice: product.actualPrice,
            offerPercent: product.offerPercent,
            offerPrice: product.offerPrice,
            category : product.category,
            images: product.images,
            shopInfo: product.shopInfo,
        };

        user.favouriteList.push(wishListItem);
        await user.save();

        return res.status(200).json({ status: 200, message: "Product added to wishlist successfully", data: wishListItem });
    } catch (error) {
        return res.status(500).json({ message: "Error adding product to wishlist.", error: error.message });
    }
};

const removeFromFavourite = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(400).json({ message: "User not found" });
        }

        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ message: "Product ID required." });
        }

        const user = await User.findById(userId).select("-password -refreshToken");
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const productId = new mongoose.Types.ObjectId(id);

        // Find product in favouriteList
        const productIndex = user.favouriteList.findIndex((e) => e._id.toString() === id);
        if (productIndex === -1) {
            return res.status(400).json({ message: "Product not found in wishlist." });
        }

        // Remove product from wishlist
        user.favouriteList.splice(productIndex, 1);
        await user.save();

        return res.status(200).json({ status: 200, message: "Product removed from wishlist successfully", data: user.favouriteList });
    } catch (error) {
        return res.status(500).json({ message: "Error removing product from wishlist.", error: error.message });
    }
};

export { addToFavourite,removeFromFavourite };
