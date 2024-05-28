import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { AiFillDelete } from "react-icons/ai";
import { MdModeEdit } from "react-icons/md";
import { toast } from 'react-toastify';
import "../../../App.css";
import AdminBreadCrumb from '../../../components/admin/braedcrumb/Breadcrumb';
import Authsvc from '../servicepage/auth.service';
import EditUser from './EditUserPage';

const AllUserList = () => {
    const [allUser, setAllUser] = useState([])
    const [updateUserDetail, setUpdateUserDetail] = useState({
        name: "",
        email: "",
        role: "",
        _id: ""
    })
    const [openUpdateUser, setOpenUpdatUser] = useState(false)
    const [deleteUserData, setDeleteUserData] = useState()

    const [loading, setLoading] = useState(true)

    const AllUserDetail = async (data) => {
        try {
            const response = await Authsvc.getAllUserDetail(data);
            setAllUser(response.result)
        } catch (exception) {
            console.error("Error fetching user data:", exception);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {

        AllUserDetail();
    }, [])
    const deleteUser = async (id) => {
        try {
            const response = await Authsvc.deleteById(id)
            toast.success("User deleted successfully")
        } catch (exception) {
            toast.error("User can not be deleted at this moment")
            console.log(exception)
        }
    }
    return (<>
        <div className="container w-full px-4">
            <h1 className=' font-bold text-xl mt-3'>All Users</h1>
            <AdminBreadCrumb
                data={[
                    {
                        title: "Home",
                        link: "/"
                    },
                    {
                        title: "Dashboard",
                        link: "/admin"
                    },
                    {
                        title: "User List",
                        link: null
                    }
                ]}
            />
            <h1 className='text-center items-center justify-center font-bold text-xl mb-2'>All Users Lists</h1>
            <table className='lg:w-full md:full sm:full userTable '>
                <thead className=''>
                    <tr className='bg-slate-500 text-white'>
                        <th className="px-16 py-2">Sn.</th>
                        <th className="px-16 py-2">Name</th>
                        <th className="px-16 py-2">Email</th>
                        <th className="px-16 py-2">Role</th>
                        <th className="px-16 py-2">Created Date</th>
                        <th className="px-16 py-2">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan="5">Loading...</td>
                        </tr>
                    ) : allUser.length > 0 ? (
                        allUser.map((user, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>{moment(user.createdAt).format('ll')}</td>
                                <td>                                
                                    <button className='bg-blue-500 p-2 rounded-full cursor-pointer hover:bg-blue-700 hover:text-white me-1 '
                                        onClick={() => {
                                            setUpdateUserDetail(user)
                                            setOpenUpdatUser(true)
                                        }}
                                    >
                                        <MdModeEdit />
                                    </button>
                                    <button className='bg-red-300 p-2 rounded-full cursor-pointer hover:bg-red-700 hover:text-white mr-10 me-1'
                                        onClick={() => {
                                            setDeleteUserData(deleteUser)
                                        }}
                                    >
                                        <AiFillDelete />
                                    </button> 

                                </td>

                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">No users found</td>
                        </tr>
                    )}
                </tbody>
            </table>
            {
                openUpdateUser && (
                    <EditUser
                        onClose={() => setOpenUpdatUser(false)}
                        name={updateUserDetail.name}
                        email={updateUserDetail.email}
                        role={updateUserDetail.role}
                        callFunc={AllUserDetail}
                    />
                )
            }

        </div>

    </>

    )
}

export default AllUserList

// import moment from 'moment';
// import React, { useEffect, useState } from 'react';
// import { toast } from 'react-toastify';
// import "../../../App.css";
// import TableAction from '../../../components/Table/TableAction';
// import AdminBreadCrumb from '../../../components/admin/braedcrumb/Breadcrumb';
// import Authsvc from '../../servicepage/auth.service';

// const AllUserList = () => {
//     const [allUser, setAllUser] = useState();
//     const [loading, setLoading] = useState(true);

//     const AllUserDetail = async (config) => {
//         try {
//             const response = await Authsvc.getAllUserDetail(config);
//             console.log("API Response:", response); // Log API response
//             if (Array.isArray(response.result) && response.result.length > 0) {
//                 console.log("User Data:", response.message); // Log user data
//                 setAllUser(response.result);
//             } else {
//                 console.error("Invalid API response:", response);
//             }
//         } catch (exception) {
//             console.error("Error fetching user data:", exception);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         AllUserDetail();
//     }, []);

//     const deleteUser = async (id) => {
//         try {
//             const response = await Authsvc.deleteById(id);
//             toast.success("User deleted successfully");
//         } catch (exception) {
//             toast.error("User can not be deleted at this moment");
//             console.log(exception);
//         }
//     }

//     return (
//         <>
//             <div className="container-fluid px-4">
//                 <h1 className=' font-bold text-xl mt-3'>All Users</h1>
//                 <AdminBreadCrumb
//                     data={[
//                         {
//                             title: "Home",
//                             link: "/"
//                         },
//                         {
//                             title: "Dashboard",
//                             link: "/admin"
//                         },
//                         {
//                             title: "User List",
//                             link: null
//                         }
//                     ]}
//                 />
//                 <h1 className='text-center items-center justify-center font-bold text-xl mb-2'>All Users Lists</h1>
//                 <table className='lg:w-full md:full sm:full userTable '>
//                     <thead className=''>
//                         <tr className='bg-slate-500 text-white'>
//                             <th className="px-20 py-2">Sn.</th>
//                             <th className="px-20 py-2">Name</th>
//                             <th className="px-20 py-2">Email</th>
//                             <th className="px-20 py-2">Role</th>
//                             <th className="px-20 py-2">Created Date</th>
//                             <th className="px-16 py-2">Action</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {loading ? (
//                             <tr>
//                                 <td colSpan="5">Loading...</td>
//                             </tr>
//                         ) : allUser.length > 0 ? (
//                             allUser.map((user, index) => (
//                                 <tr key={index}>
//                                     <td>{index + 1}</td>
//                                     <td>{user.name}</td>
//                                     <td>{user.email}</td>
//                                     <td>{user.role}</td>
//                                     <td>{moment(user.createdAt).format('ll')}</td>
//                                     <td>
//                                         <TableAction
//                                             deleteAction={deleteUser}
//                                             id={user._id}
//                                             editUrl={"/admin/user/" + user._id}
//                                         />
//                                     </td>
//                                 </tr>
//                             ))
//                         ) : (
//                             <tr>
//                                 <td colSpan="5">No users found</td>
//                             </tr>
//                         )}
//                     </tbody>
//                 </table>
//             </div>
//         </>
//     );
// }

// export default AllUserList;


