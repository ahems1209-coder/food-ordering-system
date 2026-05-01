import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Welcome() {
  const [tableInput, setTableInput] = useState("");
  const [totalTables, setTotalTables] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/config");
        setTotalTables(res.data.totalTables || 20);
      } catch (err) {
        console.error("Failed to load restaurant config", err);
        setTotalTables(20); // Fallback
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  const handleStart = (e) => {
    e.preventDefault();
    const tableNum = parseInt(tableInput);
    
    if (isNaN(tableNum) || tableNum < 1 || tableNum > totalTables) {
      alert(`Invalid Table Number! Please enter a number between 1 and ${totalTables}.`);
      return;
    }

    localStorage.setItem("tableNumber", tableNum);
    // Force reload to apply the table number globally
    window.location.href = "/";
  };

  if (loading) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-10 rounded-[3rem] shadow-2xl max-w-md w-full border border-gray-100 text-center">
        <div className="text-6xl mb-6">🍽️</div>
        <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-2">Welcome to Food<span className="text-orange-500">Dash</span></h1>
        <p className="text-gray-500 mb-8">Please enter your table number to browse the menu and start ordering.</p>
        
        <form onSubmit={handleStart} className="space-y-4">
          <div>
            <input 
              type="number" 
              placeholder="Table Number" 
              className="w-full p-5 bg-gray-50 border-2 border-transparent focus:border-orange-500 rounded-2xl text-2xl font-black text-center outline-none transition-all"
              value={tableInput}
              onChange={(e) => setTableInput(e.target.value)}
              required
              min="1"
              max={totalTables}
            />
            <p className="text-xs text-gray-400 font-bold mt-2">Valid tables: 1 to {totalTables}</p>
          </div>
          <button type="submit" className="w-full bg-black text-white py-5 rounded-2xl font-black text-xl uppercase tracking-widest hover:bg-orange-500 transition-colors shadow-xl shadow-gray-200">
            View Menu
          </button>
        </form>
      </div>
    </div>
  );
}

export default Welcome;
