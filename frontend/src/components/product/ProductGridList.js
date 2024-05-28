import React from "react";
import SingleProductItem from "./SingleProduct";

const ProductGridList = ({ products }) => {
  return ( <>
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products && products.map((prod, ind) => (
        <React.Fragment key={ind}>
          <SingleProductItem product={prod} />
        </React.Fragment>
      ))}
    </div>
    </> )
}

export default ProductGridList
