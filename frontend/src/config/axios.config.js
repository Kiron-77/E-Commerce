import axios from "axios";
import { toast } from "react-toastify";

const axiosInstance = axios.create({
    // baseURL: import.meta.env.VITE_API_URL,
    baseURL:process.env.REACT_APP_API_URL ,
    timeout: 30000,
    responseType: "json",
    timeoutErrorMessage: "Server Time out",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({ })
})
axiosInstance.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (exception) => {
        if (exception.response.status === 401) {
            //To-do
            console.log("I am generator")
            document.location.href = '/login'
        } else if(exception.response.status === 404){
            console.log("404", exception.response.data)
            toast.error("Resources not found")
        } else if (exception.response.status === 403) {
            console.log("403", exception.response.data)
            toast.error("You do not have permission")
        } else {
            throw exception?.response
        }
    }
)


export default axiosInstance