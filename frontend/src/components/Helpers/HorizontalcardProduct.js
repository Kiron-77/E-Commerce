// import React, { useEffect, useState } from 'react'
// import categoryWiseProduct from './CategoryWiseProduct'
// // import categoryWiseProduct from './categoryWiseProduct'

// const HorizontalcardProduct = ({ category, heading }) => {
//     const [data, setData] = useState([])
//     const [loading, setLoading] = useState(false)
//     const loadingList = new Array(13).fill(null)

//     const fetchData = async () => {
//         setLoading(true)
//         const categoryProduct = await categoryWiseProduct(category)
//         setLoading(false)
//         setData(categoryProduct?.data)
//     }
//     useEffect(() => {
//         fetchData()
//     })
//     return (<>
//         <div className='container mx-auto px-4 my-6 '>
//             <h2 className='text-2xl font-bold py-4'>{heading}</h2>
//             {
//                 data.map((product, index) => {
//                     return (
//                         <div className='w-full min-w-[200px] md:min-w-[320px] max-w-[200px] md:max-w-[320px] h-36 bg-white rounded-sm shadow flex'>
//                             <div className='bg-slate-200 h-full p-2 min-w-[120px] md:min-w[145px]'>
//                                 <img src={product.productImage[0]} />
//                             </div>
//                         </div>

//                     )
//                 })
//             }
//         </div>
//     </>)
// }

// export default HorizontalcardProduct
