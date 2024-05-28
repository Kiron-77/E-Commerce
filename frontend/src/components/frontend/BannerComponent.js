import { default as React, useEffect, useState } from 'react';
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import bannerSvc from '../../pages/cms/banner/bannerService';

const BannerComponent = () => {
  const [bannerProduct, setBannerProduct] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);

  const nextImage = () => {
    setCurrentImage(prev => (prev + 1) % bannerProduct.length);
  };

  const prevImage = () => {
    setCurrentImage(prev => (prev - 1 + bannerProduct.length) % bannerProduct.length);
  };

  const getBannerForHome = async () => {
    try {
      const response = await bannerSvc.getBannerForHomePage(0);
      setBannerProduct(response.result);
    } catch (exception) {
      setError('Failed to load banner.');
      console.error(exception);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBannerForHome();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      nextImage();
    }, 5000);

    return () => clearInterval(interval); // Clear interval on component unmount
  }, [bannerProduct]);

  return (
    <>
      <div className='ml-10 mr-10 mx-auto px-4 rounded'>
        <div className='h-full w-full bg-slate-200 relative'>
          <div className='absolute z-10 h-full w-full md:flex items-center hidden'>
            <div className='flex justify-between w-full text-2xl'>
              <button onClick={prevImage} className='bg-white shadow-md rounded-full p-1'><FaAngleLeft /></button>
              <button onClick={nextImage} className='bg-white shadow-md rounded-full p-1'><FaAngleRight /></button>
            </div>
          </div>
          <div className='flex h-full w-full overflow-hidden'>
            {
              bannerProduct && bannerProduct.length > 0 ? (
                bannerProduct.map((banner, index) => (
                  <div
                    className='w-full h-full min-w-full min-h-full transition-all'
                    key={index}
                    style={{ transform: `translateX(-${currentImage * 100}%)` }}
                  >
                    <img src={`${process.env.REACT_APP_IMAGE_URL}/${banner.image}`} alt={banner.name} className='h-full w-full' />
                  </div>
                ))
              ) : (
                <div className='flex justify-center items-center w-full'>
                  <p>No banners found.</p>
                </div>
              )
            }
          </div>
        </div>
      </div>
    </>
  );
};

export default BannerComponent;

