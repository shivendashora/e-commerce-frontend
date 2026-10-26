import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { useLoading } from "../../../context/loading-context"
import { signup } from "../../api/auth"

interface SignUpInterface{
    setLogin:(state:boolean)=>void

}


export default function Signup({setLogin}:SignUpInterface){
    const navigate = useNavigate()
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")
    const { loading, updateLoadingState } = useLoading()

    async function handleSignup(e: FormEvent<HTMLFormElement>){
        e.preventDefault()
        setError("")
        if (password !== confirmPassword) {
            setError("Passwords do not match")
            return
        }
        updateLoadingState(true)
        try {
            await signup(username, email, password)
            navigate("/home", { replace: true })
        } catch (err) {
            setError(err instanceof Error ? err.message : "Signup failed")
        } finally {
            updateLoadingState(false)
        }
    }

    return(
        <div className="bg-red-600 w-full min-h-screen flex items-center justify-center ">


            <form className="w-[500px] py-12 bg-white shadow-2xl text-gray-800 flex flex-col gap-5 items-center justify-center rounded-[10%]" onSubmit={handleSignup}>


                <span className="text-red-600 font-bold text-[30px]">
                    Signup
                </span>
                <div className="flex flex-col gap-2">
                    <label htmlFor="signup-username">Username</label>
                    <input id="signup-username" type="text" placeholder="Username" required minLength={3} maxLength={100} value={username} onChange={(e)=>setUsername(e.target.value)} className="w-[400px] h-[50px] rounded-[20px] px-4 py-4 border border-gray-300 placeholder-gray-400 focus:outline-none focus:border-red-600" />
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="signup-email">Email</label>
                    <input id="signup-email" type="email" placeholder="Email" required value={email} onChange={(e)=>setEmail(e.target.value)} className="w-[400px] h-[50px] rounded-[20px] px-4 py-4 border border-gray-300 placeholder-gray-400 focus:outline-none focus:border-red-600" />
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="signup-password">Create Password</label>
                    <input id="signup-password" type="password" placeholder="Password" required minLength={8} value={password} onChange={(e)=>setPassword(e.target.value)} className="w-[400px] h-[50px] rounded-[20px] px-4 py-4 border border-gray-300 placeholder-gray-400 focus:outline-none focus:border-red-600" />
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="signup-confirm-password">Re enter Password</label>
                    <input id="signup-confirm-password" type="password" placeholder="Password" required value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} className="w-[400px] h-[50px] rounded-[20px] px-4 py-4 border border-gray-300 placeholder-gray-400 focus:outline-none focus:border-red-600" />
                </div>

                {error && <p className="w-[400px] text-sm text-red-600">{error}</p>}

                <button type="submit" disabled={loading} className="w-[150px] h-[40px] rounded-full text-white font-semibold bg-red-600 hover:bg-red-700 cursor-pointer disabled:opacity-60 ">
                    {loading ? "Signing up..." : "Signup"}
                </button>
                <button type="button" className="text-red-600 underline cursor-pointer" onClick={()=>{
                    setLogin(true)
                }}>
                    Login
                </button>

            </form>
        </div>
    )
}
