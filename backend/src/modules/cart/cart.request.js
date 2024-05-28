const Joi = require("joi")

const cartValidateSchema = Joi.object({
    productId: Joi.string().required(),
    quantity:Joi.number().min(1).required()
})
const CheckoutSchema = Joi.array().items(Joi.string().required())
module.exports = {
    cartValidateSchema,
    CheckoutSchema
}