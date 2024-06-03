import express from 'express';
import multer from 'multer';
import { addCategory, deleteCategory, getByCategory, getCategory, updateCategory} from '../controllers/categoryController.js';

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
categoryRouter.post("/deleteCategory",deleteCategory);
categoryRouter.get("/getbycategory/:id",getByCategory);
categoryRouter.put("/updatecategory/:id",updateCategory);

export default categoryRouter;