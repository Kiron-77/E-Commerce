

const { USER_ROLES } = require('../../config/constant.config')
const authCheck = require('../../middlewares/auth.middleware')
const PermissionCheck = require('../../middlewares/rbac.middleware')
const authCtrl = require('./auth.controller')


const router = require('express').Router()


router.get('/home', authCtrl.ListForUserHome)
router.route('/')
    .get(
        authCheck,
        PermissionCheck(USER_ROLES.admin),
        authCtrl.getAllUsers
)
router.route("/:id")
    .get(authCheck,
        PermissionCheck(USER_ROLES.admin),
    authCtrl.getSingleUserById
)
    .put(
        authCheck,
        PermissionCheck(USER_ROLES.admin),
        authCtrl.updateUserById
)
    .delete(
        authCheck,
        PermissionCheck(USER_ROLES.admin),
        authCtrl.deleteUserById
)
module.exports = router