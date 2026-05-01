import { useState, useEffect } from "react";
import axios from "axios";

function OrderTracker() {
  const [activeOrderId, setActiveOrderId] = useState(localStorage.getItem("activeOrderId"));
  const [orderStatus, setOrderStatus] = useState(null);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    // Listen for storage changes in case Cart updates the activeOrderId
    const checkStorage = () => {
      const id = localStorage.getItem("activeOrderId");
      if (id !== activeOrderId) {
        setActiveOrderId(id);
      }
    };
    window.addEventListener("storage", checkStorage);
    // Custom event since local storage events don't fire on the same tab
    window.addEventListener("orderPlaced", checkStorage);
    return () => {
      window.removeEventListener("storage", checkStorage);
      window.removeEventListener("orderPlaced", checkStorage);
    };
  }, [activeOrderId]);

  useEffect(() => {
    if (!activeOrderId) return;

    const pollStatus = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/orders/${activeOrderId}`);
        setOrderStatus(res.data.status);
        
        if (res.data.status === "Served") {
          setShowNotification(true);
          localStorage.removeItem("activeOrderId");
          setActiveOrderId(null);
          
          // Auto hide notification after 10 seconds
          setTimeout(() => {
            setShowNotification(false);
          }, 10000);
        }
      } catch (err) {
        console.error("Error polling order status", err);
      }
    };

    // Initial check
    pollStatus();

    // Poll every 5 seconds
    const interval = setInterval(pollStatus, 5000);
    return () => clearInterval(interval);
  }, [activeOrderId]);

  const [prevStatus, setPrevStatus] = useState(null);

  // Sound notification for customers
  useEffect(() => {
    if (orderStatus && orderStatus !== prevStatus) {
      if (orderStatus === "Ready") {
        // High pitched beep for ready
        const audio = new Audio("https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav");
        audio.play().catch(e => console.log("Audio play blocked"));
      } else if (orderStatus === "Served") {
        // Double beep or celebration (using same stable URL for now to ensure it works)
        const audio = new Audio("https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav");
        audio.playbackRate = 1.5;
        audio.play().catch(e => console.log("Audio play blocked"));
      }
      setPrevStatus(orderStatus);
    }
  }, [orderStatus, prevStatus]);

  if (!activeOrderId && !showNotification) return null;

  return (
    <>
      {activeOrderId && orderStatus && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] bg-black text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-pulse text-sm font-bold whitespace-nowrap border border-white/10">
          <div className="text-xl">
            {orderStatus === "Pending" ? "📝" : orderStatus === "Preparing" ? "👨‍🍳" : "🚀"}
          </div>
          {orderStatus === "Pending" ? "Order placed! Waiting for kitchen..." : 
           orderStatus === "Preparing" ? "Chef is cooking your meal..." : 
           "Your food is ready! Waiter on the way."}
        </div>
      )}

      {showNotification && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl text-center transform animate-in zoom-in-95 duration-500">
            <div className="text-7xl mb-4 animate-bounce">🎉</div>
            <h2 className="text-3xl font-black text-gray-900 mb-2 leading-tight">Your food is arriving!</h2>
            <p className="text-gray-500 mb-8 font-medium">Please wait at your table. It's coming right now.</p>
            <button 
              onClick={() => setShowNotification(false)}
              className="w-full bg-orange-500 text-white font-black py-4 rounded-2xl hover:bg-orange-600 transition-colors uppercase tracking-widest"
            >
              Awesome!
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default OrderTracker;
