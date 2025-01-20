import { api } from "./Api's.js";
import { createAsyncThunk } from "@reduxjs/toolkit";

// fetch all products 
export const fetchProducts = createAsyncThunk("fetchAllProducts", async (_, { rejectWithValue }) => {
    try {
        const response = await fetch(api.getAllProducts, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();

        const sortedData = data.products.sort((a, b) => {
            const priceA = a.offerPrice || a.actualPrice
            const priceB = b.offerPrice || b.actualPrice;
            return priceA - priceB;
        }).slice(0, 10);
        data.products = sortedData;
        return data;
    } catch (error) {
        console.error("Something went wrong while fetching the products:", error);
        return rejectWithValue(error.message);
    }
});

// get shop through id 
export const fetchShop = createAsyncThunk("fetchShopById", async (id, { rejectWithValue }) => {
    try {
        const response = await fetch(`${api.getShopById}/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Something went wrong while fetching the shop:", error);
        return rejectWithValue(error.message);
    }
});