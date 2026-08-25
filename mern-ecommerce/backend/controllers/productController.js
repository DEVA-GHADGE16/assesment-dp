const Product = require("../models/Product");
const fs = require("fs");
const path = require("path");

const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

// @route GET /api/products  (public - all products, supports ?search=)
const getProducts = async (req, res) => {
  try {
    const { search, category } = req.query;
    const filter = {};
    if (search) filter.title = { $regex: search, $options: "i" };
    if (category) filter.category = category;

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/products/:id  (public)
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/products/seller/mine  (seller only)
const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user.id }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route POST /api/products  (seller only)
const createProduct = async (req, res) => {
  try {
    const { title, description, category, productType, brand, mrp, offerPrice, stock } = req.body;

    if (!title || !description || !category || !productType || !brand || !mrp || !offerPrice) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "Product image is required" });
    }
    if (Number(offerPrice) > Number(mrp)) {
      return res.status(400).json({ message: "Offer price cannot exceed MRP" });
    }

    let slug = slugify(title);
    const existing = await Product.findOne({ slug });
    if (existing) slug = `${slug}-${Date.now()}`;

    const product = await Product.create({
      title,
      slug,
      description,
      category,
      productType,
      brand,
      mrp,
      offerPrice,
      stock: stock || 0,
      image: `/uploads/${req.file.filename}`,
      seller: req.user.id,
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route PUT /api/products/:id  (seller only, own product)
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (product.seller.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to edit this product" });
    }

    const fields = ["title", "description", "category", "productType", "brand", "mrp", "offerPrice", "stock"];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) product[f] = req.body[f];
    });

    if (req.body.title) {
      let slug = slugify(req.body.title);
      const existing = await Product.findOne({ slug, _id: { $ne: product._id } });
      product.slug = existing ? `${slug}-${Date.now()}` : slug;
    }

    if (req.file) {
      const oldImagePath = path.join(__dirname, "..", product.image);
      if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
      product.image = `/uploads/${req.file.filename}`;
    }

    if (Number(product.offerPrice) > Number(product.mrp)) {
      return res.status(400).json({ message: "Offer price cannot exceed MRP" });
    }

    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route DELETE /api/products/:id (seller only, own product)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (product.seller.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this product" });
    }

    const imagePath = path.join(__dirname, "..", product.image);
    if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);

    await product.deleteOne();
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  getMyProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
