import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { placeOrder } from "../services/orderService";
import EmptyState from "../components/EmptyState";

const initialForm = {
  name: "",
  mobile: "",
  email: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
};

const Checkout = () => {
  const { items, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <EmptyState title="Your cart is empty" subtitle="Add products before checking out" />
      </div>
    );
  }

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!/^[0-9]{10}$/.test(form.mobile)) errs.mobile = "Enter a valid 10-digit mobile number";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = "Enter a valid email";
    if (!form.address.trim()) errs.address = "Address is required";
    if (!form.city.trim()) errs.city = "City is required";
    if (!form.state.trim()) errs.state = "State is required";
    if (!/^[0-9]{6}$/.test(form.pincode)) errs.pincode = "Enter a valid 6-digit pincode";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;

    setLoading(true);
    try {
      await Promise.all(
        items.map((item) =>
          placeOrder({
            productId: item.product._id,
            quantity: item.quantity,
            customerDetails: form,
          })
        )
      );
      clearCart();
      navigate("/orders");
    } catch (err) {
      setServerError(err.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: "name", label: "Full Name", type: "text" },
    { key: "mobile", label: "Mobile Number", type: "tel" },
    { key: "email", label: "Email", type: "email" },
    { key: "address", label: "Address", type: "text" },
    { key: "city", label: "City", type: "text" },
    { key: "state", label: "State", type: "text" },
    { key: "pincode", label: "Pincode", type: "text" },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 card p-6">
        <h1 className="text-xl font-bold text-gray-800 mb-4">Delivery Details</h1>

        {serverError && (
          <div className="bg-red-50 text-red-600 text-sm rounded-card px-3 py-2 mb-4">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid sm:grid-cols-2 gap-4">
            {fields.map(({ key, label, type }) => (
              <div key={key} className={key === "address" ? "sm:col-span-2" : ""}>
                <label className="label">{label}</label>
                <input
                  type={type}
                  className={`input ${errors[key] ? "input-error" : ""}`}
                  value={form[key]}
                  onChange={handleChange(key)}
                />
                {errors[key] && <p className="error-text">{errors[key]}</p>}
              </div>
            ))}
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full mt-6">
            {loading ? "Placing order..." : "Place Order"}
          </button>
        </form>
      </div>

      <div className="card p-6 h-fit">
        <h2 className="font-semibold text-gray-800 mb-4">Order Summary</h2>
        <div className="space-y-2 text-sm">
          {items.map(({ product, quantity }) => (
            <div key={product._id} className="flex justify-between text-gray-600">
              <span className="truncate pr-2">
                {product.title} × {quantity}
              </span>
              <span>₹{product.offerPrice * quantity}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between font-semibold text-gray-800">
          <span>Total</span>
          <span>₹{cartTotal}</span>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
