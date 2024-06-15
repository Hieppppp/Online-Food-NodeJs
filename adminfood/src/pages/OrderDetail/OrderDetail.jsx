import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from'react-router-dom';
import './OrderDetail.css';

const OrderDetail = ({url}) => {
    const { id } = useParams(); // Take id from URL
    const [orderdetail, setOrderDetail] = useState(null);

    const fetchOrderDetails = async () => {
        try {
            const response = await axios.get(`${url}/api/order/oderdetail/${id}`);
            setOrderDetail(response.data.data)
        } catch (error) {
            console.error("Error", error);
        }
    }
    
    //format money
    const formatCurrent = (amount) => {
        return new Intl.NumberFormat('vi-VN').format(amount * 1000) + 'VND';
    }

    useEffect(()=>{
        fetchOrderDetails();
    },[id])

    if (!orderdetail) {
        return <div>Loading...</div>;
    }
    return (
        <div className='order-detail'>
            <h2>Chi Tiết Đơn Hàng</h2>
            <div className='order-detail-container'>
                <p><strong>Mã đơn hàng:</strong> {orderdetail._id}</p>
                <p><strong>Trạng thái:</strong> {orderdetail.status}</p>
                <p><strong>Số lượng:</strong> {orderdetail.items.length}</p>
                <p><strong>Tổng tiền:</strong> {formatCurrent(orderdetail.amount)}</p>
                <p><strong>Ngày mua:</strong> {new Date(orderdetail.date).toLocaleDateString()} </p>
                <hr />
                <div className="order-items">
                    <div className="order-item-detail">
                        <div className="item-detail">
                            <p><strong>Họ và Tên:</strong> {orderdetail.address.lastName} {orderdetail.address.firstName} </p>
                            <p><strong>Địa chỉ:</strong> {orderdetail.address.street}, {orderdetail.address.state}, {orderdetail.address.city}, {orderdetail.address.country} </p>
                            <p><strong>Zip code:</strong> {orderdetail.address.zipcode} </p>
                            <p><strong>Điện thoại:</strong> {orderdetail.address.phone} </p>
                        </div>
                    </div>
                    {orderdetail.items.map((item, index)=>{
                        return(
                            <div key={index} className='order-item-detail'>
                                <img src={`${url}/images/${item.image}`} alt="" />
                                <div className="item-detail">
                                    <p><strong>Tên sản phẩm:</strong> {item.name} </p>
                                    <p><strong>Số lượng:</strong> {item.quantity} </p>
                                    <p><strong>Giá cả:</strong> {item.price}.000 VND </p>
                                </div>
                            </div>
                        );
                    })}
                    
                </div>

            </div>

        </div>
    )
}

export default OrderDetail