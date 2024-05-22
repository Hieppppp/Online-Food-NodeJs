import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import validator from 'validator';
import userModel from '../models/userModel.js';

const loginUser = async (req,res) => {
    const {email,password} = req.body;
    try {
        const user = await userModel.findOne({email});
        if(!user){
            return res.json({success:false,message:"Tài khoản người dùng không tồn tại"});
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.json({success:false,message:"Invalid credentials"});
        }
        const token = createToken (user._id);
        res.json({success:true,message:"Đăng nhập thành công",token})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"});
    }
}

//Hàm tạo token
const createToken = (id) =>{
    return jwt.sign({id},process.env.JWT_SECRECT);//Có thể đặt thời gian hết hạn token để sinh ra token mới{expriresIn:'7d'}
}

//Đăng ký tài khoản người dùng
const resgisterUser = async (req,res) => {
    const { name, password, email} = req.body;

    try {
        //Kiểm tra xem người dùng đã tồn tại hay chưa
        const exists = await userModel.findOne({email});
        if(exists){
            return res.json({success:false,message:"Email đã tồn tại"});
        }

        //Kiểm tra định dạng email và mật khẩu
        if(!validator.isEmail(email)){
            return res.json({success:false, message:"Vui lòng nhập Email hợp lệ"});
        }

        //Độ dài mặt khẩu tối da
        if(password.length < 8){
            return res.json({success:false, message:"Vui lòng nhập tối đa 8 ký tự"});
        }
        // Mã hóa mật khẩu người dùng
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //Tạo người dùng mới
        const newUser = new userModel({
            name:name,
            email:email,
            password:hashedPassword
        });

        const user = await newUser.save();
        const token = createToken(user._id);// tạo token cho người dùng
        res.json({success:true,message:"Đăng ký tài khoản thành công!",token});
    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error"});
    }
}

export {loginUser,resgisterUser}