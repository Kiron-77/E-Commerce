const bannerSvc = require("./banner.service")

class BannerController {
    createBanner = async (req, res, next) => {
        try {
            const data = bannerSvc.transformRequest(req)
            const success = await bannerSvc.createBanner(data)
            res.json({
                result: success,
                message: "Banner stored successfully",
                meta: null
            })
        } catch (exception) {
            console.log("Banner Create", exception)
            next(exception)
        }
    }
    listAllBanners = async (req, res, next) => {
        try {
            const query = req.query;
            let limit = +query.limit || 10
            let page = +query.page || 1
            let skip = 0
            if (page > 1) {
                skip = (page - 1) * limit
            }
            let filter = {}
            if (query.search) {
                filter = {
                    title: new RegExp(query.search, i)
                }
            }
            const count = await bannerSvc.getCount(filter)
            const data = await bannerSvc.getAllBanners({
                limit: limit,
                skip: skip,
                filter: filter
            })
            res.json({
                result: data,
                message: "Banner Fetched",
                meta: {
                    currentPage: page,
                    total: count,
                    limit: limit
                }
            })
        } catch (exception) {
            console.log(exception)
            next(exception)
        }
    }
    getBannerDetail = async (req, res, next) => {
        try {
            const data = await bannerSvc.getOneByFilter({ _id: req.params.id })
            if (!data) {
                throw { code: 404, message: "Banner doesnot exist" }
            } else {
                res.json({
                    result: data,
                    message: "banner fetched",
                    meta: null
                })
            }
        } catch (exception) {
            console.log(exception)
            next(exception)
        }
    }
    updateById = async (req, res, next) => {
        try {
            const bannerDetail = await bannerSvc.getOneByFilter({ _id: req.params.id })
            if (!bannerDetail) {
                throw { code: 404, message: "banner not found" }
            }
            const data = bannerSvc.transformRequest(req, true)
            if (!data.image) {
                data.image = bannerDetail.image
            }
            const success = await bannerSvc.updateBanner(req.params.id, data)
            if (!success) {
                throw { code: 400,message: "Problem while updating Banner"}
            }
            res.json({
                result: success,
                message: "Banner Updated Successfully",
                meta: null
            })
        } catch (exception) {
            console.log('Banner Updated', exception)
            next(exception)
        }
    }
    deleteById = async (req, res, next) => {
        try {
            let response = await bannerSvc.deleteById(req.params.id)
            res.json({
                result: response,
                message: "Banner deleted successfully",
                meta: null
            })
        } catch (exception) {
            console.log("Banner deleted", exception)
            next(exception)
        }
    }
    listForHome = async (req, res, next) => {
        try {
            const data = await bannerSvc.getAllBanners({
                limit: 10,
                skip: 0,
                filter: {
                    status: "active"
                }
            })
            if (!data || data.length <= 0) {
                throw { code: 400, message: "Empty Banner List" }
            }
            res.json({
                result: data,
                message: "Banner Fetched",
                meta: null
            })
        } catch (exception) {
            console.log(exception)
            next(exception)
        }
    }
}
const bannerCtrl = new BannerController()
module.exports = bannerCtrl