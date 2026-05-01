import Order from "../models/Order.js"; // 👈 Ensure this .js is there!

export const placeOrder = async (req, res) => {
  try {
    const { tableNumber, orderNumber, items, totalAmount, restaurantId } = req.body;
    if (!restaurantId) return res.status(400).json({ message: "Restaurant ID required" });
    const newOrder = new Order({ tableNumber, orderNumber, items, totalAmount, restaurantId });
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({ restaurantId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await Order.findByIdAndUpdate(id, { status });
    res.status(200).json({ message: "Updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrderStats = async (req, res) => {
  try {
    const orders = await Order.find({ restaurantId: req.user.id });
    
    let totalSales = 0;
    let totalOrders = orders.length;
    let itemCounts = {};

    orders.forEach(order => {
      totalSales += order.totalAmount;
      order.items.forEach(item => {
        if (!itemCounts[item.name]) {
          itemCounts[item.name] = 0;
        }
        itemCounts[item.name] += item.qty;
      });
    });

    res.status(200).json({ totalSales, totalOrders, itemCounts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};