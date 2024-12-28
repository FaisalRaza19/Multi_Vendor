import mongoose from "mongoose";

export const orderSchema = new mongoose.Schema(
    {
        products: [
            {
                productId: {
                    type: String,
                    required: true,
                },
                productImage: {
                    url: {
                        type: String,
                        required: true,
                    },
                },
                productTitle: {
                    type: String,
                    required: true,
                },
                productPrice: {
                    type: Number,
                    required: true,
                },
                eachProductQuantity: {
                    type: Number,
                    required: true,
                },
                totalPrice: {
                    type: Number,
                    required: true,
                },
                shopId: {
                    type: String,
                    required: true,
                },
            },
        ],
        userAddress: {
            country: { type: String, required: true },
            state: { type: String, required: true },
            city: { type: String, required: true },
            zipCode: { type: String, required: true },
            homeAddress: { type: String, required: true },
        },
        totalBill: {
            type: Number,
            required: true,
        },
        paymentMethod: {
            type: String,
            required: true,
        },
        paymentDetails: {
            bankName: {
                type: String,
            },
            accountHolderName: {
                type: String,
            },
            encryptedAccountNumber: {
                type: String,
            },
            paymentStatus: {
                type: String,
            },
        },
    },
    {
        timestamps: true,
    }
);