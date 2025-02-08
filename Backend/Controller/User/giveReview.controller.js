import { User } from "../../Models/User Models/user.model.js";
import { Shops } from "../../Models/Admin Models/Admin.model.js"

// give review 
const giveReview = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(400).json({ message: "User not found" });
        }

        const { id } = req.params;
        const { message } = req.body;

        // verify message length
        if (message.length < 3 || message.length > 300) {
            return res.status(400).json({ message: "Message must be between 3 and 300 characters" });
        }

        // Fetch the user and shop data
        const [user, shop] = await Promise.all([
            User.findById(userId).select("-password -refreshToken"),
            Shops.findOne({ $or: [{ "products._id": id }, { "events._id": id }] }),
        ]);

        // Check if user and shop exist
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        if (!shop) {
            return res.status(404).json({ message: "Shop not found." });
        }

        let item = null;
        let isEvent = false;

        // Check if id belongs to an event or product
        if (shop.events.some(event => event._id.toString() === id)) {
            item = shop.events.find((e) => e._id.toString() === id);
            isEvent = true;
        } else if (shop.products.some(product => product._id.toString() === id)) {
            item = shop.products.find((e) => e._id.toString() === id);
        }

        // If the item was not found
        if (!item) {
            return res.status(404).json({ message: "Item (product/event) not found within the shop." });
        }

        // Create the review object
        const review = {
            user: {
                userId: user._id,
                userName: user.userName,
                avatar: user.avatar?.url,
            },
            message: message,
            likes: {
                userId: [],
                totalLikes: 0,
            },
            unLikes: {
                userId: [],
                totalUnLikes: 0,
            }
        };

        // add review 
        if (isEvent) {
            item.productReviews.push(review);
        } else {
            item.productReviews.push(review);
        }

        await shop.save();

        return res.status(200).json({
            status: 200,
            message: "Review added successfully.",
            review: review,
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error while adding the review.",error });
    }
};

// edit review 
const editReview = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(400).json({ message: "User not found" });
        }
        const { id } = req.params;
        const { messageId, message } = req.body;
        if (!id || !message || !messageId) {
            return res.status(400).json({ message: "productId,and message are required" });
        }
        // Check message length
        if (message.length < 3 || message.length > 300) {
            return res.status(400).json({ message: "Message must be between 3 and 300 characters" });
        }

        // Fetch user and shop
        const [user, shop] = await Promise.all([
            User.findById(userId).select("-password -refreshToken"),
            Shops.findOne({ $or: [{ "products._id": id }, { "events._id": id }] }),
        ]);

        // Check user and shop
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        if (!shop) {
            return res.status(404).json({ message: "Shop not found" });
        }

        let item = null;
        let isEvent = false;

        // Check if id belongs to an event or product
        if (shop.events.some(event => event._id.toString() === id)) {
            item = shop.events.find((e) => e._id.toString() === id);
            isEvent = true;
        } else if (shop.products.some(product => product._id.toString() === id)) {
            item = shop.products.find((e) => e._id.toString() === id);
        }

        // If the item was not found
        if (!item) {
            return res.status(404).json({ message: "Item (product/event) not found within the shop." });
        }

        // find message 
        const findMessage = item?.productReviews.find((e) => e._id.equals(messageId));
        if (!findMessage) {
            return res.status(404).json({ message: "Review not found for this user." });
        }
        // update message 
        if (isEvent) {
            findMessage.message = message;
        } else {
            findMessage.message = message;
        }
        await shop.save();

        return res.status(200).json({ status: 200, message: "message update successfully", data: findMessage });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error while edit the review.",error});
    }
}

// delete review
const deleteReview = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(400).json({ message: "User not found" });
        }
        const { id } = req.params;
        const { messageId } = req.body;
        if (!id) {
            return res.status(400).json({ message: "productId and message are required" });
        }

        // Fetch user and shop
        const [user, shop] = await Promise.all([
            User.findById(userId).select("-password -refreshToken"),
            Shops.findOne({ $or: [{ "products._id": id }, { "events._id": id }] }),
        ]);

        // Check user and shop
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        if (!shop) {
            return res.status(404).json({ message: "Shop not found" });
        }

        let item = null;
        let isEvent = false;

        // Check if id belongs to an event or product
        if (shop.events.some(event => event._id.toString() === id)) {
            item = shop.events.find((e) => e._id.toString() === id);
            isEvent = true;
        } else if (shop.products.some(product => product._id.toString() === id)) {
            item = shop.products.find((e) => e._id.toString() === id);
        }

        // If the item was not found
        if (!item) {
            return res.status(404).json({ message: "Item (product/event) not found within the shop." });
        }

        // find message 
        const findMessage = item?.productReviews.find((e) => e._id.equals(messageId));
        if (!findMessage) {
            return res.status(404).json({ message: "Review not found for this user." });
        }

        if (isEvent) {
            findMessage.deleteOne(findMessage);
        } else {
            findMessage.deleteOne(findMessage);

        }
        await shop.save();

        return res.status(200).json({ status: 200, message: "Message delete successfully", data: item.productReviews });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error while edit the review.",errro});
    }
}

// Give like
const giveLike = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(400).json({ message: "User not found" });
        }

        // Get and check productId and messageId
        const { id } = req.params;
        const { messageId } = req.body;
        if (!id || !messageId) {
            return res.status(400).json({ message: "productId and messageId are required" });
        }

        // Fetch user and shop
        const [user, shop] = await Promise.all([
            User.findById(userId).select("-password -refreshToken"),
            Shops.findOne({ $or: [{ "products._id": id }, { "events._id": id }] }),
        ]);

        // Check if user and shop exist
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        if (!shop) {
            return res.status(404).json({ message: "Shop not found" });
        }

        let item = null;
        let isEvent = false;

        // Check if id belongs to an event or product
        if (shop.events.some(event => event._id.toString() === id)) {
            item = shop.events.find((e) => e._id.toString() === id);
            isEvent = true;
        } else if (shop.products.some(product => product._id.toString() === id)) {
            item = shop.products.find((e) => e._id.toString() === id);
        }

        // If the item was not found
        if (!item) {
            return res.status(404).json({ message: "Item (product/event) not found within the shop." });
        }

        // find message 
        const message = item?.productReviews.find((e) => e._id.equals(messageId));
        if (!message) {
            return res.status(404).json({ message: "Review not found for this user." });
        }

        // Check if the user has already liked or disliked this message
        const hasLiked = message.likes.userId.includes(userId);
        const hasUnLiked = message.unLikes.userId.includes(userId);

        // If user disliked the message, remove dislike
        if (hasUnLiked) {
            message.unLikes.userId = message.unLikes.userId.filter(id => !id.equals(userId));
            message.unLikes.totalUnLikes = Math.max((message.unLikes.totalUnLikes || 0) - 1, 0);
        }

        // Update like status
        if (hasLiked) {
            message.likes.userId = message.likes.userId.filter(id => !id.equals(userId));
            message.likes.totalLikes = Math.max((message.likes.totalLikes || 0) - 1, 0);
        } else {
            message.likes.userId.push(userId);
            message.likes.totalLikes = (message.likes.totalLikes || 0) + 1;
        }

        await shop.save();

        return res.status(200).json({
            message: hasLiked ? "Message unliked successfully!" : "Message liked successfully!",
            totalLikes: message.likes.totalLikes,
            totalUnLikes: message.unLikes.totalUnLikes
        });
    } catch (error) {
        return res.status(500).json({ status: 200, message: "Internal server error while liking/unliking the message.",error});
    }
};

// Give unlike
const giveUnLike = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(400).json({ message: "User not found" });
        }

        // Get and check productId and messageId
        const { id } = req.params;
        const { messageId } = req.body;
        if (!id || !messageId) {
            return res.status(400).json({ message: "productId and messageId are required" });
        }

        // Fetch user and shop
        const [user, shop] = await Promise.all([
            User.findById(userId).select("-password -refreshToken"),
            Shops.findOne({ $or: [{ "products._id": id }, { "events._id": id }] }),
        ]);

        // Check if user and shop exist
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        if (!shop) {
            return res.status(404).json({ message: "Shop not found" });
        }

        let item = null;
        let isEvent = false;

        // Check if id belongs to an event or product
        if (shop.events.some(event => event._id.toString() === id)) {
            item = shop.events.find((e) => e._id.toString() === id);
            isEvent = true;
        } else if (shop.products.some(product => product._id.toString() === id)) {
            item = shop.products.find((e) => e._id.toString() === id);
        }

        // If the item was not found
        if (!item) {
            return res.status(404).json({ message: "Item (product/event) not found within the shop." });
        }

        // find message 
        const message = item?.productReviews.find((e) => e._id.equals(messageId));
        if (!message) {
            return res.status(404).json({ message: "Review not found for this user." });
        }

        // Check if the user has already liked or disliked this message
        const hasLiked = message.likes.userId.includes(userId);
        const hasUnLiked = message.unLikes.userId.includes(userId);

        // If user liked the message, remove like
        if (hasLiked) {
            message.likes.userId = message.likes.userId.filter(id => !id.equals(userId));
            message.likes.totalLikes = Math.max((message.likes.totalLikes || 0) - 1, 0);
        }

        // Update dislike status
        if (hasUnLiked) {
            message.unLikes.userId = message.unLikes.userId.filter(id => !id.equals(userId));
            message.unLikes.totalUnLikes = Math.max((message.unLikes.totalUnLikes || 0) - 1, 0);
        } else {
            message.unLikes.userId.push(userId);
            message.unLikes.totalUnLikes = (message.unLikes.totalUnLikes || 0) + 1;
        }

        await shop.save();

        return res.status(200).json({
            status: 200,
            message: hasUnLiked ? "Message unliked successfully!" : "Message disliked successfully!",
            totalUnLikes: message.unLikes.totalUnLikes,
            totalLikes: message.likes.totalLikes
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error while liking/unliking the message.",error});
    }
};

export { giveReview, editReview, deleteReview, giveLike, giveUnLike };