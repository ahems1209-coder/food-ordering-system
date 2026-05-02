import API_URL from "../api";
import { useState, useEffect } from "react";

import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Cart({ cart, setCart, addToCart, decrementQty, removeFromCart }) {
  const [tableNumber, setTableNumber] = useState(localStorage.getItem("tableNumber") || "");
  const total = cart.reduce((a, c) => a + c.price * c.qty, 0);
  const navigate = useNavigate();

  const handlePlaceOrder = async () => {
    if (!tableNumber) return toast.error("Please enter your Table Number!");
    if (cart.length === 0) return toast.error("Your bag is empty!");

    const orderData = {
      tableNumber,
      items: cart,
      totalAmount: total,
      restaurantId: localStorage.getItem("restaurantId"),
    };

    try {
      // Play a quick sound to unlock the audio engine for status updates
      const unlockAudio = new Audio("https://raw.githubusercontent.com/sh4hids/Sound-Effects/master/iPhone-Notification.mp3");
      unlockAudio.volume = 0.1;
      unlockAudio.play().catch(() => {});

      const res = await axios.post(`${API_URL}/api/orders`, orderData);
      
      // Store the order ID for live tracking
      localStorage.setItem("activeOrderId", res.data._id);
      window.dispatchEvent(new Event("orderPlaced"));

      setCart([]);
      localStorage.removeItem("cart");
      toast.success("Order sent to kitchen!");
      navigate("/");
    } catch (err) {
      toast.error("Error sending order to kitchen.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 min-h-[80vh] flex flex-col">
      <div className="flex items-center gap-4 mb-6 md:mb-8">
        <Link to="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <h2 className="text-2xl md:text-3xl font-black italic uppercase text-center md:text-left">Checkout</h2>
      </div>
      
      {cart.length === 0 ? (
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 flex-1 flex flex-col items-center justify-center text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h3 className="text-2xl font-bold text-gray-800">Your Cart is Empty</h3>
          <p className="text-gray-400 mt-2 mb-6">Looks like you haven't added any food yet.</p>
          <Link to="/" className="bg-black text-white px-8 py-4 rounded-2xl font-bold hover:bg-orange-500 transition-all">
            Browse Menu
          </Link>
        </div>
      ) : (
        <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-xl border border-gray-100">
          <div className="mb-6 md:mb-8 bg-orange-50 p-4 md:p-6 rounded-3xl">
            <label className="block text-xs font-black uppercase text-orange-800 mb-2">Table Number</label>
            <input 
              type="number" 
              placeholder="Enter Table No." 
              className={`w-full p-4 md:p-5 bg-white rounded-2xl text-xl md:text-2xl font-black outline-none focus:ring-4 focus:ring-orange-500/20 transition-all ${localStorage.getItem("tableNumber") ? 'text-gray-500 cursor-not-allowed border-2 border-orange-200' : ''}`}
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              disabled={!!localStorage.getItem("tableNumber")}
            />
            {localStorage.getItem("tableNumber") && (
              <p className="text-xs text-orange-600 mt-2 font-bold flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                Locked to QR Code
              </p>
            )}
          </div>

          <div className="space-y-4 mb-8">
            {cart.map(item => (
              <div key={item._id} className="flex justify-between items-center py-3 border-b border-gray-50">
                <div className="flex items-center gap-4">
                  <img src={item.image} alt={item.name} className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover" />
                  <div>
                    <span className="font-bold text-sm md:text-lg block text-gray-900">{item.name}</span>
                    <span className="text-orange-500 font-bold">₹{item.price}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3 bg-gray-100 rounded-full px-3 py-1">
                    <button onClick={() => decrementQty(item)} className="w-6 h-6 flex items-center justify-center font-bold text-gray-500 hover:text-black transition-colors">-</button>
                    <span className="font-black text-sm w-4 text-center">{item.qty}</span>
                    <button onClick={() => addToCart(item)} className="w-6 h-6 flex items-center justify-center font-bold text-gray-500 hover:text-black transition-colors">+</button>
                  </div>
                  <span className="text-gray-900 font-black text-lg md:text-xl w-16 text-right">₹{item.price * item.qty}</span>
                  <button onClick={() => removeFromCart(item)} className="text-red-300 hover:text-red-500 p-2 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mb-8 p-6 bg-gray-50 rounded-3xl">
            <span className="text-gray-400 font-bold uppercase tracking-widest text-sm">Total Bill</span>
            <span className="text-3xl md:text-4xl font-black text-orange-500">₹{total}</span>
          </div>

          <button 
            onClick={handlePlaceOrder}
            className="w-full bg-black text-white font-black py-4 md:py-5 rounded-3xl hover:bg-orange-500 transition-all text-lg md:text-xl uppercase tracking-tighter shadow-xl shadow-gray-200 active:scale-95"
          >
            Send to Kitchen 👨‍🍳
          </button>
        </div>
      )}
    </div>
  );
}

export default Cart;