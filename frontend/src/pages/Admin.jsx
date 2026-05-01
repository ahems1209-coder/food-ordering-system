import API_URL from "../api";
import { useState, useEffect } from "react";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";


function Admin() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: "", price: "", image: "", description: "", category: "Fast Food", isVeg: true });
  const [totalTables, setTotalTables] = useState(20);
  
  // 🔑 Get Token from LocalStorage
  const token = localStorage.getItem("token");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [foodsRes, configRes] = await Promise.all([
        axios.get(`${API_URL}/api/foods`),
        axios.get(`${API_URL}/api/config`)
      ]);
      setFoods(foodsRes.data);
      if (configRes.data) setTotalTables(configRes.data.totalTables);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleUpdateConfig = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`${API_URL}/api/config`, { totalTables }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Restaurant Settings Updated!");
    } catch (err) {
      alert("Error updating settings.");
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/foods`, formData, {
        headers: { Authorization: `Bearer ${token}` } // 👈 Sending the Key
      });
      alert("Dish Added Successfully!");
      setFormData({ name: "", price: "", image: "", description: "", category: "Fast Food", isVeg: true });
      fetchData();
    } catch (err) {
      alert("Error: Only Admins can add items.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    try {
      await axios.delete(`${API_URL}/api/foods/${id}`, {
        headers: { Authorization: `Bearer ${token}` } // 👈 Sending the Key
      });
      fetchData();
    } catch (err) {
      alert("Delete Failed: You don't have permission.");
    }
  };

  const handleToggleAvailable = async (food) => {
    try {
      await axios.patch(`${API_URL}/api/foods/${food._id}`, 
        { isAvailable: food.isAvailable === false ? true : false }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData();
    } catch (err) {
      alert("Update Failed: You don't have permission.");
    }
  };

  const baseUrl = window.location.origin;

  return (
    <div className="p-4 md:p-10 flex flex-col gap-10 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row gap-6 md:gap-10">
        {/* Form Section */}
        <form onSubmit={handleAdd} className="bg-white p-8 rounded-[2.5rem] shadow-xl w-full md:w-1/3 space-y-4">
        <h2 className="text-2xl font-black italic uppercase text-orange-500">Add Dish</h2>
        <input type="text" placeholder="Name" className="w-full p-4 bg-gray-100 rounded-xl outline-none" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
        <input type="number" placeholder="Price" className="w-full p-4 bg-gray-100 rounded-xl outline-none" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required />
        <input type="text" placeholder="Image URL" className="w-full p-4 bg-gray-100 rounded-xl outline-none" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} required />
        <input type="text" placeholder="Category (e.g. Fast Food)" className="w-full p-4 bg-gray-100 rounded-xl outline-none" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} required />
        
        <div className="flex items-center gap-2 p-2">
          <input type="checkbox" id="isVeg" checked={formData.isVeg} onChange={(e) => setFormData({...formData, isVeg: e.target.checked})} className="w-5 h-5 accent-orange-500" />
          <label htmlFor="isVeg" className="font-bold text-gray-700">Is Vegetarian?</label>
        </div>

        <textarea placeholder="Description" className="w-full p-4 bg-gray-100 rounded-xl outline-none" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
        <button className="w-full bg-black text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-orange-500 transition">Publish</button>
      </form>

      {/* Settings Section (Added below form on mobile, stacked on desktop) */}
      <div className="flex flex-col gap-6 w-full md:w-1/3">
        <form onSubmit={handleUpdateConfig} className="bg-white p-8 rounded-[2.5rem] shadow-xl w-full">
          <h2 className="text-2xl font-black italic uppercase text-orange-500 mb-4">Settings</h2>
          <label className="block text-xs font-black uppercase text-gray-400 mb-2">Total Restaurant Tables</label>
          <input 
            type="number" 
            placeholder="e.g. 20" 
            className="w-full p-4 bg-gray-100 rounded-xl outline-none mb-4" 
            value={totalTables} 
            onChange={(e) => setTotalTables(e.target.value)} 
            required 
          />
          <button type="submit" className="w-full bg-black text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-orange-500 transition">Save Config</button>
        </form>
      </div>

      {/* Manage Section */}
      <div className="w-full md:w-2/3 bg-white p-8 rounded-[2.5rem] shadow-sm">
        <h2 className="text-2xl font-black italic uppercase mb-6 text-gray-800">Manage Menu</h2>
        <div className="space-y-4">
          {loading ? (
            <p className="text-gray-400 font-bold animate-pulse">Loading menu...</p>
          ) : foods.length === 0 ? (
            <p className="text-gray-400 font-bold italic">No dishes added yet. Use the form to add some!</p>
          ) : (
            foods.map(food => (
            <div key={food._id} className={`flex justify-between items-center p-4 border rounded-2xl ${food.isAvailable === false ? 'opacity-60 bg-gray-50' : ''}`}>
              <div className="flex items-center gap-4">
                <img src={food.image} className="w-12 h-12 rounded-lg object-cover" />
                <p className="font-bold">{food.name} <span className="text-orange-500 ml-2">₹{food.price}</span></p>
                <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${food.isVeg ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {food.isVeg ? 'Veg' : 'Non-Veg'}
                </span>
                {food.isAvailable === false && (
                  <span className="text-[10px] px-2 py-1 rounded-full font-bold uppercase bg-gray-200 text-gray-600">
                    Out of Stock
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleToggleAvailable(food)} className="text-gray-500 font-black uppercase text-xs hover:bg-gray-100 px-4 py-2 rounded-lg">
                  {food.isAvailable === false ? 'Mark In Stock' : 'Mark Out of Stock'}
                </button>
                <button onClick={() => handleDelete(food._id)} className="text-red-500 font-black uppercase text-xs hover:bg-red-50 px-4 py-2 rounded-lg">Delete</button>
              </div>
            </div>
            ))
          )}
        </div>
      </div>
      </div>

      {/* QR Code Generator Section */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm w-full">
        <div className="mb-6">
          <h2 className="text-2xl font-black italic uppercase text-gray-800">Table QR Codes</h2>
          <p className="text-sm text-gray-500 font-bold uppercase tracking-wide">Print these and place them on your tables. Customers scan them to order.</p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {Array.from({ length: totalTables }, (_, i) => i + 1).map(num => (
            <div key={num} className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50 hover:bg-white hover:border-orange-500 transition-all group">
              <div className="bg-white p-2 rounded-2xl shadow-sm group-hover:shadow-md transition-all">
                <QRCodeCanvas id={`qr-${num}`} value={`${baseUrl}/?table=${num}`} size={120} />
              </div>
              <p className="mt-4 font-black text-xl text-black">Table {num}</p>
              <button 
                onClick={() => {
                  const canvas = document.getElementById(`qr-${num}`);
                  const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
                  let downloadLink = document.createElement("a");
                  downloadLink.href = pngUrl;
                  downloadLink.download = `Table-${num}-QRCode.png`;
                  document.body.appendChild(downloadLink);
                  downloadLink.click();
                  document.body.removeChild(downloadLink);
                }}
                className="mt-3 bg-black text-white text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-xl group-hover:bg-orange-500 transition-colors w-full"
              >
                Download
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default Admin;