import React from 'react'
import './Header.css'
import {assets} from '../../assets/assets'

const Header = () => {
  return (
    <div className="header">
        <img className="logo" src={assets.logo} alt="" />
        <img className="profile" src={assets.user_profile} alt="" />
    </div>
  )
}

export default Header