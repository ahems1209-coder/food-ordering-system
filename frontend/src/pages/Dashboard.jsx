import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [stats, setStats] = useState({ totalSales: 0, totalOrders: 0, itemCounts: {} });

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get("http://localhost:5000/api/orders/stats", {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setStats(res.data))
      .catch(err => console.error("Error fetching stats", err));
  }, []);

  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-black mb-10 uppercase italic tracking-tighter">Business <span className="text-orange-500">Analytics</span></h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {/* Total Revenue Card */}
        <div className="bg-black text-white p-8 rounded-[2.5rem] shadow-2xl">
          <p className="text-xs font-bold uppercase text-gray-400 mb-2">Total Revenue</p>
          <h2 className="text-5xl font-black text-orange-500">₹{stats.totalSales}</h2>
        </div>

        {/* Total Orders Card */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
          <p className="text-xs font-bold uppercase text-gray-400 mb-2">Tables Served</p>
          <h2 className="text-5xl font-black text-black">{stats.totalOrders}</h2>
        </div>

        {/* Average Order Value */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
          <p className="text-xs font-bold uppercase text-gray-400 mb-2">Avg. Per Table</p>
          <h2 className="text-5xl font-black text-black">
            ₹{stats.totalOrders > 0 ? (stats.totalSales / stats.totalOrders).toFixed(0) : 0}
          </h2>
        </div>
      </div>

      {/* Popular Items List */}
      <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
        <h3 className="text-2xl font-black mb-6 uppercase italic">Top Selling Dishes</h3>
        <div className="space-y-4">
          {Object.entries(stats.itemCounts).map(([name, count]) => (
            <div key={name} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
              <span className="font-bold text-gray-800">{name}</span>
              <span className="bg-orange-500 text-white px-4 py-1 rounded-full font-black text-xs">{count} Sold</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;