import mongoose from "mongoose";
import { productReview } from "./review.model.js"

export const addProduct = new mongoose.Schema(
    {
        productTitle: {
            type: String,
            required: true,
            index: true,
            trim: true,
        },
        actualPrice: {
            type: Number,
            required: true,
            index: true,
        },
        giveOffer: {
            type: Boolean,
            required: true,
            default : false,
        },
        offerPercent: {
            type: Number,
            default: 0,
        },
        offerPrice: {
            type: Number,
            default: 0,
        },
        productDescription: {
            type: String,
            required: true,
        },
        images: [
            {
                public_id: {
                    type: String,
                    required: true,
                },
                url: {
                    type: String,
                    required: true,
                },
            },
        ],
        stock: {
            type: String,
            required: true,
        },
        productReviews: [productReview]
    },
    {
        timestamps: true,
    }
)