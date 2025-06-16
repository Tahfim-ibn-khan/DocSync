const {
  CreateDocService,
  GetMyDocsService,
  GetSharedDocsService,
  UpdateDocService,
  DeleteDocService,
  ShareDocService,
  GetDocByIdService
} = require("../../services/doc/DocumentService");

exports.CreateDoc = async (req, res) => {
  try {
    const result = await CreateDocService(req);
    res.status(201).json(result);
  } catch (e) {
    res.status(400).json({ status: "fail", message: e.message });
  }
};

exports.GetMyDocs = async (req, res) => {
  try {
    const result = await GetMyDocsService(req);
    res.status(200).json(result);
  } catch (e) {
    res.status(400).json({ status: "fail", message: e.message });
  }
};

exports.GetSharedDocs = async (req, res) => {
  try {
    const result = await GetSharedDocsService(req);
    res.status(200).json(result);
  } catch (e) {
    res.status(400).json({ status: "fail", message: e.message });
  }
};

exports.UpdateDoc = async (req, res) => {
  try {
    const result = await UpdateDocService(req);
    res.status(200).json(result);
  } catch (e) {
    res.status(403).json({ status: "fail", message: e.message });
  }
};

exports.DeleteDoc = async (req, res) => {
  try {
    const result = await DeleteDocService(req);
    res.status(200).json(result);
  } catch (e) {
    res.status(403).json({ status: "fail", message: e.message });
  }
};

exports.ShareDoc = async (req, res) => {
  try {
    const result = await ShareDocService(req);
    res.status(200).json(result);
  } catch (e) {
    res.status(400).json({ status: "fail", message: e.message });
  }
};

exports.GetDocById = async (req, res) => {
  try {
    const doc = await GetDocByIdService(req.params.id, req.user);
    res.status(200).json({ status: "success", data: doc });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err.message });
  }
};