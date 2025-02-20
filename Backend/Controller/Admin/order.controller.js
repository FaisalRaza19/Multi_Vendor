import { Shops } from "../../Models/Admin Models/Admin.model.js";
import { User } from "../../Models/User Models/user.model.js";

// Update Order Status
const updateStatus = async (req, res) => {
    try {
        const { shopId } = req.params;
        const { status, similarOrderId } = req.body;

        if (!shopId || !similarOrderId || !status) {
            return res.status(400).json({ message: "shopId, similarOrderId, and status are required." });
        }

        // Find shop and user simultaneously
        const [shop, user] = await Promise.all([
            Shops.findById(shopId).select("-password -refreshToken -products -events -phoneNumber -personalInfo"),
            User.findOne({ "orders.similarOrderId": similarOrderId })
        ]);

        // Validate if shop exists
        if (!shop) {
            return res.status(404).json({ message: "Shop not found." });
        }
        // Validate if user exists
        if (!user) {
            return res.status(404).json({ message: "User not found for the given order." });
        }

        // Find the order in shop
        const shopOrder = shop.Orders.find((e) => e.similarOrderId === similarOrderId);
        if (!shopOrder) {
            return res.status(404).json({ message: "Order not found in the User." });
        }
        const userOrder = user.orders.find((e)=> e.similarOrderId === similarOrderId)
        if (!userOrder) {
            return res.status(404).json({ message: "Order not found in the User." });
        }
        // Update the order status
        userOrder.status = status
        shopOrder.status = status;
        await Promise.all([user.save(),shop.save(),])

        return res.status(200).json({
            status: 200,
            message: "Order status updated successfully.",
            data: shopOrder
        });

    } catch (error) {
        console.error("Error updating order status:", error);
        return res.status(500).json({ message: "Internal server error while updating the status.", error: error.message });
    }
};

export { updateStatus };
