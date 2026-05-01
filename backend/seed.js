import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import Food from "./models/Food.js";
import bcrypt from "bcryptjs";

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for Seeding");

    // Clear existing data
    await User.deleteMany();
    await Food.deleteMany();

    // Create Admin User
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("admin123", salt);
    
    await User.create({
      name: "Super Admin",
      email: "admin@admin.com",
      password: hashedPassword,
      isAdmin: true,
    });

    console.log("✅ Admin User Created: admin@admin.com / admin123");

    // Add some default foods
    const sampleFoods = [
      {
        name: "Classic Cheeseburger",
        price: 199,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80",
        description: "Juicy beef patty with melted cheddar, lettuce, and our secret sauce.",
        category: "Fast Food",
        isVeg: false
      },
      {
        name: "Margherita Pizza",
        price: 399,
        image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&q=80",
        description: "Classic Italian pizza with fresh mozzarella, basil, and tomato sauce.",
        category: "Italian",
        isVeg: true
      },
      {
        name: "Spicy Peri Peri Fries",
        price: 129,
        image: "https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=500&q=80",
        description: "Crispy french fries tossed in spicy peri peri seasoning.",
        category: "Fast Food",
        isVeg: true
      },
      {
        name: "Chocolate Lava Cake",
        price: 149,
        image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=500&q=80",
        description: "Warm chocolate cake with a gooey molten chocolate center.",
        category: "Desserts",
        isVeg: true
      }
    ];

    await Food.insertMany(sampleFoods);
    console.log("✅ Sample Foods Added");

    process.exit();
  } catch (error) {
    console.error("❌ Seeding Error:", error);
    process.exit(1);
  }
};

seedDatabase();
