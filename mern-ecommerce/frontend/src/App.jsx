import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import CustomerOrders from "./pages/CustomerOrders";
import SellerProducts from "./pages/SellerProducts";
import SellerOrders from "./pages/SellerOrders";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/product/:id"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <ProductDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <CustomerOrders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/seller/products"
          element={
            <ProtectedRoute allowedRoles={["seller"]}>
              <SellerProducts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/seller/orders"
          element={
            <ProtectedRoute allowedRoles={["seller"]}>
              <SellerOrders />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
