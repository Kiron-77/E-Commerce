const mongoose = require('mongoose')

const CartSchemaDef = new mongoose.Schema({
    buyer: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required:true
    },
    productId: {
        type: mongoose.Types.ObjectId,
        ref: "Product",
        required:true
    },
    seller: {
        type: mongoose.Types.ObjectId,
        ref:"User"
    },
    price: {
        type: Number,
        min: 1,
        required:true
    },
    quantity: {
        type: Number,
        min: 1,
        required:true
    },
    amount: {
        type: Number,
        min: 1,
        required:true
    },
    status: {
        type: String,
        enum:['new','cancelled','completed']
    },
    purchased: {
        type: Boolean,
        default:false
    },
    isPaid: {
        type: Boolean,
        default:false
    }
}, {
    autoCreate: true,
    autoIndex: true,
    timestamps:true
})
const CartModel = mongoose.model("Cart", CartSchemaDef)
module.exports = CartModel;