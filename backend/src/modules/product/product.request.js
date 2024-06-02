const Joi = require('joi')

const productCreateSchema = Joi.object({
    title: Joi.string().min(2).required(),
    category: Joi.string().optional(),
    description: Joi.string().required(),
    price: Joi.number().min(50).required(),
    discount: Joi.number().min(0).max(90),
    brand: Joi.string().empty(''),
    seller: Joi.string().empty(''),
    featured: Joi.boolean().default(false),
    attributes: Joi.array().items(
        Joi.object({
            name: Joi.string(),
            value: Joi.array().items(Joi.string())
        })
    ),
    status: Joi.string().valid('active', 'inactive').default('inactive')
});
module.exports = {productCreateSchema};