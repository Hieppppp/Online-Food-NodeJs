import express from 'express';
import multer from 'multer';
import { addProduct, deleteMultipleProduct, deleteProduct, getByIdProduct, getListProduct, getProductByCategory, getProductCat, getTopSellingProductsAPI, listProduct, updateProduct } from '../controllers/productController.js';

const productRouter = express.Router();

//Xử lý thêm ảnh
const storage = multer.diskStorage({
    destination:"upload",
    filename:(req,file,cb)=>{
        return cb(null,`${Date.now()}${file.originalname}`);
    }
});

const upload = multer({storage:storage});
// api thêm
productRouter.post("/add",upload.single('image'),addProduct);
// api load danh sách
productRouter.get("/listProduct",getListProduct);
// api load danh sách theo mã id
productRouter.get("/listProductCat/:id",getProductCat);
// api update sản phảm
productRouter.put("/updateProduct/:id",upload.single('image'),updateProduct);
// api xóa sản phẩm
productRouter.post("/deleteProduct",deleteProduct);
// api xóa tất cả sản phẩm
productRouter.delete("/delete-multiple-product",deleteMultipleProduct);
// api get product by category
productRouter.get("/product-by-category",getProductByCategory);
// api search
productRouter.get("/listproductsearch",listProduct);
// api top selling product
productRouter.get("/top-selling-products",getTopSellingProductsAPI);
// api get product by id
productRouter.get("/getbyproductId/:id",getByIdProduct);




export default productRouter;