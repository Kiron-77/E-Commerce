import { yupResolver } from "@hookform/resolvers/yup"
import React, { useEffect, useState } from 'react'
import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify"
import * as Yup from "yup"
import { PasswordInput } from "../../../components/common/input.component"
import LoadingSpinner from "../../../components/common/loading.component"
import Authsvc from "../servicepage/auth.service"



const ResetPasswordPage = () => {
  const params = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  const passwordRules = Yup.object({
      password:Yup.string().min(8).max(25).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,25}$/, { message: "Password should be atleast one lowercase uppercase number special character and 8-25 character long." }).required("Password is required"),
      confirmPassword:Yup.string().oneOf([Yup.ref('password'),null],"Password and Confirm Password does not match")
  })

  const { control, handleSubmit, formState: { errors } } = useForm({
      resolver:yupResolver(passwordRules)
  })

  const getVerifyToken = async() => {
      try {
          const response = await Authsvc.verifyForgetPasswordToken(params.token)
          setLoading(false)
          console.log(response)
      } catch (exception) {
          console.log(exception)
          toast.error("Error verifying token")
          navigate('/login')
      }
  }
  useEffect(() => {
     getVerifyToken() 
  }, [])
  const submitForm = async(data) => {
      try {
          let response = await Authsvc.setForgetPassword(data, params.token)
          toast.success(response.message)
          navigate('/login')
      } catch (exception) {
          console.log(exception)
          toast.error("Password can not be updated at this moment.Please contact our admin")
          navigate("/register")
      }
  }
  return (<>
    {
      loading ? <LoadingSpinner/> : <>
      <section id="activate">
        <div className="max-auto container p-4">
          <div className='bg-slate-300 p-5 py-6 w-full max-w-md mx-auto rounded-md '>
            <form className="pt-6 flex flex-col gap-8" onSubmit={handleSubmit(submitForm)}>
                <div>
                <h1 className='text-center text-gray-600 mb-7 font-bold text-lg'>Reset Your Password</h1>
                <label> New Password:</label>
                <div className='bg-slate-100 p-2 flex'>
                  <PasswordInput
                    name={"password"}
                    control={control}
                    errMsg={errors?.password?.message}
                    className='w-full h-full outline-none bg-transparent'
                  />
                </div>
              </div>
              <div>
                <label>Confirm-Password:</label>
                <div className='bg-slate-100 p-2 flex'>
                  <PasswordInput
                    name={"confirmPassword"}
                    control={control}
                    errMsg={errors?.confirmPassword?.message}
                    className='w-full h-full outline-none bg-transparent'
                  />
                </div>
                </div>
                <div className="flex items-center " >
                <button disabled={loading} className='bg-red-600 hover:bg-red-700 text-white px-5 py-2 w-15 max-w-[150px] rounded-full hover:scale-110 transition-all mx-auto block mt-6 ml-28'>Submit</button>
              <button disabled={loading} className='bg-red-600 hover:bg-red-700 text-white px-5 py-2 w-15 max-w-[150px] rounded-full hover:scale-110 transition-all mx-auto block mt-6 mr-28'>Cancel</button>
              </div>
              </form>
          </div>
        </div>
      </section>
      </>
    }
  </>)
}
export default ResetPasswordPage
