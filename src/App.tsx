import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import Product from './components/products/product'
import Home from './components/home/home'
import Auth from './components/Auth/auth'
import About from './components/about/about'
import Contacts from './components/contacts/contacts'
import ListProduct from './components/list-product/list-product'
import ProtectedLayout from './components/layout/protected-layout'
import LoadingContext from './components/layout/main-layout'
import { getToken } from './api/cookies'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<LoadingContext/>}>
          <Route path='/' element={getToken() ? <Navigate to='/home' replace /> : <Auth />} />

          <Route element={<ProtectedLayout />}>
            <Route path='/home' element={<Home />} />
            <Route path='/about' element={<About />} />
            <Route path='/contacts' element={<Contacts />} />
            <Route path='/list-product' element={<ListProduct />} />
            <Route path='/product/:id' element={<Product />} />
          </Route>

        </Route>

      </Routes>
    </BrowserRouter>

  )
}
