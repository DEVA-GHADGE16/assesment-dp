import { useEffect, useState } from "react";
import { getProducts } from "../services/productService";
import ProductCard from "../components/ProductCard";
import Spinner from "../components/Spinner";
import EmptyState from "../components/EmptyState";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = async (query = "") => {
    setLoading(true);
    setError("");
    try {
      const data = await getProducts(query);
      setProducts(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => fetchProducts(search), 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Browse Products</h1>
        <input
          type="text"
          className="input max-w-md"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading && <Spinner size="lg" />}
      {!loading && error && (
        <EmptyState title="Something went wrong" subtitle={error} />
      )}
      {!loading && !error && products.length === 0 && (
        <EmptyState title="No products found" subtitle="Try a different search term" />
      )}

      {!loading && !error && products.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
