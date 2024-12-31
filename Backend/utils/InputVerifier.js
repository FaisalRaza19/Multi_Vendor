import { isValidPhoneNumber } from 'react-phone-number-input';
import { Country, State, City } from 'country-state-city';

export const InputVerifier = ({ fullName, email, password, userName, shopName, shopDescription, phoneNumber, country, state, city, homeAddress, zipCode, }) => {
    const errors = {};

    // Verify full name
    if (fullName !== undefined && (fullName.trim() === '' || fullName.length < 3)) {
        errors.fullName = 'Full name is required and must be at least 3 characters.';
    }

    // Verify email
    if (email !== undefined) {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            errors.email = 'Invalid email format.';
        }
    }

    // Verify password
    if (password !== undefined && password.length < 8) {
        errors.password = 'Password must be at least 8 characters.';
    }

    // Verify username
    if (userName !== undefined && (userName.trim() === '' || userName.length < 8)) {
        errors.userName = 'Username is required and must be at least 8 characters.';
    }

    // Verify shop name
    if (shopName !== undefined && (shopName.trim() === '' || shopName.length < 3)) {
        errors.shopName = 'Shop name is required and must be at least 3 characters.';
    }

    // Verify shop description
    if (shopDescription !== undefined && shopDescription.length < 20) {
        errors.shopDescription = 'Shop description must be at least 20 characters.';
    }

    // Verify home address
    if (homeAddress !== undefined && (homeAddress.trim() === '' || homeAddress.length < 8)) {
        errors.homeAddress = 'Home address is required and must be at least 8 characters.';
    }

    // Verify phone number
    if (phoneNumber !== undefined && !isValidPhoneNumber(phoneNumber)) {
        errors.phoneNumber = 'Invalid phone number.';
    }

    // Verify country
    if (country !== undefined) {
        const validCountry = Country.getAllCountries().find(
            (c) => c.name.toLowerCase() === country.toLowerCase()
        );
        if (!validCountry) {
            errors.country = 'Invalid country.';
        }
    }

    // Verify state
    if (state !== undefined) {
        if (country) {
            const validCountry = Country.getAllCountries().find(
                (c) => c.name.toLowerCase() === country.toLowerCase()
            );
            if (validCountry) {
                const validState = State.getStatesOfCountry(validCountry.isoCode).find(
                    (s) => s.name.toLowerCase() === state.toLowerCase()
                );
                if (!validState) {
                    errors.state = `Invalid state for the country ${country}.`;
                }
            } else {
                errors.state = 'State cannot be verified without a valid country.';
            }
        } else {
            errors.state = 'Country is required to verify state.';
        }
    }

    // Verify city
    if (city !== undefined) {
        if (country && state) {
            const validCountry = Country.getAllCountries().find(
                (c) => c.name.toLowerCase() === country.toLowerCase()
            );
            const validState = State.getStatesOfCountry(validCountry.isoCode).find(
                (s) => s.name.toLowerCase() === state.toLowerCase()
            );
            if (validState) {
                const validCity = City.getCitiesOfState(validCountry.isoCode, validState.isoCode).find(
                    (ci) => ci.name.toLowerCase() === city.toLowerCase()
                );
                if (!validCity) {
                    errors.city = `Invalid city for the state ${state}.`;
                }
            } else {
                errors.city = 'City cannot be verified without a valid state.';
            }
        } else {
            errors.city = 'Country and state are required to verify city.';
        }
    }

    // Verify zip code
    if (zipCode !== undefined) {
        if (zipCode.trim() === '') {
            errors.zipCode = 'Zip code is required.';
        } else if (!/^[0-9]+$/.test(zipCode)) {
            errors.zipCode = 'Invalid zip code format. Only numeric values are allowed.';
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
    }

    // Verify product description
    if (productDescription !== undefined && productDescription.length < 20) {
        errors.productDescription = 'Product description must be at least 20 characters long.';
    }

    // Verify stock
    if (stock !== undefined) {
        const validStockOptions = ['in stock', 'limited stock', 'out of stock'];
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