import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from "react-redux";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from "yup";
import loginIcons from '../../../asset/logo.svg';
import { EmailInputComponent, PasswordInput } from '../../../components/common/input.component';
import LoadingSpinner from '../../../components/common/loading.component';
import { setLoggedInUser } from '../../../reducers/user.reducer';
import Authsvc from '../servicepage/auth.service';
const LoginPage = () => {
    const navigate = useNavigate()

    const schema = Yup.object({
        email: Yup.string().email("Invalid email format").required("Email is required"),
        password: Yup.string().required("Password is required")

    })
    const [loading, setLoading] = useState(false)
    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    })
    const dispatch = useDispatch()
    const submitForm = async (data) => {
        setLoading(true)
        try {
            const loginData = await Authsvc.login(data);
            dispatch(setLoggedInUser(loginData.result.userDetail))
            console.log(loginData)
            toast.success(`Welcome to ${loginData.result.userDetail.role} Panel`)
            let redirectUrl = "/" + loginData.result.userDetail.role;
            if (localStorage.getItem("_redirectUrl")) {
                redirectUrl = localStorage.getItem('_redirectUrl')
                localStorage.removeItem("_redirectUrl")
            }
            // setTimeout(() => {
            //     navigate(redirectUrl)
            // },1000)
            navigate(redirectUrl)
            // navigate("/"+loginData.result.userDetail.role)
        } catch (exception) {
            console.log(exception)
            toast.error(exception?.data?.message)
        }
        finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        const token = localStorage.getItem("_au") || null
        if (token) {
            const userDetail = JSON.parse(localStorage.getItem("_ud")) || null
            if (userDetail) {
                navigate("/" + userDetail.role)
            }
        }
    }, [])
    return (<>
        {loading ? <LoadingSpinner /> : <>
            <section id='login'>
                <div className='max-auto container p-4'>
                    <div className='bg-slate-300 p-5 py-6 w-full max-w-md mx-auto rounded-md'>
                        <div className='w-20 h-20 mx-auto overflow-hidden rounded-full'>
                            <img src={loginIcons} alt='login icons' />
                        </div>
                        <form className='pt-6 flex flex-col gap-3' onSubmit={handleSubmit(submitForm)}>
                            <div className='grid'>
                                <label>Email:</label>
                                <div className='bg-slate-100 p-2'>
                                    <EmailInputComponent
                                        name={"email"}
                                        errMsg={errors?.email?.message}
                                        control={control}
                                    />
                                </div>
                            </div>
                            <div>
                                <label>Password:</label>
                                <div className='bg-slate-100 p-2 flex'>
                                    <PasswordInput
                                        name={"password"}
                                        control={control}
                                        errMsg={errors?.password?.message}
                                        className='w-full h-full outline-none bg-transparent'
                                    />
                                </div>
                                <Link to={'/forget-password'} className='block w-fit ml-auto mt-3 text-blue-700 hover:text-red-700 hover:underline'>
                                    Forget Password ?
                                </Link>
                            </div>
                            <button className='bg-red-600 hover:bg-red-700 text-white px-6 py-2 w-full max-w-[150px] rounded-full hover:scale-110 transition-all mx-auto block mt-6'>Login</button>
                        </form>
                        <p className='my-5'>Don't have an Account ? <Link to={"/sign-up"} className='text-blue-700 hover:text-red-700 hover:underline'>Sign-up</Link></p>
                    </div>
                </div>
            </section>
        </>}

    </>
    )
}
export default LoginPage
