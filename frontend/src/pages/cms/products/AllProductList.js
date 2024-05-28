
import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import AdminBreadCrumb from '../../../components/admin/braedcrumb/Breadcrumb'
import productSvc from './productService'


const AllProductList = () => {
    const [openUploadProduct, setOpenUploadProduct] = useState()
    const [allProduct, setAllproduct] = useState([])


    const getAllProducts = async (data) => {
        try {
            const response = await productSvc.listAllProducts(data)
            setAllproduct(response.data)
        } catch (exception) {
            console.log(exception)
        }
    }
    useEffect(() => {
        getAllProducts()
    }, [])
    return (<>
        <div className="container w-full px-4">
            <h1 className=' font-bold text-xl mt-3'>All Product List</h1>
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
                        title: "Product List",
                        link: null
                    }
                ]}
            />
            <div className='bg-slate-500 w-full py-2 px-16 flex justify-between items-center mt-3 ml-8 rounded-md'>
                <h1 className=' text-center items-center justify-center font-bold text-xl mb-2 ml-80'>All Products List</h1>
                <NavLink className='border-2 border-red-500 text-red-600 hover:bg-red-600 hover:text-white transition-all py-1 px-3 rounded-full ml-56' to={"/admin/product/upload"}>
                    Upload Product
                </NavLink>
            </div>
            {
                allProduct.map((product, index) => {
                    return (
                        <div>
                            <img src={product?.images[0]} width={100} height={100}/>
                        </div>
                    )
                })
            }
        </div>
    </>)
}

export default AllProductList