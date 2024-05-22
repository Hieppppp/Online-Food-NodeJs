// // category.services.jsx

// import axios from 'axios';

// const url = "http://localhost:4000"; // Thay thế bằng URL thích hợp của bạn

// const fetchList = async () => {
//     try {
//         const response = await axios.get(`${url}/api/category/getCategory`);
//         if (response.data.success) {
//             return response.data.data;
//         } else {
//             throw new Error("Lỗi không load được dữ liệu");
//         }
//     } catch (error) {
//         throw new Error("Lỗi không load được dữ liệu");
//     }
// };

// const addCategory = async (name, image) => {
//     const formData = new FormData();
//     formData.append("name", name);
//     formData.append("image", image);

//     try {
//         const response = await axios.post(`${url}/api/category/add`, formData);
//         if (response.data.success) {
//             return response.data.message;
//         } else {
//             throw new Error(response.data.message);
//         }
//     } catch (error) {
//         throw new Error("Error adding category");
//     }
// };

// const removeCategory = async (categoryId) => {
//     try {
//         const response = await axios.post(`${url}/api/category/deleteCategory`, { id: categoryId });
//         if (response.data.success) {
//             return response.data.message;
//         } else {
//             throw new Error("Error");
//         }
//     } catch (error) {
//         throw new Error("Error");
//     }
// };

// export { fetchList, addCategory, removeCategory };
