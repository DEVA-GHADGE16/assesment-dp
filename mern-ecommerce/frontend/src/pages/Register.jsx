import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "customer" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = "Enter a valid email";
    if (!form.password) errs.password = "Password is required";
    else if (form.password.length < 6) errs.password = "Minimum 6 characters";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;

    setLoading(true);
    try {
      const user = await register(form.name, form.email, form.password, form.role);
      navigate(user.role === "seller" ? "/seller/products" : "/");
    } catch (err) {
      setServerError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-8">
      <div className="card w-full max-w-sm p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Create account</h1>
        <p className="text-sm text-gray-400 mb-6">Join as a seller or customer</p>

        {serverError && (
          <div className="bg-red-50 text-red-600 text-sm rounded-card px-3 py-2 mb-4">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <label className="label">Full name</label>
            <input
              type="text"
              className={`input ${errors.name ? "input-error" : ""}`}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Jane Doe"
            />
            {errors.name && <p className="error-text">{errors.name}</p>}
          </div>

          <div className="mb-4">
            <label className="label">Email</label>
            <input
              type="email"
              className={`input ${errors.email ? "input-error" : ""}`}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>

          <div className="mb-4">
            <label className="label">Password</label>
            <input
              type="password"
              className={`input ${errors.password ? "input-error" : ""}`}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="At least 6 characters"
            />
            {errors.password && <p className="error-text">{errors.password}</p>}
          </div>

          <div className="mb-6">
            <label className="label">I am a</label>
            <div className="grid grid-cols-2 gap-3">
              {["customer", "seller"].map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => setForm({ ...form, role: r })}
                  className={`btn text-sm capitalize ${
                    form.role === r
                      ? "bg-primary-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <p className="text-sm text-gray-500 text-center mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-primary-600 font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
