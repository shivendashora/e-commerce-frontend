import { useEffect, useState } from 'react'
import { apiFetch } from './client'

// Shape of a product returned by /fetchAllProducts
export interface Product {
    id: number
    name: string
    description: string
    price: number
    thumbnail_path: string | null
    ratings: number | null
    createdAt?: string
    addedBy?: number
}

interface FetchProductsResponse {
    message: string
    data: Product[]
}

export const useDebounce=(search:string,delay:number)=>{
    const [debouncedSearch, setDebouncedSearch] = useState(search)

    useEffect(()=>{
        const timer = setTimeout(() => {
            setDebouncedSearch(search)
        }, delay)

        return ()=>clearTimeout(timer)
    }, [search, delay])

    return debouncedSearch
}

export async function fetchProducts(offset = 0, limit = 10, search = '') {
    const params = new URLSearchParams({ offset: String(offset), limit: String(limit) })
    if (search.trim()) params.set('search', search.trim())

    const res = await apiFetch<FetchProductsResponse>(`/fetchAllProducts?${params}`)
    return res.data
}

export interface NewProduct {
    name: string
    price: string
    description: string
    file: File
}

// POST /list-product expects multipart/form-data. Do not set Content-Type:
// the browser adds it together with the multipart boundary.
export async function listProduct(product: NewProduct) {
    const formData = new FormData()
    formData.append('name', product.name)
    formData.append('price', product.price)
    formData.append('description', product.description)
    formData.append('file', product.file)

    return apiFetch<unknown>('/list-product', { method: 'POST', body: formData })
}

// The backend has no single-product endpoint, so page through
// /fetchAllProducts until the product with this id shows up
export async function fetchProductById(id: number) {
    const PAGE = 50
    for (let offset = 0; ; offset += PAGE) {
        const page = await fetchProducts(offset, PAGE)
        const product = page.find((p) => p.id === id)
        if (product) return product
        if (page.length < PAGE) throw new Error("Product not found")
    }
}
