import HttpService from "../../../config/http.service"

class CartService extends HttpService{
    addToCart = async (data) => {
        try {
            const response = await this.postRequest('/v1/cart/create', data, { auth: true })
            return response
        } catch (exception) {
            throw exception
        }
    }
    getMyCart = async () => {
        try {
            const response = await this.getRequest('/v1/cart/list', { auth: true })
            return response
        } catch (exception) {
            throw exception
        }
    }
    removeFromCart = async (id) => {
        try {
            const response = await this.deleteRequest('/v1/cart/'+id, { auth: true })
            return response
        } catch (exception) {
            throw exception
        }
    }
    checkoutCart = async (ids) => {
        try {
            const response = await this.postRequest('/v1/cart/checkout', ids, { auth: true })
            return response
        } catch (exception) {
            throw exception
        }
    }
}
const cartSvc = new CartService();
export default cartSvc;