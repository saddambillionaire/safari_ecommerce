import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
    // this is considered like a foreign key if this was a sql
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1
    }
});

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    clerkId: {
        type: String,
        ref: 'Clerk',
        required: true
    },
    items: [cartItemSchema]
}, {timestamps: true});

export const Cart = mongoose.model("Cart", cartSchema);