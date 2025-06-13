const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../../models/Users/UserModel");

exports.RegisterService = async (req) => {
  const { fullName, avatar, email, password } = req.body;

  // Input validation
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

  // Check if email already exists
  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    throw new Error("Email already registered");
  }

  // Hash password
  const hashed = await bcrypt.hash(password, 10);

  // Save user
  const user = await UserModel.create({
    fullName,
    avatar,
    email,
    password: hashed
  });

  const { password: _, ...safeUser } = user.toObject();

  return {
    status: "success",
    message: "User registered successfully",
    data: safeUser
  };
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
