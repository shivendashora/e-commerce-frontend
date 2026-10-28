import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Product } from "../src/api/products";

export const MAX_QUANTITY = 10
const STORAGE_KEY = "cart"

export interface CartItem {
    product: Product
    quantity: number
}

interface CartContextValue {
    items: CartItem[]
    itemCount: number
    subtotal: number
    addToCart: (product: Product, quantity: number) => void
    updateQuantity: (productId: number, quantity: number) => void
    removeFromCart: (productId: number) => void
    clearCart: () => void
}

const cartContext = createContext<CartContextValue | null>(null)

// the cart lives in the browser only (no cart API yet), so it survives a page refresh
function loadCart(): CartItem[] {
    try {
        const saved = localStorage.getItem(STORAGE_KEY)
        return saved ? JSON.parse(saved) : []
    } catch {
        return []
    }
}

function clamp(quantity: number){
    return Math.min(MAX_QUANTITY, Math.max(1, quantity))
}


export default function CartProvider({children}:{children: ReactNode}){
    const [items, setItems] = useState<CartItem[]>(loadCart)

    useEffect(()=>{
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
        } catch {
            // storage can be blocked (private mode); the cart still works for this visit
        }
    }, [items])

    // adding a product that is already in the cart increases its quantity
    const addToCart=(product: Product, quantity: number)=>{
        setItems((prev)=>{
            const existing = prev.find((item)=>item.product.id === product.id)
            if (existing) {
                return prev.map((item)=>item.product.id === product.id
                    ? { product, quantity: clamp(item.quantity + quantity) }
                    : item)
            }
            return [...prev, { product, quantity: clamp(quantity) }]
        })
    }

    const updateQuantity=(productId: number, quantity: number)=>{
        setItems((prev)=>prev.map((item)=>item.product.id === productId ? { ...item, quantity: clamp(quantity) } : item))
    }

    const removeFromCart=(productId: number)=>{
        setItems((prev)=>prev.filter((item)=>item.product.id !== productId))
    }

    const clearCart=()=>{
        setItems([])
    }

    const itemCount = items.reduce((sum, item)=>sum + item.quantity, 0)
    const subtotal = items.reduce((sum, item)=>sum + item.product.price * item.quantity, 0)

    return(
        <cartContext.Provider value={{items, itemCount, subtotal, addToCart, updateQuantity, removeFromCart, clearCart}}>
                {children}
        </cartContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart(){
    const context = useContext(cartContext)
    if (!context) throw new Error("useCart must be used inside <CartProvider>")
    return context
}
