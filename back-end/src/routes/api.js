const express = require("express");
const AuthController = require("../controllers/user/AuthController");
const AuthVerify = require("../middlewares/AuthVerifyMiddleware");

const router = express.Router();

//Auth Routes
router.post("/register", AuthController.Register);
router.post("/login", AuthController.Login);

// Protected test route (optional)
router.get("/profile", AuthVerify, (req, res) => {
  res.status(200).json({ status: "success", data: req.user });
});





module.exports = router;
