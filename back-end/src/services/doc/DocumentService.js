const DocumentModel = require("../../models/Docs/DocumentModel");
const UserModel = require("../../models/Users/UserModel");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

exports.CreateDocService = async (req) => {
  const { title, content } = req.body;
  const ownerId = req.user._id || req.user.id;

  const doc = await DocumentModel.create({
    title,
    content,
    owner: ownerId,
    sharedWith: []
  });

  return { status: "success", data: doc };
};

exports.GetMyDocsService = async (req) => {
  const userId = req.user._id || req.user.id;

  const docs = await DocumentModel.find({ owner: userId }).sort({ updatedAt: -1 });
  return { status: "success", data: docs };
};

exports.GetSharedDocsService = async (req) => {
  const userId = req.user._id || req.user.id;

  const docs = await DocumentModel.find({
    sharedWith: { $elemMatch: { user: userId } }
  }).sort({ updatedAt: -1 });

  return { status: "success", data: docs };
};

exports.UpdateDocService = async (req) => {
  const docId = req.params.id;
  const userId = new ObjectId(req.user._id || req.user.id); // ✅ fix here
  const { content, title } = req.body;

  const doc = await DocumentModel.findOne({
    _id: docId,
    $or: [
      { owner: userId },
      { sharedWith: { $elemMatch: { user: userId, role: "editor" } } }
    ]
  });

  if (!doc) throw new Error("Not authorized or document not found");

  if (title) doc.title = title;
  if (content) doc.content = content;
  await doc.save();

  return { status: "success", data: doc };
};

exports.DeleteDocService = async (req) => {
  const docId = req.params.id;
  const userId = req.user._id || req.user.id;

  const result = await DocumentModel.deleteOne({ _id: docId, owner: userId });

  if (result.deletedCount === 0) {
    throw new Error("Document not found or unauthorized");
  }

  return { status: "success", message: "Document deleted" };
};

exports.ShareDocService = async (req) => {
  const { email, role } = req.body;
  const docId = req.params.id;
  const ownerId = req.user._id || req.user.id;

  const targetUser = await UserModel.findOne({ email });
  if (!targetUser) throw new Error("Target user not found");

  const doc = await DocumentModel.findOne({ _id: docId, owner: ownerId });
  if (!doc) throw new Error("Document not found or unauthorized");

  const alreadyShared = doc.sharedWith.find(s => s.user.equals(targetUser._id));
  if (alreadyShared) {
    alreadyShared.role = role;
  } else {
    doc.sharedWith.push({ user: targetUser._id, role });
  }

  await doc.save();

  return { status: "success", message: "Document shared" };
};

exports.GetDocByIdService = async (docId, user) => {
  if (!ObjectId.isValid(docId)) {
    throw new Error("Invalid document ID");
  }

  const userId = new ObjectId(user._id || user.id);

  const doc = await DocumentModel.findOne({
    _id: docId,
    $or: [
      { owner: userId },
      { sharedWith: { $elemMatch: { user: userId } } }
    ]
  });

  if (!doc) {
    console.log("NOT FOUND. User ID:", user._id || user.id);
    throw new Error("Document not found");
  }

  return doc;
};