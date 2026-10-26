import { useState, type FormEvent, type ReactNode } from "react"

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

const topics: { label: string, text: string, icon: ReactNode }[] = [
    {
        label: "Orders",
        text: "Track, cancel or return an order",
        icon: <svg {...iconProps}><path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="m3 8 9 5 9-5"/><path d="M12 13v8"/></svg>,
    },
    {
        label: "Payments",
        text: "Refunds, failed or double payments",
        icon: <svg {...iconProps}><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>,
    },
    {
        label: "Account",
        text: "Login, password and profile help",
        icon: <svg {...iconProps}><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>,
    },
    {
        label: "Selling",
        text: "Listing products and seller queries",
        icon: <svg {...iconProps}><path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L2 12V2h10l8.6 8.6a2 2 0 0 1 0 2.8z"/><circle cx="7" cy="7" r="1.5"/></svg>,
    },
    {
        label: "Other",
        text: "Anything else we can help with",
        icon: <svg {...iconProps}><circle cx="12" cy="12" r="9"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>,
    },
]

const details = [
    { label: "Email", value: "support@eshop.com" },
    { label: "Phone", value: "+91 98765 43210" },
    { label: "Working Hours", value: "Mon - Sat, 10am - 7pm" },
    { label: "Address", value: "Udaipur, Rajasthan, India" },
]

const inputClass = "w-full h-[52px] rounded-[12px] px-4 bg-white border border-gray-300 placeholder-gray-400 focus:outline-none focus:border-red-600"

export default function Contacts(){
    const [topic, setTopic] = useState("Orders")
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [orderId, setOrderId] = useState("")
    const [subject, setSubject] = useState("")
    const [message, setMessage] = useState("")
    const [sent, setSent] = useState(false)

    // there is no contact API yet, so just confirm and clear the form
    function handleSubmit(e: FormEvent<HTMLFormElement>){
        e.preventDefault()
        setSent(true)
        setName("")
        setEmail("")
        setPhone("")
        setOrderId("")
        setSubject("")
        setMessage("")
    }

    return(
        <div className="min-h-[calc(100vh-64px)] bg-gray-50 px-8 py-8 text-gray-800">

            <h1 className="text-red-600 font-bold text-[30px]">
                Contact Us
            </h1>
            <p className="text-gray-600 mt-1">
                Tell us what you need help with and our support team will get back to you within 24 hours.
            </p>

            <h2 className="font-semibold text-[20px] mt-8">
                What do you need help with?
            </h2>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 mt-4">
                {topics.map((item)=>{
                    const selected = topic === item.label
                    return(
                        <button
                            key={item.label}
                            type="button"
                            onClick={()=>setTopic(item.label)}
                            className={`text-left bg-white rounded-[16px] border-2 p-5 cursor-pointer ${selected ? "border-red-600" : "border-gray-200"}`}
                        >
                            <span className={`w-11 h-11 rounded-full flex items-center justify-center ${selected ? "bg-red-600 text-white" : "bg-gray-100 text-red-600"}`}>
                                {item.icon}
                            </span>
                            <p className="font-semibold mt-3">{item.label}</p>
                            <p className="text-sm text-gray-500 mt-1">{item.text}</p>
                        </button>
                    )
                })}
            </div>

            <div className="grid lg:grid-cols-[1fr_340px] gap-6 mt-8 items-start">

                <form className="bg-white rounded-[20px] border border-gray-200 p-8 flex flex-col gap-6" onSubmit={handleSubmit}>
                    <div className="border-b border-gray-200 pb-4">
                        <h2 className="font-bold text-[22px]">Send us a message</h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Topic: <span className="font-semibold text-red-600">{topic}</span>
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="contact-name" className="font-medium">Full Name</label>
                            <input id="contact-name" type="text" placeholder="Your full name" required value={name} onChange={(e)=>setName(e.target.value)} className={inputClass} />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="contact-email" className="font-medium">Email Address</label>
                            <input id="contact-email" type="email" placeholder="you@example.com" required value={email} onChange={(e)=>setEmail(e.target.value)} className={inputClass} />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="contact-phone" className="font-medium">Mobile Number</label>
                            <input id="contact-phone" type="tel" placeholder="10 digit mobile number" required pattern="[0-9]{10}" value={phone} onChange={(e)=>setPhone(e.target.value)} className={inputClass} />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="contact-order" className="font-medium">
                                Order ID <span className="text-sm font-normal text-gray-400">(optional)</span>
                            </label>
                            <input id="contact-order" type="text" placeholder="e.g. OD123456789" value={orderId} onChange={(e)=>setOrderId(e.target.value)} className={inputClass} />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="contact-subject" className="font-medium">Subject</label>
                        <input id="contact-subject" type="text" placeholder="Short summary of your issue" required value={subject} onChange={(e)=>setSubject(e.target.value)} className={inputClass} />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="contact-message" className="font-medium">Describe your issue</label>
                        <textarea id="contact-message" placeholder="Give us as much detail as you can so we can help faster" required rows={7} value={message} onChange={(e)=>setMessage(e.target.value)} className="w-full rounded-[12px] px-4 py-3 bg-white border border-gray-300 placeholder-gray-400 focus:outline-none focus:border-red-600 resize-none" />
                    </div>

                    {sent && (
                        <p className="rounded-[12px] bg-green-50 border border-green-200 text-green-700 px-4 py-3">
                            Thanks! Your request has been submitted. We will reply to you by email within 24 hours.
                        </p>
                    )}

                    <button type="submit" className="self-start px-10 h-[50px] rounded-full text-white font-semibold bg-red-600 cursor-pointer">
                        Submit Request
                    </button>
                </form>

                <aside className="bg-white rounded-[20px] border border-gray-200 p-6 flex flex-col gap-5">
                    <h2 className="font-bold text-[20px]">Other ways to reach us</h2>
                    {details.map((item)=>(
                        <div key={item.label} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                            <p className="text-sm text-gray-500">{item.label}</p>
                            <p className="font-medium mt-1">{item.value}</p>
                        </div>
                    ))}
                </aside>

            </div>
        </div>
    )
}
