import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
    label: {
        type: String,
        required: true,
    },
    ville: {
        type: String,   
        required: true,
    },
   nomComplet: {
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
    default: null,
    trim: true,
},
    numeroTelephone: {
        type: String,   
        required: true,
    },
    isDefault: {
        type: Boolean,
        default: false,
    },
});

const userSchema = new mongoose.Schema({   
    email: {
        type: String,
        required: true,  
        unique: true
},
name: {
    type: String,
    required: true, 
},
imageUrl: {
    type: String,
    default: '',
},
clerkId: {
    type: String,
    required: true,
    unique: true,
},
stripeCustomerId: {
    type: String,
    default: '',
},
addresses: [addressSchema],
wishlist: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    },
],
},
{
  timestamps: true,
});
export const User = mongoose.model('User', userSchema);