import React, { useEffect, useState } from 'react';
import { CiSearch } from "react-icons/ci";
import { FaShoppingCart } from "react-icons/fa";
import { FaRegCircleUser } from "react-icons/fa6";
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import Logo from '../../logo/logo';
import Authsvc from '../../pages/cms/servicepage/auth.service';
import { clearImage, getLoggedInUser } from '../../reducers/user.reducer';



const Header = () => {
  const [query, setQuery] = useSearchParams()
  const navigate = useNavigate()
  const [clicked, setClicked] = useState(false)
  const dispatch = useDispatch()
  const [loggedInuser, setloggedInUser] = useState()
  const [menuDisplay, setMenuDisplay] = useState(false)

  const loggedInuserDetail = useSelector((root) => {
    return root?.User?.user

  });
  console.log(loggedInuserDetail)
  let totalCount = useSelector((root) => {
    return root?.Cart?.total || 0
  })

  useEffect(() => {
    // Check if user is logged in using local storage
    const storedUser = JSON.parse(localStorage.getItem("_ud"));
    if (storedUser) {
      // Dispatch action to update user details in Redux store
      dispatch(getLoggedInUser());
    }

  }, [dispatch]);

  // const getloggedInUser = async () => {
  //   try {
  //     const userResponse = await Authsvc.getLoggedInUserDetail()
  //     setloggedInUser(userResponse.result)
  //   } catch (exception) {

  //   }
  // }
  // useEffect(() => {
  //   if (localStorage.getItem("_au")) {
  //     getloggedInUser()
  //   }
  // }, [])
  const handleLogout = async (data) => {
    const response = await Authsvc.logout(data)
    console.log(response)
    if (!clicked) {
      try {
        await Swal.fire({
          title: "Are you sure?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Logout"

        }).then((result) => {
          if (result.isConfirmed) {
            localStorage.removeItem("_au")
            localStorage.removeItem("_ud")
            navigate("/login")
            setClicked(true)
            setloggedInUser(null)
            dispatch(clearImage())
          }

        });
      } catch (error) {
        console.log("Error loggingout:", error)
      }
    }
  }
  return (<>
    <header className='sticky top-0 h-16 w-full mx-auto justify-between shadow-md bg-white z-50'>
      <div className='h-full ml-10 mr-10 mx-auto flex items-center justify-between'>
        <div className=''>
          <NavLink to={"/"}>
            <Logo w={90} h={50} />
          </NavLink>
        </div>
        <form
          className='hidden lg:flex items-center w-full justify-between m-r-15 max-w-xl border rounded-full focus-within:shadow-sm pl-2'
          role='search'
          onSubmit={(e) => {
            e.preventDefault()
          }}>
          <input
            type='search'
            placeholder='search products here.....'
            className='w-full outline-none'
            name="q"
            onChange={(e) => {
              const type = e.target.value
              setQuery({ q: type })
            }}
          />
          <button className='text-lg min-w-[50px] h-8 bg-red-500 flex items-center justify-center rounded-r-full text-white'
            type='submit'><CiSearch /></button>
        </form>
        <div className='flex items-center gap-8'>
          {
            loggedInuserDetail ? (
              <>
                <div className='relative flex justify-center'>
                <div className='text-3xl cursor-pointer relative-flex justify-center ' title={loggedInuserDetail.name}onClick={()=>setMenuDisplay(preve =>!preve)}>
                  {
                    loggedInuserDetail?.image ? (
                      <img src={loggedInuserDetail?.image} className='w-10 h-10 rounded-full' alt={loggedInuser?.name} />
                    ) : (
                      <FaRegCircleUser />
                    )}
                  </div>
                  {
                    menuDisplay && (
                      <div className='absolute bg-white bottom-0 top-11 h-fit p-2 shadow-lg rounded '>
                        <nav>                 
                      <NavLink className={"whitespace-nowrap hover:bg-slate-100 p-2 text-blue-700"} to={"/" + loggedInuserDetail?.role}>{loggedInuserDetail.name}</NavLink>
                    </nav>  
                  </div>
                    )
                  }
                  
                  </div> 
                <div className="text-2xl cursor-pointer relative">
                  <NavLink to={"/cart"}><FaShoppingCart /></NavLink>
                  <div className='bg-red-600 text-white w-5 h-5 pb-1 pl-1.5 rounded-full flex-items-center justify-center absolute -top-2 -right-3'>
                    <p className='text-sm'>{totalCount || 0}</p>
                  </div>
                </div>
                <div>
                  <NavLink to={"/"} className='px-3 py-1 rounded-full text-white bg-red-600 hover:bg-red-700' onClick={handleLogout} >Logout</NavLink>
                </div>
              </>
            ) : (
              <>
                <div className='text-3xl cursor-pointer'>
                  <FaRegCircleUser />
                  </div>
                <div>
                  <NavLink to={"/login"} className='px-3 py-1 rounded-full text-white bg-red-600 hover:bg-red-700'>Login</NavLink>
                </div>

              </>
            )}
        </div>
      </div>
    </header >
  </>)
}

export default Header
