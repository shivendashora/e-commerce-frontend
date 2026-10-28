import type { ReactNode } from "react"
import { Link } from "react-router-dom"

const iconProps = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
}

const stats = [
    { value: "10K+", label: "Products listed" },
    { value: "5K+", label: "Happy buyers" },
    { value: "1K+", label: "Active sellers" },
    { value: "24h", label: "Support reply time" },
]

const points: { title: string, text: string, icon: ReactNode }[] = [
    {
        title: "Wide Range",
        text: "Browse products listed by sellers from across the country, all in one place.",
        icon: <svg {...iconProps}><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>,
    },
    {
        title: "Sell Easily",
        text: "List your own product in a few steps with a photo, price and description.",
        icon: <svg {...iconProps}><path d="M12 5v14"/><path d="M5 12h14"/></svg>,
    },
    {
        title: "Fair Prices",
        text: "Sellers set their own prices, so you always see exactly what they are asking for.",
        icon: <svg {...iconProps}><path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L2 12V2h10l8.6 8.6a2 2 0 0 1 0 2.8z"/><circle cx="7" cy="7" r="1.5"/></svg>,
    },
    {
        title: "Secure Accounts",
        text: "Every buyer and seller signs in to their own account before buying or listing.",
        icon: <svg {...iconProps}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    },
]

export default function About(){
    return(
        <div className="min-h-[calc(100vh-64px)] overflow-hidden bg-gray-50 px-8 py-8 flex flex-col gap-8">

            <section className="bg-white rounded-[24px] border border-gray-200 p-8 md:p-10 grid md:grid-cols-[1.3fr_1fr] gap-8 items-center">
                <div>
                    <p className="text-sm font-semibold text-red-600 uppercase tracking-wide">
                        About E-Shop
                    </p>
                    <h1 className="text-gray-900 font-bold text-[34px] leading-tight mt-2">
                        A simple marketplace to buy and sell anything
                    </h1>
                    <p className="text-gray-600 mt-4">
                        We started E-Shop with one goal: make it easy to find good products and just as easy to list your own.
                        No complicated setup, no hidden fees, just buyers and sellers meeting in one place.
                    </p>
                    <div className="flex flex-wrap gap-4 mt-6">
                        <Link to="/home" className="px-6 h-[44px] rounded-full text-white font-semibold bg-red-600 flex items-center">
                            Browse Products
                        </Link>
                        <Link to="/list-product" className="px-6 h-[44px] rounded-full text-red-600 font-semibold border-2 border-red-600 flex items-center">
                            Start Selling
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {stats.map((stat)=>(
                        <div key={stat.label} className="rounded-[20px] bg-gray-50 border border-gray-200 p-5">
                            <p className="text-red-600 font-bold text-[28px]">{stat.value}</p>
                            <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section>
                <h2 className="text-red-600 font-bold text-[26px]">
                    Why shop with us
                </h2>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-6 mt-5">
                    {points.map((point)=>(
                        <div key={point.title} className="bg-white rounded-[20px] border border-gray-200 p-6">
                            <span className="w-11 h-11 rounded-full bg-red-600 text-white flex items-center justify-center">
                                {point.icon}
                            </span>
                            <h3 className="text-gray-900 font-semibold text-[18px] mt-4">
                                {point.title}
                            </h3>
                            <p className="text-gray-600 mt-2">
                                {point.text}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="bg-white rounded-[24px] border border-gray-200 p-8 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h2 className="text-gray-900 font-bold text-[22px]">Have a question?</h2>
                    <p className="text-gray-600 mt-1">Our team is happy to help with orders, listings or your account.</p>
                </div>
                <Link to="/contacts" className="px-6 h-[44px] rounded-full text-white font-semibold bg-red-600 flex items-center">
                    Contact Us
                </Link>
            </section>

        </div>
    )
}
