import Stripe from 'stripe';
import 'dotenv/config';
const secretKey = process.env.STRIPE_SECRET_KEY;
const stripe = new Stripe(secretKey, { apiVersion: '2022-11-15' });

const payment = async({ cardNumber, expiryMonth, expiryYear, cvc, amount })=>{
    try {
        // Create a token for the card details
        const token = await stripe.tokens.create({
            card: {
                number: cardNumber,
                exp_month: expiryMonth,
                exp_year: expiryYear,
                cvc: cvc,
            },
        });

        // Create a charge for the payment
        const charge = await stripe.charges.create({
            amount: Math.round(amount * 100), // Convert dollars to cents
            currency: 'usd',
            source: token.id,
            description: 'Payment for services',
        });

        return charge;
    } catch (error) {
        throw new Error(`Payment failed: ${error.message}`);
    }
}

const payOut = async({ cardNumber, expiryMonth, expiryYear, cvc, amount })=>{
    if (amount < 10) {
        throw new Error('Minimum payout amount is $10');
    }

    try {
        // Create a token for the card details
        const token = await stripe.tokens.create({
            card: {
                number: cardNumber,
                exp_month: expiryMonth,
                exp_year: expiryYear,
                cvc: cvc,
            },
        });

        // Create a transfer to the seller
        const transfer = await stripe.transfers.create({
            amount: Math.round(amount * 100), // Convert dollars to cents
            currency: 'usd',
            destination: token.id,
            description: 'Payout to seller',
        });

        return transfer;
    } catch (error) {
        throw new Error(`Payout failed: ${error.message}`);
    }
}

export {payment,payOut}