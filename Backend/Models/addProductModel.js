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
        giveOffer : {
            type : String,
            required : true,
        },
        offerPercent : {
            type : String,
            default : "0%",
        },
        offerPrice : {
            type: Number,
            default : 0,
        },
        productDescription: {
            type: String,
            required: true,
        },
        productImage: {
            url: {
                type: String,
                required: true,
                index: true,
            },
            publicId: {
                type: String,
                required: true,
                index: true,
            }
        },
        productReviews: [productReview]
    },
    {
        timestamps: true,
    }
)