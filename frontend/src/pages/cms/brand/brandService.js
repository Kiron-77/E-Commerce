import HttpService from "../../../config/http.service"

class BrandService extends HttpService{
    listAllbrands = async({page=1,limit=15,search=null}) => {
        try {
            let queryString =`page=${page}&limit=${limit}`
            if (search) {
             queryString += '&search'+search 
          }
            const response = await this.getRequest('/v1/brand?' + queryString,{auth:true})
            return response
      } catch (exception) {
        throw exception
      }  
    }

    createBrand = async(data) => {
        try {
            let response = await this.postRequest('/v1/brand', data, {
                auth: true,
                file:true
            }) 
            return response
        } catch (exception) {
            throw exception
        }
    }
    deleteById = async (id) => {
        try {
            const response = await this.deleteRequest('/v1/brand/' + id, { auth: true })
          return response  
        } catch (exception) {
            throw exception
        }
    }
    getBrandById = async (id) => {
        try {
            const response = await this.getRequest('/v1/brand/' + id,{auth:true})
            return response
        } catch (exception) {
            throw exception
        }
    }
    updateBrandById = async (id,data) => {
        try {
            const response = await this.putRequest('/v1/brand/' + id,data,{ auth: true,file:true })
           return response 
        } catch (exception) {
            throw exception
        }
    }
    getBrandForHomePage = async () => {
        try {
            const response = await this.getRequest('/v1/brand/home');
            return response
        } catch (exception) {
            throw exception
        }
    }
    getBrandDetail = async (slug) => {
        try {
            const response = await this.getRequest('/v1/product/'+slug+'/bybrand')
                return response
        } catch (exception) {
            throw exception
        }
    }
}
const brandSvc = new BrandService()
export default brandSvc