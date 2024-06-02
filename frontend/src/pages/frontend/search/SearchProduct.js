import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { SingleProduct } from '../../../components/product/SingleProduct';
import productSvc from '../../cms/products/productService';

const SearchProduct = () => {
    const location = useLocation();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const query = new URLSearchParams(location.search).get('q');

    console.log("query", query);

    const searchProduct = async () => {
        setLoading(true);
        try {
            const response = await productSvc.getSearchProduct(query);
            console.log(response);
            setData(response.result);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (query) {
            searchProduct();
        }
    }, [query]);

    return (
        <div className='container mx-auto p-4'>
            {
                loading && (
                <p className='text-lg text-center'>Loading....</p>
                )
            }
            {
                <p className='className="text-xl font-bold" my-3'>Search Results: {data.length}</p>
            }
            {
                !loading && data.length === 0 && (
                <p className='bg-white text-lg text-center p-4'>No Data Found...</p>
                )
            }
            {
                !loading && data.length !== 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-5">
                        {
                            data.map((product, index) => (
                                <SingleProduct key={index} product={product} />    
                            ))
                        }       
                </div>
                )
            }
        </div>
    );
};

export default SearchProduct;








