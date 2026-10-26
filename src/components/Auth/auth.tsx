import { useState } from "react"
import Login from "./login";
import SignUp from "./sign-up";

export default function Auth() {

    const [isLogin, setLogin] = useState(true);

    return (
        <>
            {isLogin ? <Login setLogin = {setLogin}/> : <SignUp setLogin = {setLogin} />}
        </>
    )


}