import React from 'react'
import { NavLink } from 'react-router-dom'

const SidebarMenu = ({ url, icon, name }) => {
    return (<>
        <NavLink className='nav-link -mt-0 relative ' to={url} >
            <div className='nav-link  mt-1 absolute'>
                {icon}
            </div>
            <div className='ml-7 -mb-1 '>
                {name}
            </div>

        </NavLink>
    </>)
}

export default SidebarMenu
