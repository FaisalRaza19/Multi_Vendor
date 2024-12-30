import { fileUploadOnCloudinary } from "../../utils/fileUploadAndRemoveFromCloudinary.js";
import { removeFileFromCloudinary } from "../../utils/fileUploadAndRemoveFromCloudinary.js";
import { Shops } from "../../Models/Admin.model.js";
import { ProductVerifier } from "../../utils/InputVerifier.js"

const addProduct = async (req, res) => {
    try {
        const userId = req.admin._id;
        if (!userId) {
            return res.status(400).json({ message: "User ID not found." });
        }

        const { productTitle, actualPrice, giveOffer, offerPercent, productDescription, stock } = req.body;
        const productImage = req.files?.productImage?.[0]?.path;

        if (!productTitle || !actualPrice || !giveOffer || !offerPercent || !productDescription || !stock) {
            return res.status(400).json({ message: "All fields are required" })
        }

        // validate input
        const validateProduct = ProductVerifier(req.body,productImage);
        if (!validateProduct) {
            return res.status(400).json({ message: "Invalid input", errors: validateProduct });
        }

        let offerPrice = actualPrice;

        // Handle offer logic
        if (giveOffer === 'give Offer') {
            // Calculate the offer price
            const discount = (actualPrice * offerPercent) / 100;
            offerPrice = actualPrice - discount;
        }

        // Upload the product image to Cloudinary
        const folder = "Multi Vendor/Products Images";
        const uploadedImage = await fileUploadOnCloudinary(productImage, folder);
        if (!uploadedImage) {
            return res.status(500).json({ message: "Failed to upload image. Please try again later." });
        }

        // Find the shop related to the user
        const shop = await Shops.findOne(userId).select("-password -refreshToken");
        if (!shop) {
            return res.status(404).json({ message: "Shop not found." });
        }

        // Create new product object
        const newProduct = {
            productTitle,
            actualPrice,
            productDescription,
            productImage: {
                url: uploadedImage?.url,
                publicId: uploadedImage.public_id,
            },
            giveOffer: giveOffer === 'give Offer' ? 'give Offer' : 'did not give Offer',
            offerPercent: giveOffer === 'give Offer' ? `${offerPercent}%` : null,
            offerPrice: giveOffer === 'give Offer' ? offerPrice : null,
        };

        // Push product into products field in Shop model
        shop.products.push(newProduct);
        await shop.save();

        return res.status(201).json({ message: "Product added successfully.", product: newProduct });
    } catch (error) {
        console.error("Error adding product:", error);
        return res.status(500).json({ message: "Something went wrong while adding the product.", error });
    }
};

// get product 
const getProduct = async (req, res) => {
    try {
        const { productId } = req.body;

        // Check if productId is provided
        if (!productId) {
            return res.status(400).json({ message: "Product ID is required." });
        }

        // Find the shop that contains the product by productId
        const shop = await Shops.findOne({ "products._id": productId }).select("products");

        if (!shop) {
            return res.status(404).json({ message: "Product not found." });
        }

        // Extract the specific product from the shop
        const product = shop.products.find((prod) => prod._id.toString() === productId);

        if (!product) {
            return res.status(404).json({ message: "Product not found in the shop." });
        }

        // Return the product
        return res.status(200).json({ message: "Product retrieved successfully.", product });
    } catch (error) {
        console.error("Error getting product:", error);
        return res.status(500).json({ message: "Something went wrong while retrieving the product.", error });
    }
};

// edit product 
const editProduct = async (req, res) => {
    try {
        const { productId, productTitle, actualPrice, giveOffer, offerPercent, productDescription } = req.body

        const shop = await Shops.findOne({ "products._id": productId })

        if (!shop) {
            return res.status(404).json({ message: "Product not found." });
        }

        const product = shop.products.find((e) => e?._id?.toString() === productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found in the shop." });
        }

        // Check if all required fields are provided and non-empty
        if ([productId, productTitle, actualPrice, giveOffer, offerPercent, productDescription].some((e) => e?.trim() === "")) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Validate product title length
        if (productTitle.length < 5 || productTitle.length > 50) {
            return res.status(400).json({ message: "Product title must be between 5 and 50 characters." });
        }

        // Validate product description length
        if (productDescription.length < 50 || productDescription.length > 750) {
            return res.status(400).json({ message: "Product description must be between 30 and 250 characters." });
        }

        // Validate product price
        if (actualPrice <= 0) {
            return res.status(400).json({ message: "Product price must be greater than 0." });
        }

        // edit offer 
        let offerPrice = actualPrice;

        // Handle offer logic
        if (giveOffer === 'give Offer') {
            if (!offerPercent || isNaN(offerPercent) || offerPercent < 3 || offerPercent > 90) {
                return res.status(400).json({ message: "Offer percent must be between 3 and 90." });
            }

            // Calculate the offer price
            const discount = (actualPrice * offerPercent) / 100;
            offerPrice = actualPrice - discount;
        }

        const productImage = req.files?.productImage?.[0]?.path;
        if (!productImage) {
            return res.status(400).json({ message: "Product image is required." });
        }

        // Upload the product image to Cloudinary
        const folder = "Multi Vendor/Products Images"
        const uploadedImage = await fileUploadOnCloudinary(productImage, folder);
        if (!uploadedImage) {
            return res.status(500).json({ message: "Failed to upload image. Please try again later." });
        }

        // remove file from cloudinary 
        if (product.productImage.publicId) {
            await removeFileFromCloudinary(product.productImage.publicId)
        }

        // update product 
        product.productTitle = productTitle,
            product.actualPrice = actualPrice,
            product.productDescription = productDescription,
            product.productImage = {
                url: uploadedImage?.url,
                publicId: uploadedImage.public_id,
            },
            product.giveOffer = giveOffer === 'give Offer' ? 'give Offer' : 'no',
            product.offerPercent = giveOffer === 'give Offer' ? `${offerPercent}%` : null,
            product.offerPrice = giveOffer === 'give Offer' ? offerPrice : null,

            await shop.save();

        return res.status(200).json({ message: "Product updated successfully.", product });
    } catch (error) {
        console.error("Error edit product:", error);
        return res.status(500).json({ message: "Something went wrong while edit the product.", error });
    }
}

// delete product 
const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.body;
        if (!productId) {
            return res.status(404).json({ message: "Product id is required" });
        }

        const shop = await Shops.findOne({ "products._id": productId });
        if (!shop) {
            return res.status(404).json({ message: "Product not found." });
        }

        const product = shop.products.find((e) => e._id.toString() === productId);

        if (!product) {
            return res.status(404).json({ message: "Product not found in the shop." });
        }

        // delete product image from cloudinary 
        if (product.productImage.publicId) {
            await removeFileFromCloudinary(product.productImage.publicId)
        }
        product.deleteOne(product);
        await shop.save();
        return res.status(200).json({ message: "Product is delete successfully", data: shop.products });
    } catch (error) {
        console.error("Error to delete product:", error);
        return res.status(500).json({ message: "Something went wrong while delete the product.", error });
    }
}

export { addProduct, getProduct, editProduct, deleteProduct };