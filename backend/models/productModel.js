import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name:{type:String,required:true},
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'category'
    },
    image:{type:String,required:true},
    price:{type:Number,required:true},
    description:{type:String,required:true},
    dateCreate:{type:Date,default:Date.now}

});

const productModel = mongoose.models.product || mongoose.model("product",productSchema);

export default productModel;
