import { useEffect, useState } from "react"
import { fetchProducts, useDebounce, type Product } from "../../api/products"
import Cards from "./cards"

const PAGE_SIZE = 12

export default function Home(){
    const [products, setProducts] = useState<Product[]>([])
    const [search, setSearch] = useState("")
    const debouncedSearch = useDebounce(search, 1000)
    const [query, setQuery] = useState("")
    const [hasMore, setHasMore] = useState(false)
    const [error, setError] = useState("")


    async function loadProducts(offset: number, searchText: string){
        try {
            const data = await fetchProducts(offset, PAGE_SIZE, searchText)
            setProducts((prev)=> offset === 0 ? data : [...prev, ...data])
            setQuery(searchText)
            setHasMore(data.length === PAGE_SIZE)
            setError("")
        } catch (err) {
            setError(err instanceof Error ? err.message : "Could not load products")
        }
    }

    // fetch again whenever the debounced search text changes (also runs on first load)
    useEffect(()=>{
        // loadProducts sets state as part of an API request, which is what effects are for
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadProducts(0, debouncedSearch)
    }, [debouncedSearch])

    return(
        <div className="min-h-[calc(100vh-64px)] bg-gray-50">
            <div className="px-8 pt-8 flex items-center justify-between gap-4">
                <h1 className="text-red-600 font-bold text-[30px]">
                    Products
                </h1>
                <input
                    type="search"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e)=>setSearch(e.target.value)}
                    className="w-full max-w-[500px] h-[50px] rounded-[20px] px-4 bg-white border border-gray-300 placeholder-gray-400 focus:outline-none focus:border-red-600"
                />
            </div>

            <div className="px-8 py-8">
                {error && <p className="text-red-600 mb-4">{error}</p>}

                {!error && products.length === 0 && (
                    <p className="text-gray-500">
                        {query ? `No products found for "${query}"` : "No products yet"}
                    </p>
                )}

                <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-6">
                    {products.map((product)=>(
                        <Cards key={product.id} product={product}/>
                    ))}
                </div>

                {hasMore && (
                    <div className="flex justify-center mt-10">
                        <button
                            type="button"
                            onClick={()=>loadProducts(products.length, query)}
                            className="w-[150px] h-[40px] rounded-full text-white font-semibold bg-red-600 cursor-pointer"
                        >
                            Load more
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
