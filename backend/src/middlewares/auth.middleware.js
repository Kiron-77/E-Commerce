require('dotenv').config()
const jwt = require('jsonwebtoken');
const authSvc = require("../modules/auth/auth.service");
const authCheck = async(req, res, next) => {
    try {
        let token;
        if (req.headers['authorization']) {
            token = req.headers['authorization']
        } else {
            next({ code: 401, message: "Token not set" })
        }
        token = (token.split(" ")).pop();
        if(!token){
            next({code:401, message:"Empty token"})
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const userDetail = await authSvc.getSingleUserByFilter({_id:decoded.sub})
        if(!userDetail){
            next({code:401,message:"User doesnot exist Anymore!"})
        }else{
            req.authUser = userDetail
            next()
        }
    } catch (exception) {
        console.log("JWT verification",exception)
        next({ code: 401, message: "User not authorised" })
    }
}
module.exports = authCheck;