import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { MdDelete } from "react-icons/md";
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from "yup";
import AdminBreadCrumb from '../../../components/admin/braedcrumb/Breadcrumb';
import { ImageUploaderComponent, SelectDropdownComponent, TextInputComponent, URLInputComponent } from '../../../components/common/input.component';
import uploadImage from '../../../components/common/uploadImage';
import ZoomImage from '../../../components/common/zoomImage';
import bannerSvc from './bannerService';

const UpdateBanner = () => {
  const [bannerDetail, setBannerDetail] = useState()
  const [defaultSel, setDefaultSel] = useState()
  const [thumbnail, setThumbnail] = useState(null);
  const [openFullScreenImage, setOpenFullScreenImage] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState("");
  const params = useParams()

  const bannerRules = Yup.object({
    title: Yup.string().min(2, "Title should be of at least 2 characters long").max(30).required(),
    url: Yup.string().url().required(),
    status: Yup.object({
      label: Yup.string().matches(/^(Publish|Un-Publish)$/),
      value: Yup.string().matches(/^(active|inactive)$/),
    }).required('Status is required'),
    image: Yup.mixed().required("Please upload an image"),
  })

  const { control, handleSubmit, setValue, setError, formState: { errors } } = useForm({
    resolver: yupResolver(bannerRules)
  })

  const handleUpdateBanner = async (files) => {
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

  const handleDeleteBannerImage = () => {
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
      const response = await bannerSvc.updateBannerById(params.id, formatted)
      console.log(response)
      toast.success("Banner Edited Successfully")
      navigate('/admin/banner')
    } catch (exception) {
      toast.error("Banner can not be edited at this moment")
      console.log(data)
    } finally {
      setLoading(false)
    }
  }

  const getBannerDetail = async () => {
    try {
      const response = await bannerSvc.getBannerById(params.id)
      setValue('title', response.result.title)
      setValue('url', response.result.url)
      setThumbnail(process.env.REACT_APP_IMAGE_URL + '/' + response.result.image)
      setDefaultSel({
        label: response.result.status === "active" ? "Publish" : "Un-Publish",
        value: response.result.status
      });
      setBannerDetail(response.result)
    } catch (exception) {
      console.log(exception)
    }
  }
  useEffect(() => {
    getBannerDetail()
  }, [params])
  return (<>
       <div className="mx-auto container w-full mt-5 ml-5">
      <h1 className='font-bold text-xl mt-3'>Update Banner</h1>
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
            link: "/admin/banner"
          },
          {
            title: "Update Banner",
            link: null
          }
        ]}
      />
      <div className="bg-slate-500 flex min-w-full flex-col mt-2 m-8">
        <h1 className="shadow-md rounded-lg p-4 justify-center text-center">
          Update Banners
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
          <label htmlFor='tagline'>Url:</label>
          <div className='bg-slate-100 p-2 w-full ml-32 border rounded'>
            <URLInputComponent
              name={'url'}
              control={control}
              errMsg={errors?.url?.message}
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
              setThumb={handleUpdateBanner}
            />
          </div>
          <div>
            {thumbnail && (
              <div className='flex items-center ml-16 gap-2'>
                <div className='relative group'>
                  <img
                    src={thumbnail}
                    alt='Banner'
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
                    onClick={handleDeleteBannerImage}
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
            <button type='button' disabled={loading} className='bg-red-600 hover:bg-red-700 text-white w-20 h-10 rounded-full ' onClick={() => navigate('/admin/banner')}>Cancel</button>
          </div>
        </form>
      </div>
      {openFullScreenImage && (
        <ZoomImage onClose={() => setOpenFullScreenImage(false)} imageUrl={fullScreenImage} />
      )}
    </div>
    </>)
}

export default UpdateBanner
