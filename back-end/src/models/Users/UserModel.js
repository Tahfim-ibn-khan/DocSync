const mongoose=require('mongoose');

const DataSchema=mongoose.Schema({
    fullName: { type: String, required: true },
    avatar: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' }
  }, { timestamps: true, versionKey:false });

  const UserModel=mongoose.model('users',DataSchema);
  module.exports=UserModel;