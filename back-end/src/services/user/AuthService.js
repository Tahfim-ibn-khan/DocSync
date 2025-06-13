const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../../models/Users/UserModel");

exports.RegisterService = async (req) => {
  const { fullName, avatar, email, password } = req.body;

  // Check if email already exists
  const existingUser = await UserModel.findOne({ email });
  if (existingUser) throw new Error("Email already registered");

  // Hash password
  const hashed = await bcrypt.hash(password, 10);

  // Save user
  const user = await UserModel.create({
    fullName,
    avatar,
    email,
    password: hashed
  });

  return { status: "success", data: user };
};

exports.LoginService = async (req) => {
  const { email, password } = req.body;

  // Find user
  const user = await UserModel.findOne({ email });
  if (!user) throw new Error("User not found");

  // Check password
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("Invalid credentials");

  // Create JWT
  const token = jwt.sign(
    { email: user.email, id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return {
    status: "success",
    token,
    data: {
      fullName: user.fullName,
      email: user.email,
      avatar: user.avatar
    }
  };
};
