import mongoose from "mongoose";

const ShippingAddressSchema = new mongoose.Schema(
  {
    nomComplet: {
      type: String,
      required: true,
      trim: true,
    },
    commune: {
      type: String,
      required: true,
      trim: true,
    },
    quartier: {
      type: String,
      required: true,
      trim: true,
    },
    avenue: {
      type: String,
      required: true,
      trim: true,
    },
    reference: {
      type: String,
      required: true,
      trim: true,
    },
    numeroTelephone: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false },
);

const OrderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    // Snapshot of product at purchase time
    name: {
      type: String,
      required: true,
      trim: true,
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
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    clerkId: {
      type: String,
      required: true,
      index: true,
    },

    stripeCustomerId: {
      type: String,
      default: null,
      index: true,
    },

    orderItems: {
      type: [OrderItemSchema],
      required: true,
      validate: [
        (items) => items.length > 0,
        "Order must contain at least one item.",
      ],
    },

    shippingAddress: {
      type: ShippingAddressSchema,
      required: true,
    },

    paymentResult: {
      id: {
        type: String,
        required: true,
        unique: true,
      },

      status: {
        type: String,
        required: true,
      },

      amountReceived: {
        type: Number,
        default: 0,
      },

      currency: {
        type: String,
        default: "usd",
      },

      paymentMethod: {
        type: String,
        default: null,
      },

      processedAt: {
        type: Date,
        default: Date.now,
      },
    },

    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: [
        "paid",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "refunded",
      ],
      default: "paid",
    },

    paidAt: {
      type: Date,
      default: Date.now,
    },

    processingAt: Date,

    shippedAt: Date,

    deliveredAt: Date,

    cancelledAt: Date,

    refundedAt: Date,
  },
  {
    timestamps: true,
  },
);

// Prevent duplicate orders from duplicate Stripe webhooks
orderSchema.index({ "paymentResult.id": 1 }, { unique: true });

// Common query indexes
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });

export const Order = mongoose.model("Order", orderSchema);

// import mongoose from "mongoose";

// const ShippingAddressSchema = new mongoose.Schema({
//   nomComplet: {
//     type: String,
//     required: true,
//   },
//   commune: {
//     type: String,
//     required: true,
//   },
//   quartier: {
//     type: String,
//     required: true,
//   },
//   avenue: {
//     type: String,
//     required: true,
//   },
//   reference: {
//     type: String,
//     required: true,
//   },
//   numeroTelephone: {
//     type: String,
//     required: true,
//   },
// });

// const orderItemsSchema = new mongoose.Schema({
//   product: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Product",
//     required: true,
//   },
//   name: {
//     type: String,
//     required: true,
//   },
//   price: {
//     type: Number,
//     required: true,
//     min: 0,
//   },
//   quantity: {
//     type: Number,
//     required: true,
//     min: 1,
//   },
//   image: {
//     type: String,
//     required: true,
//   },
// });

// const orderSchema = new mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     clerkId: {
//       type: String,
//       required: true,
//     },
//     orderItems: [orderItemsSchema],
//     shippingAddress: {
//       type: ShippingAddressSchema,
//       required: true,
//     },
//     paymentResult: {
//       id: String,
//       status: String,
//     },
//     totalPrice: {
//       type: Number,
//       required: true,
//       min: 0,
//     },
//     status: {
//       type: String,
//       enum: ["pending", "shipped", "delivered"],
//       default: "pending",
//     },
//     deliverdAt: {
//       type: Date,
//     },
//     shippedAt: {
//       type: Date,
//     },
//   },
//   {
//     timestamps: true,
//   },
// );

// export const Order = mongoose.model("Order", orderSchema);
