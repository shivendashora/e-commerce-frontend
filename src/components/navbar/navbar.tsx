import { NavLink, useNavigate } from "react-router-dom"
import { logout } from "../../api/auth"

const links = [
    { to: "/home", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/contacts", label: "Contacts" },
    { to: "/list-product", label: "List Product" },
]

export default function Navbar(){
    const navigate = useNavigate()

    function handleLogout(){
        logout()
        navigate("/", { replace: true })
    }

    return(
        <nav className="sticky top-0 z-30 bg-red-600 text-white w-full h-[64px] px-8 flex items-center justify-between shadow-md">
            <span className="font-bold text-[22px]">
                E-Shop
            </span>

            <div className="flex items-center gap-8">
                {links.map((link)=>(
                    <NavLink
                        key={link.to}
                        to={link.to}
                        className={({isActive})=>
                            `font-medium hover:opacity-80 ${isActive ? "underline underline-offset-8 decoration-2" : ""}`
                        }
                    >
                        {link.label}
                    </NavLink>
                ))}

                <button
                    type="button"
                    onClick={handleLogout}
                    className="px-5 py-1.5 rounded-full border-2 border-white font-semibold cursor-pointer hover:bg-white hover:text-red-600 transition"
                >
                    Logout
                </button>
            </div>
        </nav>
    )
}
