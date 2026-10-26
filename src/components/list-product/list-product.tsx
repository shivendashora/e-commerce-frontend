import { useState, type ChangeEvent, type FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import { listProduct } from "../../api/products"
import { useLoading } from "../../../context/loading-context"

export default function ListProduct(){
    const navigate = useNavigate()
    const { loading, updateLoadingState } = useLoading()
    const [name, setName] = useState("")
    const [price, setPrice] = useState("")
    const [description, setDescription] = useState("")
    const [file, setFile] = useState<File | null>(null)
    const [preview, setPreview] = useState("")
    const [error, setError] = useState("")

    // show the chosen image, and free the previous preview URL
    function handleFileChange(e: ChangeEvent<HTMLInputElement>){
        const selected = e.target.files?.[0] ?? null
        if (preview) URL.revokeObjectURL(preview)
        setFile(selected)
        setPreview(selected ? URL.createObjectURL(selected) : "")
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>){
        e.preventDefault()
        setError("")
        if (!file) {
            setError("Please choose a product image")
            return
        }

        updateLoadingState(true)
        try {
            await listProduct({ name, price, description, file })
            navigate("/home")
        } catch (err) {
            setError(err instanceof Error ? err.message : "Could not list the product")
        } finally {
            updateLoadingState(false)
        }
    }

    const inputClass = "w-full h-[48px] rounded-lg px-4 border border-gray-300 placeholder-gray-400 focus:outline-none focus:border-red-600"
    const DESCRIPTION_LIMIT = 2000

    return(
        <div className="bg-gray-50 w-full min-h-[calc(100vh-64px)]">
            <form onSubmit={handleSubmit} className="max-w-[1200px] mx-auto px-6 md:px-10 py-8 text-gray-800">

                <div className="flex flex-col gap-1 mb-8">
                    <span className="text-sm text-gray-500">
                        <Link to="/home" className="text-red-600">Home</Link> / List a Product
                    </span>
                    <h1 className="font-bold text-[28px]">
                        List a new product
                    </h1>
                    <p className="text-gray-500">
                        Fill in the details below. Products with a clear photo and a complete description sell faster.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

                    <div className="lg:col-span-2 flex flex-col gap-6">

                        <section className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 flex flex-col gap-6">
                            <div>
                                <h2 className="font-semibold text-[18px]">Product information</h2>
                                <p className="text-sm text-gray-500">What buyers will see on the product card and product page.</p>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label htmlFor="product-name" className="text-sm font-medium">
                                    Product name <span className="text-red-600">*</span>
                                </label>
                                <input id="product-name" type="text" placeholder="e.g. Red running shoes for men, size 9" required value={name} onChange={(e)=>setName(e.target.value)} className={inputClass} />
                                <span className="text-xs text-gray-500">Include brand, type, colour and size where it applies.</span>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label htmlFor="product-description" className="text-sm font-medium">
                                    Description <span className="text-red-600">*</span>
                                </label>
                                <textarea id="product-description" placeholder="Material, size, condition, what is in the box..." required rows={8} maxLength={DESCRIPTION_LIMIT} value={description} onChange={(e)=>setDescription(e.target.value)} className="w-full rounded-lg px-4 py-3 border border-gray-300 placeholder-gray-400 focus:outline-none focus:border-red-600 resize-y" />
                                <span className="text-xs text-gray-500 self-end">{description.length}/{DESCRIPTION_LIMIT}</span>
                            </div>
                        </section>

                        <section className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 flex flex-col gap-6">
                            <div>
                                <h2 className="font-semibold text-[18px]">Pricing</h2>
                                <p className="text-sm text-gray-500">The price buyers pay for one unit.</p>
                            </div>

                            <div className="flex flex-col gap-2 max-w-[320px]">
                                <label htmlFor="product-price" className="text-sm font-medium">
                                    Selling price <span className="text-red-600">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                                    <input id="product-price" type="number" placeholder="0.00" required min="0" step="0.01" value={price} onChange={(e)=>setPrice(e.target.value)} className={`${inputClass} pl-9`} />
                                </div>
                            </div>
                        </section>
                    </div>

                    <section className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 flex flex-col gap-4 lg:sticky lg:top-[88px]">
                        <div>
                            <h2 className="font-semibold text-[18px]">
                                Product image <span className="text-red-600">*</span>
                            </h2>
                            <p className="text-sm text-gray-500">This is the main photo shown on the product card.</p>
                        </div>

                        <label
                            htmlFor="product-image"
                            className="w-full aspect-square rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center overflow-hidden cursor-pointer"
                        >
                            {preview ? (
                                <img src={preview} alt="Preview" className="w-full h-full object-contain bg-white" />
                            ) : (
                                <div className="flex flex-col items-center gap-2 text-gray-400 px-6 text-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-14 h-14">
                                        <rect x="3" y="3" width="18" height="18" rx="2"/>
                                        <circle cx="9" cy="9" r="2"/>
                                        <path d="m21 15-5-5L5 21"/>
                                    </svg>
                                    <span className="font-medium text-gray-600">Click to upload an image</span>
                                    <span className="text-xs">PNG or JPG</span>
                                </div>
                            )}
                        </label>
                        <input
                            id="product-image"
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={handleFileChange}
                        />

                        {file && (
                            <div className="flex items-center justify-between gap-2 text-sm">
                                <span className="text-gray-500 truncate">{file.name}</span>
                                <label htmlFor="product-image" className="text-red-600 font-medium cursor-pointer shrink-0">
                                    Change
                                </label>
                            </div>
                        )}

                        <ul className="text-xs text-gray-500 list-disc pl-4 flex flex-col gap-1">
                            <li>Use a plain, light background</li>
                            <li>Show the whole product, in focus</li>
                            <li>Square images look best on the product card</li>
                        </ul>
                    </section>
                </div>

                <div className="mt-8 bg-white rounded-xl border border-gray-200 px-6 py-4 flex flex-col-reverse md:flex-row md:items-center md:justify-between gap-4">
                    {error ? (
                        <p className="text-sm text-red-600">{error}</p>
                    ) : (
                        <p className="text-sm text-gray-500">Fields marked <span className="text-red-600">*</span> are required.</p>
                    )}

                    <div className="flex gap-3">
                        <button type="button" onClick={()=>navigate("/home")} className="flex-1 md:flex-none md:w-[140px] h-[46px] rounded-full border-2 border-red-600 text-red-600 font-semibold cursor-pointer">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading} className="flex-1 md:flex-none md:w-[180px] h-[46px] rounded-full text-white font-semibold bg-red-600 cursor-pointer disabled:opacity-60">
                            {loading ? "Listing..." : "List Product"}
                        </button>
                    </div>
                </div>

            </form>
        </div>
    )
}
