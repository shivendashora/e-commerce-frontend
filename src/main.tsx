import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import LoadingProvider from '../context/loading-context.tsx'
import CartProvider from '../context/cart-context.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LoadingProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </LoadingProvider>
  </StrictMode>,
)
