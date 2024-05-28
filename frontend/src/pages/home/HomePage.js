import React from 'react'
import BannerComponent from '../../components/frontend/BannerComponent'
import CategoryList from '../../components/frontend/CategoryList'

const HomePage = () => {
  return (
    <div>
      <CategoryList />
      <BannerComponent/>
    </div>
  )
}

export default HomePage
