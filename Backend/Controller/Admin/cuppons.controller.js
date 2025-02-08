import { validateCoupon } from "../../utils/InputVerifier.js";
import { Shops } from "../../Models/Admin Models/Admin.model.js";

// Create coupons
const createCoupon = async (req, res) => {
    try {
        const { shopId, couponName, value, expirationDate, product } = req.body;

        if (!shopId || !couponName || !value || !expirationDate || !product) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const userId = req.admin?._id;
        if (!userId) return res.status(400).json({ message: "User ID not found." });

        // Verify coupon data
        const verifyCoupon = validateCoupon({ code: couponName, value, expirationDate });
        if (verifyCoupon !== true) {
            return res.status(400).json({ message: "Invalid coupon data.", errors: verifyCoupon });
        }

        // Find the shop
        const shop = await Shops.findById(shopId).select("-password -refreshToken");
        if (!shop) return res.status(404).json({ message: "Shop not found." });

        if (product === "All") {
            let couponCreated = false;
            shop.products.forEach((prod) => {
                if (prod.Coupon) {
                    return res.status(400).json({ message: "Coupon already exists for one or more products." });
                }

                if (prod.offerPrice) {
                    const discount = prod.offerPrice - (prod.offerPrice * value) / 100;
                    if (discount <= 0) {
                        return res.status(400).json({ message: "Please select a valid coupon value to ensure the product value is not zero." });
                    }
                }

                // Create and assign the coupon
                const coupon = {
                    couponName,
                    value,
                    shopInfo: {
                        shopId: shop._id,
                        shopName: shop.shopName,
                    },
                    expirationDate,
                    product: prod._id,
                };
                prod.Coupon = coupon;
                couponCreated = true;
            });

            if (couponCreated) {
                await shop.save();
                return res.status(201).json({ message: "Coupons added successfully for all products." });
            } else {
                return res.status(400).json({ message: "No coupons were created." });
            }
        }

        // Find product
        const productData = shop.products.find((e) => e?._id.toString() === product);
        if (!productData) {
            return res.status(404).json({ message: "Product not found." });
        }

        // Check coupon already exists
        if (productData.Coupon) {
            return res.status(400).json({ message: "Coupon already exists for this product." });
        }

        // Create coupon
        const coupon = {
            couponName,
            value,
            shopInfo: {
                shopId: shop._id,
                shopName: shop.shopName,
            },
            expirationDate,
            product: productData._id,
        };
        productData.Coupon = coupon;

        await shop.save();
        return res.status(201).json({ message: "Coupon added successfully.", data: coupon });
    } catch (error) {
        res.status(500).json({ message: "Internal server error.", error: error.message });
    }
};

// Delete coupons
const deleteCoupon = async (req, res) => {
    try {
        const { shopId, couponName, product } = req.body;

        if (!shopId || !couponName || !product) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Find the shop
        const shop = await Shops.findById(shopId).select("-password -refreshToken");
        if (!shop) return res.status(404).json({ message: "Shop not found." });

        if (product === "All") {
            let couponDeleted = false;
            shop.products.forEach((prod) => {
                if (prod.Coupon && prod.Coupon.couponName === couponName && prod.Coupon.product === prod._id) {
                    prod.Coupon = null;
                    couponDeleted = true;
                }
            });

            if (couponDeleted) {
                await shop.save();
                return res.status(200).json({ message: "Coupons deleted successfully for all products." });
            } else {
                return res.status(404).json({ message: "Coupon not found on any product." });
            }
        }

        // Find the specific product
        const productData = shop.products.find((e) => e?._id.toString() === product);
        if (!productData) {
            return res.status(404).json({ message: "Product not found." });
        }

        // Check if the coupon exists for the product
        if (!productData.Coupon || productData.Coupon.couponName !== couponName) {
            return res.status(404).json({ message: "Coupon not found for this product." });
        }

        // Delete the coupon
        productData.Coupon = null;
        await shop.save();
        return res.status(200).json({ message: "Coupon deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: "Internal server error.", error: error.message });
    }
};

export { createCoupon, deleteCoupon };