import HttpService from "../../config/http.service";

class AuthService extends HttpService{
    login = async(data) => {
        try {
            const loginResponse = await this.postRequest(
                '/v1/auth/login',
                data
            )
            if (loginResponse) {
                localStorage.setItem("_au", loginResponse.result.token)
                localStorage.setItem("_ud",JSON.stringify(loginResponse.result.userDetail))
            }
            return loginResponse
        } catch (exception) {
            throw exception
        }
    }
    logout = async (data) => {
        try {
            const logoutResponse = await this.getRequest('/v1/auth/logout', data)
            if (logoutResponse) {
                localStorage.removeItem('au')
                localStorage.removeItem('ud')
            }
            return logoutResponse
        } catch (exception) {
            throw exception
        }
    }
    register = async (data) => {
        try {
            let registerResponse = await this.postRequest(
                '/v1/auth/register',
                data,
                {file:true}
            )
           return registerResponse 
        } catch (exception) {
            throw exception
        }
    }
    verifyToken = async(token) => {
        try {
            const response = await this.getRequest('/v1/auth/verify/'+token)
            return response;
        } catch (exception) {
            throw exception
        }
    }
    setActivationPassword = async (data, token) =>{
        try {
            const response = await this.postRequest('/v1/auth/activation/'+ token,data)
            return response;
        } catch (exception) {
            throw exception
        }
    }
    getLoggedInUserDetail = async () => {
        try {
            const userDetail = await this.getRequest('/v1/auth/me', { auth: true })
            return userDetail
        } catch (exception) {
            throw exception
        }
    }
    sendEmailforgetPassword = async (email) => {
        try {
            const sendMail = await this.postRequest('/v1/auth/forget-password', { email })
            return sendMail
        } catch (exception) {
            throw exception
            
        }
    }
    verifyForgetPasswordToken = async(token) => {
        try {
            const response = await this.getRequest('/v1/auth/verify-password-token/'+token)
            return response;
        } catch (exception) {
            throw exception
        }
    }
    setForgetPassword = async (data, token) =>{
        try {
            const response = await this.postRequest('/v1/auth/set-password/'+ token,data)
            return response;
        } catch (exception) {
            throw exception
        }
    }
    getAllUserDetail = async (data) => {
        try {
            const response = await this.getRequest('/v1/user',data)
            return response
        } catch (exception) {
            throw exception
        }
    }
    getUserById = async (id) => {
        try {
            const response = await this.getRequest('/v1/user/' + id, { auth: true })
            return response
        } catch (exception) {
            throw exception
        }
    }
    updateUserById = async (id,data) => {
        try {
            const response = await this.putRequest('/v1/user/',+ id,data,{auth:true})
            return response
        } catch (exception) {
            throw exception
        }
    }
    deleteById = async (id) => {
        try {
            const response = await this.deleteRequest('/v1/user/', +id, { auth: true })
            return response
        } catch (exception) {
            throw exception
        }
    }
    getUserForHome = async () => {
        try {
            const response = await this.getRequest('/v1/user/home')
            return response
        } catch (exception) {
            throw(exception)
        }
    }

}
const Authsvc = new AuthService()
export default Authsvc