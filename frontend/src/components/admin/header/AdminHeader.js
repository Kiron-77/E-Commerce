import { useContext } from "react";
import { FaMoon } from "react-icons/fa6";
import { PiListDashesBold } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { ThemeContext } from '../../../config/Theme.config';
const AdminHeader = () => {
    const navigate = useNavigate()
    const { theme, toggleTheme } = useContext(ThemeContext)
    // ToDo:when web storage
    // Uncomment Below to persist sidebar toggle between refreshes
    // if (localStorage.getItem('sb|sidebar-toggle') === 'true') {
    //     document.body.classList.toggle('sb-sidenav-toggled');
    // }
    const sidebarToggle = (e) => {
        e.preventDefault()
        document.body.classList.toggle("sb-sidenav-toggled")
        // ToDo
        // localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
    }
    const logout = (e) => {
        e.preventDefault()
        Swal.fire({
            title: "Are you sure?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Logout"
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem("_au")
                localStorage.removeItem("_ud")
                navigate("/login")
            }
        });

    }

    return (<>
        <header className={`h-16 flex items-center px-4 md:w-full lg:w-full sm:wf bg-black ${theme === "light" ? "bg-black text-white" : "bg-white text-black"
            }`}>
            <div className='h-full container mx-auto flex items-center mr-36  '>
                <h1 className="font-bold text-xl ">Admin Panel</h1>
                <div className=" font-weight-600 text-xl ml-16 gap-12">
                    <button onClick={sidebarToggle} size="sm" variant="link" className="order-1 order-lg-0 me-4 me-lg-0">
                        <i className={`-${theme === 'light' ? 'dark' : 'light'}`}><PiListDashesBold /></i>
                    </button>
                    <button onClick={toggleTheme} size="sm" variant="link">
                        <FaMoon />
                    </button>
                </div>
            </div>
        </header>
    </>
    )
}

export default AdminHeader
