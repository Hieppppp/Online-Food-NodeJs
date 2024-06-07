import categoryModel from "../models/categoryModel.js";
import productModel from "../models/productModel.js";
import orderModel from "../models/orderModel.js";
import { paginationProduct } from "../services/productServices.js";
import fs from 'fs';

//Thêm sản phẩm
const addProduct = async (req, res) => {
    const category = await categoryModel.findById(req.body.category);
    if (!category) {
        return res.status(400).send("Invalid Category");
    }

    // Lấy ID của category
    const categoryId = category._id;

    let image_filename = `${req.file.filename}`;

    const product = new productModel({
        name: req.body.name,
        category: categoryId,//Sử dụng ID của category
        image: image_filename,
        price: req.body.price,
        description: req.body.description,
    })
    try {
        await product.save();
        res.json({ success: true, message: "Thêm sản phẩm thành công!" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

// Lấy danh sách sản phẩm (có thể lọc theo danh mục)
const getListProduct = async (req, res) => {
    try {
        if (req.query.page && req.query.limit) {
            let page = parseInt(req.query.page);
            let limit = parseInt(req.query.limit);

            const productData = await paginationProduct(page, limit);
            res.json({ success: true, data: productData });

        } else {
            let sortField = req.query.sortField || 'price';
            let sortType = req.query.sortType || 'desc';
            const category = req.query.category;
            let products;
            if (category && category !== 'All') {
                products = await productModel.find({ category }).sort({ [sortField]: sortType });
            }
            else {
                products = await productModel.find({}).sort({ [sortField]: sortType });
            }
            res.json({ success: true, data: products });
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Không lấy được danh sách sản phẩm!" });
    }
}
// Lấy sản phẩm theo mã Id
const getByIdProduct = async (req, res) => {
    const products = await productModel.findOne({ _id: req.params.id });
    if(products){
        res.json({success:true,data:products});
    }else{
        res.json({success:false, message:"Không tìm thấy sản phẩm"});
    }
}

// Lấy sản phẩm và danh mục sản phẩm đó dựa theo mã id
const getProductCat = async (req, res) => {
    try {
        const products = await productModel.findById(req.params.id).populate('category');
        res.json({ success: true, data: products });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Lỗi không tìm thấy sản phẩm!" });
    }
}
// Update sản phẩm
const updateProduct = async (req, res) => {
    try {
        const id = req.params.id
        const productExist = await productModel.findOne({_id: id});

        if(!productExist){
            return res.status(404).json({message:"Product Not Found!"});
        }
        //Kiểm tra nếu ID danh mục mới hợp lệ
        if (req.body.category) {
            const category = await categoryModel.findById(req.body.category);
            if (!category) {
                return res.status(400).json({ message: "Danh mục không hợp lệ" });
            }
        }

        let updateData = {...req.body};
        if (req.file) {
            //xóa hình ảnh cũ
            fs.unlink(`upload/${productExist.image}`, (err) => {
                if (err) {
                    console.log("Lỗi khi xóa ảnh", err);
                }
            });
            //Cập nhập tên file hình ảnh mới
            updateData.image = req.file.filename;
        }

        //Cập nhập sản phẩm mới
        const updateProduct = await productModel.findByIdAndUpdate(id, updateData, {new: true});
        res.status(201).json({success: true, message:"Update thành công", data:updateProduct});
       
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Update sản phẩm thất bại!" });
    }
}

//Xóa sản phẩm theo mã ID
const deleteProduct = async (req, res) => {
    try {
        //Xóa sản phẩm theo mã id
        const product = await productModel.findById(req.body.id);

        fs.unlink(`upload/${product.image}`, () => { })

        await productModel.findByIdAndDelete(req.body.id);

        res.json({ success: true, message: "Xóa sản phẩm thành công!" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Lỗi khi xóa sản phẩm!" });
    }
}
//Xóa tất cả sản phẩm
const deleteMultipleProduct = async (req,res) => {
    try {
        const {ids} = req.body;
        await productModel.deleteMany({_id:{$in: ids}});
        res.status(200).json({success:true, message:"Xóa sản phẩm thành công"});
    } catch (error) {
        console.error(error);
        res.status(500).json({success:false,message:"Lỗi khi xóa sản phẩm", error});
    }
}

const getProductByCategory = async (req, res) => {
    try {
        const categories = await categoryModel.find({}); // Lấy tất cả các danh mục từ bảng category
        const categoryIds = categories.map(category => category._id);//Lấy tất cả các ID danh mục và lưu vào mảng categoryIds
        const products = await productModel.find({ category: { $in: categoryIds } }).sort({ _id: 'asc' });

        //Nhóm các sản phẩm theo danh mục
        const productCats = products.reduce((acc, product) => {
            if (!acc[product.category]) {//Nếu acc chưa có key category sẽ tạo ra mảng rỗng cho nó
                acc[product.category] = [];
            }
            acc[product.category].push(product);//Thêm sản phẩm vào sản phẩm đó tương ứng
            return acc;
        }, {});
        res.json({ success: true, data: productCats });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Lỗi không load được dữ liệu!" });
    }
}
// Tìm kiếm sản phẩm
const listProduct = async (req, res) => {
    try {
        const pageSize = 5;
        const pageNumber = parseInt(req.query.page ? req.query.page.toString() : "1");
        const skip = (pageNumber - 1) * pageSize;

        let query = {};

        // Thêm điều kiện tìm kiếm theo tên
        if (req.query.name) {
            query.name = { $regex: req.query.name, $options: 'i' };
        }

        // Thêm điều kiện tìm kiếm theo danh mục
        if (req.query.category) {
            query.category = req.query.category;
        }

        // Thêm điều kiện tìm kiếm theo giá
        if (req.query.minPrice || req.query.maxPrice) {
            query.price = {};
            if (req.query.minPrice) {
                query.price.$gte = parseInt(req.query.minPrice);
            }
            if (req.query.maxPrice) {
                query.price.$lte = parseInt(req.query.maxPrice);
            }
        }

        const products = await productModel.find(query).skip(skip).limit(pageSize);
        const total = await productModel.countDocuments(query);

        const response = {
            data: products,
            pagination: {
                total,
                page: pageNumber,
                pages: Math.ceil(total / pageSize),
            },
        };
        res.json(response);

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};
//Lấy ra những sản phẩm mua nhiều
const getTopSellingProductsAPI = async (req, res) => {
    try {
        // Tổng hợp đơn hàng để có được tổng số lượng bán cho từng sản phẩm
        const bestSellers = await orderModel.aggregate([
            { $unwind: "$items" }, // Tách mảng items
            {
                $group: {
                    _id: "$items._id", // Nhóm theo ID sản phẩm
                    name: { $first: "$items.name" },
                    totalQuantity: { $sum: "$items.quantity" }
                }
            },
            { $sort: { totalQuantity: -1 } }, // Sắp xếp theo tổng số lượng bán (giảm dần)
            { $limit: 3 }
        ]);

        // Tùy chọn, điền thông tin sản phẩm bổ sung
        const populatedBestSellers = await productModel.populate(bestSellers, { path: "_id", select: "name category image price description" });

        res.json({ success: true, data: populatedBestSellers });
    } catch (error) {
        console.error("Error fetching best sellers:", error);
        res.status(500).json({ success: false, message: "Lỗi không load được dữ liệu" });
    }
};




export { 
    addProduct,
    getListProduct,
    getProductCat,
    updateProduct,
    deleteProduct,
    deleteMultipleProduct,
    getProductByCategory,
    listProduct,
    getTopSellingProductsAPI,
    getByIdProduct
};