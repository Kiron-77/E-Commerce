const productSvc = require("../product/product.service")
const cartSvc = require("./cart.service")


class CartController{
    create = async(req, res, next)=>{
        try {
            const { productId, quantity } = req.body;
            const productDetail = await productSvc.getOneByFilter({
                _id:productId
            })
            if (!productDetail) {
                throw { code:400,message:"Product does not exist"}
            }
            const cartData = cartSvc.transformCartObject(productDetail, quantity, req.authUser)
            const cartDetail = await cartSvc.createCart(cartData)
            res.json({
                result: cartDetail,
                message: "Card created successfullly",
                meta:null
            })

        } catch (exception) {
           next(exception) 
        }
    }
    deleteCart = async(req,res,next) => {
        try {
            const cartDetail = await cartSvc.getOneByFilter({
               _id:req.params.id
            }) 
            if (!cartDetail) {
                throw {
                    code: 400,
                    message: "CartItem not found"
                }
            }
            const loggedInUser = req.authUser
            if (cartDetail.purchased) {
              throw{code:400, message:"Cart Already Purchased"}  
            }
            if (!loggedInUser._id.equals(cartDetail.buyer) && loggedInUser.role !=='admin') {
                throw { code: 403, message:"You are not allowed to delete others cart"}
            } else {
                const del = await cartSvc.deleteById(req.params.id)
                res.json({
                    result: del,
                    message: "Cart deleted Successfully",
                    meta:null
                })
            }
        } catch (exception) {
            next(exception)    
        }
    }
    listByAdmin =async(req, res, next) => {
        try {
            let filter = {
                purchased: false,
            }
           
            const cartlist = await cartSvc.getAllByFilter(filter)
            let count = 0;
            cartlist.map((item) => {
                count += +item.quantity
            })
            res.json({
                result: cartlist,
                message: "Lists of Cart ",
                meta: {
                    totalCount:count
                }
            })
        } catch (exception) {
            next(exception)
        }
    }
    listCart = async(req, res, next) => {
        try {
            let filter = {
                purchased: false,
                buyer:req.authUser._id
            }
            // if (req.authUser.role !== 'admin') {
            //     filter = {
            //         ...filter,
            //         buyer:req.authUser._id
            //     }
            // }
            const cartlist = await cartSvc.getAllByFilter(filter)
            let count = 0;
            cartlist.map((item) => {
                count += +item.quantity
            })
            res.json({
                result: cartlist,
                message: "Lists of Cart ",
                meta: {
                    totalCount:count
                }
            })
        } catch (exception) {
            next(exception)
        }
    }
    checkout = async(req, res, next) => {
       try {
           let cartIds = req.body;
           const cartDetail = await cartSvc.getAllByFilter({
               _id:{$in:cartIds}
           })
           const orderObj = cartSvc.transformOrderObj(cartDetail, req.authUser)
           const order = await cartSvc.createOrder(orderObj);
           res.json({
               result: order,
               message: "Your order has been placed successfully.Our representative will contact you soon for verification",
               meta:null
           })
       } catch (exception) {
        next(exception)
       }
   }
}
module.exports = new CartController