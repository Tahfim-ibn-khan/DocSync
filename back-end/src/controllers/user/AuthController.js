const { RegisterService, LoginService } = require("../../services/user/AuthService");

exports.Register = async (req, res) => {
  try {
    const result = await RegisterService(req);
    res.status(201).json(result);
  } catch (e) {
    res.status(400).json({ status: "fail", message: e.message });
  }
};
exports.Login = async (req, res) => {
  try {
    const result = await LoginService(req);
    res.status(200).json(result);
  } catch (e) {
    res.status(401).json({ status: "fail", message: e.message });
  }
};