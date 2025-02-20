import Stripe from 'stripe';
import 'dotenv/config';
const secretKey = process.env.STRIPE_SECRET_KEY;
const stripe = new Stripe(secretKey, { apiVersion: '2022-11-15' });

// create account 
const createAccount = async (req, res) => {
    try {
        const { email } = req.body
        const account = await stripe.accounts.create({
            type: "express",
            country: "US",
            email: email,
            capabilities: {
                transfers: { requested: true },
            },
        });

        res.status(200).json({ message: "Connected account created", data: account });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// create account for on boarding user
const middleAccount = async (req, res) => {
    try {
        const { accountId } = req.body;
        const accountLink = await stripe.accountLinks.create({
            account: accountId,
            refresh_url: "http://localhost:3000/reauth",
            return_url: "http://localhost:3000/dashboard",
            type: "account_onboarding",
        });

        return res.status(200).json({ status: 200, message: "Account Create Success fully", data: accountLink });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// give payment
const givePayment = async (req, res) => {
    try {
        const { amount } = req.body;

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100),
            currency: "usd",
            payment_method_types: ['card'],
            transfer_data: {
                destination: process.env.MIDDLE_ACCOUNT_NUMBER,
            },
        });
        return res.status(200).json({ status: 200, message: "Payment successful", data: paymentIntent, });
    } catch (error) {
        return res.status(500).json({ message: "Payment failed", error: error.raw?.message || error.message, });
    }
};

const takePayment = async (req, res) => {
    try {
        const { amount, accountId } = req.body;

        const transfer = await stripe.transfers.create({
            amount: amount * 100, // Convert dollars to cents
            currency: "usd",
            destination: accountId, // Seller's Stripe Account ID
        });

        return res.status(200).json({ status: 200, message: "Pament give successfully", data: transfer });
    } catch (error) {
        console.error("Payment Error:", error);
        return res.status(500).json({ message: "Failed to process payment", error: error.message });
    }
};

// delete account
const deleteAccount = async (req, res) => {
    try {
        const { accountId } = req.body;

        if (!accountId) {
            return res.status(400).json({ message: "Account ID is required" });
        }

        const deleted = await stripe.accounts.del(accountId);

        if (deleted.deleted) {
            return res.status(200).json({ message: "Connected account deleted successfully" });
        } else {
            return res.status(400).json({ message: "Failed to delete connected account" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



export { createAccount, middleAccount, givePayment, takePayment, deleteAccount }