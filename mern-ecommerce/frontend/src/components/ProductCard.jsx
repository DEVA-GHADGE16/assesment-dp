import { Link } from "react-router-dom";
import { IMAGE_BASE_URL } from "../services/api";

const ProductCard = ({ product }) => {
  const discount = Math.round(((product.mrp - product.offerPrice) / product.mrp) * 100);

  return (
    <Link to={`/product/${product._id}`} className="card overflow-hidden group block">
      <div className="aspect-square bg-gray-100 overflow-hidden">
        <img
          src={`${IMAGE_BASE_URL}${product.image}`}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />
      </div>
      <div className="p-4">
        <p className="text-xs text-gray-400 uppercase tracking-wide">{product.brand}</p>
        <h3 className="font-semibold text-gray-800 truncate mt-1">{product.title}</h3>
        <div className="flex items-center gap-2 mt-2">
          <span className="font-bold text-gray-900">₹{product.offerPrice}</span>
          {product.mrp > product.offerPrice && (
            <>
              <span className="text-xs text-gray-400 line-through">₹{product.mrp}</span>
              <span className="text-xs text-green-600 font-medium">{discount}% off</span>
            </>
          )}
        </div>
        {product.stock === 0 ? (
          <p className="text-xs text-red-500 mt-2">Out of stock</p>
        ) : (
          <p className="text-xs text-gray-400 mt-2">{product.stock} in stock</p>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
