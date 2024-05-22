import express from 'express';
import multer from 'multer';
import { addCategory, deleteCategory, getCategory, paginationCategory } from '../controllers/categoryController.js';

//Khởi tạo Router
const categoryRouter = express.Router();

//Xử lý thêm ảnh
const storage = multer.diskStorage({
    destination:"upload",
    filename:(req,file,cb)=>{
        return cb(null,`${Date.now()}${file.originalname}`);
    }
});

const upload = multer({storage:storage});
categoryRouter.post("/add",upload.single('image'),addCategory);
categoryRouter.get("/getCategory",getCategory);
categoryRouter.get("/send/:page",paginationCategory);
categoryRouter.post("/deleteCategory",deleteCategory);

export default categoryRouter;