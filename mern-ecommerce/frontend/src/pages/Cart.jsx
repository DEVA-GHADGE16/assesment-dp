import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { IMAGE_BASE_URL } from "../services/api";
import EmptyState from "../components/EmptyState";

const Cart = () => {
  const { items, updateQuantity, removeFromCart, cartTotal } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <EmptyState
          title="Your cart is empty"
          subtitle="Browse products and add items to your cart"
          action={
            <Link to="/" className="btn-primary">
              Continue Shopping
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Cart</h1>

      <div className="space-y-4">
        {items.map(({ product, quantity }) => (
          <div key={product._id} className="card flex items-center gap-4 p-4">
            <img
              src={`${IMAGE_BASE_URL}${product.image}`}
              alt={product.title}
              className="w-20 h-20 object-cover rounded-card"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-800 truncate">{product.title}</h3>
              <p className="text-sm text-gray-500">₹{product.offerPrice} each</p>

              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center border border-gray-200 rounded-card">
                  <button
                    onClick={() => updateQuantity(product._id, quantity - 1)}
                    className="px-2 py-0.5 text-gray-600 hover:bg-gray-50"
                  >
                    −
                  </button>
                  <span className="px-3 text-sm">{quantity}</span>
                  <button
                    onClick={() => updateQuantity(product._id, quantity + 1)}
                    className="px-2 py-0.5 text-gray-600 hover:bg-gray-50"
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeFromCart(product._id)}
                  className="text-xs text-red-500 hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
            <div className="font-semibold text-gray-800">
              ₹{product.offerPrice * quantity}
            </div>
          </div>
        ))}
      </div>

      <div className="card p-6 mt-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400">Total</p>
          <p className="text-2xl font-bold text-gray-800">₹{cartTotal}</p>
        </div>
        <button onClick={() => navigate("/checkout")} className="btn-primary">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
