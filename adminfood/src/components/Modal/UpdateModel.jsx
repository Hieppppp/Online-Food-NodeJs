// import React, { useState } from 'react';
// import { Modal, Button } from 'react-bootstrap';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faPen } from '@fortawesome/free-solid-svg-icons';
// import { assets } from '../../assets/assets';
// import axios from 'axios';

// const UpdateModel = (props) => {

//     const [isShow, setIsShow] = useState(false);
//     const initModal = () => {
//         return setIsShow(!isShow);
//     };
//     // form updation data
//     const [name, setName] = useState(props.name);
//     const [id, setId] = useState(props.id);
//     const [selectFile, setSelectFile] = useState('');

//     const onUpdateSubmit = async (event) => {
//         event.preventDefault();
//         const formData = new FormData();
//         formData.append("name", data.name);
//         formData.append("image", image);

//         try {
//             const response = await axios.put(`$`)
//         } catch (error) {
            
//         }
//     }
//     return (
//         <>
//             <p className='edit-icon' onClick={initModal}><FontAwesomeIcon className='icon' icon={faPen} /></p>
//             <Modal show={isShow}>
//                 <Modal.Header closeButton onClick={initModal}>
//                     <Modal.Title>
//                         Update Danh Mục
//                     </Modal.Title>
//                 </Modal.Header>
//                 <form action="">
//                     <Modal.Body>
//                         <div className="modal-body">
//                             <div className="mb-3">
//                                 <p>Tên danh mục</p>
//                                 <input type="text" className='form-control' name='name' value={name} onChange={(event) => setName(event.target.value)} />
//                             </div>
//                             <div className="mb-3 add-img-upload flex-col">
//                                 <p>Upload hình ảnh</p>
//                                 <label htmlFor="image">
//                                     <img src={selectFile ? URL.createObjectURL(selectFile) : assets.upload_area} alt="" />
//                                 </label>
//                                 <input onChange={(event) => setSelectFile(event.target.files[0])} type='file' id='image' hidden required />
//                             </div>
//                         </div>
//                     </Modal.Body>

//                     <Modal.Footer>
//                         <Button variant='danger' onClick={initModal}>
//                             Close
//                         </Button>
//                         <Button type='submit' variant='dark'>
//                             Update
//                         </Button>
//                     </Modal.Footer>
//                 </form>

//             </Modal>
//         </>
//     )
// }

// export default UpdateModel