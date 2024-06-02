// const ProductModel = require("../product/product.model");

// import CategoryModel = require("../category/category.model");

// const searchProduct = async (req, res, next) => {
//         try {
//             const query = req.query.q;
//             const regex = new RegExp(query, 'i');
    
//             const response = await ProductModel.find({
//                 "$or": [
//                     {
//                         productName: regex
//                     },
//                     {
//                         category: regex
//                     }
//                 ]
//             });
    
//             res.json({
//                 result: response,
//                 message: "Search product list",
//                 error: false,
//                 success: true
//             });
//         } catch (exception) {
//             res.json({
//                 message: exception.message || exception,
//                 error: true,
//                 success: false
//             });
//         }
//     };

// module.exports = searchProduct
const CategoryModel = require("../category/category.model");
const ProductModel = require("../product/product.model");


const searchProduct = async (req, res, next) => {
    try {
        const query = req.query.q;
        const regex = new RegExp(query, 'i'); 

        // Retrieve category ObjectId(s) based on category name(s)
        const categories = await CategoryModel.find({ title: regex }, '_id');

        const response = await ProductModel.find({
            "$or": [
                { title: regex }, // Search by product title
                // Search products by category ObjectId(s)
                { category: { $in: categories.map(cat => cat._id) } }
            ]
        });

        res.json({
            result: response, 
            message: "Search product list",
            error: false,
            success: true
        });
    } catch (exception) {
        res.json({
            message: exception.message || exception,
            error: true,
            success: false
        });
    }
};

module.exports = searchProduct
