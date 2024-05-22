import mongoose from "mongoose";


//Kết nối với CSDL mongoDB
export const connectDB = async() =>{
    await mongoose.connect(process.env.CONNECTION_STRING).then(()=>console.log("Connect DB successful!"));
};