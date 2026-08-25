import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "../services/productService";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { IMAGE_BASE_URL } from "../services/api";
import Spinner from "../components/Spinner";
import EmptyState from "../components/EmptyState";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setLoading(true);
    getProductById(id)
      .then((data) => setProduct(data))
      .catch((err) => setError(err.response?.data?.message || "Product not found"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner size="lg" />;
  if (error || !product) return <EmptyState title="Product not found" subtitle={error} />;

  const increment = () => setQuantity((q) => Math.min(q + 1, product.stock));
  const decrement = () => setQuantity((q) => Math.max(1, q - 1));

  const requireCustomer = () => {
    if (!user) {
      navigate("/login");
      return false;
    }
    if (user.role !== "customer") {
      setMessage("Only customers can purchase products");
      return false;
    }
    return true;
  };

  const handleAddToCart = () => {
    if (!requireCustomer()) return;
    addToCart(product, quantity);
    setMessage("Added to cart");
  };

  const handleBuyNow = () => {
    if (!requireCustomer()) return;
    addToCart(product, quantity);
    navigate("/checkout", { state: { buyNowId: product._id } });
  };

  const discount = Math.round(((product.mrp - product.offerPrice) / product.mrp) * 100);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="card overflow-hidden">
          <img
            src={`${IMAGE_BASE_URL}${product.image}`}
            alt={product.title}
            className="w-full aspect-square object-cover"
          />
        </div>

        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide">{product.brand}</p>
          <h1 className="text-2xl font-bold text-gray-800 mt-1">{product.title}</h1>
          <p className="text-sm text-gray-400 mt-1">
            {product.category} · {product.productType}
          </p>

          <div className="flex items-center gap-3 mt-4">
            <span className="text-3xl font-bold text-gray-900">₹{product.offerPrice}</span>
            {product.mrp > product.offerPrice && (
              <>
                <span className="text-gray-400 line-through">₹{product.mrp}</span>
                <span className="text-green-600 font-medium text-sm">{discount}% off</span>
              </>
            )}
          </div>

          <p className="text-gray-600 mt-4 leading-relaxed">{product.description}</p>

          <p className={`text-sm mt-4 ${product.stock > 0 ? "text-gray-500" : "text-red-500"}`}>
            {product.stock > 0 ? `${product.stock} units in stock` : "Out of stock"}
          </p>

          {message && <p className="text-sm text-primary-600 mt-2">{message}</p>}

          {product.stock > 0 && (
            <>
              <div className="flex items-center gap-3 mt-6">
                <span className="label mb-0">Quantity</span>
                <div className="flex items-center border border-gray-200 rounded-card">
                  <button onClick={decrement} className="px-3 py-1 text-gray-600 hover:bg-gray-50">
                    −
                  </button>
                  <span className="px-4 py-1 text-sm">{quantity}</span>
                  <button onClick={increment} className="px-3 py-1 text-gray-600 hover:bg-gray-50">
                    +
                  </button>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={handleAddToCart} className="btn-secondary flex-1">
                  Add to Cart
                </button>
                <button onClick={handleBuyNow} className="btn-primary flex-1">
                  Buy Now
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
