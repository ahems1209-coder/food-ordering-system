import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  // Helper to highlight the active link
  const isActive = (path) => location.pathname === path ? "text-orange-500" : "text-gray-300";

  return (
    <nav className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/10 px-6 py-4 shadow-2xl">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* LOGO SECTION */}
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-3xl transition-transform group-hover:scale-110 duration-300">🍔</span>
          <h1 className="text-2xl font-black tracking-tighter text-white">
            FOOD<span className="text-orange-500">DASH</span>
          </h1>
        </Link>

        {/* NAV LINKS */}
        <div className="hidden md:flex items-center space-x-10 text-sm font-bold uppercase tracking-widest">
          <Link 
            to="/" 
            className={`${isActive('/')} hover:text-orange-400 transition-colors duration-200`}
          >
            Home
          </Link>
          
          <Link 
            to="/admin" 
            className={`${isActive('/admin')} hover:text-orange-400 transition-colors duration-200`}
          >
            Dashboard
          </Link>

          {/* CART BUTTON WITH COUNTER */}
          <Link to="/cart" className="relative group flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full hover:bg-orange-500 transition-all duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className="text-white">Cart</span>
            {/* The Badge */}
            <span className="absolute -top-1 -right-1 bg-orange-600 text-[10px] font-black text-white h-5 w-5 flex items-center justify-center rounded-full border-2 border-black group-hover:scale-110 transition-transform">
              0
            </span>
          </Link>
        </div>

        {/* MOBILE MENU ICON (Visual Only for now) */}
        <div className="md:hidden text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;