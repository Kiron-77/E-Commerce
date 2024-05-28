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
import ActivatePage from "../pages/cms/auth/ActivatePage";
import ForgetPasswordPage from "../pages/cms/auth/ForgetPasswordPage";
import LoginPage from "../pages/cms/auth/LoginPage";
import ResetPasswordPage from "../pages/cms/auth/ResetPasswordPage";
import SignupPage from "../pages/cms/auth/SignupPage";
import { AllBannerList, UpdateBanner, UploadBanner } from "../pages/cms/banner";
import { AllBrandList, UpdateBrand, UploadBrand } from "../pages/cms/brand";
import { AllCategoryList, UpdateCategory, UploadCategory } from "../pages/cms/category";
import CategoryDetail from "../pages/cms/category/CategoryDetail";
import { AllProductList, UpdateProduct, UploadProducts } from "../pages/cms/products";
import { AllUserList, EditUser } from "../pages/cms/users";
import Error404 from "../pages/error/Error404Page";
import HomePage from "../pages/home/HomePage";
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

                    <Route path="category/:slug" element={<CategoryDetail />}></Route>

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

                    <Route path="product" element={<AllProductList/>}></Route>
                    <Route path="product/upload" element={<UploadProducts />}></Route>
                    <Route path="product/:id" element={<UpdateProduct />}></Route>

                    

                    <Route path="*" element={<Error404 goBackUrl={'/admin'} name={'Admin Dashboard'} />}></Route>
                </Route>
            </Routes>
        </BrowserRouter>
    </>)
}
export default Router