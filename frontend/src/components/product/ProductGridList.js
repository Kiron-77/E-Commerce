import React from "react";
import SingleProductItem from "./SingleProduct";

const ProductGridList = ({ products }) => {
  return ( <>
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-5">
      {products && products.map((prod, ind) => (
        <React.Fragment key={ind}>
          <SingleProductItem product={prod} />
        </React.Fragment>
      ))}
    </div>
    </> )
}

export default ProductGridList
