import dotenv from "dotenv";
dotenv.config(); // Move this to the very top, before other imports

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import foodRoutes from "./routes/foodRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import configRoutes from "./routes/configRoutes.js";

const app = express();

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json()); // Essential for reading the "Table Number" and "Items" from the frontend

// --- ROUTES ---
app.use("/api/auth", authRoutes);
app.use("/api/foods", foodRoutes);
app.use("/api/orders", orderRoutes); // 2. Register the order endpoint
app.use("/api/config", configRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Hotel Management Backend is Live 🏨🚀");
});

const PORT = process.env.PORT || 5000;

// --- DATABASE & SERVER START ---
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`📝 Kitchen Orders available at http://localhost:${PORT}/api/orders/all`);
  });
}).catch((err) => {
  console.error("❌ DB connection failed. Check your MONGO_URI in .env file.", err);
});