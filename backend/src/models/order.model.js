import mongoose from 'mongoose';

const ShippingAddressSchema = new mongoose.Schema({
    fullName: { 
        type: String,
        required: true
    },
    addressAddress: { 
        type: String,
        required: true
    },
    county: { 
        type: String,
        required: true
    },
    phoneNumber: { 
        type: String,
        required: true
    }
});

const orderItemsSchema = new mongoose.Schema({
    product: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product',
        required: true 
    },
    name: { 
        type: String, 
        required: true
    },
    price: { 
        type: Number, 
        required: true, 
        min: 0 
    },
    quantity: { 
        type: Number, 
        required: true, 
        min: 1 
    },
    image: { 
        type: String, 
        required: true
    }
});

const orderSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true },
  clerkId: {
    type: String,
    required: true
  },
  orderItems: [orderItemsSchema],
  shippingAddress: {
    type: ShippingAddressSchema,
    required: true
},
paymentResult: {
    id: String,
    status: String,
},
totalPrice: {
    type: Number,
    required: true,
    min: 0
},
status: {
    type: String,
    enum: ['pending', , 'shipped', 'delivered'],
    default: 'pending'
},
deliverdAt: {
    type: Date
},
shippedAt: {
    type: Date
}
},
 {
  timestamps: true
});

export const Order = mongoose.model('Order', orderSchema);