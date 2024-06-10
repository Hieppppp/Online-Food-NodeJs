import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import validator from 'validator';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import userModel from '../models/userModel.js';

dotenv.config();
// Get user
const getUser = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: "Not Authorized" });
        }

        const userId = req.user.id;
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User Not Found" });
        }

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
// Login user
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
        sendverifyMail(req.body.name,req.body.email,user._id);
        const token = createToken(user._id);// tạo token cho người dùng
        res.json({success:true,message:"Đăng ký tài khoản thành công!",token});
    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error"});
    }
}
// ReSet Password 
const resetPassword = async(req,res) => {
    const { email } = req.body;
    try {
        const user = await userModel.findOne({email});
        if(!user){
            return res.status(404).json({success: false, message:"User Not Found"});
        }
        const resetToken = generateResetToken();
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000;
        await user.save();
        await sendResetPasswordToken(user.email, resetToken);
        res.json({success: true, message:"Reset password email successfully"});
    } catch (error) {
        console.error(error);
        res.status(500).json({success: true, message:"Internal server error"});
        
    }
}
// Update Password
const updatePassword = async (req,res) => {
    const { token, newPassword } = req.body;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRECT);
        const user = await userModel.findOne({
            _id: decoded.id,
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now()}
        });
        if(!user){
            return res.status(400).json({ success: false, message:"Password reset token is invalid or has expired"});

        }
        if(newPassword.length < 8) {
            return res.status(400).json({ success: false, message:"Password must be at less 8 charater"});
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({success: true, message:"Password update successfully"});
    } catch (error) {
        console.error(error);
        res.status(500).json({success:false,message:"Interal server error"});
    }
}
// for send email
const sendverifyMail = async (name,email,user_id) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD,
            },
        });
        const mailOptions = {
            from: process.env.MAIL_FROM_ADDRESS,
            to: email,
            subject: 'Xác Thực Email',
            html: '<p> Xin Chào '+name+', please click here to <a href = "http://localhost:5173/verify?id='+user_id+'">Verify</a> your mail. </p>'

        }
        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                console.log(error);
            }
            else{
                console.log("Email has been sent", info.response);
            }
        })
    } catch (error) {
        console.log(error);
    }
}
// for send email reset password
const sendResetPasswordToken = async (email, resetToken) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: 587,
            secure: false,
            requireTLS: true,
            auth:{
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD,
            },
        });
        const mailOptions = {
            from: process.env.MAIL_FROM_ADDRESS,
            to: email,
            subject: 'Password Reset Request',
            html: `
                <p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
                <p>Please click on the following link, or paste this into your browser to complete the process:</p>
                <p><a href="http://localhost:5173/myprofile/${resetToken}">Reset Password Link</a></p>
                <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
            ` 
        };

        await transporter.sendMail(mailOptions);

    } catch (error) {
        console.error(error);
    }
}


export {loginUser,resgisterUser,resetPassword,updatePassword,getUser}