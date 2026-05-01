import API_URL from "../api";
import { useState, useEffect } from "react";

import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/auth/register`, formData);
      alert("Registration Successful! Please Login.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50">
      <form onSubmit={handleRegister} className="bg-white p-10 rounded-[2.5rem] shadow-xl w-full max-w-md border border-gray-100">
        <h2 className="text-3xl font-black mb-8 italic uppercase tracking-tighter text-center">Join <span className="text-orange-500">Us</span></h2>
        
        <input 
          type="text" placeholder="Full Name" required
          className="w-full bg-gray-50 p-4 rounded-2xl mb-4 outline-none focus:ring-2 focus:ring-orange-500"
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <input 
          type="email" placeholder="Email Address" required
          className="w-full bg-gray-50 p-4 rounded-2xl mb-4 outline-none focus:ring-2 focus:ring-orange-500"
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <input 
          type="password" placeholder="Password" required
          className="w-full bg-gray-50 p-4 rounded-2xl mb-6 outline-none focus:ring-2 focus:ring-orange-500"
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />

        <button type="submit" className="w-full bg-black text-white font-black py-4 rounded-2xl hover:bg-orange-500 transition-all uppercase tracking-widest">
          Create Account
        </button>
        
        <p className="mt-6 text-center text-gray-400 text-sm">
          Already have an account? <Link to="/login" className="text-orange-500 font-bold">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;