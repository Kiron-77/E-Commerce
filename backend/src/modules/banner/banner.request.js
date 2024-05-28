const Joi = require('joi')

const bannerCreateSchema = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    url: Joi.string().uri().required(),
    status:Joi.string().regex(/^(active|inactive)$/).default('inactive')
})
module.exports = {bannerCreateSchema}