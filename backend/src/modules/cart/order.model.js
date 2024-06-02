const mongoose = require("mongoose")

const OrderSchema = new mongoose.Schema({
    buyerId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    cartId: [{
        type: mongoose.Types.ObjectId,
        ref: "Cart",
        required: true
    }],
    subTotal: {
        type: Number,
        min: 0,
        required: true
    },
    discount: {
        type: Number,
        min: 0,
        default: 0
    },
    serviceCharge: {
        type: Number,
        min: 0,
        default: 0
    },
    taxAmt: {
        type: Number,
        min: 0,
        default: 0
    },
    totalAmt: {
        type: Number,
    },
    status: {
        type: String,
        enum: ['new', 'verify', 'processing', 'canceled', 'completed'],
        default: 'new'
    },
    isPaid:Boolean
}, {
    timestamps: true,
    autoCreate: true,
    autoIndex: true
})
const OrderModel = mongoose.model("Order", OrderSchema)
module.exports = OrderModel