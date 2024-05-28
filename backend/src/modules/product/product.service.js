const slugify = require("slugify");
const ProductModel = require("./product.model");

class ProductService {
    transformRequest = (req, isEdit = false) => {
        const data = {
            ...req.body,
        };

        if (!isEdit && (!req.files || req.files.length === 0)) {
            throw { code: 422, message: "Image is required", result: { images: "Image is required" } };
        } else {
            if (req.files && req.files.length > 0) {
                data.images = req.files.map(item => item.filename);
            }
        }

        if (data.category === 'null' || data.category === '') {
            data.category = null;
        } else {
            data.category = data.category.split(",");
        }

        data.afterDiscount = data.price - data.price * data.discount / 100;

        if (data.seller === 'null' || data.seller === '') {
            data.seller = null;
        }
        if (data.brand === 'null' || data.brand === '') {
            data.brand = null;
        }
        if (data.featured === 'true' || data.featured === 1) {
            data.featured = true;
        } else {
            data.featured = false;
        }

        if (!isEdit) {
            data.slug = slugify(data.title, {
                replacement: "-",
                lower: true
            });
            data.createdBy = req.authUser._id;
        } else {
            data.updatedBy = req.authUser._id;
        }

        return data;
    };

    createProduct = async (data) => {
        try {
            const product = new ProductModel(data);
            return await product.save();
        } catch (exception) {
            throw exception;
        }
    };
}

const productSvc = new ProductService();
module.exports = productSvc;
