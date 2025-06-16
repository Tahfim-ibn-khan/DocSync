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
  const result = await LoginService(req);

  if (result.status === "fail") {
    return res.status(401).json(result);
  }

  return res.status(200).json(result);
};