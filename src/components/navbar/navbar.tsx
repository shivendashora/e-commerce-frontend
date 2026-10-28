import { NavLink, useNavigate } from "react-router-dom"
import { logout } from "../../api/auth"
import { useCart } from "../../../context/cart-context"

const links = [
    { to: "/home", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/contacts", label: "Contacts" },
    { to: "/list-product", label: "List Product" },
]

export default function Navbar(){
    const navigate = useNavigate()
    const { itemCount, clearCart } = useCart()

    function handleLogout(){
        logout()
        clearCart()
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

                <NavLink
                    to="/cart"
                    className={({isActive})=>
                        `relative flex items-center gap-1 font-medium hover:opacity-80 ${isActive ? "underline underline-offset-8 decoration-2" : ""}`
                    }
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                        <circle cx="9" cy="20" r="1.5"/>
                        <circle cx="18" cy="20" r="1.5"/>
                        <path d="M2 3h3l2.4 11.2a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.5L21 7H6"/>
                    </svg>
                    Cart
                    {itemCount > 0 && (
                        <span className="absolute -top-2 left-3 min-w-[18px] h-[18px] px-1 rounded-full bg-white text-red-600 text-[11px] font-bold flex items-center justify-center">
                            {itemCount}
                        </span>
                    )}
                </NavLink>

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
