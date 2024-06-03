import path from "path";
import categoryModel from "../models/categoryModel.js";
import { paginationCategory } from "../services/categoryServices.js";
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
        if(req.query.page && req.query.limit){
            let page = parseInt(req.query.page);
            let limit = parseInt(req.query.limit);

            const categoryData  = await paginationCategory(page, limit);
            res.json({success:true,data:categoryData });

            console.log("check ket qua:", 'page=',page, 'limit= ',limit);
        }
        else{
            const category = await categoryModel.find({});
            res.json({success:true,data:category});
        }
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Không lấy được danh mục sản phẩm!"});
    }
}
// Lấy danh mục theo mã ID
const getByCategory = async (req,res)=>{
    try {
        const categories = await categoryModel.findOne({_id: req.params.id});
        res.json({success:true, data:categories});
    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error"});
    }
}
//Update danh mục sản phẩm
const updateCategory = async (req,res) => {
    try {
        const response = await categoryModel.updateOne(
            {_id: req.params.id},
            {$set:req.body}
        );
        res.json({success:true,message:"Update thành công",data:response});

    } catch (error) {
        console.log(error);
    }
}

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



export {addCategory,getCategory,deleteCategory,getByCategory,updateCategory};