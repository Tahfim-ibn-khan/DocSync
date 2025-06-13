const mongoose=require('mongoose');

const DataSchema=mongoose.Schema({
    fullName: { type: String, required: true },
    avatar: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
  }, { timestamps: true, versionKey:false });

  const UserModel=mongoose.model('users',DataSchema);
  module.exports=UserModel;