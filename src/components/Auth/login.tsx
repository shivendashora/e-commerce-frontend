import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { useLoading } from "../../../context/loading-context"
import { login } from "../../api/auth"

interface LoginInterface{
    setLogin:(state:boolean)=>void

}

export default function Login({setLogin}:LoginInterface){
    const navigate = useNavigate()
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const { loading, updateLoadingState } = useLoading()

    async function handleLogin(e: FormEvent<HTMLFormElement>){
        e.preventDefault()
        setError("")
        updateLoadingState(true)
        try {
            await login(username, password)
            navigate("/home", { replace: true })
        } catch (err) {
            setError(err instanceof Error ? err.message : "Login failed")
        } finally {
            updateLoadingState(false)
        }
    }

    return(
        <div className="bg-red-600 w-full min-h-screen flex items-center justify-center ">


            <form className="w-[500px] h-[600px] bg-white shadow-2xl text-gray-800 flex flex-col gap-5 items-center justify-center rounded-[10%] " onSubmit={handleLogin}>


                <span className="text-red-600 font-bold text-[30px]">
                    Login
                </span>
                <div className="flex flex-col gap-2">
                    <label htmlFor="login-username">Username</label>
                    <input id="login-username" type="text" placeholder="Username" required value={username} onChange={(e)=>setUsername(e.target.value)} className="w-[400px] h-[50px] rounded-[20px] px-4 py-4 border border-gray-300 placeholder-gray-400 focus:outline-none focus:border-red-600" />
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="login-password">Password</label>
                    <input id="login-password" type="password" placeholder="Password" required value={password} onChange={(e)=>setPassword(e.target.value)} className="w-[400px] h-[50px] rounded-[20px] px-4 py-4 border border-gray-300 placeholder-gray-400 focus:outline-none focus:border-red-600" />
                </div>

                {error && <p className="w-[400px] text-sm text-red-600">{error}</p>}

                <button type="submit" disabled={loading} className="w-[150px] h-[40px] rounded-full text-white font-semibold bg-red-600 hover:bg-red-700 cursor-pointer disabled:opacity-60 ">
                    {loading ? "Logging in..." : "Login"}
                </button>
                <button type="button" className="text-red-600 underline cursor-pointer"
                 onClick={()=>{
                    setLogin(false)
                 }}>
                    Signup
                </button>

            </form>
        </div>
    )
}
