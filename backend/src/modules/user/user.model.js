
const mongoose = require('mongoose')

const UserSchemaDef = new mongoose.Schema({
    name:{
        type:String,
        min:2,
        max:50,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password: {
        type:String
    },
    phone: {
        type:String
    },
    activationToken:String,
    role:{
        type:String,
        enum:["admin","seller","customer"],
        default:"customer"
    },
    forgetPasswordToken:String,
    address:{
        shipping:String,
        billing:String
    },
    image:{
        type:String
    },
    status:{
        type:String,
        enum:["activated","notactivated","suspended","deleted"],
        default:"notactivated"
    },
    dateOfBirth:Date
},{
    timestamps:true,
    autoCreate:true,            
    autoIndex:true
})
const UserModel = mongoose.model('User',UserSchemaDef)
module.exports = UserModel;