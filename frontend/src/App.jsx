import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import Admin from "./pages/Admin";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Kitchen from "./pages/Kitchen";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Welcome from "./pages/Welcome";
import OrderTracker from "./components/OrderTracker";

// --- MAIN APP STRUCTURE ---
function App() {
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem("cart")) || []);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
  const [tableNumber, setTableNumber] = useState(localStorage.getItem("tableNumber") || "");

  // Detect ?table= and ?restaurant= URL params for QR ordering
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const table = params.get("table");
    const restaurant = params.get("restaurant");
    
    if (table) {
      localStorage.setItem("tableNumber", table);
      setTableNumber(table);
    }
    if (restaurant && restaurant !== "null" && restaurant !== "undefined") {
      localStorage.setItem("restaurantId", restaurant);
      // Force a page refresh to clear any old state and fetch new data
      window.location.href = window.location.pathname;
    }

    if (table && !restaurant) {
      // Clean up URL without reloading if only table is present
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Persist cart
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (food) => {
    const exist = cart.find(x => x._id === food._id);
    if (exist) {
      setCart(cart.map(x => x._id === food._id ? { ...exist, qty: exist.qty + 1 } : x));
    } else {
      setCart([...cart, { ...food, qty: 1 }]);
    }
  };

  const decrementQty = (food) => {
    const exist = cart.find(x => x._id === food._id);
    if (exist.qty === 1) {
      setCart(cart.filter(x => x._id !== food._id));
    } else {
      setCart(cart.map(x => x._id === food._id ? { ...exist, qty: exist.qty - 1 } : x));
    }
  };

  const removeFromCart = (food) => {
    setCart(cart.filter(x => x._id !== food._id));
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("tableNumber"); // Clear table on logout too
    setTableNumber("");
    setUser(null);
  };

  return (
    <Router>
      <Toaster position="top-center" />
      
      {/*  STAFF NAVIGATION (Only shown to logged-in staff) */}
      {user && (
        <nav className="bg-black text-white px-4 md:px-8 py-4 md:py-5 flex justify-between items-center fixed top-0 left-0 right-0 z-50 shadow-md">
          <Link to="/dashboard" className="flex items-center gap-2 text-xl md:text-2xl font-black italic uppercase">
            <img src="/logo.png" alt="Logo" className="h-8 w-8 rounded-lg" />
            <span>Food<span className="text-orange-500">Dash</span></span> <span className="text-[10px] bg-white/20 px-2 py-1 rounded ml-2 not-italic">STAFF</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8 text-xs font-bold uppercase tracking-widest">
            <Link to="/kitchen" className="hover:text-orange-500 transition-colors">Kitchen</Link>
            <Link to="/orders" className="hover:text-orange-500 transition-colors">Orders</Link>
            <Link to="/dashboard" className="hover:text-orange-500 transition-colors">Dashboard</Link>
            <Link to="/admin" className="hover:text-orange-500 transition-colors">Admin</Link>
            <button onClick={handleLogout} className="bg-white/10 px-4 py-2 rounded-lg hover:bg-red-500 transition">Logout</button>
          </div>
        </nav>
      )}

      {/* CUSTOMER NAVBAR (Minimalist, only shown to customers) */}
      {!user && (
        <nav className="bg-white border-b border-gray-100 px-4 md:px-8 py-4 md:py-5 flex justify-between items-center fixed top-0 left-0 right-0 z-50">
          <Link to="/" className="flex items-center gap-2 text-xl md:text-2xl font-black italic uppercase text-gray-900">
            <img src="/logo.png" alt="Logo" className="h-8 w-8 rounded-lg" />
            <span>Food<span className="text-orange-500">Dash</span></span>
          </Link>
          
          <div className="flex items-center gap-4 md:gap-6">
            {tableNumber && localStorage.getItem("restaurantId") && (
              <div className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-full border border-green-100 shadow-sm">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-green-700">Table {tableNumber}</span>
              </div>
            )}
            
            <Link to="/cart" className="relative p-2.5 bg-black text-white rounded-2xl shadow-xl shadow-gray-200 hover:bg-orange-500 hover:scale-105 transition-all active:scale-95">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 border-2 border-white text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </Link>
          </div>
        </nav>
      )}

      {/* LIVE TRACKER (Customer only) */}
      {!user && <OrderTracker />}

      <main className="pt-20 pb-24 md:pb-10">
        <Routes>
          <Route path="/" element={tableNumber || user ? <Home addToCart={addToCart} decrementQty={decrementQty} cart={cart} /> : <Navigate to="/welcome" />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/cart" element={tableNumber || user ? <Cart cart={cart} setCart={setCart} addToCart={addToCart} decrementQty={decrementQty} removeFromCart={removeFromCart} /> : <Navigate to="/welcome" />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/kitchen" element={user ? <Kitchen /> : <Navigate to="/login" />} />
          <Route path="/orders" element={user ? <Orders /> : <Navigate to="/login" />} />
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/admin" element={user ? <Admin /> : <Navigate to="/login" />} />
        </Routes>
      </main>
      
      {/* Mobile Bottom Navigation for Admin */}
      {user && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black text-white p-4 flex justify-around items-center z-50 border-t border-gray-800 text-[10px] uppercase font-bold tracking-wider">
          <Link to="/kitchen" className="flex flex-col items-center hover:text-orange-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            Kitchen
          </Link>
          <Link to="/orders" className="flex flex-col items-center hover:text-orange-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
            Orders
          </Link>
          <Link to="/admin" className="flex flex-col items-center hover:text-orange-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            Menu
          </Link>
          <button onClick={handleLogout} className="flex flex-col items-center text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Logout
          </button>
        </div>
      )}
    </Router>
  );
}

export default App;