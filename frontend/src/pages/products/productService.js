

import HttpService from "../../config/http.service"

class ProductService extends HttpService{
    listAllProducts = async ({ page = 1, limit = 15, search = null }) => {
        try {
            let queryString = `page=${page}&limit=${limit}`
            if (search) {
                queryString +='&search'+search
            }
            const response = await this.getRequest('/v1/product?' + queryString, { auth: true })
            return response
        } catch (exception) {
            throw exception
        }
    }
    uploadProduct = async (data) => {
        try {
            let response = await this.postRequest('/v1/product', data, {
                auth: true,
                file:true
            })
            return response
        } catch (exception) {
            throw exception
        }
    }
    deleteProductById = async (id) => {
        try {
            const response = await this.deleteRequest('/v1/product/' + id, { auth: true })
            return response
        } catch (exception) {
            throw exception
        }
    }
    getProductById = async (id) => {
        try {
            const response = await this.getRequest('/v1/product/' + id, { auth: true })
            return response
        } catch (exception) {
            throw exception
        }
    }
    updateProductById = async (id, data) => {
        try {
            const response = await this.putRequest('/v1/product/' + id, data, { auth: true, file: true })
            return response
        } catch (exception) {
            throw exception
        }
    }
    getProductForHome = async () => {
        try {
            const response = await this.getRequest('/v1/product/home')
            return response
        } catch (exception) {
            throw exception
        }
    }
    getProductDetailBySlug = async (slug) => {
        try {
            const response = await this.getRequest('/v1/product/'+slug+'/bySlug')
        return response
        } catch (exception) {
            throw exception
        }       
    }
    getProductDetailByBrand = async (brandslug) => {
        try {
            const response = await this.getRequest('/v1/product/'+brandslug+'/bybrand')
            return response
        } catch (exception) {
            throw exception
        }
    }
    getProductDetailByCategory = async (categoryslug) => {
        try {
            const response = await this.getRequest('/v1/product/'+categoryslug+'/bycategory')
            return response
        } catch (exception) {
            throw exception
        }
    }
}
const productSvc = new ProductService()
export default productSvc