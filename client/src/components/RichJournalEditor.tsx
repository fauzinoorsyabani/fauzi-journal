/**
 * Style guide: Fauzi / Journal.
 * The editor keeps authoring tactile and quiet, while familiar formatting controls remain within immediate reach.
 */
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";
import { EditorContent, useEditor } from "@tiptap/react";
import { Bold, Heading2, Heading3, ImagePlus, Italic, Link2, List, ListOrdered, Quote, Undo2, Redo2 } from "lucide-react";
import { useEffect } from "react";
import { JournalFigure } from "./JournalFigure";

const emptyDocument = { type: "doc", content: [{ type: "paragraph" }] };

function parseDocument(value: string) {
  try { return value ? JSON.parse(value) : emptyDocument; } catch { return emptyDocument; }
}

export function RichJournalEditor({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Link.configure({ openOnClick: false, autolink: true, HTMLAttributes: { class: "text-[#b78a58] underline underline-offset-4" } }),
      JournalFigure,
      Placeholder.configure({ placeholder: "Mulai menulis jurnal di sini…" }),
    ],
    content: parseDocument(value),
    editorProps: { attributes: { class: "rich-journal-editor min-h-[22rem] outline-none" } },
    onUpdate: ({ editor: instance }) => onChange(JSON.stringify(instance.getJSON())),
  });

  useEffect(() => {
    if (!editor) return;
    const next = JSON.stringify(parseDocument(value));
    if (JSON.stringify(editor.getJSON()) !== next) editor.commands.setContent(parseDocument(value), { emitUpdate: false });
  }, [editor, value]);

  if (!editor) return <div className="grid min-h-64 place-items-center border border-white/10 text-sm text-[#aaa69f]">Preparing editor…</div>;

  const addLink = () => {
    const url = window.prompt("Paste the link URL");
    if (url) editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };
  const addImage = () => {
    const url = window.prompt("Paste the image URL");
    if (!url) return;
    const alt = window.prompt("Describe the image for readers using assistive technology") ?? "";
    const caption = window.prompt("Write an optional image caption") ?? "";
    editor.chain().focus().insertContent({ type: "journalFigure", attrs: { src: url, alt, caption } }).run();
  };
  const Tool = ({ active, label, onClick, children }: { active?: boolean; label: string; onClick: () => void; children: React.ReactNode }) => <button type="button" aria-label={label} title={label} onClick={onClick} className={`grid h-9 w-9 place-items-center border text-[#f3f0ea] transition-colors hover:border-[#b78a58] hover:text-[#b78a58] ${active ? "border-[#b78a58] bg-[#b78a58]/10 text-[#e3c29f]" : "border-white/10 bg-[#080808]"}`}>{children}</button>;

  return (
    <div className="border border-white/10 bg-[#080808]">
      <div className="flex flex-wrap gap-1 border-b border-white/10 p-2">
        <Tool label="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}><Bold size={15} /></Tool>
        <Tool label="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic size={15} /></Tool>
        <Tool label="Heading level 2" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><Heading2 size={15} /></Tool>
        <Tool label="Heading level 3" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}><Heading3 size={15} /></Tool>
        <Tool label="Quote" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}><Quote size={15} /></Tool>
        <Tool label="Bulleted list" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}><List size={15} /></Tool>
        <Tool label="Numbered list" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered size={15} /></Tool>
        <Tool label="Add link" onClick={addLink}><Link2 size={15} /></Tool>
        <Tool label="Add image with caption" onClick={addImage}><ImagePlus size={15} /></Tool>
        <span className="mx-1 h-9 w-px bg-white/10" />
        <Tool label="Undo" onClick={() => editor.chain().focus().undo().run()}><Undo2 size={15} /></Tool>
        <Tool label="Redo" onClick={() => editor.chain().focus().redo().run()}><Redo2 size={15} /></Tool>
      </div>
      <EditorContent editor={editor} className="px-5 py-5 sm:px-7 sm:py-7" />
    </div>
  );
}
