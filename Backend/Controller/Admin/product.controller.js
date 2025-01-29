import { fileUploadOnCloudinary, removeFileFromCloudinary } from "../../utils/fileUploadAndRemoveFromCloudinary.js";
import { Shops } from "../../Models/Admin.model.js";
import { ProductVerifier } from "../../utils/InputVerifier.js"

// Add Product
const addProduct = async (req, res) => {
    try {
        const userId = req.admin._id;
        if (!userId) {
            return res.status(400).json({ message: "User ID not found." });
        }

        const { productTitle, actualPrice, giveOffer, offerPercent, productDescription, stock, category } = req.body;
        const productImages = req.files?.productImages;

        // Check for missing fields
        if (!productTitle || !actualPrice || !giveOffer || !offerPercent || !productDescription || !stock || !productImages || !category) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Verify input
        const verifyProduct = ProductVerifier(req.body);
        if (verifyProduct !== true) {
            return res.status(400).json({ message: "Invalid input", error: verifyProduct });
        }

        const folder = "Multi Vendor/Products Images";
        const images = [];

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
        }
        const calculateOfferPrice = parseFloat(actualPrice) - (parseFloat(actualPrice) * parseFloat(offerPercent)) / 100;

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
            stock,
            shopInfo: {
                shopId: shop._id,
                shopName: shop.shopName,
            },
            images,
            giveOffer: giveOffer === "true" ? true : false,
            offerPercent: giveOffer === "true" ? offerPercent : null,
            offerPrice: giveOffer === "true" ? calculateOfferPrice : null,
        };

        shop.products.push(newProduct)
        await shop.save();

        return res.status(201).json({status : 200, message: "Product added successfully.", product: newProduct });

    } catch (error) {
        console.error("Error adding product:", error);
        return res.status(500).json({ message: "Something went wrong while adding the product.", error });
    }
};

// get product through :id
const getProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        if (!productId) {
            return res.status(400).json({ message: "Product ID is required." });
        }

        // Find the shop that contains the product by productId
        const shop = await Shops.findOne({ "products._id": productId }).select("-password -refreshToken");

        if (!shop) {
            return res.status(404).json({ message: "Product not found." });
        }

        // Extract the specific product from the shop
        const product = shop.products.find((prod) => prod._id.toString() === productId);

        if (!product) {
            return res.status(404).json({ message: "Product not found in the shop." });
        }

        // Return the product
        return res.status(200).json({status : 200,  message: "Product retrieved successfully.", product });
    } catch (error) {
        console.error("Error getting product:", error);
        return res.status(500).json({ message: "Something went wrong while retrieving the product.", error });
    }
};

// get all products present in shop collection in mongo db products 
const get_allProduct = async (req, res) => {
    try {
        // Fetch all shops and retrieve only the `products` field
        const shops = await Shops.find({}, { products: 1, _id: 0 });

        // Flatten the `products` arrays from all shops
        const allProducts = shops.flatMap((shop) => shop.products || []);

        // Check if there are any products
        if (allProducts.length === 0) {
            return res.status(404).json([]);
        }

        // Return the array of products
        return res.status(200).json({status : 200, message : "Product retrived successfully", allProducts});
    } catch (error) {
        console.error("Error getting products:", error);
        return res.status(500).json([]);
    }
};

// edit product
const editProduct = async (req, res) => {
    try {
        const userId = req.admin._id;
        if (!userId) {
            return res.status(400).json({ message: "User ID not found." });
        }

        const { productId, productTitle, actualPrice, giveOffer, category, offerPercent, productDescription, stock } = req.body;
        const productImages = req.files?.productImages;

        // Validate required fields
        if (!productId || !productTitle || !actualPrice || !productDescription || !stock || !category) {
            return res.status(400).json({ message: "All required fields must be provided." });
        }

        // Find the shop associated with the admin user
        const shop = await Shops.findOne({ _id: userId }).select("-password -refreshToken");
        if (!shop) {
            return res.status(404).json({ message: "Shop not found." });
        }

        // Find the specific product within the shop
        const product = shop.products.find((e) => e?._id?.toString() === productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found in the shop." });
        }

        // Update product details
        product.productTitle = productTitle;
        product.actualPrice = actualPrice;
        product.productDescription = productDescription;
        product.stock = stock;
        product.category = category;

        // Handle offer-related fields
        product.giveOffer = giveOffer === "true";
        product.offerPercent = product.giveOffer ? offerPercent || product.offerPercent : null;
        product.offerPrice = product.giveOffer
            ? ((actualPrice - (actualPrice * (offerPercent || 0)) / 100).toFixed(2))
            : null;

        // Handle product image updates
        if (productImages && productImages.length > 0) {
            const retainedIds = req.body.publicId?.map((id) => id) || [];
            const existingIds = product.images.map((img) => img.public_id);

            // Determine which images to delete
            const idsToDelete = existingIds.filter((id) => !retainedIds.includes(id));
            for (const id of idsToDelete) {
                await removeFileFromCloudinary(id);
            }

            // Upload new images
            const uploadedImages = [];
            for (const file of productImages) {
                const uploadedImage = await fileUploadOnCloudinary(file.path, "Multi Vendor/Products Images");
                if (uploadedImage) {
                    uploadedImages.push({
                        public_id: uploadedImage.public_id,
                        url: uploadedImage.url,
                    });
                }
            }

            // Update product images
            product.images = [
                ...product.images.filter((img) => retainedIds.includes(img.public_id)),
                ...uploadedImages,
            ];
        } else if(!productImages){
            const retainedIds = req.body.publicId?.map((id) => id) || [];
            if(retainedIds){
                const existingIds = product.images.map((img) => img.public_id);
    
                // Determine which images to delete
                const idsToDelete = existingIds.filter((id) => !retainedIds.includes(id));
                for (const id of idsToDelete) {
                    await removeFileFromCloudinary(id);
                }
            }
            product.images = [
                ...product.images.filter((img) => retainedIds.includes(img.public_id))
            ];
        }

        // Save the updated product
        await shop.save();
        return res.status(200).json({status : 200, data: product, message: "Product updated successfully" });
    } catch (error) {
        console.error("Error editing product:", error);
        return res.status(500).json({ message: "Something went wrong.", error: error.message });
    }
};

// delete product 
const deleteProduct = async (req, res) => {
    try {
        const userId = req.admin._id;
        if (!userId) {
            return res.status(400).json({ message: "User ID not found." });
        }
        const { productId } = req.body;
        if (!productId) {
            return res.status(404).json({ message: "Product id is required" });
        }

        const shop = await Shops.findOne(userId).select("-password -refreshToken");
        if (!shop) {
            return res.status(404).json({ message: "Product not found." });
        }

        const product = shop.products.find((e) => e._id.toString() === productId);

        if (!product) {
            return res.status(404).json({ message: "Product not found in the shop." });
        }

        const publicIds = product.images.map((e) => e.public_id);
        for (const publicId of publicIds) {
            try {
                await removeFileFromCloudinary(publicId);
            } catch (cloudinaryError) {
                console.error(`Error deleting image (${publicId}):`, cloudinaryError);
                return res.status(500).json({ message: "Error deleting product images.", error: cloudinaryError });
            }
        }

        product.deleteOne(product);
        await shop.save();
        return res.status(200).json({status : 200, message: "Product is delete successfully", data: shop.products });
    } catch (error) {
        console.error("Error to delete product:", error);
        return res.status(500).json({ message: "Something went wrong while delete the product.", error });
    }
}

export { addProduct, get_allProduct, getProduct, editProduct, deleteProduct };