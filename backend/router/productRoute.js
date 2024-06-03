import express from 'express';
import multer from 'multer';
import { addProduct, deleteProduct, getByIdProduct, getListProduct, getProductByCategory, getProductCat, getTopSellingProductsAPI, listProduct, updateProduct } from '../controllers/productController.js';

const productRouter = express.Router();

//Xử lý thêm ảnh
const storage = multer.diskStorage({
    destination:"upload",
    filename:(req,file,cb)=>{
        return cb(null,`${Date.now()}${file.originalname}`);
    }
});

const upload = multer({storage:storage});
productRouter.post("/add",upload.single('image'),addProduct);
productRouter.get("/listProduct",getListProduct);
productRouter.get("/listProductCat/:id",getProductCat);
productRouter.put("/updateProduct/:id",updateProduct);
productRouter.post("/deleteProduct",deleteProduct);
productRouter.get("/product-by-category",getProductByCategory);
productRouter.get("/listproductsearch",listProduct);
productRouter.get("/top-selling-products",getTopSellingProductsAPI);
productRouter.get("/getbyproductId/:id",getByIdProduct);




export default productRouter;