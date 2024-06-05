import React, { useState, useRef, useEffect } from 'react';
import './category.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrashAlt, faSearch, faPen } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { assets } from '../../assets/assets';
import Navar from '../../components/Navar/Navar';
import ReactPaginate from 'react-paginate';

const ManageCategory = ({ url }) => {
    const [list, setList] = useState([]);
    const [itemsToShow, setItemsToShow] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentLimit, setCurrentLimit] = useState(itemsToShow);
    const [totalPages, setTotalPages] = useState(0);
    const modalRef = useRef(null);
    const [data, setData] = useState({ name: "", id: "" });
    const [image, setImage] = useState(null);

    // Hiển hị dữ liệu ra danh sách
    const fetchList = async (page, limit) => {
        try {
            const response = await axios.get(`${url}/api/category/getCategory?page=${page}&limit=${limit}`);
            if (response.data.success) {
                setList(response.data.data.categories);
                setTotalPages(response.data.data.totalPages);
            } else {
                toast.error("Lỗi không load được dữ liệu");
            }
        } catch (error) {
            toast.error("Loading...");
        }
    };
    // Lấy giá trị value đổ vào form
    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setData(data => ({ ...data, [name]: value }));
    };

    // Thêm danh mục
    const onSubmitHandler = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("image", image);

        try {
            const response = await axios.post(`${url}/api/category/add`, formData);
            if (response.data.success) {
                setData({ name: "" });
                setImage(null);
                await fetchList(currentPage, currentLimit);
                toast.success(response.data.message, { autoClose: 1500 });

                const modal = modalRef.current;
                if (modal) {
                    const bootstrapModal = window.bootstrap.Modal.getInstance(modal);
                    if (bootstrapModal) {
                        bootstrapModal.hide();
                    }
                }
            } else {
                toast.error(response.data.message, { autoClose: 1500 });
            }
        } catch (error) {
            toast.error("Error");
        }
    };

    // Update danh mục theo mã id
    const onSubmitEdit = async (event) => {
        event.preventDefault();
        const { id, name } = data;
        const formData = new FormData();
        formData.append("name", name);
        if(image){
            formData.append("image", image);
        }

        try {
            const response = await axios.put(`${url}/api/category/updatecategory/${id}`,formData);
            if (response.data.success) {
                toast.success(response.data.message, { autoClose: 1500 });
                await fetchList(currentPage, currentLimit);
                setData({ name: "", id: "" });
                setImage(null);

                const modal = modalRef.current;
                if (modal) {
                    const bootstrapModal = window.bootstrap.Modal.getInstance(modal);
                    if (bootstrapModal) {
                        bootstrapModal.hide();
                    }
                }
            } else {
                toast.error(response.data.message, { autoClose: 1500 });
            }
        } catch (error) {
            console.error(error);
            toast.error("Error updating category.");
        }
    };

    // Xóa danh mục theo mã Id
    const removeCategory = async (categoryId) => {
        const response = await axios.post(`${url}/api/category/deleteCategory`, { id: categoryId });
        await fetchList(currentPage, currentLimit);
        if (response.data.success) {
            toast.success(response.data.message, { autoClose: 1500 });
        } else {
            toast.error("Error");
        }
    };

    // Sự kiện Oncick lọc số lượng sản phẩm muốn hiển thị
    const handleSelectChange = (event) => {
        const newItemsToShow = Number(event.target.value);
        setItemsToShow(newItemsToShow);
        setCurrentLimit(newItemsToShow);
        fetchList(1, newItemsToShow);
    };
    // Sự kiện Onclick phân trang
    const handlePageClick = (event) => {
       const selectedPage = event.selected + 1;
       setCurrentPage(selectedPage);
       fetchList(selectedPage, currentLimit);
    };
    // Sự kiện onclick update danh mục
    const handleEditClick = (category) => {
        setData({ name: category.name, id: category._id });
        setImage(null);
    }

    useEffect(() => {
        fetchList(currentPage, currentLimit);
    }, [currentPage, currentLimit]);

    return (
        <>
            <div className='main'>
                <Navar />
                <div className='container'>
                    <div className='model-header'>
                        <div>
                            <button type="button" data-bs-toggle="modal" data-bs-target="#addCategoryModal">
                                <FontAwesomeIcon className='icon' icon={faPlus} />
                                <span>Thêm sản phẩm mới</span>
                            </button>
                            <button>
                                <FontAwesomeIcon className='icon' icon={faTrashAlt} />
                                <span>Xóa tất cả</span>
                            </button>
                        </div>
                    </div>
                    <hr />
                    <div className='model-body'>
                        <div className='model-tools'>
                            <label>
                                Hiện thị
                                <select onChange={handleSelectChange} value={itemsToShow}>
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
                                <div className="mainbox">
                                    <div className="iconContainer">
                                        <FontAwesomeIcon className='search' icon={faSearch} />
                                    </div>
                                    <input className="search_input" placeholder="Search..." type="text" />
                                </div>
                            </div>
                        </div>
                        <table className="table text-center table-striped">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Tên danh mục</th>
                                    <th scope="col">Hình ảnh</th>
                                    <th scope="col">Chức năng</th>
                                </tr>
                            </thead>
                            <tbody>
                                {list.slice(0, itemsToShow).map((item, index) => (
                                    <tr key={index}>
                                        <th scope="row">{index + 1}</th>
                                        <td>{item.name}</td>
                                        <td><img style={{ height: '50px', width: '80px' }} className='img-fluid' src={`${url}/images/${item.image}`} alt="" /></td>
                                        <td>
                                            <p className='edit-icon' id={item.id} name={item.name} data-bs-toggle="modal" data-bs-target="#editCategoryModal" onClick={() => handleEditClick(item)}><FontAwesomeIcon className='icon' icon={faPen} /></p>
                                            <p className='cusor' onClick={() => removeCategory(item._id)}><FontAwesomeIcon className='icon' icon={faTrashAlt} /></p>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
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
            </div>

            {/* Modal Thêm Danh Mục */}
            <div className="modal fade" id="addCategoryModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" ref={modalRef}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <form onSubmit={onSubmitHandler}>
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Thêm mới danh mục</h5>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <p>Tên danh mục</p>
                                    <input onChange={onChangeHandler} type="text" className='form-control' name='name' value={data.name} />
                                </div>
                                <div className="mb-3 add-img-upload flex-col">
                                    <p>Upload hình ảnh</p>
                                    <label htmlFor="image">
                                        <img src={image ? URL.createObjectURL(image) : assets.upload_area} alt="" />
                                    </label>
                                    <input onChange={(e) => setImage(e.target.files[0])} type='file' id='image' hidden required />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Hủy</button>
                                <button type="submit" className="btn btn-primary">Thêm Mới</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Model Update Danh Mục */}
            <div className="modal fade" id="editCategoryModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" ref={modalRef}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <form onSubmit={onSubmitEdit}>
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Update danh mục</h5>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <p>Tên danh mục</p>
                                    <input onChange={onChangeHandler} type="text" className='form-control' name='name' value={data.name} />
                                </div>
                                <div className="mb-3 add-img-upload flex-col">
                                    <p>Upload hình ảnh</p>
                                    <label htmlFor="image">
                                        <img src={image ? URL.createObjectURL(image) : assets.upload_area} alt="" />
                                    </label>
                                    <input onChange={(e) => setImage(e.target.files[0])} type='file' id='image' hidden />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Hủy</button>
                                <button type="submit" className="btn btn-primary">Update</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ManageCategory;
