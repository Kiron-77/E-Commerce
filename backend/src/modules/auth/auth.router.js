const router = require('express').Router()
const authCheck = require('../../middlewares/auth.middleware')
const authCtrl = require('./auth.controller')
const {validator,paramValidator, } =require('../../middlewares/validator.middleware')
const {registerSchema,activationToken, passwordSchema,loginSchema, } = require('./auth.request')
const uploader = require('../../middlewares/uploader.middlewares')
const PermissionCheck = require('../../middlewares/rbac.middleware')
const { USER_ROLES } = require('../../config/constant.config')

        // ******register user*******/
router.post('/register',uploader.single('image'),validator(registerSchema),authCtrl.register)
router.get('/verify/:token',paramValidator(activationToken),authCtrl.verifyActivationToken)
router.post('/activation/:token',paramValidator(activationToken),validator(passwordSchema),authCtrl.activateUser)

    /********login process */
router.post('/login',validator(loginSchema),authCtrl.loginUser)
router.get('/me',authCheck,authCtrl.getLoggedInUser)
router.get('/logout',authCheck,authCtrl.logoutUser)

    /*****forget password */
router.post('/forget-password',authCtrl.sendEmailForForgetPassword)
router.get('/verify-password-token/:token',paramValidator(activationToken),authCtrl.verifyForgetPasswordToken)
router.post('/set-password/:token', paramValidator(activationToken), validator(passwordSchema), authCtrl.updatePassword)

// router.get("/get-alluser", authCheck, PermissionCheck('admin'), authCtrl.getAllUsers)
// router.get("/get-user/:id", authCheck, PermissionCheck('admin'), authCtrl.getSingleUserById)
// router.put("/update-user/:id", authCheck, PermissionCheck('admin'), authCtrl.updateUserById)
// router.delete("/delete-user/:id", authCheck, PermissionCheck('admin'), authCtrl.deleteUserById)



module.exports = router;

