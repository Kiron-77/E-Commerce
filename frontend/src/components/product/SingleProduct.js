import React from 'react';
import { NavLink } from "react-router-dom";

export const SingleProduct = ({ product }) => {
    const showError = (e) => {
        e.target.src = "https://placehold.co/300x250?text=No+Image+Found";
    }

    return (
        <div className="bg-white shadow-md rounded-md overflow-hidden">
            <img
                onError={showError}
                src={`${process.env.REACT_APP_IMAGE_URL}/${product.images[0]}`}
                alt={product.title}
                className="w-full h-48 object-cover"
            />
            <div className="p-4">
                <h6 className="text-lg font-semibold">
                    <NavLink to={`/product/${product.slug}`} className="text-blue-600 hover:underline">
                        {product.title}
                    </NavLink>
                </h6>
                <p className="text-gray-700">
                    <span className="mr-2">Npr. {product.afterDiscount}</span>
                    {
                        product.discount > 0 && (
                            <span className="line-through text-red-500">Npr. {product.price}</span>
                        )
                    }
                </p>
                <div className="mt-2">
                    {product.category && product.category.map((cat, ind) => (
                        <span key={ind} className="bg-blue-100 text-blue-600 text-sm font-medium mr-2 px-2.5 py-0.5 rounded">
                            {cat.title}
                        </span>
                    ))}
                </div>
            </div>
            <div className="bg-yellow-500 text-center p-2">
                <NavLink to={`/product/${product.slug}`} className="text-white font-bold hover:underline">
                    Add To Cart
                </NavLink>
            </div>
        </div>
    );
}

const SingleProductItem = ({ product }) => {
    return (
        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2">
            <SingleProduct product={product} />
        </div>
    );
}

export default SingleProductItem;
