import Stripe from 'stripe';
import dotenv from 'dotenv';
import orderModel from '../models/orderModel.js';
import userModel from '../models/userModel.js';
import { paginationOrder } from '../services/orderSevices.js';
import fs from 'fs';
import path from 'path';

// cấu hình biến môi trường từ file .env
dotenv.config();

//kết nối với key của stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//Xây dựng đặt hàng cho người dùng phía frontend
const placeOrder = async (req,res) => {
    const frontend_url = "http://localhost:5173";

    try {
        //Tạo đơn hàng mới
        const newOrder = new orderModel({
            userId:req.body.userId,
            items:req.body.items,
            amount:req.body.amount,
            address:req.body.address
        })

        await newOrder.save();//Lưu vào CSDL

        await userModel.findByIdAndUpdate(req.body.userId,{cartData:{}});//cập nhập giỏ hàng của người dùng

        //Xây dựng thông tin về mặt hàng (line_itmes) cho phiên thanh toán

        //price_data: là đối tượng con chứa thông tin về giá
        const line_items = req.body.items.map((item)=>({
            price_data:{
                currency:"vnd", //sử dụng thành tiền tệ việt name
                product_data:{
                    name:item.name
                },
                unit_amount:item.price // Sử dụng giá trị VND trực tiếp
            },
            quantity:item.quantity
        }))

        line_items.push({
            price_data:{
                currency:"vnd",
                product_data:{
                    name:"Phí vận chuyển"
                },
                unit_amount:15000 //Đặt phí vận chyển
            },
            quantity:1
        })
        //Yêu cầu tạo phiên thanh toán tới Stripe và chờ cho tới khi hoàn thành
        const session = await stripe.checkout.sessions.create({
            line_items:line_items,//tham số đầu vào chứa thông tin các mặt hàng để thanh toán
            mode:'payment',
            success_url:`${frontend_url}/verify?success=true&orderId=${newOrder._id}`,//Chuyển hướng sau khi thanh toán thành công trở về trang hóa đơn ng dùng
            cancel_url:`${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
        })
        //Chuyển hướng ng dùng đến trang thanh toán của Stripe
        res.json({success:true,session_url:session.url})
    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error"});
        
    }
}

//Xác thực thanh toán thành công
const verifyOrder = async (req,res) => {
    const {orderId, success} = req.body;
    try {
        if(success==='true'){
            await orderModel.findByIdAndUpdate(orderId,{payment:true});
            res.json({success:true,message:"Thanh toán thành công!"});
        }
        else{
            await orderId.findByIdAndDelete(orderId);
            res.json({success:false, message:"Lỗi thanh toán!"});
        }
    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error"});
    }
}
//Hiển thị đơn hàng phía người dùng
const userOrders = async (req,res) => {
    try {
        const orders = await orderModel.find({userId:req.body.userId});
        res.json({success:true,data:orders});
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"});
    }
}
//Hiển thị danh sách đơn hàng phía admin
const listOrders = async (req,res) => {
    try {
        if (req.query.page && req.query.limit){
            let page = parseInt(req.query.page);
            let limit = parseInt(req.query.limit);

            const orderData = await paginationOrder(page, limit);
            res.json({success: true, data: orderData});
        }
        else {
            const orders = await orderModel.find({});
            res.json({success:true,data:orders});
        }
        
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"});
    }
}
//Cập nhập trạng thái đơn hàng
const updateStatus = async (req,res)=>{
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status});
        res.json({success:true,message:"Cập nhập trạng thái thành công"});
    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error"});
    }
}
//xem chi tiết đơn hàng
const getOrderId = async (req,res) => {
    try {
        const orderId = await orderModel.findById(req.params.id);
        if(!orderId){
            return res.json({success:false, message:"Không tim thấy đơn hàng"});
        } 
        res.json({success:true, data:orderId});
    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error"});
    }
}
//Xem chi tiết đơn hàng dựa theo mã id người dùng
const getOrderDetailByUserId = async (req, res) => {
    try {
        const orders = await orderModel.find({userId:req.params.userId});
        res.json({success:true, data:orders});
    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error"});
    }
}

//Export PDF
// const generatePdf = async (req, res, next) => {
//     const html = fs.readFileSync(path.join(__dirname, '../'))
// }



export {placeOrder,verifyOrder,userOrders,listOrders,updateStatus, getOrderId, getOrderDetailByUserId}