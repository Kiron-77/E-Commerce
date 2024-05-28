const slugify = require("slugify");
const CategoryModel = require("./category.model");

class CategoryService {
    transformRequest = (req, isEdit = false) => {
        const data = {
            ...req.body,  //title,status,url,image,createdBy
            image: null
        }
        if (!isEdit && !req.file) {
            throw { code: 422, message: "Image is required", result: { image: "Image is required" } }
        } else {
            if (req.file) {
                data.image = req.file.filename;
            }
        }
        if (data.subCategory === 'null' || data.subCategory === '') {
            data.subCategory = null;
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
    createCategory = async(data)=>{
        try{
            const category = new CategoryModel(data)
            return await category.save()
        }catch(exception){
            throw exception;
        }
    }
    updateCategory = async(id,data) => {
        try {
            let status = await CategoryModel.findByIdAndUpdate(id, {
               $set:data
            }) 
            return status;
        } catch (exception) {
            throw exception
        }
    }
    getCount = async(filter = {}) => {
        const count = await CategoryModel.countDocuments(filter) 
        return count;
    }
    getOneByFilter = async (filter) => {
        try {
            const data = await CategoryModel.findOne(filter)
            .populate("subCategory",['_id','title'])
            .populate("createdBy",["_id","name","role"])
            .populate('updatedBy', ["_id", "name", "role"])
            return data;
        } catch (exception) {
            throw exception
        }
    }
    getAllCategories = async({limit=10,skip=0,filter={}}) => {
        try {
            let data = await CategoryModel.find(filter)
            .populate("subCategory",['_id','title'])
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
            let response = await CategoryModel.findByIdAndDelete(id) 
            if (!response) {
                throw{code:404,message:"Category doesnot exist or already deleted"}
            } else {
                return response;
            }
        } catch (exception) {
            throw exception
        }
    }

}
const categorySvc = new CategoryService()
module.exports = categorySvc;