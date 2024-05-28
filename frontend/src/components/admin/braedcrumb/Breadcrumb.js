import { NavLink } from "react-router-dom"

const AdminBreadCrumb = ({data}) => {
    return (<>
    <ol className=" flex items-center gap-3 text-blue-600 ">
                {/* <li className="breadcrumb-item">
                    <NavLink to="/admin">Dashboard</NavLink>
                </li> */}
            {
                data.map((item,ind) => (
                    <li key={ind} className={` active:bg-violet-700 ${item.link === null ? 'active' : ''}`}>
                        {
                            item.link ? <>
                                <NavLink to={item.link}>{ item.title}</NavLink>
                            </> : item.title
                        }
                    </li>
                ))
             }
            </ol>
    </>)
}
export default AdminBreadCrumb
