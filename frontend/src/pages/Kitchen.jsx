import API_URL from "../api";
import { useState, useEffect } from "react";
import axios from "axios";

function Kitchen() {
  const [orders, setOrders] = useState([]);
  const [prevCount, setPrevCount] = useState(0);
  const token = localStorage.getItem("token");

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/orders/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const activeOrders = res.data.filter(order => order.status === "Pending" || order.status === "Preparing");
      setOrders(activeOrders); 
    } catch (err) {
      console.error("Kitchen fetch error:", err);
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
    const interval = setInterval(fetchOrders, 5000); 
    return () => clearInterval(interval);
  }, []);

  // Universal sound logic
  useEffect(() => {
    if (orders.length > prevCount && prevCount !== 0) {
      const chime = new Audio("https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/Chime.wav");
      chime.play().catch(() => {});
    }
    setPrevCount(orders.length);
  }, [orders, prevCount]);

  return (
    <div className="p-4 md:p-10 bg-gray-900 min-h-screen text-white pb-24 md:pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-10 gap-4">
        <h1 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter">Kitchen <span className="text-orange-500">Live</span></h1>
        <div className="flex items-center gap-2 bg-green-500/10 px-4 py-2 rounded-xl border border-green-500/20">
          <div className="h-2 w-2 bg-green-500 rounded-full animate-ping"></div>
          <span className="text-[10px] font-black uppercase text-green-400">Monitoring Orders</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {orders.map((order) => (
          <div key={order._id} className="bg-white text-black p-6 rounded-[2.5rem] shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <span className="text-4xl font-black">T-{order.tableNumber}</span>
              <div className="flex flex-col items-end">
                <span className="bg-gray-100 px-3 py-1 rounded-full text-[10px] font-bold mb-1">#{order.orderNumber}</span>
                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${order.status === 'Pending' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'}`}>
                  {order.status}
                </span>
              </div>
            </div>
            
            <div className="space-y-2 mb-6">
              {order.items.map((item, i) => (
                <p key={i} className="font-bold border-b border-gray-50 pb-1">
                  <span className="text-orange-500">{item.qty}x</span> {item.name}
                </p>
              ))}
            </div>

            {order.status === "Pending" ? (
              <button onClick={() => updateStatus(order._id, "Preparing")} className="w-full bg-yellow-500 text-black py-3 rounded-2xl font-black hover:bg-yellow-400 transition-all uppercase text-xs">
                Start Preparing
              </button>
            ) : (
              <button onClick={() => updateStatus(order._id, "Ready")} className="w-full bg-green-500 text-white py-3 rounded-2xl font-black hover:bg-green-400 transition-all uppercase text-xs shadow-[0_0_15px_rgba(34,197,94,0.5)]">
                Mark Ready
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Kitchen;