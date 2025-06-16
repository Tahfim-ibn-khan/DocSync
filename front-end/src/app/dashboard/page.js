"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import useRequireAuth from "@/hooks/useRequireAuth";

export default function DashboardPage() {
  useRequireAuth();
  const router = useRouter();
  const [tab, setTab] = useState("mine");
  const [myDocs, setMyDocs] = useState([]);
  const [sharedDocs, setSharedDocs] = useState([]);
  const [shareDocId, setShareDocId] = useState(null);
  const [shareEmail, setShareEmail] = useState("");
  const [accessLevel, setAccessLevel] = useState("viewer");

  const fetchDocs = async () => {
    try {
      const mine = await api("/docs");
      setMyDocs(mine.data);

      const shared = await api("/docs/shared");
      setSharedDocs(shared.data);
    } catch (err) {
      console.error("Failed to load documents:", err.message);
    }
  };

  const handleCreate = async () => {
    try {
      const res = await api("/docs", {
        method: "POST",
        body: JSON.stringify({ title: "Untitled Document" }),
      });
      router.push(`/editor/${res.data._id}`);
    } catch (err) {
      console.error("Failed to create document:", err.message);
    }
  };

  const handleShare = async () => {
  try {
    await api(`/docs/${shareDocId}/share`, {
      method: "POST",
      body: JSON.stringify({ email: shareEmail, access: accessLevel }),
    });
    alert("Document shared!");
    setShareDocId(null);
    setShareEmail("");
    setAccessLevel("viewer");
    fetchDocs();
  } catch (err) {
    console.error("Failed to share document:", err.message);
    alert(err.message.includes("yourself") ? "Cannot share with yourself." : "Error sharing document");
  }
};


  useEffect(() => {
    fetchDocs();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + New Document
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setTab("mine")}
          className={`px-4 py-2 rounded ${tab === "mine" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          My Docs
        </button>
        <button
          onClick={() => setTab("shared")}
          className={`px-4 py-2 rounded ${tab === "shared" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          Shared With Me
        </button>
      </div>

      <ul className="space-y-4">
        {(tab === "mine" ? myDocs : sharedDocs).map((doc) => (
          <li
            key={doc._id}
            className="p-4 border rounded shadow hover:bg-gray-50"
          >
            <div className="flex justify-between items-center">
              <h3
                className="font-semibold text-lg cursor-pointer"
                onClick={() => router.push(`/editor/${doc._id}`)}
              >
                {doc.title}
              </h3>
              {tab === "shared" && (
              <p className="text-sm text-gray-600 mt-1">
                Shared by: <span className="font-medium">{doc.ownerName || "Unknown"}</span>
              </p>
            )}
              {tab === "mine" && (
                <button
                  onClick={() => setShareDocId(doc._id)}
                  className="text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                >
                  Share
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>

      {shareDocId && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-3">Share Document</h2>
            <input
              type="email"
              value={shareEmail}
              onChange={(e) => setShareEmail(e.target.value)}
              placeholder="Recipient's email"
              className="w-full border p-2 mb-3 rounded"
            />
            <select
              value={accessLevel}
              onChange={(e) => setAccessLevel(e.target.value)}
              className="w-full border p-2 mb-4 rounded"
            >
              <option value="viewer">Viewer</option>
              <option value="editor">Editor</option>
            </select>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShareDocId(null)}
                className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleShare}
                className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Share
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
