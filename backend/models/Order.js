import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  tableNumber: { type: String, required: true },
  orderNumber: { type: String, required: true },
  items: [
    {
      name: { type: String, required: true },
      qty: { type: Number, required: true },
      price: { type: Number, required: true },
    }
  ],
  totalAmount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Preparing', 'Ready', 'Served', 'Paid'], 
    default: "Pending" 
  },
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);
export default Order;