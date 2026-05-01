import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  isVeg: { type: Boolean, default: true },
  isAvailable: { type: Boolean, default: true },
  description: { type: String, required: true },
}, { timestamps: true });

const Food = mongoose.model("Food", foodSchema);
export default Food; // 👈 ESM Export