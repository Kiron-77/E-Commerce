const express = require('express')
const app = express()
const authRouter =require('../modules/auth/auth.router')
const userRouter = require('../modules/auth/user.router')
const productRouter = require('../modules/product/product.router')
const brandRouter = require('../modules/brand/brand.router')
const categoryRouter = require('../modules/category/category.router')
const bannerRouter = require('../modules/banner/banner.router')



app.use("/auth",authRouter)
app.use("/user", userRouter)
app.use("/product", productRouter)
app.use("/brand", brandRouter)
app.use('/category', categoryRouter)
app.use('/banner',bannerRouter)

module.exports = app;