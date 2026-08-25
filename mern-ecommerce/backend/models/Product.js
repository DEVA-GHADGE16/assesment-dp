const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    productType: { type: String, required: true },
    brand: { type: String, required: true },
    mrp: { type: Number, required: true, min: 0 },
    offerPrice: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    image: { type: String, required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

productSchema.index({ title: "text" });

module.exports = mongoose.model("Product", productSchema);
