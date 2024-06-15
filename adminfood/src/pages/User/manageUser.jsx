import React, { useEffect, useState } from 'react'
import Navar from '../../components/Navar/Navar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrashAlt, faSearch, faPen } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { assets } from '../../assets/assets';
import ReactPaginate from 'react-paginate';

const manageUser = ({ url }) => {
    const [users, setUsers] = useState([]);

    const fetchAllUses = async () => {
        const response = await axios.get(url + "/api/user/get-all-user");
        if (response.data.success) {
            setUsers(response.data.data);
            console.log(response.data.data);
        }
        else {
            toast.error("Error");
        }
    }
    useEffect(()=>{
        fetchAllUses();
    },[])
    return (
        <>
            <div className='main'>
                <Navar />
                <div className='container'>
                    {/* <div className='model-header'>
                        <div className="col-3">
                            <select name="category_id" id="category_id" className="form-control">
                                <option value="0">Tất cả nhóm</option>
                                {categories.map((category) => (
                                    <option key={category._id} value={category._id}>{category.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <button type="button" data-bs-toggle="modal" data-bs-target="#addCategoryModal">
                                <FontAwesomeIcon className='icon' icon={faPlus} />
                                <span>Thêm sản phẩm mới</span>
                            </button>
                            <button onClick={handleDeleteSelected}>
                                <FontAwesomeIcon className='icon' icon={faTrashAlt} />
                                <span>Xóa tất cả</span>
                            </button>
                        </div>
                    </div> */}
                    <hr />
                    <div className='model-body'>
                        <div className='model-tools'>
                            <label>
                                Hiện thị
                                <select >
                                    <option value="5">5</option>
                                    <option value="10">10</option>
                                    <option value="20">20</option>
                                    <option value="50">50</option>
                                    <option value="100">100</option>
                                </select>
                                danh mục
                            </label>
                            <div className="search-container">
                                <input className="checkbox" type="checkbox" />
                                <form action="" >
                                    <div className="mainbox">
                                        <div className="iconContainer">
                                            <FontAwesomeIcon className='search' icon={faSearch} />
                                        </div>
                                        <input className="search_input" placeholder="Search..." type="text" />
                                    </div>
                                </form>
                            </div>
                        </div>
                        <table className="table text-center table-striped">
                            <thead>
                                <tr>
                                    <th>
                                        <input className='form-check-input' type="checkbox" />
                                    </th>
                                    <th scope="col">STT</th>
                                    <th scope="col">Mã Tài Khoản</th>
                                    <th scope="col">Tên Tài Khoản</th>
                                    <th scope="col">Email</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((item, index) => (
                                    <tr key={index} className='align-middle'>
                                        <th>
                                            <input className='form-check-input' type="checkbox" onChange={(e) => handleCheckboxChange(e, item._id)} />
                                        </th>
                                        <th scope="row">{index + 1}</th>
                                        <td>{item._id}</td>
                                        <td>{item.name}</td>
                                        <td>{item.email}</td>
                                        {/* <td>
                                            <p className='edit-icon' id={item.id} name={item.name} price={item.price} description={item.description} dateCreate={item.dateCreate} data-bs-toggle="modal" data-bs-target="#editCategoryModal" onClick={() => handleEditClick(item)}><FontAwesomeIcon className='icon' icon={faPen} /></p>
                                            <p className='cusor' onClick={() => removeProduct(item._id)}><FontAwesomeIcon className='icon' icon={faTrashAlt} /></p>
                                        </td> */}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className='page'>
                            {/* <ReactPaginate
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
                            /> */}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default manageUser