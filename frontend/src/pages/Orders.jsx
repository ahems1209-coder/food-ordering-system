import API_URL from "../api";
import { useState, useEffect } from "react";

import axios from "axios";

function Orders() {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/orders/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Waiter sees Ready, Served (not Paid yet)
      const activeOrders = res.data.filter(order => order.status !== "Paid" && order.status !== "Pending" && order.status !== "Preparing");
      setOrders(activeOrders);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(`${API_URL}/api/orders/${id}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchOrders();
    } catch (err) {
      console.error("Error updating order:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000); // Auto-refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 md:p-10 bg-gray-100 min-h-screen pb-24 md:pb-10">
      <div className="flex justify-between items-center mb-6 md:mb-10">
        <h2 className="text-2xl md:text-4xl font-black italic uppercase tracking-tighter text-gray-900 underline decoration-orange-500 decoration-8 underline-offset-8">Front of House</h2>
        <div className="bg-green-500 h-4 w-4 rounded-full animate-ping"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {orders.map(order => (
          <div key={order._id} className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-lg border-t-8 border-black">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-3xl md:text-4xl font-black text-orange-500">TABLE {order.tableNumber}</h3>
                <p className="text-xs font-bold text-gray-300 mt-1 uppercase">Order No: #{order.orderNumber}</p>
              </div>
              <p className={`text-xs font-black px-3 py-1 rounded-lg uppercase ${order.status === 'Ready' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                {order.status}
              </p>
            </div>

            <div className="space-y-3 mb-8">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between font-bold text-gray-700">
                  <span>{item.qty} x {item.name}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-6 border-t border-gray-100">
              <p className="font-black text-xl">₹{order.totalAmount}</p>
              {order.status === "Ready" ? (
                <button onClick={() => updateStatus(order._id, "Served")} className="bg-blue-500 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-600 transition-all uppercase text-xs tracking-widest">
                  Mark Served
                </button>
              ) : (
                <button onClick={() => updateStatus(order._id, "Paid")} className="bg-black text-white px-6 py-2 rounded-xl font-bold hover:bg-gray-800 transition-all uppercase text-xs tracking-widest">
                  Collect Payment
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Orders;