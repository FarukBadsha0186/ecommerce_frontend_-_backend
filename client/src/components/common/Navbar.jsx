import { Link } from "react-router-dom";
import { ShoppingCart, Search } from "lucide-react";

const Navbar = () => {
  return (
    <div className="bg-blue-700 text-white shadow-md">
      {/* Top Navbar */}
      <div className="flex items-center justify-between px-6 py-3">

        {/* Logo */}
        <Link to="/" className="text-2xl font-bold">
          Faruk<span className="text-yellow-400">Shop</span>
        </Link>

        {/* Search Bar */}
        <div className="flex w-1/2">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full px-4 py-2 text-black rounded-l-md focus:outline-none"
          />
          <button className="bg-yellow-400 px-4 rounded-r-md">
            <Search size={20} />
          </button>
        </div>

        {/* Right Menu */}
        <div className="flex items-center gap-6">
          <Link to="/login" className="hover:text-yellow-400">
            Login
          </Link>

          <Link to="/cart" className="relative">
            <ShoppingCart />
            <span className="absolute -top-2 -right-3 bg-yellow-400 text-black text-xs px-2 rounded-full">
              2
            </span>
          </Link>
        </div>
      </div>

      {/* Bottom Menu */}
      <div className="bg-blue-600 px-6 py-2 flex gap-6 text-sm">
        <Link to="/me"> Home</Link>
        <span>Electronics</span>
        <span>Fashion</span>
          <Link to="/shop">All Products</Link>
        <span>Accessories</span>
      </div>
    </div>
  );
};

export default Navbar;