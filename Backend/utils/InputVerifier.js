import { isValidPhoneNumber } from 'react-phone-number-input';
import { Country, State, City } from 'country-state-city';

export const InputVerifier = (data) => {
    const errors = {};
    const { fullName, email, password, userName, shopName, shopDescription, phoneNumber, country, state, city, homeAddress, zipCode, } = data;

    // Verify full name
    if (fullName !== undefined) {
        if (!fullName || fullName.trim() === '' || fullName.length < 3) {
            errors.message = 'Full name is required and must be at least 3 characters.';
        }
    }

    // Verify email
    if (email !== undefined) {
        if (!email || !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
            errors.message = 'Invalid email format.';
        }
    }

    // verify password
    if (password !== undefined) {
        if (!password || password.length < 8) {
            errors.message = 'Password must be at least 8 characters.';
        } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            errors.message = 'Password must include at least one special character.';
        }
    }    

    // Verify username
    if (userName !== undefined) {
        if (!userName || userName.trim() === '' || userName.length < 8) {
            errors.message = 'Username is required and must be at least 8 characters.';
        }
    }

    // Verify shop name
    if (shopName !== undefined) {
        if (!shopName || shopName.trim() === '' || shopName.length < 3) {
            errors.message = 'Shop name is required and must be at least 3 characters.';
        }
    }

    // Verify shop description
    if (shopDescription !== undefined) {
        if (!shopDescription || shopDescription.length < 20) {
            errors.message = 'Shop description must be at least 20 characters.';
        }
    }

    // Verify phone number
    if (phoneNumber !== undefined) {
        if (!phoneNumber || !isValidPhoneNumber(phoneNumber)) {
            errors.message = 'Invalid phone number.';
        }
    }

    // Verify address details
    if (homeAddress !== undefined) {
        if (!homeAddress || homeAddress.trim() === '' || homeAddress.length < 8) {
            errors.message = 'Home address is required and must be at least 8 characters.';
        }
    }

    if (country !== undefined) {
        if (!country || !Country.getAllCountries().find((c) => c.name.toLowerCase() === country.toLowerCase())) {
            errors.message = 'Invalid country.';
        } else if (!state || !State.getStatesOfCountry(Country.getAllCountries().find((c) => c.name.toLowerCase() === country.toLowerCase()).isoCode)
            .find((s) => s.name.toLowerCase() === state.toLowerCase())) {
            errors.message = `Invalid state for the country ${country}.`;
        } else if (!city || !City.getCitiesOfState(
            Country.getAllCountries().find((c) => c.name.toLowerCase() === country.toLowerCase()).isoCode,
            State.getStatesOfCountry(Country.getAllCountries().find((c) => c.name.toLowerCase() === country.toLowerCase()).isoCode)
                .find((s) => s.name.toLowerCase() === state.toLowerCase()).isoCode)
            .find((ci) => ci.name.toLowerCase() === city.toLowerCase())) {
            errors.message= `Invalid city for the state ${state}.`;
        }
    }

    if (zipCode !== undefined) {
        if (!zipCode || zipCode.trim() === '' || !/^[0-9]+$/.test(zipCode)) {
            errors.message = 'Zip code is required and must be numeric.';
        }
    }

    return Object.keys(errors).length > 0 ? errors : true;
};

export const ProductVerifier = ({ productTitle, actualPrice, giveOffer, offerPercent, productDescription, stock, productImage, startDate, endDate }) => {
    const errors = {};

    // Verify product title
    if (productTitle !== undefined && (productTitle.trim() === '' || productTitle.length < 10)) {
        errors.productTitle = 'Product title is required and must be at least 10 characters.';
    }

    // Verify actual price
    if (actualPrice !== undefined && actualPrice < 0.10) {
        errors.actualPrice = 'Actual price must be at least $0.10.';
    }

    // Verify offer percent
    if (giveOffer && offerPercent !== undefined && offerPercent < 2) {
        errors.offerPercent = 'Offer percent must be at least 2%.';
    } else if (giveOffer && offerPercent > 100) {
        errors.offerPercent = 'Offer percent cannot be more than 100%.';
    }

    // Verify product description
    if (productDescription !== undefined && productDescription.length < 20) {
        errors.productDescription = 'Product description must be at least 20 characters long.';
    }

    // Verify stock
    if (stock !== undefined) {
        const validStockOptions = ['In Stock', 'Limited Stock', 'Out of Stock'];
        if (!validStockOptions.includes(stock)) {
            errors.stock = "Stock must be one of 'in stock', 'limited stock', or 'out of stock'.";
        }
    }

    // Verify product image
    if (productImage !== undefined && productImage.trim().length === 0) {
        errors.productImage = 'Product image is required.';
    }

    // Verify startDate and endDate
    if (startDate !== undefined && endDate !== undefined) {
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (isNaN(start) || isNaN(end)) {
            errors.dateRange = 'Invalid start date or end date.';
        } else {
            const diffInDays = (end - start) / (1000 * 60 * 60 * 24);
            if (diffInDays > 3) {
                errors.dateRange = 'The difference between start date and end date must be exactly 3 days.';
            }
        }
    }
    return Object.keys(errors).length > 0 ? errors : true;
};


export const validateCoupon = ({ code, value, expirationDate }) => {
    const errors = [];
    // Validate coupon code
    if (!code || typeof code !== 'string' || code.trim().length < 5) {
        errors.push('Coupon code is required and must be a non-empty string.');
    }

    // Validate discount value
    if (value === undefined || isNaN(value) || value <= 0 || value >=100) {
        errors.push('Discount value is required and must be a positive number.');
    }

    // validate expiration date
    if (!expirationDate || isNaN(new Date(expirationDate).getTime())) {
        errors.push('Expiration date is required and must be a valid date.');
    } else if (new Date(expirationDate) <= new Date()) {
        errors.push('Expiration date must be in the future.');
    }

    // Return validation result
    return errors.length > 0 ? errors : true;
}
