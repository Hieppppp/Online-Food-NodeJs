import categoryModel from "../models/categoryModel.js";
import productModel from "../models/productModel.js";
import fs from 'fs';

//Thêm sản phẩm
const addProduct = async (req,res)=>{
    const category = await categoryModel.findById(req.body.category);
    if(!category){
        return res.status(400).send("Invalid Category");
    }

    // Lấy ID của category
    const categoryId = category._id;

    let image_filename = `${req.file.filename}`;

    const product = new productModel({
        name:req.body.name,
        category:categoryId,//Sử dụng ID của category
        image:image_filename,
        price:req.body.price,
        description:req.body.description,
    })
    try {
        await product.save();
        res.json({success:true,message:"Thêm sản phẩm thành công!"});
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"});
    }  
}

// Lấy danh sách sản phẩm (có thể lọc theo danh mục)
const getListProduct = async(req,res)=>{
    try {

        // let params = [];
        // params.sortField = 'name';
        // params.sortType = 'asc';
        let sortField = req.query.sortField || 'name';
        let sortType = req.query.sortType || 'asc';


        const category = req.query.category;
        let products;
        if(category && category !== 'All' ){
            products = await productModel.find({category}).sort({[sortField]:sortType});
        }
        else{
            products = await productModel.find({}).sort({[sortField]:sortType});
        }
        // const productList = await productModel.find({});
        res.json({success:true,data:products});
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Không lấy được danh sách sản phẩm!"});
    }
}

// Lấy sản phẩm và danh mục sản phẩm đó dựa theo mã id
const getProductCat = async(req,res)=>{
    try {
        const products = await productModel.findById(req.params.id).populate('category');
        res.json({success:true,data:products});
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Lỗi không tìm thấy sản phẩm!"});
    }
}
// Update sản phẩm
const updateProduct = async(req,res)=>{
    try {
        const {id} = req.params;
        let product = await productModel.findById(id);

        if(!product){
            return res.status(400).json({message:`Không tìm thấy sản phẩm  với id ${id}`});
        }
        //Kiểm tra nếu ID danh mục mới hợp lệ
        if(req.body.category){
            const category = await categoryModel.findById(req.body.category);
            if(!category){
                return res.status(400).json({message:"Danh mục không hợp lệ"});
            }
        }

        const updateData = {
            name: req.body.name,
            category: req.body.category,
            price: req.body.price,
            description: req.body.description
        };
        if(req.file){
            //xóa hình ảnh cũ
            fs.unlink(`upload/${product.image}`,(err)=>{
                if(err){
                    console.log("Lỗi khi xóa ảnh", err);
                }
            });
            //Cập nhập tên file hình ảnh mới
            updateData.image = req.file.filename;
        }

        //Cập nhập sản phẩm mới
        product = await productModel.findByIdAndUpdate(id, updateData, {new: true});
        res.json({success: true,message:"Update sản phẩm thành công" ,data: product})
    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Update sản phẩm thất bại!"});
    }
}

//Xóa sản phẩm theo mã ID
const deleteProduct = async (req,res)=>{
    try {
        //Xóa sản phẩm theo mã id
        const product = await productModel.findById(req.body.id);

        fs.unlink(`upload/${product.image}`,()=>{})

        await productModel.findByIdAndDelete(req.body.id);

        res.json({success:true,message:"Xóa sản phẩm thành công!"});

    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Lỗi khi xóa sản phẩm!"});
    }
}
//phân trang sản phẩm
const paginationProduct = async (req,res,next)=>{
    try {
        let perPage = 10; // số lượng sản phẩm hiển thị ra client

        let page = parseInt(req.params.page) || 1;

        const products = await productModel
            .find() // lấy ra tất cả dữ liệu
            .skip((perPage * page) - perPage)
            .limit(perPage);
        const count = await productModel.countDocuments();

        res.json({
            products,
            currentPage: page,
            totalPages: Math.ceil(count/perPage),
            totalItems: count
        });
        
    } catch (error) {
        next(error)
    }
}
//Lấy những sản phẩm cùng một danh mục
// const getProductIdCat = async (req,res) =>{
//     try {
//         const category = req.query.category;
//         let products ;
//         if(category && category !== 'All'){
//             products = await productModel.find({category});
//         }
//         else{
//             products = await productModel.find();
//         }
//         res.json({success:true, data:products});
//     } catch (error) {
//         console.log(error);
//         res.json({success:false,message:'Error'});
//     }
// }

export {addProduct,getListProduct,getProductCat,updateProduct,deleteProduct,paginationProduct};