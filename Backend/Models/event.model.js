import mongoose from "mongoose";
import { productReview } from "./review.model.js"

export const admin_events = new mongoose.Schema(
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
        offerPercent: {
            type: String,
            default: "0%",
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
        eventStart: {
            type: Date,
            required: true
        },
        eventEnd: {
            type: Date,
            required: true
        },
        productReviews: [productReview]
    },
    {
        timestamps: true,
    }
)