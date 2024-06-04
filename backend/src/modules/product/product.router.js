
const { USER_ROLES } = require('../../config/constant.config')
const authCheck = require('../../middlewares/auth.middleware')
const PermissionCheck = require('../../middlewares/rbac.middleware')
const uploader = require('../../middlewares/uploader.middlewares')
const { validator } = require('../../middlewares/validator.middleware')
const filterProduct = require('../filterProduct/filterProduct.controller')
const searchProduct = require('../searchProduct/searchProduct.controller')
const productCtrl = require('./product.controller')
const { productCreateSchema } = require('./product.request')


const router = require('express').Router()
router.get("/home", productCtrl.listForHome)
router.get('/:slug/bySlug', productCtrl.getProductDetailBySlug)
router.get('/:brandslug/bybrand', productCtrl.getProductsByBrand)
router.get('/:categoryslug/bycategory', productCtrl.getProductsByCategory)
router.route('/')
    .post(
        authCheck,
        PermissionCheck([USER_ROLES.admin, USER_ROLES.seller]),
        uploader.array('images'),
        validator(productCreateSchema),
        productCtrl.createProduct
    )
    .get(
        authCheck,
        PermissionCheck([USER_ROLES.admin, USER_ROLES.seller]),
        productCtrl.listAllProducts
    )

router.get("/search", searchProduct)
router.post("/filterproduct",filterProduct)

router.route("/:id")
    .get(
        authCheck,
        PermissionCheck([USER_ROLES.admin, USER_ROLES.seller]),
        productCtrl.getProductDetail
    )
    .put(
        authCheck,
        PermissionCheck([USER_ROLES.admin, USER_ROLES.seller]),
        uploader.array('images'),
        validator(productCreateSchema),
        productCtrl.updateById


    )
    .delete(
        authCheck,
        PermissionCheck([USER_ROLES.admin, USER_ROLES.seller]),
        productCtrl.deleteById
    )

module.exports = router;