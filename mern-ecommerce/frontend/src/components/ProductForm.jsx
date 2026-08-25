import { useState } from "react";

const emptyForm = {
  title: "",
  description: "",
  category: "",
  productType: "",
  brand: "",
  mrp: "",
  offerPrice: "",
  stock: "",
};

const ProductForm = ({ initialData, onSubmit, onCancel, submitting }) => {
  const [form, setForm] = useState(initialData || emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(initialData?.imageUrl || null);
  const [errors, setErrors] = useState({});

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const validate = () => {
    const errs = {};
    ["title", "description", "category", "productType", "brand", "mrp", "offerPrice"].forEach(
      (f) => {
        if (!String(form[f]).trim()) errs[f] = "Required";
      }
    );
    if (form.mrp && Number(form.mrp) <= 0) errs.mrp = "Must be greater than 0";
    if (form.offerPrice && Number(form.offerPrice) <= 0) errs.offerPrice = "Must be greater than 0";
    if (
      form.mrp &&
      form.offerPrice &&
      Number(form.offerPrice) > Number(form.mrp)
    ) {
      errs.offerPrice = "Cannot exceed MRP";
    }
    if (form.stock !== "" && Number(form.stock) < 0) errs.stock = "Cannot be negative";
    if (!initialData && !imageFile) errs.image = "Product image is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => data.append(key, value));
    if (imageFile) data.append("image", imageFile);

    onSubmit(data);
  };

  const fields = [
    { key: "title", label: "Title", type: "text" },
    { key: "category", label: "Category", type: "text" },
    { key: "productType", label: "Product Type", type: "text" },
    { key: "brand", label: "Brand", type: "text" },
    { key: "mrp", label: "MRP (₹)", type: "number" },
    { key: "offerPrice", label: "Offer Price (₹)", type: "number" },
    { key: "stock", label: "Stock", type: "number" },
  ];

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        {fields.map(({ key, label, type }) => (
          <div key={key}>
            <label className="label">{label}</label>
            <input
              type={type}
              className={`input ${errors[key] ? "input-error" : ""}`}
              value={form[key]}
              onChange={handleChange(key)}
              min={type === "number" ? 0 : undefined}
            />
            {errors[key] && <p className="error-text">{errors[key]}</p>}
          </div>
        ))}
      </div>

      <div>
        <label className="label">Description</label>
        <textarea
          rows={3}
          className={`input ${errors.description ? "input-error" : ""}`}
          value={form.description}
          onChange={handleChange("description")}
        />
        {errors.description && <p className="error-text">{errors.description}</p>}
      </div>

      <div>
        <label className="label">Product Image</label>
        <input type="file" accept="image/*" onChange={handleImageChange} className="text-sm" />
        {errors.image && <p className="error-text">{errors.image}</p>}
        {preview && (
          <img src={preview} alt="preview" className="w-24 h-24 object-cover rounded-card mt-3" />
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={submitting} className="btn-primary">
          {submitting ? "Saving..." : initialData ? "Update Product" : "Create Product"}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
