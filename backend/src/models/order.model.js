import mongoose from "mongoose";

const ShippingAddressSchema = new mongoose.Schema({
  nomComplet: {
    type: String,
    required: true,
  },
  ville: {
    type: String,
    required: true,
  },
  commune: {
    type: String,
    required: true,
  },
  quartier: {
    type: String,
    required: true,
  },
  avenue: {
    type: String,
    required: true,
  },
  reference: {
    type: String,
    required: true,
  },
  numeroTelephone: {
    type: String,
    required: true,
  },
});

const orderItemsSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  image: {
    type: String,
    required: true,
  },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    clerkId: {
      type: String,
      required: true,
    },
    orderItems: [orderItemsSchema],
    shippingAddress: {
      type: ShippingAddressSchema,
      required: true,
    },
    paymentResult: {
      id: String,
      status: String,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["pending", "shipped", "delivered"],
      default: "pending",
    },
    deliverdAt: {
      type: Date,
    },
    shippedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

export const Order = mongoose.model("Order", orderSchema);
