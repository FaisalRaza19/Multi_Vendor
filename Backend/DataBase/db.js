import mongoose from "mongoose";

export const connectToDb = async()=>{
    try {
        await mongoose.connect("mongodb://localhost:27017/MultiVendor")
        console.log("Data Base connect successfully")
    } catch (error) {
        console.log("Something went wrong to connect the data base",error)
    }
};