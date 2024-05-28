import { yupResolver } from '@hookform/resolvers/yup';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from "yup";
import { EmailInputComponent } from '../../components/common/input.component';
import LoadingSpinner from '../../components/common/loading.component';
import Authsvc from '../servicepage/auth.service';

const ForgetPasswordPage = () => {
  const navigate = useNavigate()
  const schema = Yup.object({
    email: Yup.string().email("Invalid email format").required("Email is required")
  })
  const [loading, setLoading] = useState(false)
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver:yupResolver(schema)
  })

  const submitForm = async (data) => {
    setLoading(true)
    try {
    const forgetPasswordForSendMail = await Authsvc.sendEmailforgetPassword(data.email)
    toast.success("Please check your email for reset password.")
    navigate("/activate")
} catch (exceptiton) {
    console.log("Error sending mail", exceptiton)
    toast.error(exceptiton?.data?.message)
} finally {
    setLoading(false)
    }
}
  return (<>
    {
      loading ? <LoadingSpinner/> : <>
        <section id="activate">
          <div className="max-auto container p-4">
            <div className='bg-slate-300 p-5 py-6 w-full max-w-md mx-auto rounded-md'>
              <form className="pt-6 flex flex-col gap-8 " onSubmit={handleSubmit(submitForm)}>
                <div className='grid'>
                  <h1 className='text-center text-gray-600 mb-7 font-bold text-lg'>Enter Your Email</h1>
                  <label>Email:</label>
                  <div className='bg-slate-100 p-2'>
                    <EmailInputComponent
                      name={"email"}
                      errMsg={errors?.email?.message}
                      control={control}
                    />
                  </div>
                </div>

                <div className="flex items-center pb-7" >
                  <button disabled={loading} className='bg-red-600 hover:bg-red-700 text-white px-5 py-2 w-32 rounded-full hover:scale-110 transition-all mx-auto block'>Submit</button>
                </div>
              </form>


            </div>
          </div>
        </section>
      </>
    }
  </>)
}

export default ForgetPasswordPage
