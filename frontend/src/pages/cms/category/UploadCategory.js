import { yupResolver } from "@hookform/resolvers/yup";
import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { MdDelete } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from "yup";
import AdminBreadCrumb from "../../../components/admin/braedcrumb/Breadcrumb";
import { ImageUploaderComponent, SelectDropdownComponent, TextInputComponent } from "../../../components/common/input.component";
import uploadImage from "../../../components/common/uploadImage";
import ZoomImage from "../../../components/common/zoomImage";
import categorySvc from "./categoryService";

const UploadCategory = () => {
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [openFullScreenImage, setOpenFullScreenImage] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState("");

  const categoryRules = Yup.object({

    // title: Yup.object({
    //   label: Yup.string().required("Title is required"),
    //   value: Yup.string().required("Title is required"),
    // }).required("Title is required"),
    title: Yup.string().min(2, "Title should be of at least 2 characters long").max(30).required(),
    subCategory: Yup.string().nullable(),
    status: Yup.object({
      label: Yup.string().matches(/^(Publish|Un-Publish)$/).required("Status is required"),
      value: Yup.string().matches(/^(active|inactive)$/).required("Status is required"),
    }).required("Status is required"),
    image: Yup.mixed().required("Please upload an image"),
  });

  const { handleSubmit, control, setValue, setError, formState: { errors } } = useForm({
    resolver: yupResolver(categoryRules),
  });

  const handleUploadCategory = async (files) => {
    const uploadedImages = [];
    if (files.length === 0) return;
    const file = files[0];
    const localImageUrl = URL.createObjectURL(file);
    setThumbnail(localImageUrl);

    try {
      const uploadImageCloudinary = await uploadImage(file);
      uploadedImages.push(uploadImageCloudinary.url);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
    setValue("image", file);
  };

  const handleDeleteCategoryImage = () => {
    setValue("image", null);
    setThumbnail(null);
  };

  const submitForm = async (data) => {
    try {
      setLoading(true);
      const formatted = {
        ...data,
        status: data.status.value,
        // title: data.title.value,
      };

      const response = await categorySvc.createCategory(formatted);
      console.log(response);
      toast.success("Category Created Successfully.");
      navigate('/admin/category');
    } catch (exception) {
      toast.error("Category cannot be created at this moment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto container w-full mt-5 ml-5">
      <h1 className='font-bold text-xl mt-3'>Upload Categories</h1>
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
            title: "Category List",
            link: "/admin/category"
          },
          {
            title: "Category Create",
            link: null
          }
        ]}
      />
      <div className="bg-slate-500 flex min-w-full flex-col mt-2 m-8">
        <h1 className="shadow-md rounded-lg p-4 justify-center text-center">
          Upload Categories
        </h1>
        <form className='grid h-full w-full mt-3 justify-center items-center px-48' onSubmit={handleSubmit(submitForm)}>
        <label htmlFor='title'>Title:</label>
          <div className='bg-slate-100 p-2 w-full ml-32 border rounded'>
            <TextInputComponent
              name={'title'}
              control={control}
              errMsg={errors?.title?.message}
            />
          </div>
          {/* <label htmlFor='title'>Title:</label>
          <div className='bg-slate-100 p-2 w-full ml-32 border rounded'>
            <SelectDropdownComponent
              control={control}
              errMsg={errors?.title?.message}
              name={"title"}
              isMultiple={false}
              options={productCategory.map(category => ({ label: category.label, value: category.value }))}
              setValue={setValue}
              menuPosition="top"
              menuPlacement="top"
              className="mb-2"
            />
          </div> */}
          <label htmlFor='subCategory'>Sub Category:</label>
          <div className='bg-slate-100 p-2 w-full ml-32 border rounded'>
            <TextInputComponent
              name={'subCategory'}
              control={control}
              errMsg={errors?.subCategory?.message}
            />
          </div>
          <label htmlFor='status'>Status:</label>
          <div className='bg-slate-100 p-2 w-full ml-32 border rounded'>
            <SelectDropdownComponent
              control={control}
              errMsg={errors?.status?.message}
              name={"status"}
              isMultiple={false}
              options={[
                { label: "Publish", value: "active" },
                { label: "Un-Publish", value: "inactive" }
              ]}
              setValue={setValue}
            />
          </div>
          <label htmlFor='image'>Image:</label>
          <div className='bg-slate-100 p-2 w-full ml-32 border rounded'>
            <ImageUploaderComponent
              name={"image"} 
              errMsg={errors?.image?.message} 
              control={control}
              setError={setError}
              setValue={setValue}
              setThumb={handleUploadCategory}
            />
          </div>
          <div>
            {thumbnail && (
              <div className='flex items-center ml-16 gap-2'>
                <div className='relative group'>
                  <img
                    src={thumbnail}
                    alt='Category'
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
                    onClick={handleDeleteCategoryImage}
                  >
                    <MdDelete />
                  </div>
                </div>
              </div>
            )}
            {!thumbnail && <p className='text-red-600 text-xs ml-32'>*Please upload image</p>}
          </div>
          <div className='ml-56 mt-5 flex mb-3 space-x-2'>
            <button type='submit' disabled={loading} className='bg-red-600 hover:bg-red-700 text-white w-20 h-10 rounded-full'>Submit</button>
            <button type='button' disabled={loading} className='bg-red-600 hover:bg-red-700 text-white w-20 h-10 rounded-full ' onClick={() => navigate('/admin/category')}>Cancel</button>
          </div>
        </form>
      </div>
      {openFullScreenImage && (
        <ZoomImage onClose={() => setOpenFullScreenImage(false)} imageUrl={fullScreenImage} />
      )}
    </div>
  );
}

export default UploadCategory;












