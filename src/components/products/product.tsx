import { useEffect, useState } from "react"
import { Link, useLocation, useNavigate, useParams } from "react-router-dom"
import { fetchProductById, type Product as ProductType } from "../../api/products"
import { useLoading } from "../../../context/loading-context"
import { useCart } from "../../../context/cart-context"

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

function Stars({rating, size = "text-[20px]"}:{rating: number, size?: string}){
    return(
        <span className={`${size} tracking-wide`}>
            {[1, 2, 3, 4, 5].map((n)=>(
                <span key={n} className={n <= Math.round(rating) ? "text-red-600" : "text-gray-300"}>★</span>
            ))}
        </span>
    )
}

function formatPrice(price: number){
    return price.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

// remount for every product id, so gallery, quantity and messages reset when moving between products
export default function Product(){
    const { id } = useParams()
    return <ProductPage key={id}/>
}

function ProductPage(){
    const { id } = useParams()
    const productId = Number(id)
    const location = useLocation()
    const { updateLoadingState } = useLoading()
    const { addToCart } = useCart()
    const navigate = useNavigate()

    // the card passes the product it was showing, so the page opens instantly;
    // on a refresh or a direct link it is fetched instead
    const passed = (location.state as { product?: ProductType } | null)?.product
    const [product, setProduct] = useState<ProductType | null>(passed?.id === productId ? passed : null)
    const [error, setError] = useState("")
    const [selected, setSelected] = useState(0)
    const [failed, setFailed] = useState<string[]>([])
    const [viewerOpen, setViewerOpen] = useState(false)
    const [quantity, setQuantity] = useState(1)
    const [added, setAdded] = useState(false)

    useEffect(()=>{
        window.scrollTo(0, 0)
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

    function handleAddToCart(){
        if (!product) return
        addToCart(product, quantity)
        setAdded(true)
    }

    // Amazon style: put the item in the cart and go straight to it
    function handleBuyNow(){
        if (!product) return
        addToCart(product, quantity)
        navigate("/cart")
    }

    if (error) {
        return(
            <div className="min-h-[calc(100vh-64px)] bg-gray-50 flex items-center justify-center px-4">
                <div className="bg-white rounded-xl border border-gray-200 p-10 max-w-[440px] w-full flex flex-col items-center gap-4 text-center">
                    <ImagePlaceholder/>
                    <h1 className="text-[22px] font-bold text-gray-800">
                        {error === "Product not found" ? "This product is not available" : "Something went wrong"}
                    </h1>
                    <p className="text-gray-500">
                        {error === "Product not found"
                            ? "It may have been removed, or the link is incorrect."
                            : error}
                    </p>
                    <Link to="/home" className="mt-2 h-[46px] px-8 rounded-full flex items-center text-white font-semibold bg-red-600">
                        Browse products
                    </Link>
                </div>
            </div>
        )
    }

    if (!product) return <div className="min-h-[calc(100vh-64px)] overflow-hidden bg-gray-50"/>

    // only one image per product today; the gallery takes a list so more can be added later
    const images = [product.thumbnail_path].filter((src): src is string => !!src && !failed.includes(src))
    const current = images[Math.min(selected, images.length - 1)]
    const listedOn = product.createdAt
        ? new Date(product.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
        : null

    return(
        <div className="min-h-[calc(100vh-64px)] overflow-hidden bg-gray-50">
            <div className="w-full px-4 md:px-8 py-6 text-gray-800">

                <nav className="text-sm text-gray-500 mb-4 truncate">
                    <Link to="/home" className="text-red-600">Home</Link>
                    <span className="mx-2">/</span>
                    <span>{product.name}</span>
                </nav>

                <div className="bg-white rounded-xl border border-gray-200 grid grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">

                    {/* left: gallery and purchase buttons, stays in view while the details scroll */}
                    <div className="p-4 md:p-6 lg:border-r border-gray-200">
                        <div className="lg:sticky lg:top-[88px] flex flex-col gap-4">
                            <div className="flex gap-3">
                                {images.length > 1 && (
                                    <div className="flex flex-col gap-2">
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

                                <div className="flex-1 aspect-square max-h-[480px] rounded-lg border border-gray-200 overflow-hidden flex items-center justify-center">
                                    {current ? (
                                        <img
                                            src={current}
                                            alt={product.name}
                                            onClick={()=>setViewerOpen(true)}
                                            onError={()=>setFailed((prev)=>[...prev, current])}
                                            className="w-full h-full object-contain p-4 cursor-zoom-in"
                                        />
                                    ) : (
                                        <ImagePlaceholder/>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <button type="button" onClick={handleAddToCart} className="h-[52px] rounded-lg border-2 border-red-600 text-red-600 font-bold uppercase tracking-wide cursor-pointer">
                                    Add to Cart
                                </button>
                                <button type="button" onClick={handleBuyNow} className="h-[52px] rounded-lg bg-red-600 text-white font-bold uppercase tracking-wide cursor-pointer">
                                    Buy Now
                                </button>
                            </div>
                            {added && (
                                <p className="text-sm text-gray-600 text-center">
                                    Added to cart. <Link to="/cart" className="text-red-600 font-semibold">Go to Cart</Link>
                                </p>
                            )}
                        </div>
                    </div>

                    {/* right: details */}
                    <div className="p-4 md:p-8 flex flex-col divide-y divide-gray-200">

                        <div className="flex flex-col gap-3 pb-6">
                            <h1 className="text-[22px] md:text-[26px] font-semibold leading-snug">
                                {product.name}
                            </h1>

                            {product.ratings !== null ? (
                                <div className="flex items-center gap-2">
                                    <span className="bg-red-600 text-white text-sm font-semibold px-2 py-0.5 rounded">
                                        {product.ratings.toFixed(1)} ★
                                    </span>
                                    <Stars rating={product.ratings} size="text-[16px]"/>
                                </div>
                            ) : (
                                <span className="text-sm text-gray-500">No ratings yet</span>
                            )}

                            <div className="flex flex-col gap-1 mt-2">
                                <div className="flex items-start font-bold">
                                    <span className="text-[18px] mt-1">₹</span>
                                    <span className="text-[36px] leading-none">{Math.floor(product.price).toLocaleString("en-IN")}</span>
                                    <span className="text-[18px] mt-1">{product.price.toFixed(2).split(".")[1]}</span>
                                </div>
                                <span className="text-sm text-gray-500">Inclusive of all taxes</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 py-6">
                            <span className="w-[120px] text-sm text-gray-500">Quantity</span>
                            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                                <button type="button" aria-label="Decrease quantity" disabled={quantity <= 1} onClick={()=>setQuantity((q)=>q - 1)} className="w-[40px] h-[40px] text-[20px] cursor-pointer disabled:text-gray-300">
                                    −
                                </button>
                                <span className="w-[48px] text-center font-semibold">{quantity}</span>
                                <button type="button" aria-label="Increase quantity" disabled={quantity >= 10} onClick={()=>setQuantity((q)=>q + 1)} className="w-[40px] h-[40px] text-[20px] cursor-pointer disabled:text-gray-300">
                                    +
                                </button>
                            </div>
                            {quantity > 1 && (
                                <span className="text-sm text-gray-500">Total ₹{formatPrice(product.price * quantity)}</span>
                            )}
                        </div>

                        <div className="flex flex-col gap-3 py-6">
                            <h2 className="text-[18px] font-semibold">Description</h2>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-line break-words">
                                {product.description}
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 py-6">
                            <h2 className="text-[18px] font-semibold">Specifications</h2>
                            <dl className="grid grid-cols-[160px_1fr] text-sm">
                                <dt className="py-2 text-gray-500">Product ID</dt>
                                <dd className="py-2">{product.id}</dd>

                                <dt className="py-2 text-gray-500">Price</dt>
                                <dd className="py-2">₹{formatPrice(product.price)}</dd>

                                {product.addedBy !== undefined && (
                                    <>
                                        <dt className="py-2 text-gray-500">Seller</dt>
                                        <dd className="py-2">Seller #{product.addedBy}</dd>
                                    </>
                                )}

                                {listedOn && (
                                    <>
                                        <dt className="py-2 text-gray-500">Listed on</dt>
                                        <dd className="py-2">{listedOn}</dd>
                                    </>
                                )}
                            </dl>
                        </div>

                        <div className="flex flex-col gap-3 pt-6">
                            <h2 className="text-[18px] font-semibold">Ratings</h2>
                            {product.ratings !== null ? (
                                <div className="flex items-center gap-4">
                                    <span className="text-[40px] font-bold leading-none">{product.ratings.toFixed(1)}</span>
                                    <div className="flex flex-col">
                                        <Stars rating={product.ratings}/>
                                        <span className="text-sm text-gray-500">out of 5</span>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500">This product has not been rated yet.</p>
                            )}
                        </div>
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
