import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = "Enter a valid email";
    if (!form.password) errs.password = "Password is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;

    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === "seller" ? "/seller/products" : "/");
    } catch (err) {
      setServerError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="card w-full max-w-sm p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Welcome back</h1>
        <p className="text-sm text-gray-400 mb-6">Login to your account</p>

        {serverError && (
          <div className="bg-red-50 text-red-600 text-sm rounded-card px-3 py-2 mb-4">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
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

          <div className="mb-6">
            <label className="label">Password</label>
            <input
              type="password"
              className={`input ${errors.password ? "input-error" : ""}`}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
            />
            {errors.password && <p className="error-text">{errors.password}</p>}
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-sm text-gray-500 text-center mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary-600 font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
