import { useEffect, useState } from "react";
import { getMyOrders } from "../services/orderService";
import { IMAGE_BASE_URL } from "../services/api";
import Spinner from "../components/Spinner";
import EmptyState from "../components/EmptyState";

const statusColors = {
  Pending: "bg-yellow-50 text-yellow-700",
  Accepted: "bg-blue-50 text-blue-700",
  Rejected: "bg-red-50 text-red-700",
  Shipped: "bg-purple-50 text-purple-700",
  Delivered: "bg-green-50 text-green-700",
};

const CustomerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getMyOrders()
      .then(setOrders)
      .catch((err) => setError(err.response?.data?.message || "Failed to load orders"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner size="lg" />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Orders</h1>

      {error && <EmptyState title="Something went wrong" subtitle={error} />}
      {!error && orders.length === 0 && (
        <EmptyState title="No orders yet" subtitle="Your placed orders will appear here" />
      )}

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="card p-4 flex items-center gap-4">
            <img
              src={`${IMAGE_BASE_URL}${order.product?.image}`}
              alt={order.product?.title}
              className="w-16 h-16 object-cover rounded-card"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-800 truncate">{order.product?.title}</h3>
              <p className="text-sm text-gray-500">
                Qty: {order.quantity} · ₹{order.price}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <span
              className={`text-xs font-medium px-3 py-1 rounded-full ${statusColors[order.status]}`}
            >
              {order.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerOrders;
