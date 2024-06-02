import React, { useCallback, useEffect, useState } from 'react'
import BannerComponent from '../../components/frontend/BannerComponent'
import BrandList from '../../components/frontend/BrandList'
import CategoryList from '../../components/frontend/CategoryList'
import ProductGridList from '../../components/product/ProductGridList'
import productSvc from '../cms/products/productService'

const HomePage = () => {
  const [product, setProduct] = useState()
  const getProductList = useCallback(async () => {
    try {
      const productResponse = await productSvc.getProductForHome()
      setProduct(productResponse.result)
    } catch (exception) {
      console.log(exception)
    }
  }, [])
  useEffect(() => {
    getProductList()
  }, [])
  return (<>
    <div>
      <CategoryList />
      <BannerComponent />
      <BrandList/>
    </div>
    <div className="container mx-auto my-8">
        <div className="mb-4">
          <h4 className="text-xl font-bold">Just For You</h4>
        </div>
        <ProductGridList products={product} />
      </div>

  </>)
}

export default HomePage
