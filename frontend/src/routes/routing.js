import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import App from "../App";
import AdminLayout from "../Layout/AdminLayout";
import { ThemeProvider } from "../config/Theme.config";
import CheckPermission from "../config/permission.config";
import DashboardPage from "../pages/admin/dahboard/DasboardPage";
import ActivatePage from "../pages/auth/ActivatePage";
import ForgetPasswordPage from "../pages/auth/ForgetPasswordPage";
import HomePage from "../pages/auth/HomePage";
import LoginPage from "../pages/auth/LoginPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";
import SignupPage from "../pages/auth/SignupPage";
import { AllUserList, EditUser } from "../pages/auth/users";
import { AllBannerList, UpdateBanner, UploadBanner } from "../pages/banner";
import { AllBrandList, UpdateBrand, UploadBrand } from "../pages/brand";
import { AllCategoryList, UpdateCategory, UploadCategory } from "../pages/category";
import Error404 from "../pages/error/Error404Page";
import { AllProductList, UpdateProduct, UploadProducts } from "../pages/products";
import { getLoggedInUser } from "../reducers/user.reducer";


const Router = () => {
    const dispatch = useDispatch()
    useEffect(() => {
        let token = localStorage.getItem("au") || null
        if (token) {
            dispatch(getLoggedInUser())
        }
    }, [])
    return (<>
        <ToastContainer theme="colored" />
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />}>
                    <Route path="/" element={<HomePage />}></Route>
                    <Route path="sign-up" element={<SignupPage />}></Route>
                    <Route path="activate/:token" element={<ActivatePage />} />
                    <Route path="login" element={<LoginPage />}></Route>
                    <Route path="forget-password" element={<ForgetPasswordPage />}></Route>
                    <Route path="reset-password/:token" element={<ResetPasswordPage />}></Route>
                    <Route path="*" element={<Error404 goBackUrl={' /'} name={'Home Page'} />}></Route>
                </Route>
                <Route path="admin" element={<AdminLayout />}></Route>
                <Route path="/admin" element={<CheckPermission accessBy={"admin"}>
                    <ThemeProvider>
                        <AdminLayout />
                    </ThemeProvider>
                </CheckPermission>}>
                    <Route index element={<DashboardPage />}></Route>

                    <Route path="user" element={<AllUserList />}></Route>
                    <Route path="user/:id" element={<EditUser />}></Route>

                    <Route path="banner" element={<AllBannerList/>}></Route>
                    <Route path="banner/upload" element={<UploadBanner/>}></Route>
                    <Route path="banner/:id" element={<UpdateBanner />}></Route>

                    <Route path="brand" element={<AllBrandList/>}></Route>
                    <Route path="brand/upload" element={<UploadBrand/>}></Route>
                    <Route path="brand/:id" element={<UpdateBrand />}></Route>
                    
                    <Route path="category" element={<AllCategoryList/>}></Route>
                    <Route path="category/upload" element={<UploadCategory/>}></Route>
                    <Route path="category/:id" element={<UpdateCategory/>}></Route>

                    <Route path="product" element={<AllProductList />}></Route>
                    <Route path="product/upload" element={<UploadProducts />}></Route>
                    <Route path="product/:id" element={<UpdateProduct />}></Route>

                    

                    <Route path="*" element={<Error404 goBackUrl={'/admin'} name={'Admin Dashboard'} />}></Route>
                </Route>
            </Routes>
        </BrowserRouter>
    </>)
}
export default Router