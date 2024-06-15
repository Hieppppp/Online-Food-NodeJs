import React, { useEffect, useState } from 'react';
import './Order.css'
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../../assets/assets';
import Navar from '../../components/Navar/Navar';
import ReactPaginate from 'react-paginate';
import { useNavigate } from 'react-router-dom';

const Order = ({ url }) => {

  const [orders, setOrders] = useState([]);
  const [itemsToShow, setItemsToShow] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit, setCurrentLimit] = useState(itemsToShow);
  const [totalPages, setTotalPages] = useState(0);

  const fetchAllOrders = async (page, limit) => {
    try {
      const response = await axios.get(`${url}/api/order/listorders?page=${page}&limit=${limit}`);
      if (response.data.success) {
        setOrders(response.data.data.orders);
        setTotalPages(response.data.data.totalPages);
      }
      else {
        toast.error("Error");
      }
    } catch (error) {
      console.error(error);
    }
  }

  const statusHandler = async (event, orderId) => {
    const response = await axios.post(url + "/api/order/status", {
      orderId,
      status: event.target.value
    })
    if (response.data.success) {
      await fetchAllOrders();
      toast.success("Trạng thái đã được cập nhập thành công", { autoClose: 1500 });
    }
    else {
      toast.error("Error");
    }
  }

  // Onclick fillter order want display
  const handleSelectChange = (event) => {
    const newItemsToShow = Number(event.target.value);
    setItemsToShow(newItemsToShow);
    setCurrentLimit(newItemsToShow);
    fetchAllOrders(1, newItemsToShow);
  }

  // Onclick pagination
  const handlePageClick = (event) => {
    const selectedPage = event.selected + 1;
    setCurrentPage(selectedPage);
    fetchAllOrders(selectedPage, currentLimit);
  }

  //Navigate
  const navigate = useNavigate();

  // Format money
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(amount * 1000) + 'VND';
  };

  useEffect(() => {
    fetchAllOrders(currentPage, currentLimit);
  }, [currentPage, currentLimit]);

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
                  <p>{ formatCurrency(order.amount)}</p>
                  <select onChange={(event) => statusHandler(event, order._id)} value={order.status}>
                    <option value="Đã Xử Lý Đơn Hàng">Đã xử lý đơn hàng</option>
                    <option value="Đang Vận Chuyển">Đang Vận Chuyển</option>
                    <option value="Đã Giao Hàng">Đã Giao Hàng</option>
                    <option value="Hoàn Thành">Hoàn Thành</option>
                    <option value="Đã Hủy">Đã Hủy</option>
                  </select>
                  <a href="" className='btn btn-outline-success' onClick={()=>navigate(`/order_detail/${order._id}`)}>Xem chi tiết</a>
                  
                </div>
              ))}

            </div>
          </div>
          <div className='page'>
            <ReactPaginate
              nextLabel="Sau >"
              onPageChange={handlePageClick}
              pageRangeDisplayed={2}
              marginPagesDisplayed={1}
              pageCount={totalPages}
              previousLabel="< Trước"
              pageClassName="page-item"
              pageLinkClassName="page-link"
              previousClassName="page-item"
              previousLinkClassName="page-link"
              nextClassName="page-item"
              nextLinkClassName="page-link"
              breakLabel="..."
              breakClassName="page-item"
              breakLinkClassName="page-link"
              containerClassName="pagination"
              activeClassName="active"
              renderOnZeroPageCount={null}
            />
          </div>
        </div>

      </div>

    </>
  )
}

export default Order