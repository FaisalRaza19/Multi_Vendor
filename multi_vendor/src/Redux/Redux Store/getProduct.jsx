import { createSlice} from "@reduxjs/toolkit";
import { fetchProducts,fetchShop} from "./products&Events.jsx";

const initialState = {
    products:[],
    shop : {},
    status: "loading",
    error: null,
}

const handlePending = (state) => {
    state.status = "loading";
    state.error = null;
};

const handleFulfilled = (field) => (state, action) => {
    state[field] = action.payload;
    state.status = "succeeded";
};

const handleRejected = (state, action) => {
    state.status = "failed";
    state.error = action.error?.message || "Something went wrong";
};
const productsSlice = createSlice({
    name: "products",
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending,handlePending)
            .addCase(fetchProducts.fulfilled, handleFulfilled("products"))
            .addCase(fetchProducts.rejected, handleRejected)

            // fetch shop
            .addCase(fetchShop.pending,handlePending)
            .addCase(fetchShop.fulfilled, handleFulfilled("shop"))
            .addCase(fetchShop.rejected, handleRejected)
    },
});

export default productsSlice.reducer;