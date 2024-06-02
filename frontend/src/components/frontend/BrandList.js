import React, { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import brandSvc from '../../pages/cms/brand/brandService';

const BrandList = () => {
  const [brandProduct, setBrandProduct] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const listRef = useRef(null);

  const getBrandForHome = async () => {
    try {
      const response = await brandSvc.getBrandForHomePage();
      setBrandProduct(response.result);
    } catch (exception) {
      setError('Failed to load brands.');
      console.error(exception);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBrandForHome();
  }, []);

  useEffect(() => {
    const container = listRef.current;

    const pauseAnimation = () => {
      container.style.animationPlayState = 'paused';
    };
    const resumeAnimation = () => {
      container.style.animationPlayState = 'running';
    };

    container.addEventListener('mouseenter', pauseAnimation);
    container.addEventListener('mouseleave', resumeAnimation);

    return () => {
      container.removeEventListener('mouseenter', pauseAnimation);
      container.removeEventListener('mouseleave', resumeAnimation);
    };
  }, [brandProduct]);

  return (
    <div className='brand-list-container mx-auto mt-5'>
      <h4 className="text-xl font-bold ml-12 mb-3">Top Brands List</h4>
      <div className='brand-list flex items-center' ref={listRef}>
        {
          brandProduct && brandProduct.length > 0 ? (
            <>
              {
                brandProduct.map((brand, index) => (
                  <div key={index} className="block my-4 brand-item">
                    <NavLink to={"/brand/" + brand.slug} className='cursor-pointer'>
                      <div className='w-full min-w-[40px] md:min-w-[80px] max-w-[80px] md:max-w-[100px] bg-white rounded-lg shadow-lg flex flex-col'>
                        <div className='bg-zinc-300 p-2 h-32 md:h-36 flex items-center justify-center rounded-lg'>
                          <img
                            src={`${process.env.REACT_APP_IMAGE_URL}/${brand.image}`}
                            alt={brand.name}
                            title={brand.title}
                            className='h-full object-scale-down mix-blend-multiply hover:scale-125 transition-all'
                          />
                        </div>
                      </div>
                    </NavLink>
                    <p className='text-center text-sm md:text-base capitalize'>{brand?.title}</p>
                  </div>
                ))
              }
              {
                brandProduct.map((brand, index) => (
                  <div key={index + brandProduct.length} className="block my-4 brand-item">
                    <NavLink to={"/brand/" + brand.slug} className='cursor-pointer'>
                      <div className='w-full min-w-[40px] md:min-w-[80px] max-w-[80px] md:max-w-[100px] bg-white rounded-lg shadow-lg flex flex-col'>
                        <div className='bg-zinc-300 p-2 h-32 md:h-36 flex items-center justify-center rounded-lg'>
                          <img
                            src={`${process.env.REACT_APP_IMAGE_URL}/${brand.image}`}
                            alt={brand.name}
                            className='h-full object-scale-down mix-blend-multiply hover:scale-125 transition-all'
                          />
                        </div>
                      </div>
                    </NavLink>
                    <p className='text-center text-sm md:text-base capitalize'>{brand?.title}</p>
                  </div>
                ))
              }
            </>
          ) : (
            <div className='flex justify-center items-center w-full'>
              <p>No brand found.</p>
            </div>
          )
        }
      </div>
    </div>
  );
}

export default BrandList;


