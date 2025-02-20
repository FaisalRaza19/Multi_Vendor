import express from "express";
import session from "express-session";
import dotenv from "dotenv";
import cors from "cors";
import { connectToDb } from "./DataBase/db.js";
import { router as userRouter } from "./Routes/user.route.js";
import { route as adminRoute } from "./Routes/admin.route.js";
import { review } from "./Routes/review.route.js";
import { buyProduct } from "./Routes/buyProduct.route.js";
import {payment} from "./Routes/Payment.js";

dotenv.config({ path: ".env" });

const app = express();
connectToDb();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const corsOptions = {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'token'],
    credentials: true,
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 3600000,
        },
    })
);

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.use("/user", userRouter);
app.use("/admin", adminRoute);
app.use("/review", review);
app.use("/buyProduct", buyProduct);
app.use("/payment",payment)

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "An unexpected error occurred.", error: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`App listening on http://localhost:${PORT}`);
});