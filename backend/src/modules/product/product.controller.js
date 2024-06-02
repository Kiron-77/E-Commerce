const productSvc = require("./product.service");
const brandSvc = require("../brand/brand.service")
const categorySvc = require("../category/category.service");
const { ConnectionPoolCreatedEvent } = require("mongodb");
class ProductController{
    createProduct = async (req, res, next) => {
        try {
            const data = productSvc.transformRequest(req);
            const success = await productSvc.createProduct(data);
            res.json({
                result: success,
                message: "Product stored Successfully",
                meta: null
            });
        } catch (exception) {
            console.log('ProductCreate', exception);
            next(exception);
        }
    };
    listAllProducts = async (req, res, next) => {
        try {
            const query = req.query;
            let limit = +query.limit || 10
            let page = +query.page || 1
            let skip = 0;
            if (page > 1) {
                skip = (page-1)*limit
            }
            let filter = {};
            if (query.search) {
                filter = {
                    title:new RegExp(query.search,'i')

                }
            }
            const count = await productSvc.getCount(filter);
            const data = await productSvc.getAllProducts({
                limit: limit,
                skip: skip,
                filter:filter
            })
            res.json({
                result: data,
                message: "Product Fetched",
                meta: {
                    currentPage: page,
                    total: count,
                    limit:limit
                }
            })
        } catch (exception) {
            console.log(exception)
            next(exception)
        }
    }
    getProductDetail = async (req, res, next) => {
        try {
            const data = await productSvc.getOneByFilter({ _id:req.params.id })
            if (!data) {
               throw{code:404, message:"Product doesnot exist"} 
            } else {
                res.json({
                    result: data,
                    message: "Product Fetched",
                    meta:null
                })
                
            }
        } catch (exception) {
            next(exception)
        }
    }
    getProductDetailBySlug = async (req,res,next) => {
        try {
            const data = await productSvc.getOneByFilter({ slug:req.params.slug })
            const related = await productSvc.getAllProducts({
                limit: 10, skip: 0, filter: {
                    status: "active",
                    category: data.category,
                    _id:{$ne:data._id}
            }})
            if (!data) {
               throw{code:404, message:"Product doesnot exist"} 
            } else {
                res.json({
                    result: {detail:data,related:related},
                    message: "Product Fetched",
                    meta:null
                })
                
            }
        } catch (exception) {
            next(exception)
        }  
    }
    updateById = async (req, res, next) => {
        try {
            const productDetail = await productSvc.getOneByFilter({ _id: req.params.id });
            if (!productDetail) {
                throw { code: 404, message: "Product not found" };
            }
            const data = productSvc.transformRequest(req, true);
            if (!data.images) {
                data.images = productDetail.images;
            }
            const success = await productSvc.updateProduct(req.params.id, data);
            if (!success) {
                throw { code: 400, message: "Problem while updating Product" };
            }
            res.json({
                result: success,
                message: "Product Updated Successfully",
                meta: null
            });
        } catch (exception) {
            console.log('Product updated', exception);
            next(exception);
        }
    };
    deleteById = async (req, res, next) => {
        try {
            let response = await productSvc.deleteById(req.params.id)
            res.json({
                result: response,
                message: "Product  deleted successfully",
                meta:null
            })
        } catch (exception) {
            console.log('Product deleted', exception)
            next(exception)
        }
    }
    listForHome = async (req, res, next) => {
        try {
       
            const data = await productSvc.getAllProducts({
                limit: 10,
                skip: 0,
                filter: {
                    status:"active"
                }
            })
            if (!data || data.length<=0) {
                throw{code:400,message:"Empty Product List"}
            }
            res.json({
                result: data,
                message: "Product Fetched",
                meta: null
            })
        } catch (exception) {
            console.log(exception)
            next(exception)
        } 
    }
    getProductsByBrand = async(req,res,next) => {
        try {
            let brandDetail = await brandSvc.getOneByFilter({
                slug:req.params.brandslug
            })
            if (!brandDetail) {
                throw{code:400,message:"Brand does not exist"}
            }
            const query = req.query;
            let limit = +query.limit || 10
            let page = +query.page || 1
            let skip = 0;
            if (page > 1) {
                skip = (page-1)*limit
            }
            let filter = {};
            if (query.search) {
                filter = {
                    title:new RegExp(query.search,'i')

                }
            }
            filter = {
               ...filter,
                brand: brandDetail._id,
            status:"active"
            }
            
            const count = await productSvc.getCount(filter);
            const data = await productSvc.getAllProducts({
                limit: limit,
                skip: skip,
                filter:filter
            })
            res.json({
                result: data,
                message: "Product Fetched",
                meta: {
                    currentPage: page,
                    total: count,
                    limit:limit
                }
            })

        } catch (exception) {
            console.log(exception)
            next(exception)
        }
    }
    getProductsByCategory = async(req,res,next) => {
        try {
            let categoryDetail = await categorySvc.getOneByFilter({
                slug:req.params.categoryslug
            })
            if (!categoryDetail) {
                throw{code:400,message:"Brand does not exist"}
            }
            const query = req.query;
            let limit = +query.limit || 10
            let page = +query.page || 1
            let skip = 0;
            if (page > 1) {
                skip = (page-1)*limit
            }
            let filter = {};
            if (query.search) {
                filter = {
                    title:new RegExp(query.search,'i')

                }
            }
            filter = {
               ...filter,
                category: categoryDetail._id,
            status:"active"
            }
            
            const count = await productSvc.getCount(filter);
            const data = await productSvc.getAllProducts({
                limit: limit,
                skip: skip,
                filter:filter
            })
            res.json({
                result: data,
                message: "Product Fetched",
                meta: {
                    currentPage: page,
                    total: count,
                    limit:limit
                }
            })

        } catch (exception) {
            console.log(exception)
            next(exception)
        }
    }

}
const productCtrl = new ProductController()
module.exports = productCtrl;