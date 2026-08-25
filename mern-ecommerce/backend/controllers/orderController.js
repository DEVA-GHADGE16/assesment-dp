const Order = require("../models/Order");
const Product = require("../models/Product");

// @route POST /api/orders  (customer only)
const placeOrder = async (req, res) => {
  try {
    const { productId, quantity, customerDetails } = req.body;

    if (!productId || !quantity || !customerDetails) {
      return res.status(400).json({ message: "Missing required order fields" });
    }

    const requiredCustomerFields = ["name", "mobile", "email", "address", "city", "state", "pincode"];
    for (const field of requiredCustomerFields) {
      if (!customerDetails[field]) {
        return res.status(400).json({ message: `${field} is required` });
      }
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (quantity > product.stock) {
      return res.status(400).json({ message: "Quantity exceeds available stock" });
    }

    const order = await Order.create({
      customer: req.user.id,
      seller: product.seller,
      product: product._id,
      quantity,
      price: product.offerPrice * quantity,
      customerDetails,
      status: "Pending",
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/orders/mine  (customer only)
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user.id })
      .populate("product", "title image offerPrice")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/orders/seller  (seller only)
const getSellerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ seller: req.user.id })
      .populate("product", "title image offerPrice")
      .populate("customer", "name email")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route PUT /api/orders/:id/status  (seller only, own order)
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["Pending", "Accepted", "Rejected", "Shipped", "Delivered"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.seller.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this order" });
    }

    // Reduce stock only when transitioning into Accepted from Pending
    if (status === "Accepted" && order.status !== "Accepted") {
      const product = await Product.findById(order.product);
      if (product) {
        if (product.stock < order.quantity) {
          return res.status(400).json({ message: "Insufficient stock to accept this order" });
        }
        product.stock -= order.quantity;
        await product.save();
      }
    }

    order.status = status;
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { placeOrder, getMyOrders, getSellerOrders, updateOrderStatus };
