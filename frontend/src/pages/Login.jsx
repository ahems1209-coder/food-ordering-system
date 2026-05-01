import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.removeItem("tableNumber"); // Clear table number on admin login
      localStorage.removeItem("activeOrderId"); // Clear active order tracking on admin login
      localStorage.removeItem("cart"); // Clear cart on admin login to keep it separate
      setUser(res.data.user);
      navigate("/dashboard"); // Redirect to dashboard instead of home for admins
    } catch (err) {
      alert("Invalid Credentials");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <form onSubmit={handleLogin} className="bg-white p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md border border-gray-100">
        <h2 className="text-3xl font-black mb-8 text-center uppercase italic">Login</h2>
        <input type="email" placeholder="Email" className="w-full bg-gray-50 p-4 rounded-2xl mb-4 outline-none" onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" className="w-full bg-gray-50 p-4 rounded-2xl mb-6 outline-none" onChange={(e) => setPassword(e.target.value)} required />
        <button className="w-full bg-black text-white font-bold py-4 rounded-2xl hover:bg-orange-500 transition-all uppercase tracking-widest">Sign In</button>
        <p className="mt-4 text-center text-sm text-gray-400">New here? <Link to="/register" className="text-orange-500 font-bold">Register</Link></p>
      </form>
    </div>
  );
}

export default Login;