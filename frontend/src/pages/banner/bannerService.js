import HttpService from "../../config/http.service"

class BannerService extends HttpService{
    listAllbanners = async({page=1,limit=15,search=null}) => {
        try {
            let queryString =`page=${page}&limit=${limit}`
            if (search) {
             queryString += '&search'+search 
          }
            const response = await this.getRequest('/v1/banner?' + queryString,{auth:true})
            return response
      } catch (exception) {
        throw exception
      }  
    }

    createBanner = async(data) => {
        try {
            let response = await this.postRequest('/v1/banner', data, {
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
            const response = await this.deleteRequest('/v1/banner/' + id, { auth: true })
          return response  
        } catch (exception) {
            throw exception
        }
    }
    getBannerById = async (id) => {
        try {
            const response = await this.getRequest('/v1/banner/' + id,{auth:true})
            return response
        } catch (exception) {
            throw exception
        }
    }
    updateBannerById = async (id,data) => {
        try {
            const response = await this.putRequest('/v1/banner/' + id,data,{ auth: true,file:true })
           return response 
        } catch (exception) {
            throw exception
        }
    }
    getBannerForHomePage = async () => {
        try {
            const response = await this.getRequest('/v1/banner/home');
            return response
        } catch (exception) {
            throw exception
        }
    }
}
const bannerSvc = new BannerService()
export default bannerSvc