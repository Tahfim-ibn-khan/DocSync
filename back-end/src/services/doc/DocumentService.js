const DocumentModel = require("../../models/Docs/DocumentModel");
const UserModel = require("../../models/Users/UserModel");

// Create a new document
exports.CreateDocService = async (req) => {
  const { title, content } = req.body;
  const ownerId = req.user.id;

  const doc = await DocumentModel.create({
    title,
    content,
    owner: ownerId
  });

  return { status: "success", data: doc };
};

// Get all documents owned by user
exports.GetMyDocsService = async (req) => {
  const userId = req.user.id;

  const docs = await DocumentModel.find({ owner: userId }).sort({ updatedAt: -1 });
  return { status: "success", data: docs };
};

// Get shared documents
exports.GetSharedDocsService = async (req) => {
  const userId = req.user.id;

  const docs = await DocumentModel.find({
    sharedWith: { $elemMatch: { user: userId } }
  }).sort({ updatedAt: -1 });

  return { status: "success", data: docs };
};

// Update document content
exports.UpdateDocService = async (req) => {
  const docId = req.params.id;
  const userId = req.user.id;
  const { content } = req.body;

  const doc = await DocumentModel.findOne({
    _id: docId,
    $or: [
      { owner: userId },
      { sharedWith: { $elemMatch: { user: userId, role: "editor" } } }
    ]
  });

  if (!doc) throw new Error("Not authorized or document not found");

  doc.content = content;
  await doc.save();

  return { status: "success", data: doc };
};

// Delete document (only owner)
exports.DeleteDocService = async (req) => {
  const docId = req.params.id;
  const userId = req.user.id;

  const result = await DocumentModel.deleteOne({ _id: docId, owner: userId });

  if (result.deletedCount === 0) {
    throw new Error("Document not found or unauthorized");
  }

  return { status: "success", message: "Document deleted" };
};

// Share document with another user
exports.ShareDocService = async (req) => {
  const { email, role } = req.body;
  const docId = req.params.id;
  const ownerId = req.user.id;

  const targetUser = await UserModel.findOne({ email });
  if (!targetUser) throw new Error("Target user not found");

  const doc = await DocumentModel.findOne({ _id: docId, owner: ownerId });
  if (!doc) throw new Error("Document not found or unauthorized");

  const alreadyShared = doc.sharedWith.find(s => s.user.equals(targetUser._id));
  if (alreadyShared) {
    alreadyShared.role = role; // update role
  } else {
    doc.sharedWith.push({ user: targetUser._id, role });
  }

  await doc.save();

  return { status: "success", message: "Document shared" };
};
