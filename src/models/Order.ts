import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    customerEmail: {
      type: String,
      required: true,
      index: true,
    },
    date: {
      type: String,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    items: {
      type: Array, // Could be specifically typed with a nested schema, but keeping it flexible to match the existing shape
      required: true,
    },
    shippingAddress: {
      type: Object,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
