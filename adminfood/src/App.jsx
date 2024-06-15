import React from 'react'
import Header from './components/Header/Header'
import Slider from './components/Slider/Slider'
import Category from './pages/Category/manageCategory'
import Product from './pages/Product/manageProduct'
import User from './pages/User/manageUser'
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Order from './pages/Orders/Order'
import OrderDetail from './pages/OrderDetail/OrderDetail'


const App = () => {

  const url = "http://localhost:4000";
  return (
    <div>
      <ToastContainer/>
      <Header/>
      <hr />
      <div className='app-content'>
        <Slider/>
        <Routes>
            <Route path='/managecategory' element={<Category url={url}/>}/>
            <Route path='/manageproduct' element={<Product url={url}/>}/>
            <Route path='/manageorder' element={<Order url={url}/>}/>
            <Route path='/order_detail/:id' element={<OrderDetail url={url}/>}/>
            <Route path='/manageuser' element={<User url={url}/>}/>
        </Routes>
      </div>
    </div>
  )
}

export default App