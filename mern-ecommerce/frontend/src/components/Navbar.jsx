import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-primary-600">
          ShopEase
        </Link>

        <div className="flex items-center gap-4">
          {!user && (
            <>
              <Link to="/login" className="text-sm text-gray-600 hover:text-primary-600">
                Login
              </Link>
              <Link to="/register" className="btn-primary text-sm">
                Sign Up
              </Link>
            </>
          )}

          {user && user.role === "customer" && (
            <>
              <Link to="/" className="text-sm text-gray-600 hover:text-primary-600">
                Shop
              </Link>
              <Link to="/orders" className="text-sm text-gray-600 hover:text-primary-600">
                My Orders
              </Link>
              <Link to="/cart" className="relative text-sm text-gray-600 hover:text-primary-600">
                Cart
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-3 bg-primary-600 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </>
          )}

          {user && user.role === "seller" && (
            <>
              <Link to="/seller/products" className="text-sm text-gray-600 hover:text-primary-600">
                Products
              </Link>
              <Link to="/seller/orders" className="text-sm text-gray-600 hover:text-primary-600">
                Orders
              </Link>
            </>
          )}

          {user && (
            <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
              <span className="text-sm text-gray-500 hidden sm:inline">{user.name}</span>
              <button onClick={handleLogout} className="btn-secondary text-sm">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
