import mongoose, { Schema } from 'mongoose';

const categorySchema = new mongoose.Schema({
    name:{type:String,required:true},
    image:{type:String,required:true}
});

const categoryModel = mongoose.models.category || mongoose.model("category",categorySchema);

export default categoryModel;