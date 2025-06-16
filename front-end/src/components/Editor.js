// src/components/Editor.js
"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import CodeBlock from "@tiptap/extension-code-block";
import { useEffect } from "react";

export default function Editor({ content, onEditorReady, onContentChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        bulletList: false,
        orderedList: false,
        listItem: false,
      }),
      Bold,
      Italic,
      CodeBlock,
    ],
    content,
    onUpdate({ editor }) {
      onContentChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && onEditorReady) {
      onEditorReady(editor);
    }
  }, [editor, onEditorReady]);

  if (!editor) return null;

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-2">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          Bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          Italic
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          Code Block
        </button>
      </div>

      <EditorContent editor={editor} className="min-h-[300px] border border-gray-300 p-4 rounded bg-white text-gray-900" />
    </div>
  );
}
