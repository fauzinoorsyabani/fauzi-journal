/** Render the TipTap document in a read-only editorial layout on the public journal. */
import Link from "@tiptap/extension-link";
import StarterKit from "@tiptap/starter-kit";
import { EditorContent, useEditor } from "@tiptap/react";
import { JournalFigure } from "./JournalFigure";

function parseDocument(value: string) {
  try { return JSON.parse(value); } catch { return { type: "doc", content: [] }; }
}

export function RichJournalContent({ content }: { content: string }) {
  const editor = useEditor({
    extensions: [StarterKit.configure({ heading: { levels: [2, 3] } }), Link.configure({ openOnClick: true, HTMLAttributes: { class: "text-[#b78a58] underline underline-offset-4" } }), JournalFigure],
    content: parseDocument(content),
    editable: false,
    editorProps: { attributes: { class: "rich-journal-reading outline-none" } },
  });
  if (!editor) return null;
  return <EditorContent editor={editor} />;
}
