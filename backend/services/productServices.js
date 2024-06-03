import categoryModel from "../models/categoryModel.js";
import productModel from "../models/productModel.js";
import orderModel from "../models/orderModel.js";
//phân trang sản phẩm
const paginationProduct = async (page, limit) => {
    try {

        let offset = (page - 1) * limit;

        //Đếm tổng số bản ghi dùng countDocuments của mongodb
        const count = await productModel.countDocuments();

        //Lấy dữ liệu với phân trang
        const rows = await productModel.find()
            .skip(offset)
            .limit(limit);

        let totalPages = Math.ceil(count / limit);

        let data = {
            totalRows: count,
            totalPages: totalPages,
            products: rows
        };
        return data;

    } catch (error) {
        console.log(error);
    }
};

//Lấy ra những sản phẩm bán chạy 
const getTopSellingProducts = async (req, res) => {
    const limit = parseInt(req.query.limit) || 5; // Giới hạn số lượng sản phẩm trả về, mặc định là 5
    const topSellingProducts = await orderModel.aggregate([
        { "$unwind": "$items" }, // Tách các mục trong mảng items thành các tài liệu riêng biệt
        {
            "$group": {
                "_id": "$items._id", // Nhóm theo _id của sản phẩm trong items
                "name": { "$first": "$items.name" }, // Giữ lại tên sản phẩm đầu tiên trong mỗi nhóm
                "totalSold": { "$sum": "$items.quantity" } // Tính tổng số lượng sản phẩm được bán
            }
        },
        {
            "$sort": { "totalSold": -1 } // Sắp xếp các sản phẩm theo tổng số lượng giảm dần
        },
        {
            "$limit": limit // Giới hạn số lượng sản phẩm trả về
        }
    ]);


    return topSellingProducts;
}



export { paginationProduct, getTopSellingProducts };