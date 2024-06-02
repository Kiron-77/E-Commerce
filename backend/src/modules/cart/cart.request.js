const Joi = require("joi")

const CartValidateSchema = Joi.object({
    productId: Joi.string().required(),
    quantity:Joi.number().min(1).required()
})
const CheckOutSchema = Joi.array().items(Joi.string().required())
module.exports = {
    CartValidateSchema,
    CheckOutSchema
}