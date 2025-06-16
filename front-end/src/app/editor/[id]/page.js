"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import dynamic from "next/dynamic";
import { io } from "socket.io-client";
import useRequireAuth from "@/hooks/useRequireAuth";

const Editor = dynamic(() => import("@/components/Editor"), { ssr: false });
const socket = io(process.env.NEXT_PUBLIC_BASE_URL, { autoConnect: false });

export default function EditorPage() {
  useRequireAuth();
  const { id } = useParams();
  const router = useRouter();
  const [docTitle, setDocTitle] = useState("");
  const [editor, setEditor] = useState(null);
  const [user, setUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const initialContent = useRef("");
  const hasInitialized = useRef(false);

  const fetchDoc = useCallback(async () => {
    try {
      const res = await api(`/docs/${id}`);
      setDocTitle(res.data.title);
      initialContent.current = res.data.content;
    } catch (err) {
      console.error("Error fetching doc:", err.message);
    }
  }, [id]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    setUser(parsedUser);

    if (parsedUser) {
      socket.connect();
      socket.emit("join-doc", id, { id: parsedUser.id, name: parsedUser.fullName });

      socket.on("receive-changes", (delta) => {
        if (editor && !editor.isDestroyed && delta !== editor.getHTML()) {
          editor.commands.setContent(delta, false);
        }
      });

      socket.on("user-joined", (newUser) => {
        setOnlineUsers((prev) => {
          const exists = prev.find((u) => u.id === newUser.id);
          return exists ? prev : [...prev, newUser];
        });
      });

      socket.on("user-left", (leftUserId) => {
        setOnlineUsers((prev) => prev.filter((u) => u.id !== leftUserId));
      });
    }

    return () => {
      socket.disconnect();
    };
  }, [id, editor]);

  useEffect(() => {
    if (editor && !hasInitialized.current) {
      hasInitialized.current = true;
      fetchDoc().then(() => {
        if (!editor.isDestroyed) {
          editor.commands.setContent(initialContent.current);
        }
      });
    }
  }, [editor, fetchDoc]);

  
  const handleSave = async () => {
    try {
      const contentHTML = editor?.getHTML();
      const res = await api(`/docs/${id}`, {
        method: "PUT",
        body: JSON.stringify({ content: contentHTML, title: docTitle }),
      });
      if (res.status === "success") {
        router.push("/dashboard");
      } else {
        alert("Save failed: " + res.message);
      }
    } catch (err) {
      alert("Failed to save document: " + err.message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <input
        value={docTitle}
        onChange={(e) => setDocTitle(e.target.value)}
        placeholder="Document Title"
        className="text-xl font-semibold mb-4 w-full border-b border-gray-300 focus:outline-none focus:border-blue-500"
      />

      <div className="flex items-center gap-2 mb-2 text-sm text-gray-600">
        <span>Online:</span>
        {onlineUsers.map((u) => (
          <span key={u.id} className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
            {u.name}
          </span>
        ))}
      </div>

      <Editor
        content=""
        onEditorReady={setEditor}
        onContentChange={(content) => {
          if (editor && !editor.isDestroyed) {
            socket.emit("send-changes", { docId: id, delta: content });
          }
        }}
      />

      <button
        onClick={handleSave}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Save
      </button>
    </div>
  );
}
