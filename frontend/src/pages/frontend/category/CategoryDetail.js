
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductGridList from "../../../components/product/ProductGridList";
import categorySvc from "../../cms/category/categoryService";


const CategoryDetail = () => {
  const params = useParams();
  const [products, setProducts] = useState();

  const getCategoryDetail = useCallback(async () => {
    try {
      const detail = await categorySvc.getCategoryDetail(params.slug);
      setProducts(detail.result);
    } catch (exception) {
      console.log(exception);
    }
  }, [params]);

  useEffect(() => {
    getCategoryDetail();
  }, [getCategoryDetail]);
  return (<>
          <div className="container mx-auto my-2 py-2">
      <div className="mb-4">
        <h4 className="text-xl font-bold text-blue-500">Categorywise Products</h4>
      </div>
      <div className="my-3">
        {products && products.length > 0 ? (
          <ProductGridList products={products} />
        ) : (
          <p className="text-red-500">No products found</p>
        )}
      </div>
    </div>

    </>)
}

export default CategoryDetail
