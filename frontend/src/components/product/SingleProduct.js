import React from 'react';
import { NavLink } from "react-router-dom";

export const SingleProduct = ({ product }) => {
    const showError = (e) => {
        e.target.src = "https://placehold.co/300x250?text=No+Image+Found";
    }

    return (
        <div className='container mx-auto '>
            <div className='w-full min-w-[120]] md:min-w-[240px] max-w-[240px] md:max-w-[2800px] bg-white rounded-lg shadow-lg flex flex-col'>
                <div className='bg-slate-300 p-2 h-48 md:h-56 flex items-center justify-center rounded-lg'>
                    <img
                        onError={showError}
                        src={`${process.env.REACT_APP_IMAGE_URL}/${product.images[0]}`}
                        alt={product.title}
                        className='max-h-full object-scale-down hover:scale-110 transition-all mix-blend-multiply'
                    />
                </div>

                <div className="p-2 flex-grow text-center rounded-full">
                    <h6 className="text-lg font-semibold">
                        <NavLink to={`/product/${product.slug}`} className="text-blue-600 hover:underline">
                            {product.title}
                        </NavLink>
                    </h6>
                    <p className="text-red-500 text-xl font-semibold ">
                        <span className="mr-2">Npr. {product.afterDiscount}</span>
                        {
                            product.discount > 0 && (
                                <span className="line-through text-gray-700 text-sm">Npr. {product.price}</span>
                                
                            )
                        }
                        <span className='ml-3 text-gray-700 text-sm'>-{product.discount}%</span>
                    </p>
                    
                    <div className="mt-2" >
                        {product.category && product.category.map((cat, ind) => (
                            <span key={ind} className="bg-blue-100 text-blue-600 text-sm font-medium mr-2 px-2.5 py-0.5 rounded">
                                {cat.title}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="bg-yellow-500 hover:bg-yellow-600 hover:scale-105 rounded-full text-center transition-all p-2">
                    <NavLink to={`/product/${product.slug}`} className="text-white font-bold  hover:underline">
                        Add To Cart
                    </NavLink>
                </div>
            </div>
        </div>
    );
}

const SingleProductItem = ({ product }) => {
    return (
        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-2 mb-2">
            <SingleProduct product={product} />
        </div>
    );
}

export default SingleProductItem;


