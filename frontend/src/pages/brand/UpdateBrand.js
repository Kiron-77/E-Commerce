import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { MdDelete } from "react-icons/md";
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from "yup";
import AdminBreadCrumb from '../../components/admin/braedcrumb/Breadcrumb';
import { ImageUploaderComponent, SelectDropdownComponent, TextInputComponent } from '../../components/common/input.component';
import uploadImage from '../../components/common/uploadImage';
import ZoomImage from '../../components/common/zoomImage';
import brandSvc from './brandService';

const UpdateBrand = () => {
  const [brandDetail, setBrandDetail] = useState()
  const [defaultSel, setDefaultSel] = useState()
  const [thumbnail, setThumbnail] = useState(null);
  const [openFullScreenImage, setOpenFullScreenImage] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState("");
  const params = useParams()

  const categoryRules = Yup.object({
    title: Yup.string().min(2, "Title should be of at least 2 characters long").max(30).required(),
    tagline: Yup.string().required(),
    status: Yup.object({
      label: Yup.string().matches(/^(Publish|Un-Publish)$/),
      value: Yup.string().matches(/^(active|inactive)$/),
    }).required('Status is required'),
    image: Yup.mixed().required("Please upload an image"),
  })

  const { control, handleSubmit, setValue, setError, formState: { errors } } = useForm({
    resolver: yupResolver(categoryRules)
  })

  const handleUpdateBrand = async (files) => {
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

  const handleDeleteBrandImage = () => {
    setValue("image", null);
    setThumbnail(null);
  };

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const submitForm = async (data) => {
    try {
      setLoading(true)
      const formatted = {
        ...data,
        status: data.status.value
      }
      console.log(formatted)
      const response = await brandSvc.updateBrandById(params.id, formatted)
      console.log(response)
      toast.success("Brand Edited Successfully")
      navigate('/admin/brand')
    } catch (exception) {
      toast.error("Brand can not be edited at this moment")
      console.log(data)
    } finally {
      setLoading(false)
    }
  }

  const getBrandDetail = async () => {
    try {
      const response = await brandSvc.getBrandById(params.id)
      setValue('title', response.result.title)
      setValue('tagline', response.result.tagline)
      setThumbnail(process.env.REACT_APP_IMAGE_URL + '/' + response.result.image)
      setDefaultSel({
        label: response.result.status === "active" ? "Publish" : "Un-Publish",
        value: response.result.status
      });
      setBrandDetail(response.result)
    } catch (exception) {
      console.log(exception)
    }
  }
  useEffect(() => {
    getBrandDetail()
  }, [params])
  return (<>
          <div className="mx-auto container w-full mt-5 ml-5">
      <h1 className='font-bold text-xl mt-3'>Update Brand</h1>
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
            title: "Brand List",
            link: "/admin/brand"
          },
          {
            title: "Update Brands",
            link: null
          }
        ]}
      />
      <div className="bg-slate-500 flex min-w-full flex-col mt-2 m-8">
        <h1 className="shadow-md rounded-lg p-4 justify-center text-center">
          Update Brands
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
          <label htmlFor='tagline'>Tagline:</label>
          <div className='bg-slate-100 p-2 w-full ml-32 border rounded'>
            <TextInputComponent
              name={'tagline'}
              control={control}
              errMsg={errors?.tagline?.message}
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
    
          <label htmlFor='image'>Image:</label>
          <div className='bg-slate-100 p-2 w-full ml-32 border rounded'>
            <ImageUploaderComponent
              name={"image"}
              errMsg={errors?.image?.message}
              control={control}
              setError={setError}
              setValue={setValue}
              setThumb={handleUpdateBrand}
            />
          </div>
          <div>
            {thumbnail && (
              <div className='flex items-center ml-16 gap-2'>
                <div className='relative group'>
                  <img
                    src={thumbnail}
                    alt='Brand'
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
                    onClick={handleDeleteBrandImage}
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
            <button type='button' disabled={loading} className='bg-red-600 hover:bg-red-700 text-white w-20 h-10 rounded-full ' onClick={() => navigate('/admin/brand')}>Cancel</button>
          </div>
        </form>
      </div>
      {openFullScreenImage && (
        <ZoomImage onClose={() => setOpenFullScreenImage(false)} imageUrl={fullScreenImage} />
      )}
    </div>
    </>)
}

export default UpdateBrand
