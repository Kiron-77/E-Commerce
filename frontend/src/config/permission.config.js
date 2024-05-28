import React, { useEffect, useState, } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import LoadingSpinner from '../components/common/loading.component'
import Authsvc from '../pages/servicepage/auth.service'

const CheckPermission = ({ accessBy, children }) => {
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    const getLoggedInUser = async () => {
        try {
            const userDetail = await Authsvc.getLoggedInUserDetail()
            if (!userDetail) {
                localStorage.removeItem("_au")
                localStorage.removeItem("_ud")
                toast.error("Invalid Token")
                navigate("/login")
            } else {

                if (userDetail.result.role === accessBy) {
                    setLoading(false)
                } else {
                    toast.warn("You do not have previledge to access this pannel")
                    navigate("/" + userDetail.result.role)
                }
            }
        } catch (exception) {
            console.log(exception)
            toast.error("Something went wrong!!")
            navigate("/")
        }
    }
    useEffect(() => {
        let token = localStorage.getItem("_au") || null
        if (token) {
            getLoggedInUser(token)
        } else {
            toast.error("Please login to access")
            navigate("/login")
        }
    }, [])
    return (<>
        {
            loading ? <LoadingSpinner/> : children
        }
    </>)
}

export default CheckPermission
