import { useEffect, useState } from "react";
import {
  getMyProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/productService";
import { IMAGE_BASE_URL } from "../services/api";
import ProductForm from "../components/ProductForm";
import Spinner from "../components/Spinner";
import EmptyState from "../components/EmptyState";

const SellerProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [view, setView] = useState("list"); // list | create | edit
  const [editingProduct, setEditingProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const loadProducts = () => {
    setLoading(true);
    getMyProducts()
      .then(setProducts)
      .catch((err) => setError(err.response?.data?.message || "Failed to load products"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleCreate = async (formData) => {
    setSubmitting(true);
    setFormError("");
    try {
      await createProduct(formData);
      setView("list");
      loadProducts();
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to create product");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (formData) => {
    setSubmitting(true);
    setFormError("");
    try {
      await updateProduct(editingProduct._id, formData);
      setView("list");
      setEditingProduct(null);
      loadProducts();
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to update product");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete product");
    }
  };

  if (view === "create") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-xl font-bold text-gray-800 mb-6">Create Product</h1>
        {formError && (
          <div className="bg-red-50 text-red-600 text-sm rounded-card px-3 py-2 mb-4">
            {formError}
          </div>
        )}
        <div className="card p-6">
          <ProductForm
            onSubmit={handleCreate}
            onCancel={() => setView("list")}
            submitting={submitting}
          />
        </div>
      </div>
    );
  }

  if (view === "edit" && editingProduct) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-xl font-bold text-gray-800 mb-6">Edit Product</h1>
        {formError && (
          <div className="bg-red-50 text-red-600 text-sm rounded-card px-3 py-2 mb-4">
            {formError}
          </div>
        )}
        <div className="card p-6">
          <ProductForm
            initialData={{ ...editingProduct, imageUrl: `${IMAGE_BASE_URL}${editingProduct.image}` }}
            onSubmit={handleUpdate}
            onCancel={() => {
              setView("list");
              setEditingProduct(null);
            }}
            submitting={submitting}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Products</h1>
        <button onClick={() => setView("create")} className="btn-primary">
          + Add Product
        </button>
      </div>

      {loading && <Spinner size="lg" />}
      {!loading && error && <EmptyState title="Something went wrong" subtitle={error} />}
      {!loading && !error && products.length === 0 && (
        <EmptyState
          title="No products yet"
          subtitle="Create your first product to start selling"
          action={
            <button onClick={() => setView("create")} className="btn-primary">
              + Add Product
            </button>
          }
        />
      )}

      {!loading && !error && products.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((p) => (
            <div key={p._id} className="card overflow-hidden">
              <img
                src={`${IMAGE_BASE_URL}${p.image}`}
                alt={p.title}
                className="w-full aspect-video object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 truncate">{p.title}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  ₹{p.offerPrice}{" "}
                  <span className="text-gray-400 line-through text-xs">₹{p.mrp}</span>
                </p>
                <p className="text-xs text-gray-400 mt-1">Stock: {p.stock}</p>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => {
                      setEditingProduct(p);
                      setView("edit");
                      setFormError("");
                    }}
                    className="btn-secondary text-sm flex-1"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="btn-danger text-sm flex-1"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SellerProducts;
