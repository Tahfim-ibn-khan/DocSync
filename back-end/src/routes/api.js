const express = require("express");
const AuthController = require("../controllers/user/AuthController");
const AuthVerify = require("../middlewares/AuthVerifyMiddleware");
const DocController = require("../controllers/doc/DocumentController");


const router = express.Router();

//Auth Routes
router.post("/register", AuthController.Register);
router.post("/login", AuthController.Login);

// Protected test route (optional)
router.get("/profile", AuthVerify, (req, res) => {
  res.status(200).json({ status: "success", data: req.user });
});


// Document Routes
router.post("/docs", AuthVerify, DocController.CreateDoc);
router.get("/docs", AuthVerify, DocController.GetMyDocs);
router.get("/docs/shared", AuthVerify, DocController.GetSharedDocs);
router.put("/docs/:id", AuthVerify, DocController.UpdateDoc);
router.delete("/docs/:id", AuthVerify, DocController.DeleteDoc);
router.post("/docs/:id/share", AuthVerify, DocController.ShareDoc);


module.exports = router;
