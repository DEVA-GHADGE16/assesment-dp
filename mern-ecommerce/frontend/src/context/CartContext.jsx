import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);

const loadCart = () => {
  try {
    const raw = localStorage.getItem("cart");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(loadCart);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const addToCart = (product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product._id === product._id);
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, product.stock);
        return prev.map((i) =>
          i.product._id === product._id ? { ...i, quantity: newQty } : i
        );
      }
      return [...prev, { product, quantity: Math.min(quantity, product.stock) }];
    });
  };

  const updateQuantity = (productId, quantity) => {
    setItems((prev) =>
      prev.map((i) =>
        i.product._id === productId
          ? { ...i, quantity: Math.max(1, Math.min(quantity, i.product.stock)) }
          : i
      )
    );
  };

  const removeFromCart = (productId) => {
    setItems((prev) => prev.filter((i) => i.product._id !== productId));
  };

  const clearCart = () => setItems([]);

  const cartTotal = items.reduce((sum, i) => sum + i.product.offerPrice * i.quantity, 0);
  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, updateQuantity, removeFromCart, clearCart, cartTotal, cartCount }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
