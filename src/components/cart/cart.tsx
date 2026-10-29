import { useState } from "react"
import { Link } from "react-router-dom"
import { MAX_QUANTITY, useCart, type CartItem } from "../../../context/cart-context"
import { payWithRazorpay } from "../../api/payment"

function formatPrice(price: number) {
    return price.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function ItemImage({ src, alt }: { src: string | null, alt: string }) {
    const [failed, setFailed] = useState(false)

    if (!src || failed) {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10 text-gray-400">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-5-5L5 21" />
            </svg>
        )
    }
    return <img src={src} alt={alt} onError={() => setFailed(true)} className="w-full h-full object-contain" />
}

function CartRow({ item }: { item: CartItem }) {
    const { updateQuantity, removeFromCart } = useCart()
    const { product, quantity } = item

    return (
        <div className="flex gap-4 md:gap-6 py-6">
            <Link to={`/product/${product.id}`} state={{ product }} className="w-[100px] h-[100px] md:w-[140px] md:h-[140px] shrink-0 rounded-lg border border-gray-200 bg-white flex items-center justify-center overflow-hidden">
                <ItemImage src={product.thumbnail_path} alt={product.name} />
            </Link>

            <div className="flex-1 min-w-0 flex flex-col gap-2">
                <div className="flex justify-between gap-4">
                    <Link to={`/product/${product.id}`} state={{ product }} className="text-[17px] md:text-[18px] font-medium leading-snug line-clamp-2">
                        {product.name}
                    </Link>
                    <span className="font-bold text-[18px] whitespace-nowrap">₹{formatPrice(product.price)}</span>
                </div>

                <p className="text-sm text-gray-500 line-clamp-1">{product.description}</p>

                <div className="flex flex-wrap items-center gap-4 mt-2">
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                        <button type="button" aria-label="Decrease quantity" disabled={quantity <= 1} onClick={() => updateQuantity(product.id, quantity - 1)} className="w-[36px] h-[36px] text-[18px] cursor-pointer disabled:text-gray-300">
                            −
                        </button>
                        <span className="w-[40px] text-center font-semibold">{quantity}</span>
                        <button type="button" aria-label="Increase quantity" disabled={quantity >= MAX_QUANTITY} onClick={() => updateQuantity(product.id, quantity + 1)} className="w-[36px] h-[36px] text-[18px] cursor-pointer disabled:text-gray-300">
                            +
                        </button>
                    </div>

                    <span className="text-gray-300">|</span>

                    <button type="button" onClick={() => removeFromCart(product.id)} className="text-sm text-red-600 font-medium cursor-pointer">
                        Delete
                    </button>

                    {quantity > 1 && (
                        <span className="text-sm text-gray-500 ml-auto">
                            {quantity} × ₹{formatPrice(product.price)} = <span className="font-semibold text-gray-800">₹{formatPrice(product.price * quantity)}</span>
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}

interface PlacedOrder {
    items: CartItem[]
    itemCount: number
    total: number
}

export default function Cart() {
    const { items, itemCount, subtotal, clearCart } = useCart()
    const [placedOrder, setPlacedOrder] = useState<PlacedOrder | null>(null)

    const [paying, setPaying] = useState(false)
    const [paymentError, setPaymentError] = useState("")

    const handleBuy = async () => {
        setPaying(true)
        setPaymentError("")
        try {
            await payWithRazorpay(items)
            setPlacedOrder({ items, itemCount, total: subtotal })
            clearCart()
        } catch (err) {
            setPaymentError(err instanceof Error ? err.message : "Payment failed")
        } finally {
            setPaying(false)
        }
    }

    if (placedOrder) {
        return (
            <div className="bg-gray-50 px-4 md:px-8 py-10 flex justify-center">
                <div className="w-full max-w-[640px] bg-white rounded-xl border border-gray-200 p-8 flex flex-col gap-6 h-fit">
                    <div className="flex flex-col items-center gap-3 text-center">
                        <div className="w-14 h-14 rounded-full bg-red-600 text-white flex items-center justify-center text-[28px]">✓</div>
                        <h1 className="text-[24px] font-bold text-gray-800">Order placed</h1>
                        <p className="text-gray-500">
                            {placedOrder.itemCount} {placedOrder.itemCount === 1 ? "item" : "items"} for ₹{formatPrice(placedOrder.total)}
                        </p>
                    </div>

                    <ul className="divide-y divide-gray-200 border-y border-gray-200">
                        {placedOrder.items.map(({ product, quantity }) => (
                            <li key={product.id} className="flex justify-between gap-4 py-3 text-sm">
                                <span className="truncate">{product.name} <span className="text-gray-500">× {quantity}</span></span>
                                <span className="font-medium whitespace-nowrap">₹{formatPrice(product.price * quantity)}</span>
                            </li>
                        ))}
                    </ul>

                    <p className="text-xs text-gray-500 text-center">
                        Payment received. Thank you for your order.
                    </p>

                    <Link to="/home" className="self-center h-[46px] px-8 rounded-full flex items-center text-white font-semibold bg-red-600">
                        Continue shopping
                    </Link>
                </div>
            </div>
        )
    }

    if (items.length === 0) {
        return (
            <div className="min-h-[calc(100vh-64px)] bg-gray-50 px-4 md:px-8 py-10 flex justify-center">
                <div className="w-full max-w-[640px] bg-white rounded-xl border border-gray-200 p-10 flex flex-col items-center gap-4 text-center h-fit">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-16 h-16 text-gray-400">
                        <circle cx="9" cy="20" r="1.5" />
                        <circle cx="18" cy="20" r="1.5" />
                        <path d="M2 3h3l2.4 11.2a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.5L21 7H6" />
                    </svg>
                    <h1 className="text-[22px] font-bold text-gray-800">Your cart is empty</h1>
                    <p className="text-gray-500">Add products from a product page and they will show up here.</p>
                    <Link to="/home" className="mt-2 h-[46px] px-8 rounded-full flex items-center text-white font-semibold bg-red-600">
                        Browse products
                    </Link>
                </div>
            </div>
        )
    }


    const summary = ()=>{
        return(
        <div className="flex flex-col gap-4">
            <p className="text-[18px]">
                Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"}):{" "}
                <span className="font-bold">₹{formatPrice(subtotal)}</span>
            </p>
            <button type="button" onClick={handleBuy} disabled={paying} className="w-full h-[48px] rounded-full bg-red-600 text-white font-semibold cursor-pointer disabled:opacity-60">
                {paying ? "Processing..." : "Proceed to Buy"}
            </button>
            {paymentError && <p className="text-sm text-red-600 text-center">{paymentError}</p>}
        </div>
        )

    }

    return (
        <div className="min-h-[calc(100vh-64px)] overflow-hidden bg-gray-50">
            <div className="w-full px-4 md:px-8 py-6 text-gray-800 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-6 items-start">

                <section className="bg-white rounded-xl border border-gray-200 px-4 md:px-8 py-6">
                    <div className="flex items-end justify-between border-b border-gray-200 pb-4">
                        <h1 className="text-[26px] font-bold">Shopping Cart</h1>
                        <span className="text-sm text-gray-500">Price</span>
                    </div>

                    <div className="divide-y divide-gray-200">
                        {items.map((item) => (
                            <CartRow key={item.product.id} item={item} />
                        ))}
                    </div>

                    <div className="border-t border-gray-200 pt-4 text-right text-[18px]">
                        Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"}):{" "}
                        <span className="font-bold">₹{formatPrice(subtotal)}</span>
                    </div>
                </section>

                <aside className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-4 lg:sticky lg:top-[88px]">
                    {summary()}
                    <button type="button" onClick={clearCart} className="text-sm text-gray-500 underline cursor-pointer">
                        Clear cart
                    </button>
                </aside>
            </div>
        </div>
    )
}
