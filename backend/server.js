import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import categoryRouter from "./router/categoryRouter.js";
import productRouter from "./router/productRoute.js";
import userRouter from "./router/userRouter.js";
import cartRouter from "./router/cartRouter.js";

dotenv.config();

// App config
const app = express();
const port = 4000;

// Connect to the database
connectDB();

// Middleware
app.use(cors()); // Use CORS middleware here
app.use(express.json()); // Use JSON middleware here

// API endpoints
app.use("/images", express.static('upload'));

//User router
app.use("/api/user",userRouter);

// Category routes
app.use("/api/category", categoryRouter);

// Product routes
app.use("/api/product", productRouter);

// Cart routes
app.use("/api/cart",cartRouter);

// Root route
app.get("/", (req, res) => {
    res.send("Back End và API hoạt động");
});

// Start the server
app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});
