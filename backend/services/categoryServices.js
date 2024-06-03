import categoryModel from "../models/categoryModel.js"

// const paginationCategory = async (req, res, next) => {
//     try {
//         let perPage = 5; // số lượng sản phẩm trên 1 trang
//         let page = parseInt(req.params.page) || 1;

//         const categories = await categoryModel
//             .find() // find all data
//             .skip((perPage * page) - perPage) // trang đầu tiên sẽ loại bỏ giá trị là 0
//             .limit(perPage);

//         const count = await categoryModel.countDocuments(); // đếm để tính có bao nhiêu trang

//         res.json({
//             categories, // dữ liệu data
//             currentPage: page, // số trang hiện tại
//             totalPages: Math.ceil(count / perPage), // Tổng số trang
//             totalItems: count // Tổng số sản phẩm
//         });
//     } catch (error) {
//         next(error); // Báo lỗi
//     }
// };

const paginationCategory = async (page, limit) => {
    try {
        let offset = (page - 1) * limit; 

        // Đếm tổng số bản ghi
        const count = await categoryModel.countDocuments();

        // Lấy dữ liệu với phân trang
        const rows = await categoryModel.find()
            .skip(offset)
            .limit(limit);

        let totalPages = Math.ceil(count / limit);
        let data = {
            totalRows: count,
            totalPages: totalPages,
            categories: rows // Sửa tên 'categorys' thành 'categories'
        };

        console.log("check data input: offset =", offset, "limit =", limit);
        console.log("?? check data:", data);
        return data;
       
    } catch (error) {
        console.log(error);
    }
};


export {paginationCategory};