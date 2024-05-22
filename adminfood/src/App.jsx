import React from 'react'
import Header from './components/Header/Header'
import Slider from './components/Slider/Slider'
import Category from './pages/Category/manageCategory'
import Product from './pages/Product/manageProduct'
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

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
        </Routes>
      </div>
    </div>
  )
}

export default App