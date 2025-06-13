const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, default: "" },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  sharedWith: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
      role: { type: String, enum: ["viewer", "editor"], default: "viewer" }
    }
  ]
}, { timestamps: true });

const DocumentModel = mongoose.model("documents", DocumentSchema);

module.exports = DocumentModel;
