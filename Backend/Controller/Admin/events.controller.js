import { fileUploadOnCloudinary } from "../../utils/fileUploadAndRemoveFromCloudinary.js";
import { removeFileFromCloudinary } from "../../utils/fileUploadAndRemoveFromCloudinary.js";
import { Shops } from "../../Models/Admin.model.js";
import { ProductVerifier } from "../../utils/InputVerifier.js"

// add event
const addEvent = async (req, res) => {
    try {
        const userId = req.admin._id;
        if (!userId) {
            return res.status(400).json({ message: "User ID not found." });
        }

        const { productTitle, actualPrice, offerPercent, productDescription, stock, startDate, endDate, category } = req.body;
        const productImages = req.files?.productImages;

        // Check for missing fields
        if (!productTitle || !actualPrice || !offerPercent || !productDescription || !category || !stock || !startDate || !endDate || !productImages) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Verify input
        const verifyProduct = ProductVerifier(req.body);
        if (verifyProduct !== true) {
            return res.status(400).json({ message: "Invalid input", error: verifyProduct });
        }

        // Calculate event status based on dates
        const currentDate = new Date();
        const eventStartDate = new Date(startDate);
        const eventEndDate = new Date(endDate);


        if (currentDate > eventStartDate || eventEndDate < currentDate || eventEndDate < eventStartDate) {
            return res.status(400).json({ message: "Please select future date" })
        }
        // Nullify offer if event is finished
        let offerPercentValue;
        let offerPercentPrice;
        if (eventStartDate < eventEndDate) {
            offerPercentValue = offerPercent;
            offerPercentPrice = actualPrice - (actualPrice * offerPercent) / 100
        } else {
            offerPercentValue = null;
            offerPercentPrice = null;
        }

        const folder = "Multi Vendor/Events Images";
        const images = []; // Array to store uploaded images

        // Process each uploaded file and add to the images array
        for (const file of productImages) {
            try {
                const uploadedImage = await fileUploadOnCloudinary(file?.path, folder);
                if (uploadedImage) {
                    images.push({
                        public_id: uploadedImage.public_id,
                        url: uploadedImage.url,
                    });
                }
            } catch (uploadError) {
                console.error(`Error uploading file:`, uploadError);
                return res.status(500).json({ message: "Error uploading images.", error: uploadError });
            }
        };

        // Find the shop and add the new product
        const shop = await Shops.findOne({ _id: userId }).select("-password -refreshToken");
        if (!shop) {
            return res.status(404).json({ message: "Shop not found." });
        }

        // Create new product with the uploaded images
        const newProduct = {
            productTitle,
            actualPrice,
            productDescription,
            category,
            shopInfo: {
                shopId : shop._id,
                shopName : shop.shopName,
            },
            stock,
            images,
            eventStart: eventStartDate,
            eventEnd: eventEndDate,
            offerPercent: offerPercentValue || null,
            offerPrice: offerPercentPrice,
        };

        shop.events.push(newProduct);
        await shop.save();

        return res.status(201).json({ message: "Product added successfully.", product: newProduct });
    } catch (error) {
        console.error("Error adding product:", error);
        return res.status(500).json({ message: "Something went wrong while adding the product.", error });
    }
};

// get event 
const getAllEvent = async (req, res) => {
    try {
        // Fetch all shops
        const shops = await Shops.find({}, { events: 1, _id: 0 });

        const allProducts = shops.flatMap((shop) => shop.events || []);

        if (allProducts.length === 0) {
            return res.status(404).json({ message: "No products found in any shop." });
        }

        // Return the combined list of products
        return res.status(200).json({
            message: "events retrieved successfully.",
            products: allProducts,
        });
    } catch (error) {
        console.error("Error getting products:", error);
        return res.status(500).json({
            message: "Something went wrong while retrieving the products.",
            error: error.message,
        });
    }
};

// get event:id
const getEvent = async (req, res) => {
    try {
        const { eventId } = req.body;
        if (!eventId) {
            return res.status(400).json({ message: "event ID is required." });
        }

        // Find the shop that contains the product by productId
        const shop = await Shops.findOne({"events._id":eventId}).select("-password -refreshToken");

        if (!shop) {
            return res.status(404).json({ message: "event not found." });
        }

        // Extract the specific product from the shop
        const event = shop.events.find((prod) => prod._id.toString() === eventId);

        if (!event) {
            return res.status(404).json({ message: "event not found in the shop." });
        }

        // Return the product
        return res.status(200).json({ message: "event retrieved successfully.", event });
    } catch (error) {
        console.error("Error getting product:", error);
        return res.status(500).json({ message: "Something went wrong while retrieving the event.", error });
    }
};

// edit product 
const editEvent = async (req, res) => {
    try {
        const userId = req.admin._id;
        if (!userId) {
            return res.status(400).json({ message: "User ID not found." });
        }

        const { eventId, productTitle, actualPrice, offerPercent, productDescription, category, stock, startDate, endDate } = req.body;
        const eventImages = req.files?.eventImages;

        // Validate required fields
        if (!eventId || !productTitle || !actualPrice || !offerPercent || !category || !productDescription || !stock) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Verify product input fields
        const verifyProduct = ProductVerifier(req.body);
        if (verifyProduct !== true) {
            return res.status(400).json({ message: "Invalid input", error: verifyProduct });
        }

        // Calculate event status based on dates
        const currentDate = new Date();
        const eventStartDate = new Date(startDate);
        const eventEndDate = new Date(endDate);


        if (currentDate > eventStartDate || eventEndDate < currentDate || eventEndDate < eventStartDate) {
            return res.status(400).json({ message: "Please select future date" })
        }
        // Nullify offer if event is finished
        let offerPercentValue;
        let offerPercentPrice;
        if (eventStartDate < eventEndDate) {
            offerPercentValue = offerPercent;
            offerPercentPrice = actualPrice - (actualPrice * offerPercent) / 100
        } else {
            offerPercentValue = null;
            offerPercentPrice = null;
        }

        // Find the shop by event ID
        const shop = await Shops.findOne(userId).select("-password -refreshToken");
        if (!shop) {
            return res.status(404).json({ message: "event not found in any shop." });
        }

        // Find the specific event within the shop
        const event = shop.events.find((e) => e?._id?.toString() === eventId);
        if (!event) {
            return res.status(404).json({ message: "event not found in the shop." });
        }

        // Update product details
        event.productTitle = productTitle || event.productTitle;
        event.actualPrice = actualPrice || event.actualPrice;
        event.productDescription = productDescription || event.productDescription;
        event.stock = stock || event.stock;
        event.category = category || event.category;
        event.eventStart = eventStartDate,
            event.eventEnd = eventEndDate,
            event.offerPercent = offerPercentValue || null,
            event.offerPrice = offerPercentPrice

        // Handle product image updates
        if (eventImages && eventImages.length > 0) {
            const retainedIds = req.body.publicId?.map((id) => id) || [];
            const existingIds = event.images.map((img) => img.public_id);

            // Determine which images to delete
            const idsToDelete = existingIds.filter((id) => !retainedIds.includes(id));
            for (const id of idsToDelete) {
                await removeFileFromCloudinary(id);
            }

            // Upload new images
            const uploadedImages = [];
            for (const file of eventImages) {
                const uploadedImage = await fileUploadOnCloudinary(file.path, "Multi Vendor/Events Images");
                if (uploadedImage) {
                    uploadedImages.push({
                        public_id: uploadedImage.public_id,
                        url: uploadedImage.url,
                    });
                }
            }

            // Update product images
            event.images = [
                ...event.images.filter((img) => retainedIds.includes(img.public_id)),
                ...uploadedImages,
            ];
        }

        // Save the updated product
        await shop.save();

        return res.status(200).json({
            statusCode: 200,
            data: event,
            message: "Product updated successfully",
        });
    } catch (error) {
        console.error("Error editing product:", error);
        return res.status(500).json({ message: "Something went wrong while editing the product.", error });
    }
};

// delete product 
const deleteEvent = async (req, res) => {
    try {
        const userId = req.admin._id;
        if (!userId) {
            return res.status(400).json({ message: "User ID not found." });
        }
        const { eventId } = req.body;
        if (!eventId) {
            return res.status(404).json({ message: "event id is required" });
        }

        const shop = await Shops.findOne(userId).select("-password -refreshToken");
        if (!shop) {
            return res.status(404).json({ message: "Shop not found." });
        }

        const event = shop.events.find((e) => e._id.toString() === eventId);

        if (!event) {
            return res.status(404).json({ message: "event not found in the shop." });
        }

        const publicIds = event.images.map((e) => e.public_id);
        for (const publicId of publicIds) {
            try {
                await removeFileFromCloudinary(publicId);
            } catch (cloudinaryError) {
                console.error(`Error deleting image (${publicId}):`, cloudinaryError);
                return res.status(500).json({ message: "Error deleting product images.", error: cloudinaryError });
            }
        }

        event.deleteOne(event);
        await shop.save();
        return res.status(200).json({ message: "Product is delete successfully", data: shop.events });
    } catch (error) {
        console.error("Error to delete product:", error);
        return res.status(500).json({ message: "Something went wrong while delete the product.", error });
    }
}

export { addEvent, getAllEvent, getEvent, deleteEvent, editEvent };