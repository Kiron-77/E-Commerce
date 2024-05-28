
import React, { useEffect, useState } from 'react';
import { IoClose } from "react-icons/io5";
import { toast } from 'react-toastify';
import ROLE from '../../../components/common/Role';
import Authsvc from '../../servicepage/auth.service';



const EditUser = ({
    name,
    email,
    role,
    _id,
    onClose,
    callFunc
}) => {
    const [userRole, setUserRole] = useState(role)
    const handleOnSelect = (e) => {
        setUserRole(e.target.value)
        console.log(e.target.value)
    }
    const updateUserRole = async (data) => {
        try {
            if (userRole !== null) {
                const response = await Authsvc.updateUserById(_id, { role: userRole })
                const responseData = await response.json()
                console.log(responseData)
                if (responseData.success) {
                    toast.success(responseData.message)
                    onClose()
                    callFunc()
                }
                else {
                    toast.error(responseData.message)
                }
                const user = responseData.data.result
                setUserRole(user.role)

            }
        } catch (exception) {
            console.log("Error fetching data", exception)
        }
    }
    useEffect(() => {
        updateUserRole(); // Fetch user data on component mount
    }, [_id]); // Only fetch data when _id changes
    return (<>

        <div className='fixed top-0 bottom-0 left-0 w-full h-full z-10 flex justify-between items-center bg-slate-200 bg-opacity-50'>
            <div className='mx-auto bg-white shadow-md p-4 w-full max-w-sm'>
                <button className='block ml-auto' onClick={onClose}>
                    <IoClose />
                </button>
                <h1 className='pb-4 text-lg font-medium'>Change Users Details</h1>
                <p>Name:{name}</p>
                <p>Email:{email}</p>
                <div className='flex items-center justify-between my-4'>
                    <p>Role</p>
                    <select className='border px-4 py-1' value={userRole} onChange={handleOnSelect}>
                        {
                            Object.values(ROLE).map(el => {
                                return (
                                    <option value={el} key={el}>{el}</option>
                                )
                            })
                        }
                    </select>

                </div>
                <button className='w-fit mx-auto block py-1 px-3 rounded-full bg-red-600 text-white hover:bg-red-700' onClick={updateUserRole}>Change Role</button>
            </div>
        </div>
      
    </>)
}

export default EditUser





// import { yupResolver } from "@hookform/resolvers/yup"
// import { useEffect, useState } from "react"
// import { useForm } from "react-hook-form"
// import { IoClose } from "react-icons/io5"
// import { useNavigate, useParams } from "react-router-dom"
// import { toast } from "react-toastify"
// import * as Yup from "yup"
// import AdminBreadCrumb from '../../../components/admin/braedcrumb/Breadcrumb'
// import { SelectDropdownComponent } from "../../../components/common/input.component"
// import Authsvc from "../../servicepage/auth.service"


// const UserEdit = ({onClose,name,email}) => {
//     const [userDetail,setUserDetail] = useState()
//     const [defaultSel, setDefaultSel] = useState()
//     const [openUpdateUser, setOpenUpdatUser] = useState(false)
//     const params = useParams()
//     const [updateUserDetail, setUpdateUserDetail] = useState({ name: "", email: "", role: "" })
//     const selectRule = Yup.object({
//         role: Yup.object({
//             label: Yup.string().matches(/^(Seller|Customer)$/),
//             value: Yup.string().matches(/^(seller|customer)$/)
//         }).required()
//     })
//     const { control, handleSubmit, setValue, setError, formState: { errors } } = useForm({
//         resolver:yupResolver(selectRule)
//     })
//     const [loading, setLoading] = useState(false)
//     const navigate = useNavigate()

//     const submitForm = async (data) => {
//         try {
//             setLoading(true)
//             const formatted = {
//                 ...data,
//                 status:data.status.value
//             }
//             console.log(formatted)
//             const response = await Authsvc.updateUserById(params.id, formatted)
//             console.log(response)
//             toast.success("User edited successfully")
//             navigate('/admin/user')
//         } catch (exception) {
//             toast.error("User can not be updated at this moment")
//         } finally {
//             setLoading(false)
//         }
//     }
//     const getUserDetail = async () => {
//         try {
//             const response = await Authsvc.getUserById(params.id)
//             setUserDetail(response.result)
//         } catch (exception) {
//             console.log(exception)
//         }
//     }
//     useEffect(() => {
//         getUserDetail()
//     }, [params])
//     return (<>
//            <div className="container-fluid px-4">
//             <h1 className="mt-4">User Edit</h1>
//             <AdminBreadCrumb
//                 data={[
//                     {
//                         title: "Home",
//                         link: "/"
//                     },
//                     {
//                         title: "Dashboard",
//                         link: "/admin"
//                     },
//                     {
//                         title: "User List",
//                         link: "/admin/user"
//                     },
//                     {
//                         title: "User Edit",
//                         link: null
//                     }
//                 ]}
//             />
//             <div className='fixed top-0 bottom-0 left-0 w-full h-full z-10 flex justify-between items-center bg-slate-200 bg-opacity-50'>
//              <div className='mx-auto bg-white shadow-md p-4 w-full max-w-sm'>
//                  <button className='block ml-auto' onClick={onClose}>
//                      <IoClose />
//                  </button>
//                  <h1 className='pb-4 text-lg font-medium'>Change Users Role:</h1>
//                 <p>Name:{name}</p>
//                 <p>Email:{email}</p>
//                 <div className='flex items-center justify-between my-4'>
//                 <p>Role:</p>
//                         <form onSubmit={handleSubmit(submitForm)}>
//                             {
//                                 defaultSel ? <>
//                                     <SelectDropdownComponent
//                                         errMsg={errors?.role?.message}
//                                         name={"role"}
//                                         defaultValue={defaultSel}
//                                         options={
//                                             [
//                                                 { label: "Admin", value: "admin" },
//                                                 { label: "Seller", value: "seller" },
//                                                 { label:"Customer",value:"customer"}
//                                             ]
//                                         }
//                                         setValue={setValue}
//                                     /></> : <></>
//                             }
//                             <button disabled={loading} className='w-fit mx-auto block py-1 px-3 rounded-full bg-red-600 text-white hover:bg-red-700'>Change Role</button>
//                 </form>

//                     </div>
//                 </div>
//         </div>
//         </div>
   
        
//     </>)
// }

// export default UserEdit