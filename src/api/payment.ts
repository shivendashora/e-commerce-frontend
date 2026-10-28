import { apiFetch } from './client'

// response of POST /trigger-payment; amount is in paise
export interface RazorpayOrder {
    message: string
    payment_id: number
    order_id: string
    amount: number
    currency: string
    key: string
}

export interface RazorpaySuccessResponse {
    razorpay_payment_id: string
    razorpay_order_id: string
    razorpay_signature: string
}

interface RazorpayOptions {
    key: string
    amount: number
    currency: string
    name: string
    description?: string
    order_id: string
    handler: (response: RazorpaySuccessResponse) => void
    modal?: { ondismiss?: () => void }
    theme?: { color?: string }
}

interface RazorpayInstance {
    open: () => void
    on: (event: 'payment.failed', callback: (response: { error: { description: string } }) => void) => void
}

// checkout.js is loaded in index.html and puts Razorpay on window
declare global {
    interface Window {
        Razorpay?: new (options: RazorpayOptions) => RazorpayInstance
    }
}

export function createPaymentOrder(productId: number, quantity: number) {
    return apiFetch<RazorpayOrder>('/trigger-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: productId, quantity }),
    })
}

// the backend checks the signature with the key secret, the browser never sees the secret
export function verifyPayment(response: RazorpaySuccessResponse) {
    return apiFetch<unknown>('/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
        }),
    })
}

export async function payWithRazorpay(productId: number, quantity: number): Promise<void> {
    const Razorpay = window.Razorpay
    if (!Razorpay) throw new Error('Razorpay failed to load. Check your internet connection.')
    const order = await createPaymentOrder(productId, quantity)

    return new Promise((resolve, reject) => {
        const razorpay = new Razorpay({
            key: order.key,
            amount: order.amount,
            currency: order.currency,
            name: 'E-commerce Store',
            order_id: order.order_id,
            handler: (response) => {
                verifyPayment(response).then(() => resolve(), reject)
            },
            modal: { ondismiss: () => reject(new Error('Payment cancelled')) },
            theme: { color: '#dc2626' },
        })
        razorpay.on('payment.failed', (response) => reject(new Error(response.error.description)))
        razorpay.open()
    })
}
