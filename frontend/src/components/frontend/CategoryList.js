import React, { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import categorySvc from '../../pages/cms/category/categoryService';

const CategoryList = () => {
  const [categoryProduct, setCategoryProduct] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const listRef = useRef(null);

  const getCategoryForHome = async () => {
    try {
      const response = await categorySvc.getCategoryForHomePage();
      setCategoryProduct(response.result);
    } catch (exception) {
      setError('Failed to load categories.');
      console.error(exception);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategoryForHome();
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
  }, [categoryProduct]);

  return (
    <div className='category-list-container  mx-auto'>
      <div className='category-list flex items-center' ref={listRef}>
        {categoryProduct && categoryProduct.length > 0 ? (
          <>
            {categoryProduct.map((category, index) => (
              <div key={index} className="block my-4 category-item">
                <NavLink to={"/category/" + category.slug} className='cursor-pointer'>
                  <div className='w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden p-3 bg-slate-200 flex items-center justify-center'>
                    <img
                      src={`${process.env.REACT_APP_IMAGE_URL}/${category.image}`}
                      alt={category.name}
                      className='h-full object-scale-down mix-blend-multiply hover:scale-125 transition-all'
                    />
                  </div>
                </NavLink>
                <p className='text-center text-sm md:text-base capitalize'>{category?.title}</p>
              </div>
            ))}
            {categoryProduct.map((category, index) => (
              <div key={index + categoryProduct.length} className="block my-4 category-item">
                <NavLink to={"/category/" + category.slug} className='cursor-pointer'>
                  <div className='w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden p-3 bg-slate-200 flex items-center justify-center'>
                    <img
                      src={`${process.env.REACT_APP_IMAGE_URL}/${category.image}`}
                      alt={category.name}
                      className='h-full object-scale-down mix-blend-multiply hover:scale-125 transition-all'
                    />
                  </div>
                </NavLink>
                <p className='text-center text-sm md:text-base capitalize'>{category?.title}</p>
              </div>
            ))}
          </>
        ) : (
          <div className='flex justify-center items-center w-full'>
            <p>No categories found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryList;







