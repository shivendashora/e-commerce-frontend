import { useState } from "react"
import { Link } from "react-router-dom"
import type { Product } from "../../api/products"

interface CardsInterface{
    product: Product
}

export default function Cards({product}:CardsInterface){
    const [imageFailed, setImageFailed] = useState(false)
    const showImage = product.thumbnail_path && !imageFailed

    return(
        <Link
            to={`/product/${product.id}`}
            state={{ product }}
            className="flex flex-col w-full bg-white rounded-2xl shadow-md overflow-hidden"
        >
            <div className="w-full aspect-square bg-gray-100 flex items-center justify-center">
                {showImage ? (
                    <img
                        src={product.thumbnail_path!}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={()=>setImageFailed(true)}
                    />
                ) : (
                    // same placeholder for a missing or broken image
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12">
                            <rect x="3" y="3" width="18" height="18" rx="2"/>
                            <circle cx="9" cy="9" r="2"/>
                            <path d="m21 15-5-5L5 21"/>
                        </svg>
                        <span className="text-sm">No image</span>
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-1 p-4">
                <span className="font-semibold text-[17px] text-gray-800 truncate">
                    {product.name}
                </span>

                <span className="text-sm text-gray-500 line-clamp-2 min-h-[40px]">
                    {product.description}
                </span>

                <div className="flex items-center justify-between mt-2">
                    <span className="font-bold text-[18px] text-red-600">
                        ₹{product.price.toFixed(2)}
                    </span>
                    {product.ratings !== null && (
                        <span className="text-sm text-gray-600">
                            ★ {product.ratings.toFixed(1)}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    )
}
