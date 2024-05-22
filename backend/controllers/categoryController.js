import path from "path";
import categoryModel from "../models/categoryModel.js";
import fs from 'fs';

//thêm loại danh mục
const addCategory = async(req,res)=>{
    let image_filename = `${req.file.filename}`;

    const category = new categoryModel({
        name:req.body.name,
        image:image_filename
    })
    try {
        await category.save();
        res.json({success:true,message:"Thêm danh mục thành công!"});
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"});
    }
}
//Lấy danh mục
const getCategory = async(req,res)=>{
    try {
        const category = await categoryModel.find({});
        res.json({success:true,data:category});
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Không lấy được danh mục sản phẩm!"});
    }
}
//Update danh mục sản phẩm

//Xóa danh mục sản phẩm theo mã id
const deleteCategory = async (req,res)=>{
    try {
        const category = await categoryModel.findById(req.body.id);
        fs.unlink(`upload/${category.image}`,()=>{})
        await categoryModel.findByIdAndDelete(req.body.id);
        res.json({success:true,message:"Xóa danh mục thành công!"});
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"});
    }
}

const paginationCategory = async (req, res, next) => {
    try {
        let perPage = 5; // số lượng sản phẩm trên 1 trang
        let page = parseInt(req.params.page) || 1;

        const categories = await categoryModel
            .find() // find all data
            .skip((perPage * page) - perPage) // trang đầu tiên sẽ loại bỏ giá trị là 0
            .limit(perPage);

        const count = await categoryModel.countDocuments(); // đếm để tính có bao nhiêu trang

        res.json({
            categories, // dữ liệu data
            currentPage: page, // số trang hiện tại
            totalPages: Math.ceil(count / perPage), // Tổng số trang
            totalItems: count // Tổng số sản phẩm
        });
    } catch (error) {
        next(error); // Báo lỗi
    }
};

export {addCategory,getCategory,deleteCategory,paginationCategory};