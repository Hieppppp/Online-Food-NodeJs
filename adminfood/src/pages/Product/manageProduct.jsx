import React, { useEffect, useState, useRef } from 'react';
import Navar from '../../components/Navar/Navar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrashAlt, faSearch, faPen } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { assets } from '../../assets/assets';
import ReactPaginate from 'react-paginate';


const ManageProduct = ({ url }) => {
    const [list, setList] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [image, setImage] = useState(null);
    const [itemsToShow, setItemsToShow] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentLimit, setCurrentLimit] = useState(itemsToShow);
    const [totalPages, setTotalPages] = useState(0);
    const [selectedProduct, setSelectedProduct] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [data, setData] = useState({
        id: "",
        name: "",
        category: "",
        price: "",
        description: "",
        dateCreate: ""
    });
    const modalRef = useRef(null);
    // Lấy giá trị đổ vào form
    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setSelectedCategory(value);
        setData(prevData => ({ ...prevData, [name]: value }));
    };
    // Xử lý sự kiện khi thay đổi danh mục
    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
        setData(prevData => ({ ...prevData, category: e.target.value }));
    };
    // Thêm sản phẩm
    const onSubmitHandler = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("category", data.category);
        formData.append("price", data.price);
        formData.append("description", data.description);
        formData.append("dateCreate", data.dateCreate);
        formData.append("image", image);

        try {
            const response = await axios.post(`${url}/api/product/add`, formData);
            if (response.data.success) {
                setData({
                    name: "",
                    category: "",
                    price: "",
                    description: "",
                    dateCreate: ""
                });
                setImage(false);
                await fetchList(currentPage,currentLimit); // Update product list after successful addition
                toast.success(response.data.message, { autoClose: 1500 });

                const model = modalRef.current;
                if (model) {
                    const bootstrapModal = window.bootstrap.Modal.getInstance(model);
                    if (bootstrapModal) {
                        bootstrapModal.hide();
                    }
                }
            } else {
                toast.error(response.data.message, { autoClose: 1500 });
            }
        } catch (error) {
            console.error(error);
            toast.error("Lỗi khi thêm sản phẩm");
        }
    };
    // Hiển thị danh sách sản phẩm
    // const fetchList = async (page, limit) => {
    //     try {
    //         const response = await axios.get(`${url}/api/product/listProduct?page=${page}&limit=${limit}`);
    //         if (response.data.success) {
    //             setList(response.data.data.products);
    //             setTotalPages(response.data.data.totalPages);
    //         } else {
    //             toast.error("Lỗi khi load dữ liệu");
    //         }
    //     } catch (error) {
    //         toast.error("Loading...");
    //     }
    // };
    const fetchList = async (page, limit, query = '') => {
        try {
            const response = await axios.get(`${url}/api/product/listProduct`, {
                params: { page, limit, search: query }
            });
            if (response.data.success) {
                setList(response.data.data.products || []);
                setTotalPages(response.data.data.totalPages || 0);
            } else {
                toast.error("Lỗi khi load dữ liệu");
            }
        } catch (error) {
            toast.error("Loading...");
        }
    };
    // Hiển thị tên danh mục
    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${url}/api/category/getCategory`);
            if (response.data.success) {
                setCategories(response.data.data);
            } else {
                toast.error("Lỗi khi load dữ liệu");
            }
        } catch (error) {
            toast.error("Loading...");
        }
    };
    // Update sản phẩm
    const onSubmitEditProduct = async (event) => {
        event.preventDefault();
        const { id, name, category, price, description, dateCreate } = data;
        const formData = new FormData();
        formData.append("name", name);
        formData.append("category", category);
        formData.append("price", price);
        formData.append("description", description);
        formData.append("dateCreate", dateCreate);
        if (image) {
            formData.append("image", image);
        }
        try {
            const response = await axios.put(`${url}/api/product/updateProduct/${id}`, formData);
            if (response.data.success) {
                toast.success(response.data.message, { autoClose: 1500 });
                await fetchList(currentPage, currentLimit);
                setData({
                    id: "",
                    name: "",
                    category: "",
                    price: "",
                    description: "",
                    dateCreate: "",
                });
                setImage(null);

                const modal = modalRef.current;
                if (modal) {
                    const bootstrapModal = window.bootstrap.Modal.getInstance(modal);
                    if (bootstrapModal) {
                        bootstrapModal.hide();
                    }
                }
                else {
                    toast.error(response.data.message, { autoClose: 1500 });
                }
            }
        } catch (error) {
            console.error(error);
            toast.error("Error updating product", { autoClose: 1500 });
        }
    }
    // Xóa sản phẩm
    const removeProduct = async (productId) => {
        try {
            const response = await axios.post(`${url}/api/product/deleteProduct`, { id: productId });
            await fetchList();
            if (response.data.success) {
                toast.success(response.data.message, { autoClose: 1500 });
            } else {
                toast.error(response.data.message, { autoClose: 1500 });
            }
        } catch (error) {
            toast.error("Lỗi khi xóa sản phẩm");
        }
    };
    //Hàm handleSelectChange để cập nhập state itemsToShow khi ta thay đổi lựa chon
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
    // Sự kiện hiển thị value để sửa
    const handleEditClick = (product) => {
        const formattedDate = new Date(product.dateCreate).toISOString().split('T')[0];
        setData({
            id: product._id,
            name: product.name,
            category: product.category,
            price: product.price,
            description: product.description,
            dateCreate: formattedDate
        });
        setSelectedCategory(product.category);
        setImage(null);

    };
    // Sự kiên onclick xóa sản phẩm khi chọn lọc
    const handleCheckboxChange = (event, id) => {
        if (event.target.checked) {
            setSelectedProduct([...selectedProduct, id]);
        }
        else {
            selectedProduct(selectedProduct.filter(productId => productId !== id));
        }
    }
    // Xóa sản phẩm (delete-multiple)
    const handleDeleteSelected = async () => {
        try {
            const response = await axios.delete(`${url}/api/product/delete-multiple-product`, { data: { ids: selectedProduct } });
            await fetchList(currentPage, currentLimit);
            if (response.data.success) {
                setList((prevList) => prevList.filter(item => !selectedProduct.includes(item._id)));
                setSelectedProduct([]);
                toast.success(response.data.message, { autoClose: 1500 });
            }
        } catch (error) {
            console.error(error);
            toast.error(response.data.message, { autoClose: 1500 });
        }
    }
    // Tìm kiếm sản phẩm 
    // const fetchSearchResults = async () => {
    //     try {
    //         const response = await axios.get(`${url}/api/product/search-products`,{search: query});
    //         if(response.data.success){
    //             setList(response.data.data);
    //         }
    //         else{
    //             console.error("Error");
    //         }
    //     } catch (error) {
    //         console.error("Error fetching search results:", error);
    //     }
    // }
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchList(1, currentLimit, searchQuery);
    };


    useEffect(() => {
        fetchList(currentPage, currentLimit);
        fetchCategories();
    }, [currentPage, currentLimit]);

    return (
        <>
            <div className='main'>
                <Navar />
                <div className='container'>
                    <div className='model-header'>
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
                                <form action=""  onSubmit={handleSearch}>
                                    <div className="mainbox">
                                        <div className="iconContainer">
                                            <FontAwesomeIcon className='search' icon={faSearch} />
                                        </div>
                                        <input className="search_input" placeholder="Search..." type="text" value={searchQuery} onChange={handleSearchChange} />
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
                                    <th scope="col">Tên sản phẩm</th>
                                    <th scope="col">Loai sản phẩm</th>
                                    <th scope="col">Hình ảnh</th>
                                    <th scope="col">Giá sản phẩm</th>
                                    <th scope="col">Mô tả</th>
                                    <th scope="col">Chức năng</th>
                                </tr>
                            </thead>
                            <tbody>
                                {list.slice(0, itemsToShow).map((item, index) => (
                                    <tr key={index} className='align-middle'>
                                        <th>
                                            <input className='form-check-input' type="checkbox" onChange={(e) => handleCheckboxChange(e, item._id)} />
                                        </th>
                                        <th scope="row">{index + 1}</th>
                                        <td>{item.name}</td>
                                        <td>{categories.find(category => category._id === item.category)?.name}</td>
                                        <td><img style={{ height: '50px', width: '50px' }} className='img-fluid' src={`${url}/images/${item.image}`} alt="" /></td>
                                        <td>{item.price}.000</td>
                                        <td>{item.description}</td>
                                        <td>
                                            <p className='edit-icon' id={item.id} name={item.name} price={item.price} description={item.description} dateCreate={item.dateCreate} data-bs-toggle="modal" data-bs-target="#editCategoryModal" onClick={() => handleEditClick(item)}><FontAwesomeIcon className='icon' icon={faPen} /></p>
                                            <p className='cusor' onClick={() => removeProduct(item._id)}><FontAwesomeIcon className='icon' icon={faTrashAlt} /></p>
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
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <form onSubmit={onSubmitHandler}>
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Thêm mới sản phẩm</h5>
                            </div>
                            <div className="modal-body">
                                <div className='row'>
                                    <div className='form-group col-md-6 mb-3'>
                                        <label htmlFor="name">Tên sản phẩm</label>
                                        <input onChange={onChangeHandler} value={data.name} type="text" className='form-control' name='name' />
                                    </div>
                                    <div className='form-group col-md-6 mb-3'>
                                        <label htmlFor="category">Danh mục</label>
                                        <select name="category" id="category" value={selectedCategory} onChange={handleCategoryChange} className='form-control'>
                                            <option value="">Chọn loại sản phẩm</option>
                                            {categories.map((category) => (
                                                <option key={category._id} value={category._id}>{category.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className='form-group col-md-6 mb-3'>
                                        <label htmlFor="price">Giá cả</label>
                                        <input onChange={onChangeHandler} value={data.price} type="number" className='form-control' name='price' />
                                    </div>
                                    <div className='form-group col-md-6 mb-3'>
                                        <label htmlFor="dateCreate">Ngày Tạo</label>
                                        <input onChange={onChangeHandler} value={data.dateCreate} type="date" className='form-control' name='dateCreate' />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <p>Mô tả</p>
                                    <textarea onChange={onChangeHandler} value={data.description} name='description' className='form-control' rows={5} />
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

            {/* Model edit sản phẩm */}
            <div className="modal fade" id="editCategoryModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" ref={modalRef}>
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <form onSubmit={onSubmitEditProduct}>
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Update Sản Phẩm</h5>
                            </div>
                            <div className="modal-body">
                                <div className='row'>
                                    <div className='form-group col-md-6 mb-3'>
                                        <label htmlFor="name">Tên sản phẩm</label>
                                        <input onChange={onChangeHandler} value={data.name} type="text" className='form-control' name='name' />
                                    </div>
                                    <div className='form-group col-md-6 mb-3'>
                                        <label htmlFor="category">Danh mục</label>
                                        <select name="category" id="category" value={selectedCategory} onChange={handleCategoryChange} className='form-control'>
                                            <option value="">Chọn loại sản phẩm</option>
                                            {categories.map((category) => (
                                                <option key={category._id} value={category._id}>{category.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className='form-group col-md-6 mb-3'>
                                        <label htmlFor="price">Giá cả</label>
                                        <input onChange={onChangeHandler} value={data.price} type="number" className='form-control' name='price' />
                                    </div>
                                    <div className='form-group col-md-6 mb-3'>
                                        <label htmlFor="dateCreate">Ngày Tạo</label>
                                        <input onChange={onChangeHandler} value={data.dateCreate} type="date" className='form-control' name='dateCreate' disabled />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <p>Mô tả</p>
                                    <textarea onChange={onChangeHandler} value={data.description} name='description' className='form-control' rows={5} />
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
};

export default ManageProduct;
