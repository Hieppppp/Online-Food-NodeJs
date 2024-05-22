import React from 'react'
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListAlt, faBoxes, faReceipt, faBlog, faUser, faCog } from '@fortawesome/free-solid-svg-icons';
import './Slider.css'

const Slider = () => {
    return (
        <div className='slider'>
            <div className='slier-options'>
                <NavLink to='/managecategory' className="slider-option">
                    <FontAwesomeIcon className="icon" icon={faListAlt} />
                    <p>Quản lý danh mục</p>
                </NavLink>

                <NavLink to='/manageproduct' className="slider-option">
                    <FontAwesomeIcon className="icon" icon={faBoxes} />
                    <p>Quản danh sách sản phẩm</p>
                </NavLink>

                <NavLink to='/manageorder' className="slider-option">
                    <FontAwesomeIcon className="icon" icon={faReceipt} />
                    <p>Quản đơn hàng</p>
                </NavLink>

                <NavLink to='/manageblog' className="slider-option">
                    <FontAwesomeIcon className="icon" icon={faBlog} />
                    <p>Quản lý bài viết</p>
                </NavLink>

                <NavLink to='/manageuser' className="slider-option">
                    <FontAwesomeIcon className="icon" icon={faUser} />
                    <p>Quản lý người dùng</p>
                </NavLink>

                <NavLink to='/managesetting' className="slider-option">
                    <FontAwesomeIcon className="icon" icon={faCog} />
                    <p>Quản lý cài đặt</p>
                </NavLink>

            </div>
        </div>
    )
}

export default Slider