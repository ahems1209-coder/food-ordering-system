import API_URL from "../api";
import { useState, useEffect } from "react";

import axios from "axios";
import { Link } from "react-router-dom";
import FoodCard from "../components/FoodCard";

// Skeleton component for a smooth loading experience
const Skeleton = () => (
  <div className="bg-white rounded-[2rem] p-4 shadow-sm animate-pulse">
    <div className="bg-gray-200 h-48 w-full rounded-[1.5rem] mb-4"></div>
    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
    <div className="flex justify-between items-center pt-2">
      <div className="h-8 bg-gray-200 rounded w-16"></div>
      <div className="h-12 bg-gray-200 rounded-2xl w-28"></div>
    </div>
  </div>
);

function Home({ addToCart, cart, decrementQty }) {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const tableNumber = localStorage.getItem("tableNumber");

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/foods?restaurantId=${localStorage.getItem("restaurantId")}`);
        setFoods(res.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFoods();
  }, []);

  const filteredFoods = selectedCategory === "All Categories" 
    ? foods 
    : foods.filter(food => food.category === selectedCategory);

  return (
    <div className="bg-[#fcfcfc] min-h-screen pb-24 md:pb-20">
      
      {/* --- HERO SECTION --- */}
      <section className="bg-white border-b border-gray-100 mb-8 md:mb-12">
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 text-center md:text-left">
            <div className="inline-block px-4 py-1.5 bg-orange-50 rounded-full mb-6">
              <span className="text-orange-600 font-bold tracking-widest uppercase text-[10px]">
                {tableNumber ? `Table ${tableNumber} Ready ⚡` : 'Fastest Delivery in Town ⚡'}
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 leading-tight">
              Order Your <br /> 
              <span className="text-orange-500">Favorite Food</span>
            </h1>
            <p className="text-gray-500 text-base md:text-lg mb-8 max-w-md mx-auto md:mx-0">
              Freshly prepared meals from top-rated kitchens delivered straight to your table.
            </p>
            <button onClick={() => window.scrollTo({ top: 500, behavior: 'smooth' })} className="bg-black text-white px-8 py-4 rounded-2xl font-bold hover:bg-orange-600 transition-all shadow-xl shadow-gray-200 w-full md:w-auto">
              Explore Menu
            </button>
          </div>
          
          {/* Decorative element for Hero */}
          <div className="hidden md:flex md:w-1/2 justify-end relative">
            <div className="text-[180px] grayscale opacity-10 select-none animate-bounce">🍔</div>
          </div>
        </div>
      </section>

      {/* --- MENU SECTION --- */}
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 md:mb-12 gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 italic tracking-tighter">OUR POPULAR MENU</h2>
            <div className="h-1.5 w-12 bg-orange-500 rounded-full mt-1"></div>
          </div>
          
          <select 
            className="bg-white border border-gray-200 rounded-xl px-4 py-3 md:py-2 text-sm font-semibold outline-none focus:ring-2 focus:ring-orange-500 w-full md:w-auto"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option>All Categories</option>
            <option>Fast Food</option>
            <option>Desserts</option>
            <option>Italian</option>
            <option>Beverages</option>
          </select>
        </div>

        {/* LOADING STATE */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => <Skeleton key={n} />)}
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && filteredFoods.length === 0 && (
          <div className="text-center py-32 bg-white rounded-[3rem] shadow-sm border-2 border-dashed border-gray-100">
            <div className="text-6xl mb-4">🍕</div>
            <h3 className="text-2xl font-bold text-gray-800">No Food Found</h3>
            <p className="text-gray-400 mt-2">No items available in this category.</p>
          </div>
        )}

        {/* FOOD GRID */}
        {!loading && filteredFoods.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {filteredFoods.map((food) => (
              <FoodCard key={food._id} food={food} addToCart={addToCart} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

export default Home;