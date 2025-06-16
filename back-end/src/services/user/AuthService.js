const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../../models/Users/UserModel");

exports.RegisterService = async (req) => {
  const { fullName, avatar, email, password } = req.body;

  if (!fullName || !email || !password) {
    throw new Error("Full name, email, and password are required");
  }

  const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
  if (!emailRegex.test(email)) {
    throw new Error("Invalid email format");
  }

  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters long");
  }

  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    throw new Error("Email already registered");
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await UserModel.create({
    fullName,
    avatar,
    email,
    password: hashed
  });

  const { password: _, ...safeUser } = user.toObject();

  // Create token
  const token = jwt.sign(
    { _id: user._id, email: user.email, fullName: user.fullName },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return {
    status: "success",
    message: "User registered successfully",
    token,
    data: safeUser
  };
};

exports.LoginService = async (req) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });
  if (!user) {
    return {
      status: "fail",
      message: "User not found"
    };
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return {
      status: "fail",
      message: "Invalid credentials"
    };
  }

  const token = jwt.sign(
    { _id: user._id, email: user.email, fullName: user.fullName },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return {
    status: "success",
    token,
    data: {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      avatar: user.avatar
    }
  };
};