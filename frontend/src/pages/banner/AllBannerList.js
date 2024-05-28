import React, { useEffect, useState } from 'react'
import Paginate from 'react-paginate'
import { NavLink } from 'react-router-dom'
import { toast } from 'react-toastify'
import TableAction from '../../components/Table/TableAction'
import TableImage from '../../components/Table/TableImage'
import TableStatus from '../../components/Table/TableStatus'
import AdminBreadCrumb from '../../components/admin/braedcrumb/Breadcrumb'
import LoadingSpinner from '../../components/common/loading.component'
import bannerSvc from './bannerService'

const AllBannerList = () => {
  const [data, setData] = useState()
  const [loading, setLoading] = useState(true)
  let [pageNo, setPageNo] = useState(1)
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 15,
    noOfPages: 1,

  })

  const getAllBanners = async (config) => {
    try {
      const response = await bannerSvc.listAllbanners(config)
      setData(response.result)
      let pageNo = 1;
      pageNo = ((+response.meta.currentPage - 1) * response.meta.limit) + 1;
      setPageNo(pageNo);
      setPagination({
        total: response.meta.total,
        page: response.meta.currentPage,
        limit: response.meta.limit,
        noOfPages: Math.ceil(response.meta.total / response.meta.limit)
      })
    } catch (exception) {

    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    getAllBanners({ page: 1, limit: 15, search: null })
  }, [])

  const deleteData = async (id) => {
    try {
      const response = await bannerSvc.deleteById(id)
      getAllBanners({ page: 1, limit: 15, search: null })
      toast.success("Banner deleted successfully.")
    } catch (exception) {
      toast.error("Banner can not be deleted at this moment.")
      console.log(exception)
    }
  }
  return (<>
    <div className="container w-full px-4">
      <h1 className=' font-bold text-xl mt-3'>All Banner List</h1>
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
            title: "Banner List",
            link: null
          }
        ]}
      />
      <div className='bg-slate-500 w-full py-2 px-6 flex justify-between items-center mt-3 ml-6 rounded-md'>
        <h1 className=' text-center items-center justify-center font-bold text-xl mb-2 ml-80'>All Banners Lists</h1>
        <NavLink className='border-2 border-red-500 text-red-600 hover:bg-red-600 hover:text-white transition-all py-1 px-3 rounded-full' to={"/admin/banner/upload"}>
          Upload Banners
        </NavLink>
      </div>
    </div>
    <div className='justify-center items-center'>
      <table className='lg:w-full md:full sm:full userTable ml-6  '>
        <thead className=''>
          <tr className='bg-slate-700 text-white'>
            <th className="px-7 py-2">Sn.</th>
            <th className="px-16 py-2">Banner Name</th>
            <th className="px-16 py-2">Image</th>
            <th className="px-16 py-2">Link</th>
            <th className="px-16 py-2">Status</th>
            <th className="px-16 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {
            loading ? <>
              <tr>
                <td colSpan='5'>
                  <LoadingSpinner />
                </td>
              </tr>
            </> : <>
              {
                data && data.length ? <>
                  {
                    data.map((row, index) => (
                      <tr key={index}>
                        <td>{pageNo++}</td>
                        <td>{row.title}</td>
                        <td>
                          <TableImage image={row.image} />
                        </td>
                        <td>
                          <a href={row.url} target='_banner'>
                            {row.url}
                          </a>
                        </td>
                        <td>
                          <TableStatus status={row.status} />
                        </td>
                        <td>
                          <TableAction
                            deleteAction={deleteData}
                            id={row._id}
                            editUrl={"/admin/banner/" + row._id}
                          />
                        </td>
                      </tr>
                    ))
                  }
                </> : <tr>
                  <td colSpan={5}>
                    <p className='text-center'>No data found....</p>
                  </td>
                </tr>
              }
            </>
          }
        </tbody>
      </table>
      {
        pagination ? <>
          <Paginate className='float-end flex gap-3'>
            {
              pagination.page !== 1 ? <>
                <Paginate.First onClick={(e) => {
                  getAllBanners({ page: 1, limit: pagination.limit, search: null })
                }} />
                <Paginate.Prev onClick={(e) => {
                  getAllBanners({ page: (+pagination.page - 1), limit: pagination.limit, search: null })
                }} />
              </> : <></>
            }
            {
              Array(pagination.noOfPages).fill(null).map((val, ind) => (
                <Paginate.Item onClick={(e) => {
                  getAllBanners({ page: (ind + 1), limit: pagination.limit, search: null })
                }} active={(pagination.page === (ind + 1)) ? true : false} key={ind}>{ind + 1}</Paginate.Item>
              ))
            }
            {
              pagination.page !== pagination.noOfPages ? <>
                <Paginate.Next onClick={(e) => {
                  getAllBanners({ page: (+pagination.page + 1), limit: pagination.limit, search: null })
                }} />
                <Paginate.Last onClick={(e) => {
                  getAllBanners({ page: pagination.noOfPages, limit: pagination.limit, search: null })
                }} />
              </> : <></>
            }
          </Paginate>
        </> : <></>
      }
    </div>
  </>)
}

export default AllBannerList

