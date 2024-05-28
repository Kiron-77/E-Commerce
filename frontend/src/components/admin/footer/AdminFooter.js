import React from 'react'
import { Link } from 'react-router-dom'
const AdminFooter = () => {
    return (<>
        <footer className='bg-slate-200'>
            <div className='container max-auto p-4 '>
                <div className='flex items-center px-4 justify-between'>
                    <p className='  text-blue-700 hover:text-red-700 hover:underline ml-72' title='Github/kiron-77'> Copyright &copy; Your Website 2023</p>
                    <Link className=' text-blue-700 hover:text-red-700 hover:underline'>Privacy Policy Terms &amp; Conditions</Link>
                </div>
            </div>
        </footer>
    </>)
}

export default AdminFooter
