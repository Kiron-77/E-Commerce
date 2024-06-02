
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductGridList from "../../../components/product/ProductGridList";
import brandSvc from "../../cms/brand/brandService";

const BrandDetail = () => {
  const params = useParams();
  const [products, setProducts] = useState();

  const getBrandDetail = useCallback(async () => {
    try {
      const detail = await brandSvc.getBrandDetail(params.slug);
      setProducts(detail.result);
    } catch (exception) {
      console.log(exception);
    }
  }, [params]);

  useEffect(() => {
    getBrandDetail();
  }, [getBrandDetail]);
  return (<>
    <div className="container mx-auto my-2 py-2">
      <div className="mb-4 mt-4">
        <h4 className="text-xl font-bold text-blue-500">Brandwise Products</h4>
      </div>
      <div className="my-3">
        {
          products && products.length > 0 ? (
            <ProductGridList products={products} />
          ) : (
            <p className="text-red-500">No products found</p>
          )
        }
      </div>
    </div>
  </>)
}

export default BrandDetail



