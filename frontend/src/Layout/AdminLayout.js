import React from 'react'
import { useSelector } from 'react-redux'
import '../App.css'
import AdminFooter from '../components/admin/footer/AdminFooter'
import AdminHeader from '../components/admin/header/AdminHeader'
import AdminSidebar from '../components/admin/sidebar/AdminSidebar'

const AdminLayout =()=>{
    let loggedInuser = useSelector((root) => {
        return root?.User?.user
    })

    return (<>
        <div>
            < AdminHeader />
            <AdminSidebar />
            <AdminFooter />
        </div>
    </>)
}

export default AdminLayout
