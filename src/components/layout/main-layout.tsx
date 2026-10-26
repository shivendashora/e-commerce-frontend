import { Oval } from "react-loader-spinner";
import { useLoading } from "../../../context/loading-context";
import { Outlet } from "react-router-dom"

export default function LoadingContext() {

    const { loading } = useLoading()


    return (
        <>
            {loading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                    <Oval
                        height={60}
                        width={60}
                        color="#be1c1c"
                        ariaLabel="loading"
                        visible={true}
                    />
                </div>
            )}
            <Outlet />
        </>

    );
}
