import { configureStore } from "@reduxjs/toolkit";
import productsSlice from "./Redux Store/getProduct";

export const store = configureStore({
    reducer: {
        products : productsSlice
    }
});