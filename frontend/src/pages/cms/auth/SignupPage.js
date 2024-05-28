import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import * as Yup from "yup";
import loginIcons from '../../../asset/signin.gif';
import imagebase64 from '../../../components/common/helper';
import { EmailInputComponent, SelectDropdownComponent, TextAreaInputComponent, TextInputComponent } from '../../../components/common/input.component';
import LoadingSpinner from '../../../components/common/loading.component';
import Authsvc from '../servicepage/auth.service';

const SignupPage = () => {

    const registerSchema = Yup.object({
        name: Yup.string().min(2, "Name should be of at least 2 character long").max(30).required(),
        email: Yup.string().email().required("Email is required field"),
        address: Yup.string().min(2).max(150).required(),
        role: Yup.object({
            label: Yup.string().matches(/^(Seller|Customer)$/, 'role should be either customer or seller'),
            value: Yup.string().matches(/^(seller|customer)$/, 'role should be either customer or seller'),
        }, "Role should be provided").required("Role is compulsory"),
        phone: Yup.string().required("Phone is reqired filed"),
        image: Yup.object().optional().nullable()
    })

    const [profilePic, setProfilePic] = useState(null)
    const handleUploadPic = async (e) => {
        const file = e.target.files[0]

        const imagePic = await imagebase64(file)
        console.log("imagePic", imagePic)
        setProfilePic(imagePic)

    }
    const { handleSubmit, control, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(registerSchema)
    })
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const options = [
        { label: 'Customer', value: 'customer' },
        { label: 'Seller', value: 'seller' }
    ]

    const submitForm = async (data) => {
        setLoading(true)
        try {
            const formattedData = {
                ...data,
                role: data.role.value,
                image: profilePic
            }
            const resolve = await Authsvc.register(formattedData)
            toast.success("Your account has been registered successfully.Please check your email for further step.")
            navigate("/")
            console.log(resolve)
            console.log(formattedData)
        } catch (exceptiton) {
            console.log("Error registration", exceptiton)
            toast.error(exceptiton?.data?.message)
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
            <section id='signup'>
                <div className='max-auto container p-4'>
                    <div className='bg-slate-300 p-5 py-6 w-full max-w-md mx-auto rounded-md '>
                        <div className='w-20 h-20 mx-auto relative overflow-hidden rounded-full'>
                            <div>
                                <img src={profilePic || loginIcons} alt='login icons' />
                            </div>
                            <form onSubmit={handleSubmit(submitForm)}>
                                <label>
                                    <div className='text-xs bg-opacity-80 bg-slate-200 pb-5 pt-2 cursor-pointer rounded-md text-center absolute bottom-0 w-full'>
                                        Upload Photo
                                    </div>
                                    <input type='file' className='hidden' onChange={handleUploadPic} required />
                                </label>
                            </form>
                        </div>

                        <form className='pt-5 flex flex-col gap-2' onSubmit={handleSubmit(submitForm)}>
                            < div className='grid gap-2'>
                                <label className="">Full Name:</label>
                                <div className='bg-slate-100 p-2 '>
                                    <TextInputComponent
                                        name={"name"}
                                        errMsg={errors?.name?.message}
                                        control={control}
                                    />
                                </div>
                                <label>Email:</label>
                                <div className='bg-slate-100 p-2 '>
                                    <EmailInputComponent
                                        name={"email"}
                                        errMsg={errors?.email?.message}
                                        control={control}
                                    />
                                </div>
                                <label>Phone:</label>
                                <div className='bg-slate-100 p-2'>
                                    <TextInputComponent
                                        name={"phone"}
                                        errMsg={errors?.phone?.message}
                                        control={control}
                                    />
                                </div>
                                <label className="col-sm-3">Address:</label>
                                <div className='bg-slate-100 p-2'>
                                    <TextAreaInputComponent
                                        name={"address"}
                                        control={control}
                                        errMsg={errors?.address?.message}
                                    />
                                </div>
                                <label className="col-sm-3">Role:</label>
                                <div className='bg-slate-100 p-2 flex'>
                                    <SelectDropdownComponent
                                        name={"role"}
                                        control={control}
                                        errMsg={errors?.role?.message}
                                        setValue={setValue}
                                        options={options}
                                    />
                                </div>
                            </div>

                            <button disabled={loading} className='bg-red-600 hover:bg-red-700 text-white px-6 py-2 w-full max-w-[150px] rounded-full hover:scale-110 transition-all mx-auto block mt-6'>Sign Up</button>
                        </form>
                        <p className='my-5'>Already have an Account ?{' '} <Link to={'/login'} className='text-blue-700 hover:text-red-700 hover:underline'>Login</Link></p>
                    </div >
                </div >

            </section >
        </>
        }
    </>)
}

export default SignupPage
