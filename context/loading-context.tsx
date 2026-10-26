import { createContext, useContext, useState, type ReactNode } from "react";

interface LoadingContextValue {
    loading: boolean
    updateLoadingState: (state: boolean) => void
}

const loadingContext = createContext<LoadingContextValue | null>(null)


export default function LoadingProvider({children}:{children: ReactNode}){
    const [loading,setLoading] = useState(false)
    const updateLoadingState=(state:boolean)=>{
        setLoading(state)
    }

    return(
        <loadingContext.Provider value={{loading, updateLoadingState}}>
                {children}
        </loadingContext.Provider>
    )
}
export function useLoading(){
    const context = useContext(loadingContext)
    if (!context) throw new Error("useLoading must be used inside <LoadingProvider>")
    return context
}
