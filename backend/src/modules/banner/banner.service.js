const BannerModel = require("./banner.model")

class BannerService {
    transformRequest = (req, isEdit = false) => {
        const data = {
            ...req.body
        }
        if (!isEdit && !req.file) {
            throw { code: 422, message: "Image is required", result: { image: "Image is required" } }
        } else {
            if (req.file) {
                data.image = req.file.filename
            }
        }
        if (!isEdit) {
            data.createdBy = req.authUser._id
        } else {
            data.updatedBy = req.authUser._id
        }
        return data
    }
    createBanner = async (data) => {
        try {
            const banner = new BannerModel(data)
            return await banner.save()
        } catch (exception) {
            throw exception
        }
    }
    updateBanner = async (id, data) => {
        try {
            let status = await BannerModel.findByIdAndUpdate(id, {
                $set: data
            })
            return status
        } catch (exception) {
            throw exception
        }
    }
    getCount = async (filter = {}) => {
        const count = await BannerModel.countDocuments(filter)
        return count
    }
    getOneByFilter = async (filter) => {
        try {
            const data = await BannerModel.findOne(filter)
                .populate("createdBy", ["_id", "name", "role"])
                .populate("updatedBy", ["_id", "name", "role"])
            return data
        } catch (exception) {
            throw exception
        }
    }
    getAllBanners = async ({ limit = 10, skip = 0, filter = {} }) => {
        try {
            let data = await BannerModel.find(filter)
                .populate("createdBy", ["_id", "name", "role"])
                .populate("updatedBy", ["_id", "name", "role"])
                .skip(skip)
                .limit(limit)
            return data
        } catch (exception) {
            throw exception
        }
    }
    deleteById = async (id) => {
        try {
            let response = await BannerModel.findByIdAndDelete(id)
            if (!response) {
                throw { code: 404, message: "Banner doesnot exist or already deleted" }
            } else {
                return response
            }
        } catch (exception) {
            throw exception
        }
    }
}
const bannerSvc = new BannerService()
module.exports = bannerSvc