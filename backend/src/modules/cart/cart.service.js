const CartModel = require("./cart.model");
const OrderModel = require("./order.model")

class CartService{
    transformCartObject = (product, qty, buyer) => {
        let cart = {
            buyer: buyer._id,
            productId: product._id,
            seller: product?.seller?._id,
            price: product.afterDiscount,
            quantity: qty,
            amount: (product.afterDiscount * qty),
            status: 'new',
            isPaid: false,
            purchased: false
        }
        return cart;
    }
    createCart = async (data) => {
        try {
            let exists = await CartModel.findOne({
                buyer: data.buyer,
                productId: data.productId,
                purchased: false
            })
            if (exists) {
                const updateBody = {
                    quantity: data.quantity,
                    amount: data.amount
                }
                
                return await CartModel.findByIdAndUpdate(exists._id,{
                    $set: updateBody
                })
            } else {
                let cart = new CartModel(data);
                return cart.save()
            }
        } catch (exception) {
            throw exception
        }
    }
    deleteById = async (id) => {
        try {
            const resp = await CartModel.findByIdAndDelete(id)
            if (!resp) {
                throw { code: 400, message: "CartId does not exist or already deleted" }
            }
            return resp;
        } catch (exception) {
            throw exception
        }
    }
    getOneByFilter = async (filter) => {
        try {
            const response = await CartModel.findOne(filter)
            return response;
        } catch (exception) {
            throw exception
        }
    }
    getAllByFilter = async (filter) => {
        try {
            const response = await CartModel.find(filter)
                .populate("buyer", ['_id', 'name', 'role', 'email', 'address'])
                .populate("seller", ['_id', 'name', 'role', 'email', 'address'])
                .populate("productId", ['_id', 'title', 'slug', 'price', 'discount', 'afterDiscount','images'])
            return response;
        } catch (exception) {
            throw exception
        }
    }
    transformOrderObj = (cartDetail, buyer) => {
        const orderObj = {
            buyerId: buyer._id,
            cartId: [],
            subTotal: 0,
            discount: 0,
            serviceCharge: 0,
            taxAmt: 0,
            totalAmt: 0,
            status: 'new',
            isPaid: false
        }
        const cartIds = []
        let subTotal = 0;
        console.log(cartDetail)
        cartDetail.map((row) => {
            if (buyer._id.equals(row.buyer._id)) {
                cartIds.push(row._id)
                subTotal += row.amount
            }
        })
        orderObj.cartId = cartIds
        orderObj.subTotal = subTotal
        orderObj.totalAmt = subTotal
        return orderObj;
    }

    createOrder = async (orderObj) => {
        try {
            const order = new OrderModel(orderObj)
            await order.save()
            await CartModel.updateMany({
                _id: { $in: orderObj.cartId }
            }, {
                $set: { purchased: true }
            })
            return order;
        } catch (exception) {
            throw exception
        }
    }
}
module.exports = new CartService