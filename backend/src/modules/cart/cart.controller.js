const productSvc = require("../product/product.service")
const cartSvc = require("./cart.service")


class CartController{
    create = async (req, res, next) => {
        try {
            const { productId, quantity } = req.body;
            const productDetail = await productSvc.getOneByFilter({
                _id:productId
            })
            if (!producrDetail) {
                throw{code:400,message:"Product doesnot exist or already deleted"}
            }
            const cartData = cartSvc.transformCartObject(productDetail, quantiry, req.authUser)
            const cartDetail = await cartSvc.createCart(cartData)
            res.json({
                result: cartDetail,
                message: "Cart created successfully",
                meta:null
            })
        } catch (exception) {
            next(exception)
        }
    }
    deleteCart = async (req, res, next) => {
        try {
            const cartDetail = await cartSvc.getOneByFilter({
               _id:req.params.id
            })
            if (!cartDetail) {
                throw {
                    code: 400,
                    message:"Cart Item not found"
                }
            }
            const loggedInUser = req.authUser
            if (cartDetail.purchased) {
                throw { code: 400, message: "Cart Already purchased" } 
            }
            if (!loggedInUser._id.equals(cartDetail.buyer) && loggedInUser.role !== 'admin') {
                throw{code:403,message:"You do not allowed to delete others cart"}
            } else {
                const del = await cartSvc.deleteById(req.paramss.id)
                res.json({
                    result: del,
                    message: "Cart deleted successfully",
                    meta:null
                })
            }
        } catch (exception) {
           next(exception) 
        }
    }
    listByAdmin = async (req, res, next) => {
        try {
            let filter = {
                purchased:false,
            }
            const cartList = await cartSvc.getAllByFilter(filter)
            let count = 0;
            cartList.flatMap((item) => {
                count += +item.quantity
            })
            res.json({
                result: cartList,
                message: "Lists of cart",
                meta: {
                    totalCount:count
                }
            })
        } catch (exception) {
            next(exception)
        }
    }
    listcart = async (req, res, next) => {
        try {
            let filter = {
                purchased: false,
                buyer:req.authUser._id
            }
            const cartList = await cartSvc.getAllByFilter(filter)
            let count = 0;
            cartList.map((item) => {
                count += +item.quantity
            })
            res.json({
                result: cartList,
                message: "List of carts",
                meta: {
                    totalCount:count
                }
            })
        } catch (exception) {
            next(exception)
        }
  
    }
    checkout = async (req, res, next) => {
        try {
            let cartIds = req.bady;
            const cartDetail = await cartSvc.transformCartObject(cartDetail, req.authUser)
            const order = await cartSvc.createOrder(orderObj)
            res.json({
                result: order,
                message: "Your order has benn placed successfully",
                meta:null
            })
        } catch (exception) {
            next(exception)
        }
    }
}
module.exports = new CartController