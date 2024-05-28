// const { USER_ROLES } = require('../../config/constants.config')
// const authCheck = require('../../middlewares/auth.middleware')
// const PermissionCheck = require('../../middlewares/rbac.middleware')
// const uploader = require('../../middlewares/uploader.middleware')
// const { validator } = require('../../middlewares/validator.middleware')
const {USER_ROLES} = require('../../config/constant.config')
const authCheck = require('../../middlewares/auth.middleware')
const PermissionCheck = require('../../middlewares/rbac.middleware')
const uploader = require('../../middlewares/uploader.middlewares')
const {validator} = require('../../middlewares/validator.middleware')
const categoryCtrl = require('./category.controller')
const { categoryCreateSchema } = require('./category.request')

const router = require('express').Router()
router.get("/home",categoryCtrl.listForHome)
router.route('/')
.post(
    authCheck,
    PermissionCheck(USER_ROLES.admin),
    uploader.single('image'),
    validator(categoryCreateSchema),
    categoryCtrl.createCategory
)
.get(
    authCheck,
    PermissionCheck(USER_ROLES.admin),
    categoryCtrl.listAllCategories
)
router.route("/:id")
.get(
    authCheck,
    PermissionCheck(USER_ROLES.admin),
    categoryCtrl.getCategoryDetail
)
.put(
    authCheck,
    PermissionCheck(USER_ROLES.admin),
    uploader.single('image'),
    validator(categoryCreateSchema),
    categoryCtrl.updateById

    
)
.delete(
    authCheck,
    PermissionCheck(USER_ROLES.admin),
    categoryCtrl.deleteById
)



// .post(authCheck,PermisionCheck(USER_ROLES.admin))


module.exports = router;