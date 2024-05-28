import React, { useContext, useEffect } from "react";
import { FaBarcode, FaBullhorn, FaGifts, FaHome, FaImages, FaNewspaper, FaReceipt, FaShoppingCart, FaTachometerAlt, FaTag, FaUsers } from "react-icons/fa";
import { FaBasketShopping, FaRegCircleUser } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { ThemeContext } from "../../../config/Theme.config";
import { getLoggedInUser } from "../../../reducers/user.reducer";
import SidebarItem from "./SidebarMenu";

const AdminSidebar = () => {
    const dispatch = useDispatch()
    const loggedInUser = JSON.parse(localStorage.getItem("_ud")) || null
    const loggedInuserDetail = useSelector((root) => {
        return root?.User?.user
    })
    useEffect(() => {
        // Check if user is logged in using local storage
        const storedUser = JSON.parse(localStorage.getItem("_ud"));
        if (storedUser) {
            // Dispatch action to update user details in Redux store
            dispatch(getLoggedInUser());
        }

    }, [dispatch]);
    const { theme } = useContext(ThemeContext)
    const navigate = useNavigate()

    const sidebarItems = [
        {
            name: "",
            items: [
                {
                    name: "Home",
                    icon: <FaHome />,
                    url: "/"
                },
                {
                    name: "Dashboard",
                    icon: <FaTachometerAlt />,
                    url: "/admin"
                }
            ]
        },
        {
            name: "Core Features",
            items: [
                {
                    name: "Banner Manager",
                    icon: <FaImages />,
                    url: "/admin/banner"
                },
                {
                    name: "Brand Manager",
                    icon: <FaBarcode />,
                    url: "/admin/brand"
                },
                {
                    name: "Category Manager",
                    icon: <FaImages />,
                    url: "/admin/category"
                },
                {
                    name: "Users Manager",
                    icon: <FaUsers />,
                    url: "/admin/user"
                },
                {
                    name: "Products Manager",
                    icon: <FaBasketShopping />,
                    url: "/admin/product"
                },
                {
                    name: "Order Manager",
                    icon: <FaShoppingCart />,
                    url: "/admin/order"
                }
            ]
        },
        {
            name: "Add On Features",
            items: [
                {
                    name: "Transactions Manager",
                    icon: <FaReceipt />,
                    url: "/admin/transaction"
                },
                {
                    name: "Blogs Manager",
                    icon: <FaNewspaper />,
                    url: "/admin/blogs"
                },
                {
                    name: "Tags Manager",
                    icon: <FaTag />,
                    url: "/admin/tags"
                },
                {
                    name: "Offers Manager",
                    icon: <FaGifts />,
                    url: "/admin/offers"
                },
                {
                    name: "Promo Manager",
                    icon: <FaBullhorn />,
                    url: "/admin/promo"
                }
            ]
        }
    ]
    return (<>
        <div className="flex min-h-screen">

            <div className={` bg-black w-64 ${theme === "light" ? "bg-black text-white" : "bg-white text-black"
                }`}
            >
                <div className="h-1 flex justify-center items-center mt-3 flex-col">
                    <div className="text-5xl cursor-pointer relative flex justify-center ">
                        {
                            loggedInuserDetail?.image ? (
                                <img src={loggedInuserDetail?.image} className='w-10 h-10 rounded-full' alt={loggedInuserDetail?.name} />
                            ) : (
                                <FaRegCircleUser />
                            )}
                    </div>
                    <div className='mt-24 absolute'>
                        <div className=' cursor-pointer relative-flex justify-center' >
                            <p className={"whitespace-nowrap  p-2 text-blue-700"} to={"/" + loggedInuserDetail?.role}>{loggedInUser.name}<br /><span className="ml-8">{loggedInUser.role}</span></p>
                        </div>

                    </div>
                </div>
                <nav className="ml-8 mt-20">
                    {
                        sidebarItems.map((menuList, index) => (
                            <React.Fragment key={index}>
                                {menuList.name ? (
                                    <div className="gap-5">{menuList.name}</div>
                                ) : (
                                    ""
                                )}
                                <div className="gap-5 flex flex-col mb-8">
                                    {menuList.items.map((item, index) => (
                                        <SidebarItem onClick={(item) => {
                                            navigate(item.url)
                                        }}
                                            key={index}
                                            url={item.url}
                                            icon={item.icon}
                                            name={item.name}

                                        />
                                    ))}
                                </div>
                            </React.Fragment>
                        ))
                    }
                    <div className="sb-sidenav-footer">
                        <div className="smal">Logged in as:</div>
                        <span className='text-blue-600 ml-12'>{loggedInUser?.name}</span>
                    </div>
                </nav>
            </div>
            <main className="">
               <Outlet/>
            </main>
        </div>
    </>)
}
export default AdminSidebar
