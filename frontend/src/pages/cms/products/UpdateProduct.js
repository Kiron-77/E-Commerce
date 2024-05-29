
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { MdDelete } from "react-icons/md";
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from "yup";
import AdminBreadCrumb from '../../../components/admin/braedcrumb/Breadcrumb';
import { DiscountInputComponent, ImageUploaderComponent, PriceInputComponent, SelectDropdownComponent, TextAreaInputComponent, TextInputComponent } from '../../../components/common/input.component';
import uploadImage from '../../../components/common/uploadImage';
import ZoomImage from '../../../components/common/zoomImage';
import brandSvc from '../brand/brandService';
import categorySvc from '../category/categoryService';
import Authsvc from '../servicepage/auth.service';
import productSvc from './productService';

const UpdateProduct = ({ onClose }) => {

    const [thumbnails, setThumbnails] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [openFullScreenImage, setOpenFullScreenImage] = useState(false);
    const [fullScreenImage, setFullScreenImage] = useState("");

    const [defaultSel, setDefaultSel] = useState();
    const [productDetail, setProductDetail] = useState();

    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [sellers, setSellers] = useState([]);
    const params = useParams();

    const productRules = Yup.object({
        title: Yup.string().min(2, "Title should be of at least 2 characters long").max(30).required(),
        category: Yup.object({
            label: Yup.string().required("Category is required"),
            value: Yup.string().required("Category is required"),
        }).required("Category is required"),
        brand: Yup.object({
            label: Yup.string().required("Brand is required"),
            value: Yup.string().required("Brand is required"),
        }).required("Brand is required"),
        seller: Yup.string().nullable(),
        price: Yup.number().required('Price is a required field').typeError('Price must be a number'),
        discount: Yup.number().required('Discount percent is required').typeError('Enter a number').min(1, 'Enter a discount percentage of at least 1%').max(50, 'Enter a discount percentage of at most 50%'),
        images: Yup.array().min(1, "Please upload at least one image").required(),
        description: Yup.string().required('Description is required'),
        status: Yup.object({
            label: Yup.string().matches(/^(Publish|Un-Publish)$/).required("Status is required"),
            value: Yup.string().matches(/^(active|inactive)$/).required("Status is required"),
        }).required('Status is required'),
    });

    const { handleSubmit, control, setValue, setError, getValues, formState: { errors } } = useForm({
        resolver: yupResolver(productRules),
    });

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const brandRes = await brandSvc.listAllbrands({});
                setBrands(brandRes);

                const categoriesRes = await categorySvc.listAllCategories({});
                setCategories(categoriesRes);

                const usersRes = await Authsvc.getAllUserDetail({});
                const sellers = usersRes.result.filter(user => user.role === 'seller');
                setSellers(sellers);

            } catch (error) {
                console.error('Error fetching options:', error);
            }
        };

        fetchOptions();
    }, []);

    const handleUpdateProduct = async (files) => {
        const uploadedImages = [];
        for (let file of files) {
            const localImageUrl = URL.createObjectURL(file);
            setThumbnails((prev) => [...prev, localImageUrl]);
            try {
                const uploadImageCloudinary = await uploadImage(file);
                uploadedImages.push(uploadImageCloudinary.url);
            } catch (error) {
                console.error('Error uploading image:', error);
            }
        }
        const currentImages = getValues("images") || [];
        setValue("images", [...currentImages, ...uploadedImages]);
    };

    const handleDeleteProductImage = (index) => {
        const newProductImage = getValues("images") || [];
        newProductImage.splice(index, 1);
        setValue("images", newProductImage);

        const newThumbnails = [...thumbnails];
        newThumbnails.splice(index, 1);
        setThumbnails(newThumbnails);
    };

    const checkIfSellerExist = (sellerName) => {
        if (!sellerName) {
            return false;
        } else {
            return sellers.some(seller => seller.name === sellerName);
        }
    };

    const submitForm = async (data) => {
        try {
            console.log("Submitting form with data:", data);
            setLoading(true);
            if (data.seller) {
                const sellerExists = checkIfSellerExist(data.seller);
                if (!sellerExists) {
                    toast.error("Seller is not registered");
                    setLoading(false);
                    return;
                }
            } else {
                data.seller = null;
            }

            const formatted = {
                ...data,
                category: data.category.value,
                brand: data.brand.value,
                status: data.status.value,
                images: data.images.map(image => typeof image === 'string' ? image : URL.createObjectURL(image))
            };

            console.log("Formatted data to be sent:", formatted);

            const response = await productSvc.updateProductById(params.id, formatted);

            console.log("Response from server:", response);

            if (response && response.success) {
                toast.success("Product Updated Successfully.");
                navigate('/admin/product');
            } else {
                toast.error("Product update failed. Please try again.");
                console.error("Error response:", response);
            }
        } catch (exception) {
            console.error("Error during form submission:", exception);
            toast.error("Product cannot be updated at this moment.");
        } finally {
            setLoading(false);
        }
    };

    const getProductDetail = async () => {
        try {
            const response = await productSvc.getProductById(params.id);
            setValue('title', response.result.title);
            setValue('category', { label: response.result.category.title, value: response.result.category._id });
            setValue('brand', { label: response.result.brand.title, value: response.result.brand._id });
            setValue('seller', response.result.seller);
            setValue('price', response.result.price);
            setValue('discount', response.result.discount);
            setValue('description', response.result.description);
            setValue('images', response.result.images);
            setThumbnails(response.result.images.map(image => process.env.REACT_APP_IMAGE_URL + '/' + image));
            setDefaultSel({
                label: response.result.status === "active" ? "Publish" : "Un-Publish",
                value: response.result.status
            });
            setProductDetail(response.result);
        } catch (exception) {
            console.log(exception);
        }
    };

    useEffect(() => {
        getProductDetail();
    }, [params]);

    return (
        <div className="mx-auto container w-full mt-5 ml-5">
            <h1 className='font-bold text-xl mt-3'>Update Product</h1>
            <AdminBreadCrumb
                data={[
                    { title: "Home", link: "/" },
                    { title: "Dashboard", link: "/admin" },
                    { title: "Product List", link: "/admin/product" },
                    { title: "Product Update", link: null }
                ]}
            />
            <div className="bg-slate-500 flex min-w-full flex-col mt-2 m-8">
                <h1 className="shadow-md rounded-lg p-4 justify-center text-center">
                    Update Product
                </h1>
                <form className='grid h-full w-full mt-3 justify-center items-center px-48' onSubmit={handleSubmit(submitForm)} noValidate>
                    <label htmlFor='title'>Title:</label>
                    <div className='bg-slate-100 p-2 w-full ml-32 border rounded'>
                        <TextInputComponent
                            name={'title'}
                            control={control}
                            errMsg={errors?.title?.message}
                        />
                    </div>
                    <label htmlFor='category'>Category:</label>
                    <div className='bg-slate-100 p-2 w-full ml-32 border rounded'>
                        <SelectDropdownComponent
                            control={control}
                            errMsg={errors?.category?.value?.message}
                            name={"category"}
                            isMultiple={false}
                            options={(categories.result || []).map(category => ({ label: category.title, value: category._id }))}
                            setValue={setValue}
                            menuPosition="top"
                            menuPlacement="auto"
                            className="mt-2 transform -translate-y-full"
                        />
                    </div>
                    <label htmlFor='brand'>Brand:</label>
                    <div className='bg-slate-100 p-2 w-full ml-32 border rounded'>
                        <SelectDropdownComponent
                            control={control}
                            errMsg={errors?.brand?.value?.message}
                            name={"brand"}
                            isMultiple={false}
                            options={(brands.result || []).map(brand => ({ label: brand.title, value: brand._id }))}
                            setValue={setValue}
                            menuPosition="top"
                            menuPlacement="auto"
                            className="mt-2 transform -translate-y-full"
                        />
                    </div>
                    <label htmlFor='seller'>Seller:</label>
                    <div className='bg-slate-100 p-2 w-full ml-32 border rounded'>
                        <TextInputComponent
                            name={'seller'}
                            control={control}
                            errMsg={errors?.seller?.message}
                        />
                    </div>
                    <label htmlFor='price'>Price:</label>
                    <div className='bg-slate-100 p-2 w-full ml-32 border rounded'>
                        <PriceInputComponent
                            name={'price'}
                            control={control}
                            errMsg={errors?.price?.message}
                        />
                    </div>
                    <label htmlFor='discount'>Discount:</label>
                    <div className='bg-slate-100 p-2 w-full ml-32 border rounded'>
                        <DiscountInputComponent
                            name={'discount'}
                            control={control}
                            errMsg={errors?.discount?.message}
                        />
                    </div>
                    <label htmlFor='status'>Status:</label>
                    <div className='bg-slate-100 p-2 w-full ml-32 border rounded'>
                        <SelectDropdownComponent
                            errMsg={errors?.status?.message}
                            name={"status"}
                            defaultValue={defaultSel}
                            options={
                                [{ label: "Publish", value: "active" },
                                { label: "Un-Publish", value: "inactive" }]
                            }
                            setValue={setValue}
                            className="bg-slate-100 p-2 w-full ml-32 border rounded"
                        />
                    </div>
                    <label htmlFor='images'>Images:</label>
                    <div className='bg-slate-100 p-2 w-full ml-32 border rounded'>
                        <ImageUploaderComponent
                            name={"images"}
                            errMsg={errors?.images?.message}
                            control={control}
                            setError={setError}
                            setValue={setValue}
                            setThumb={handleUpdateProduct}
                            multiple
                        />
                        <span className="text-danger">{errors?.images?.message}</span>
                    </div>
                    <div className='flex flex-wrap gap-4'>
                        {thumbnails.map((thumbnail, index) => (
                            <div key={index} className='relative group'>
                                <img
                                    src={thumbnail}
                                    alt='Product'
                                    width={80}
                                    height={80}
                                    className='bg-slate-100 border cursor-pointer mt-3'
                                    onClick={() => {
                                        setOpenFullScreenImage(true);
                                        setFullScreenImage(thumbnail);
                                    }}
                                />
                                <div
                                    className='absolute bottom-0 right-0 p-1 text-white bg-red-600 rounded-full hidden group-hover:block cursor-pointer'
                                    onClick={() => handleDeleteProductImage(index)}
                                >
                                    <MdDelete />
                                </div>
                            </div>
                        ))}
                        {!thumbnails.length && <p className='text-red-600 text-xs ml-32'>*Please upload image</p>}
                    </div>
                    <label htmlFor='description'>Description:</label>
                    <div className='bg-slate-100 p-2 w-full ml-32 border rounded'>
                        <TextAreaInputComponent
                            name={'description'}
                            control={control}
                            errMsg={errors?.description?.message}
                        />
                    </div>
                    <div className='ml-56 mt-5 flex mb-3 space-x-2'>
                        <button type='submit' disabled={loading} className='bg-red-600 hover:bg-red-700 text-white w-20 h-10 rounded-full'>Submit</button>
                        <button type='button' disabled={loading} className='bg-red-600 hover:bg-red-700 text-white w-20 h-10 rounded-full ' onClick={() => navigate('/admin/product')}>Cancel</button>
                    </div>
                </form>
            </div>
            {openFullScreenImage && (
                <ZoomImage onClose={() => setOpenFullScreenImage(false)} imageUrl={fullScreenImage} />
            )}
        </div>
    );
}

export default UpdateProduct;

