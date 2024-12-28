import mongoose from "mongoose";

const BankAccountSchema = new mongoose.Schema(
    {
        bankName: {
            type: String,
            required: true
        },
        accountHolderName: {
            type: String,
            required: true
        },
        encryptedAccountNumber: {
            type: String,
            required: true
        },
    },
    {
        timestamps: true,
    }
)

export { BankAccountSchema };