const slugify = require("slugify");
const ProductModel = require("./product.model");

class ProductService {
    transformRequest = (req, isEdit = false) => {
        const data = {
            ...req.body,  //title,status,url,image,createdBy
        }
        if (!isEdit && !req.files) {
            throw { code: 422, message: "Image is required", result: { image: "Image is required" } }
        } else {
            if (req.files) {
                data.images = req.files.map((item)=>item.filename)
            }
        }
        if (data.category === 'null' || data.category === '') {
            data.category = null;
        } else {
            // "id,id,id"
            data.category = data.category.split(",")
        }
        data.afterDiscount = data.price - data.price * data.discount / 100

        if (data.seller === 'null' || data.seller === '') {
            data.seller = null;
        }
        if (data.brand === 'null' || data.brand === '') {
            data.brand = null;
        }
        if (data.featured === 'true' || data.featured === 1) {
            data.featured = true;
        } else {
            data.featured = false
        }
        
        if (!isEdit) {
            data.slug = slugify(data.title, {
                replacement: "-",
                lower: true
            });
            data.createdBy = req.authUser._id
        }else{
            data.updatedBy = req.authUser._id
        }
        return data;
    }
    createProduct = async(data)=>{
        try{
            const product = new ProductModel(data)
            return await product.save()
        }catch(exception){
            throw exception;
        }
    }
    updateProduct = async(id,data) => {
        try {
            let status = await ProductModel.findByIdAndUpdate(id, {
               $set:data
            }) 
            return status;
        } catch (exception) {
            throw exception
        }
    }
    getCount = async(filter = {}) => {
        const count = await ProductModel.countDocuments(filter) 
        return count;
    }
    getOneByFilter = async (filter) => {
        try {
            const data = await ProductModel.findOne(filter)
            .populate("brand", ["_id", "title"])
            .populate("seller",["_id","name"])
            .populate("category", ['_id', 'title'])
            .populate("createdBy",["_id","name","role"])
            .populate('updatedBy', ["_id", "name", "role"])
            return data;
        } catch (exception) {
            throw exception
        }
    }
    getAllProducts = async({limit=10,skip=0,filter={}}) => {
        try {
            let data = await ProductModel.find(filter)
            .populate("brand", ["_id", "title","slug"])
            .populate("seller",["_id","name"])
            .populate("category", ['_id', 'title',"slug"])
            .populate("createdBy",["_id","name","role"])
            .populate('updatedBy',["_id","name","role"])
            .sort({ "_id": "desc" })
            .skip(skip)
            .limit(limit)
            return data;
        } catch (exception) {
            throw exception
        }
    }
    deleteById = async (id) => {
        try {
            let response = await ProductModel.findByIdAndDelete(id) 
            if (!response) {
                throw{code:404,message:"Product doesnot exist or already deleted"}
            } else {
                return response;
            }
        } catch (exception) {
            throw exception
        }
    }
}

const productSvc = new ProductService();
module.exports = productSvc;
