
const { USER_ROLES } = require('../../config/constant.config')
const authCheck = require('../../middlewares/auth.middleware')
const PermissionCheck = require('../../middlewares/rbac.middleware')
const uploader = require('../../middlewares/uploader.middlewares')
const { validator } = require('../../middlewares/validator.middleware')
const brandCtrl = require('./brand.controller')
const { brandCreateSchema } = require('./brand.request')

const router = require('express').Router()
router.get("/home",brandCtrl.listForHome)
router.route('/')
    .post(
        authCheck,
        PermissionCheck(USER_ROLES.admin),
        uploader.single('image'),
        validator(brandCreateSchema),
        brandCtrl.createBrand
)
    .get(
        authCheck,
        PermissionCheck(USER_ROLES.admin),
        brandCtrl.listAllBrands
)
router.route("/:id")
    .get(
        authCheck,
        PermissionCheck(USER_ROLES.admin),
        brandCtrl.getBrandDetail
)
    .put(
        authCheck,
        PermissionCheck(USER_ROLES.admin),
        uploader.single('image'),
        validator(brandCreateSchema),
        brandCtrl.updateById

        
)
    .delete(
        authCheck,
        PermissionCheck(USER_ROLES.admin),
        brandCtrl.deleteById
)

module.exports = router;