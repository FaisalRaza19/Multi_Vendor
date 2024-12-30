import { isValidPhoneNumber } from 'react-phone-number-input';
import { Country, State, City } from 'country-state-city';

export const InputVerifier = ({ fullName, email, password, userName, shopName, shopDescription, phoneNumber, country, state, city, homeAddress, zipCode, }) => {
    try {
        const errors = {};

        // Verify full name
        if (fullName !== undefined) {
            if (!fullName || fullName.trim() === '' || fullName.length < 3) {
                errors.fullName = 'Full name is required and must be at least 3 characters.';
            }
        }

        // Verify email
        if (email !== undefined) {
            const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!email || !emailRegex.test(email)) {
                errors.email = 'Invalid email format.';
            }
        }

        // Verify password
        if (password !== undefined) {
            if (!password || password.length < 8) {
                errors.password = 'Password must be at least 8 characters.';
            }
        }

        // Verify username
        if (userName !== undefined) {
            if (!userName || userName.trim() === '' || userName.length < 8) {
                errors.userName = 'Username is required and must be at least 8 characters.';
            }
        }

        // Verify shop name
        if (shopName !== undefined) {
            if (!shopName || shopName.trim() === '' || shopName.length < 3) {
                errors.shopName = 'Shop name is required and must be at least 3 characters.';
            }
        }

        // Verify shop name
        if (shopDescription !== undefined) {
            if (!shopDescription || shopDescription.length < 20) {
                errors.shopName = 'shopDescription is required and must be at least 20 characters.';
            }
        }

        // Verify home address
        if (homeAddress !== undefined) {
            if (!homeAddress || homeAddress.trim() === '' || homeAddress.length < 8) {
                errors.homeAddress = 'Home address is required and must be at least 8 characters.';
            }
        }

        // Verify phone number
        if (phoneNumber !== undefined) {
            if (!phoneNumber || !isValidPhoneNumber(phoneNumber)) {
                errors.phoneNumber = 'Invalid phone number.';
            }
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
            if (!zipCode || zipCode.trim() === '') {
                errors.zipCode = 'Zip code is required.';
            } else if (!/^\d+$/.test(zipCode)) {
                errors.zipCode = 'Invalid zip code format. Only numeric values are allowed.';
            }
        }

        if (Object.keys(errors).length > 0) {
            throw errors;
        }

        console.log('All input fields are valid.');
        return true;
    } catch (errors) {
        console.error('Errors during verifying the input fields:', errors);
        return errors;
    }
};


export const ProductVerifier = ({ productTitle, actualPrice, giveOffer, offerPercent, productDescription, stock, productImage }) => {
    try {
        const errors = {};

        // Verify product title if provided
        if (productTitle !== undefined) {
            if (!productTitle || productTitle.trim() === '' || productTitle.length < 10) {
                errors.productTitle = "Product title is required min 10 character.";
            }
        }

        // Verify actual price if provided
        if (actualPrice !== undefined) {
            if (!actualPrice || actualPrice < 0.10) {
                errors.actualPrice = "Actual price must be at least $0.10.";
            }
        }

        // Verify offer percent if provided
        if (giveOffer && offerPercent !== undefined) {
            if (offerPercent < 2) {
                errors.offerPercent = "Offer percent must be at least 2%.";
            }
        }

        // Verify product description if provided
        if (productDescription !== undefined) {
            if (!productDescription || productDescription.length < 20) {
                errors.productDescription = "Product description must be at least 20 characters long.";
            }
        }
        // Verify stock if provided
        if (stock !== undefined) {
            const validStockOptions = ["in stock", "limited stock", "out of stock"];
            if (!validStockOptions.includes(stock)) {
                errors.stock = "Stock must be one of 'in stock', 'limited stock', or 'out of stock'.";
            }
        }

        // Verify product image if provided
        if (productImage !== undefined) {
            if (productImage.trim().length === 0) {
                errors.productImage = "Product image is required.";
            }
        }

        return errors;
    } catch (error) {
        console.error('Errors during verifying the input fields:', error);
        return { error: "An unexpected error occurred during validation." };
    }
}