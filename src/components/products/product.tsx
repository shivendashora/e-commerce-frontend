import { useEffect, useState } from "react"
import { Link, useLocation, useParams } from "react-router-dom"
import { fetchProductById, type Product as ProductType } from "../../api/products"
import { useLoading } from "../../../context/loading-context"

function ImagePlaceholder(){
    return(
        <div className="flex flex-col items-center gap-2 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-16 h-16">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <circle cx="9" cy="9" r="2"/>
                <path d="m21 15-5-5L5 21"/>
            </svg>
            <span className="text-sm">No image</span>
        </div>
    )
}

function Stars({rating}:{rating: number}){
    return(
        <span className="text-[20px] tracking-wide">
            {[1, 2, 3, 4, 5].map((n)=>(
                <span key={n} className={n <= Math.round(rating) ? "text-red-600" : "text-gray-300"}>★</span>
            ))}
        </span>
    )
}

export default function Product(){
    const { id } = useParams()
    const productId = Number(id)
    const location = useLocation()
    const { updateLoadingState } = useLoading()

    // the card passes the product it was showing, so the page opens instantly;
    // on a refresh or a direct link it is fetched instead
    const passed = (location.state as { product?: ProductType } | null)?.product
    const [product, setProduct] = useState<ProductType | null>(passed?.id === productId ? passed : null)
    const [error, setError] = useState("")
    const [selected, setSelected] = useState(0)
    const [failed, setFailed] = useState<string[]>([])
    const [viewerOpen, setViewerOpen] = useState(false)

    useEffect(()=>{
        if (product?.id === productId) return
        updateLoadingState(true)
        fetchProductById(productId)
            .then((data)=>setProduct(data))
            .catch((err)=>setError(err instanceof Error ? err.message : "Could not load the product"))
            .finally(()=>updateLoadingState(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productId])

    // close the full screen viewer with Escape
    useEffect(()=>{
        if (!viewerOpen) return
        const onKey = (e: KeyboardEvent)=>{ if (e.key === "Escape") setViewerOpen(false) }
        window.addEventListener("keydown", onKey)
        return ()=>window.removeEventListener("keydown", onKey)
    }, [viewerOpen])

    if (error) {
        return(
            <div className="min-h-[calc(100vh-64px)] bg-gray-50 px-8 py-8">
                <p className="text-red-600 mb-4">{error}</p>
                <Link to="/home" className="text-red-600 font-semibold">← Back to products</Link>
            </div>
        )
    }

    if (!product) return <div className="min-h-[calc(100vh-64px)] bg-gray-50"/>

    // only one image per product today; the gallery takes a list so more can be added later
    const images = [product.thumbnail_path].filter((src): src is string => !!src && !failed.includes(src))
    const current = images[Math.min(selected, images.length - 1)]

    return(
        <div className="min-h-[calc(100vh-64px)] bg-gray-50">
            <div className="px-8 pt-6">
                <Link to="/home" className="text-sm text-red-600 font-semibold">← Back to products</Link>
            </div>

            <div className="px-8 py-6 grid grid-cols-1 md:grid-cols-2 gap-10">

                {/* gallery: thumbnails on the left, large image on the right */}
                <div className="flex gap-4 md:sticky md:top-6 self-start">
                    {images.length > 1 && (
                        <div className="flex flex-col gap-3">
                            {images.map((src, i)=>(
                                <button
                                    key={src}
                                    type="button"
                                    onClick={()=>setSelected(i)}
                                    className={`w-[64px] h-[64px] rounded-lg overflow-hidden bg-white border-2 cursor-pointer ${src === current ? "border-red-600" : "border-gray-200"}`}
                                >
                                    <img src={src} alt={`${product.name} ${i + 1}`} className="w-full h-full object-contain"/>
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="flex-1 aspect-square bg-white rounded-2xl shadow-md overflow-hidden flex items-center justify-center">
                        {current ? (
                            <img
                                src={current}
                                alt={product.name}
                                onClick={()=>setViewerOpen(true)}
                                onError={()=>setFailed((prev)=>[...prev, current])}
                                className="w-full h-full object-contain p-6 cursor-zoom-in"
                            />
                        ) : (
                            <ImagePlaceholder/>
                        )}
                    </div>
                </div>

                {/* details */}
                <div className="flex flex-col gap-4">
                    <h1 className="text-[28px] font-bold text-gray-800 leading-tight">
                        {product.name}
                    </h1>

                    {product.ratings !== null ? (
                        <div className="flex items-center gap-2">
                            <span className="text-gray-700 font-semibold">{product.ratings.toFixed(1)}</span>
                            <Stars rating={product.ratings}/>
                        </div>
                    ) : (
                        <span className="text-sm text-gray-500">No ratings yet</span>
                    )}

                    <hr className="border-gray-200"/>

                    <div className="flex items-start text-red-600 font-bold">
                        <span className="text-[18px] mt-1">₹</span>
                        <span className="text-[36px] leading-none">{Math.floor(product.price)}</span>
                        <span className="text-[18px] mt-1">{product.price.toFixed(2).split(".")[1]}</span>
                    </div>
                    <span className="text-sm text-gray-500 -mt-2">Inclusive of all taxes</span>

                    <hr className="border-gray-200"/>

                    <div className="flex flex-col gap-2">
                        <h2 className="text-[18px] font-bold text-gray-800">About this item</h2>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                            {product.description}
                        </p>
                    </div>
                </div>
            </div>

            {/* full screen image viewer */}
            {viewerOpen && current && (
                <div
                    className="fixed inset-0 z-40 bg-black/80 flex items-center justify-center p-8"
                    onClick={()=>setViewerOpen(false)}
                >
                    <button
                        type="button"
                        onClick={()=>setViewerOpen(false)}
                        className="absolute top-4 right-6 text-white text-[32px] cursor-pointer"
                        aria-label="Close"
                    >
                        ×
                    </button>
                    <img
                        src={current}
                        alt={product.name}
                        onClick={(e)=>e.stopPropagation()}
                        className="max-w-full max-h-full object-contain bg-white rounded-2xl"
                    />
                </div>
            )}
        </div>
    )
}
