const { USER_ROLES } = require("../../config/constant.config")
const authCheck = require("../../middlewares/auth.middleware")
const PermissionCheck = require("../../middlewares/rbac.middleware")
const { validator } = require("../../middlewares/validator.middleware")
const cartController = require("./cart.controller")
const { CheckOutSchema, CartValidateSchema} = require("./cart.request")
// const { cartValidateSchema, CheckoutSchema } = require("./cart.request")

const router = require("express").Router()

router.post("/create",
    authCheck,
    PermissionCheck([USER_ROLES.customer, USER_ROLES.admin]),
    validator(CartValidateSchema),
    cartController.create
)
router.post("/checkout",
    authCheck,
    PermissionCheck([USER_ROLES.customer, USER_ROLES.admin]),
    validator(CheckOutSchema),
    cartController.checkout
)
router.get("/list",
    authCheck,
    PermissionCheck([USER_ROLES.customer, USER_ROLES.admin]),
    cartController.listCart
)
router.delete("/:id",
    authCheck,
    PermissionCheck([USER_ROLES.customer, USER_ROLES.admin]),
    cartController.deleteCart
)
router.get("/list/by-admin",
    authCheck,
    PermissionCheck([ USER_ROLES.admin]),
    cartController.listByAdmin
)

module.exports = router