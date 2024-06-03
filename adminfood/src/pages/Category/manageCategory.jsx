import React, { useState, useRef, useEffect } from 'react';
import './category.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrashAlt, faSearch, faPen } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { assets } from '../../assets/assets';
import Navar from '../../components/Navar/Navar';
import { useParams } from 'react-router-dom';

const ManageCategory = ({ url }) => {
    const [list, setList] = useState([]);
    const [itemsToShow, setItemsToShow] = useState(5);
    const [searchQuery, setSearchQuery] = useState('');
    const [modalData, setModalData] = useState({ name: '', image: null });
    const [image, setImage] = useState(null);
    const params = useParams();
    const modalRef = useRef(null);

    const fetchList = async () => {
        try {
            const response = await axios.get(`${url}/api/category/getCategory`);
            if (response.data.success) {
                setList(response.data.data);
            } else {
                toast.error("Lỗi không load được dữ liệu");
            }
        } catch (error) {
            toast.error("Loading...");
        }
    };

    const fetchById = async (categoryId) => {
        try {
            const response = await axios.get(`${url}/api/category/getbycategory`, { id: categoryId });
            if (response.data.success) {
                setModalData(response.data.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setModalData(data => ({ ...data, [name]: value }));
    };

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("name", modalData.name);
        if (image) {
            formData.append("image", image);
        }

        try {
            const response = await axios.post(`${url}/api/category/update`, formData);
            if (response.data.success) {
                setModalData({ name: '', image: null });
                setImage(null);
                await fetchList();
                toast.success(response.data.message, { autoClose: 1500 });

                // Đóng modal lại
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

    const updateCategory = async(categoryId)=>{
        const response = await axios.put(`${url}/api/category/updatecategory`, { id: categoryId });
        await fetchList();
        if (response.data.success) {
            toast.success(response.data.message, { autoClose: 1500 });
        } else {
            toast.error("Error");
        }
    };

    const removeCategory = async (categoryId) => {
        const response = await axios.post(`${url}/api/category/deleteCategory`, { id: categoryId });
        await fetchList();
        if (response.data.success) {
            toast.success(response.data.message, { autoClose: 1500 });
        } else {
            toast.error("Error");
        }
    };

    const handleSelectChange = (event) => {
        setItemsToShow(Number(event.target.value));
    };

    const handleEditClick = (category) => {
        setModalData(category);
        setImage(null); // Reset image preview
    };

    useEffect(() => {
        fetchList();
    }, []);

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
                                    <input
                                        className="search_input"
                                        placeholder="Search..."
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
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
                                {list
                                    .filter(category => category.name.toLowerCase().includes(searchQuery.toLowerCase()))
                                    .slice(0, itemsToShow)
                                    .map((item, index) => (
                                        <tr key={index}>
                                            <th scope="row">{index + 1}</th>
                                            <td>{item.name}</td>
                                            <td><img style={{ height: '50px', width: '80px' }} className='img-fluid' src={`${url}/images/${item.image}`} alt="" /></td>
                                            <td>
                                                <p className='edit-icon' data-bs-toggle="modal" data-bs-target="#editCategoryModal" onClick={() => handleEditClick(item)}>
                                                    <FontAwesomeIcon className='icon' icon={faPen} />
                                                </p>
                                                <p className='cusor' onClick={() => removeCategory(item._id)}>
                                                    <FontAwesomeIcon className='icon' icon={faTrashAlt} />
                                                </p>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                        <div className='page'>
                            <label>
                                Trang
                                <select>
                                    <option value="">Trang</option>
                                </select>
                            </label>
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
                                    <input onChange={onChangeHandler} type="text" className='form-control' name='name' value={modalData.name} />
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
                        <form onSubmit={onSubmitHandler}>
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Update danh mục</h5>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <p>Tên danh mục</p>
                                    <input onChange={onChangeHandler} type="text" className='form-control' name='name' value={modalData.name} />
                                </div>
                                <div className="mb-3 add-img-upload flex-col">
                                    <p>Upload hình ảnh</p>
                                    <label htmlFor="image">
                                        <img src={image ? URL.createObjectURL(image) : `${url}/images/${modalData.image}`} alt="" />
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
