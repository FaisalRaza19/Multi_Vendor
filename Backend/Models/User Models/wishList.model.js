import mongoose from 'mongoose'

export const wishList = new mongoose.Schema(
    {
        productTitle: {
            type: String,
            required: true
        },
        actualPrice: {
            type: Number,
            required: true,
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
            required: true
        },
        user : {
            type : Object,
            required : true,
        },
        category: {
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
        shopInfo: {
            type: Object,
            required: [true || "User Not Found"],
        },
    },
    {
        timestamps: true,
    }
)