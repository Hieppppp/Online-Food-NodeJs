import express from 'express';
import multer from 'multer';
import { addProduct, deleteProduct, getListProduct, getProductCat, paginationProduct, updateProduct } from '../controllers/productController.js';

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
productRouter.get("/pagination/:page",paginationProduct);


export default productRouter;