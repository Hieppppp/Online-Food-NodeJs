import categoryModel from "../models/categoryModel.js"

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

        return data;
       
    } catch (error) {
        console.log(error);
    }
};


export {paginationCategory};