import { Navigate, Outlet } from "react-router-dom"
import { getToken } from "../../api/cookies"
import Navbar from "../navbar/navbar"

// Wraps every page that needs a logged in user: sends guests back to login and shows the navbar
export default function ProtectedLayout(){
    if (!getToken()) return <Navigate to="/" replace />

    return(
        <>
            <Navbar/>
            <Outlet/>
        </>
    )
}
