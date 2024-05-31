import React, { useEffect, useState } from 'react';
import './Order.css'
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../../assets/assets';
import Navar from '../../components/Navar/Navar';

const Order = ({ url }) => {

  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    const response = await axios.get(url + "/api/order/listorders");
    if (response.data.success) {
      setOrders(response.data.data);
      console.log(response.data.data);
    }
    else {
      toast.error("Error");
    }
  }

  const statusHandler = async (event, orderId) => {
    const response = await axios.post(url+"/api/order/status",{
      orderId,
      status:event.target.value
    })
    if(response.data.success){
      await fetchAllOrders();
      toast.success("Trạng thái đã được cập nhập thành công",{ autoClose: 1500 });
    }
    else{
      toast.error("Error");
    }
  }

  useEffect(() => {
    fetchAllOrders();
  }, [])

  return (
    <>
      <div className='main'>
        <Navar />
        <div className="container">
          <div className='order add'>
            <h3>Quản Lý Đơn Hàng</h3>
            <div className="order-list">
              {orders.map((order, index) => (
                <div key={index} className='order-item'>
                  <img src={assets.parcel_icon} alt="" />
                  <div>
                    <p className='order-item-food'>
                      {order.items.map((item, index) => {
                        if (index === order.items.length - 1) {
                          return item.name + " x " + item.quantity 
                        }
                        else {
                          return item.name + " x " + item.quantity + " , "
                        }
                      })}
                    </p>
                    <p className='order-item-name'>
                      {order.address.lastName + " " + order.address.firstName}
                    </p>
                    <div className='order-item-address'>
                      <p>{order.address.street + " ,"}</p>
                      <p>{order.address.state + ", " + order.address.city + ", " + order.address.country + ", " + order.address.zipcode}</p>
                    </div>
                    <p className='order-item-phone'>{order.address.phone}</p>
                  </div>
                  <p>Sản Phẩm: {order.items.length}</p>
                  <p>{order.amount}.000 VND</p>
                  <select onChange={(event)=>statusHandler(event, order._id)} value={order.status}>
                    <option value="Đã Xử Lý Đơn Hàng">Đã xử lý đơn hàng</option>
                    <option value="Đang Vận Chuyển">Đang Vận Chuyển</option>
                    <option value="Đã Giao Hàng">Đã Giao Hàng</option>
                    <option value="Hoàn Thành">Hoàn Thành</option>
                    <option value="Đã Hủy">Đã Hủy</option>
                  </select>
                </div>
              ))}

            </div>

          </div>
        </div>

      </div>

    </>
  )
}

export default Order