import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import categorySvc from '../../pages/cms/category/categoryService';

const CategoryList = () => {
  const [categoryProduct, setCategoryProduct] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <div className='ml-10 mr-10 mx-auto'>
      <div className=' flex items-center gap-6 justify-between overflow-scroll scrollbar-none'>
        {
          categoryProduct && categoryProduct.length > 0 ? (
            categoryProduct.map((category, index) => (
              <a target="_new" href={category.url} key={index} className="block my-4">
                <NavLink to={"/category/" + category.slug} className='cursor-pointer'>
                  <div className='w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden p-3 bg-slate-200 flex items-center justify-center'>
                    <img src={`${process.env.REACT_APP_IMAGE_URL}/${category.image}`} alt={category.name} className='h-full object-scale-down mix-blend-multiply hover:scale-125 transition-all' />
                  </div>
                </NavLink>
                <p className='text-center text-sm md:text-base capitalize'>{category?.title}</p>
              </a>
            ))
          ) : (
            <div className='flex justify-center items-center w-full'>
              <p>No categories found.</p>
            </div>
          )
        }
      </div>
    </div>
  );
};

export default CategoryList;



