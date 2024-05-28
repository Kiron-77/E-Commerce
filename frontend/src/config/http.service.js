
import axiosInstance from "./axios.config";

class HttpService{
    #headers;
    getHeaders = (config) => {
        if (config && config.auth) {
            let token =localStorage.getItem("_au")||null;
            this.#headers = {
                ...this.#headers,
                "Authorization":"Bearer "+token
            }
        }
        if (config && config.file) {
            this.#headers = {
                ...this.#headers,
                "Content-Type":"multipart/form-data"
            }
        }
    }
    getRequest = async (url, config = null) => {
        try {
            this.getHeaders(config)
            const response = await axiosInstance.get(url,{
                headers: {
                ...this.#headers
                }
            })
            return response
        } catch (exception) {
            console.log(exception)
            throw exception
        }  
     }
    postRequest = async(url, data=null, config = null) => {
        try {
            this.getHeaders(config)
            const response = await axiosInstance.post(url, data, {
                headers: {
                ...this.#headers
                }
            })
            return response
        } catch (exception) {
            throw exception
        }
    }
    putRequest = async (url, data = null, config = null) => {
        try {
            this.getHeaders(config)
            const response = await axiosInstance.put(url, data, {
                headers: {
                ...this.#headers
                }
            })
            return response
        } catch (exception) {
            throw exception
        } 
    }
    deleteRequest = async (url, config = null) => {
        try {
            this.getHeaders(config)
            const response = await axiosInstance.delete(url, {
                headers: {
                ...this.#headers
                }
            })
            return response
        } catch (exception) {
            throw exception
        }
    }
    
}
export default HttpService