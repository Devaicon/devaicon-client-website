"use client";

import { useState, type ReactNode } from "react";
import { EditorContent, useEditor, useEditorState, type Editor } from "@tiptap/react";
import {
  Bold,
  Code,
  Image as ImageIcon,
  Italic,
  Link2,
  List,
  ListOrdered,
  Megaphone,
  Minus,
  PanelTop,
  Quote,
  Redo2,
  SquareCode,
  Strikethrough,
  Table as TableIcon,
  Underline,
  Undo2,
} from "lucide-react";
import type { Cta, DocNode } from "@/lib/blog/types";
import { CtaLibraryContext, editorExtensions } from "./extensions";
import { ImageDialog, uploadImage } from "./ImagePicker";

function ToolButton({
  label,
  active = false,
  disabled = false,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      // Keep the selection in the document while clicking the toolbar.
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`inline-flex h-8 min-w-8 items-center justify-center rounded px-1.5 text-sm transition-colors disabled:opacity-30 ${
        active
          ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
          : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
      }`}
    >
      {children}
    </button>
  );
}

const Divider = () => <span className="mx-1 h-5 w-px bg-neutral-200 dark:bg-neutral-700" aria-hidden />;

function safeLink(input: string): string | null {
  const v = input.trim();
  if (!v) return null;
  if (v.startsWith("/") || v.startsWith("#")) return v;
  if (/^(mailto|tel):/i.test(v)) return v;
  const withScheme = /^https?:\/\//i.test(v) ? v : `https://${v}`;
  try {
    const u = new URL(withScheme);
    return u.protocol === "https:" || u.protocol === "http:" ? withScheme : null;
  } catch {
    return null;
  }
}

function Toolbar({ editor, ctas }: { editor: Editor; ctas: Cta[] }) {
  const [imageOpen, setImageOpen] = useState(false);
  const [ctaOpen, setCtaOpen] = useState(false);
  const s = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      block: e.isActive("heading", { level: 2 })
        ? "h2"
        : e.isActive("heading", { level: 3 })
          ? "h3"
          : e.isActive("heading", { level: 4 })
            ? "h4"
            : "p",
      bold: e.isActive("bold"),
      italic: e.isActive("italic"),
      underline: e.isActive("underline"),
      strike: e.isActive("strike"),
      code: e.isActive("code"),
      link: e.isActive("link"),
      bullet: e.isActive("bulletList"),
      ordered: e.isActive("orderedList"),
      quote: e.isActive("blockquote"),
      callout: e.isActive("callout"),
      codeBlock: e.isActive("codeBlock"),
      table: e.isActive("table"),
      canUndo: e.can().undo(),
      canRedo: e.can().redo(),
    }),
  });

  const chain = () => editor.chain().focus();

  function setBlock(value: string) {
    if (value === "p") chain().setParagraph().run();
    else chain().setHeading({ level: Number(value.slice(1)) as 2 | 3 | 4 }).run();
  }

  function toggleLink() {
    if (s.link) {
      chain().extendMarkRange("link").unsetLink().run();
      return;
    }
    const input = prompt("Link to (https://…, /a-page-on-this-site, or mailto:)");
    if (input === null) return;
    const href = safeLink(input);
    if (!href) {
      alert("That isn't a link that can be used.");
      return;
    }
    if (editor.state.selection.empty) {
      chain().insertContent({ type: "text", text: input.trim(), marks: [{ type: "link", attrs: { href } }] }).run();
    } else {
      chain().extendMarkRange("link").setLink({ href }).run();
    }
  }

  return (
    <div className="sticky top-0 z-10 flex flex-wrap items-center gap-0.5 border-b border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-neutral-900/95 px-2 py-1.5 backdrop-blur">
      <label htmlFor="block-type" className="sr-only">
        Text style
      </label>
      <select
        id="block-type"
        value={s.block}
        onChange={(e) => setBlock(e.target.value)}
        className="h-8 rounded border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-1.5 text-sm"
      >
        <option value="p">Paragraph</option>
        <option value="h2">Heading 2</option>
        <option value="h3">Heading 3</option>
        <option value="h4">Heading 4</option>
      </select>
      <Divider />
      <ToolButton label="Bold" active={s.bold} onClick={() => chain().toggleBold().run()}>
        <Bold className="h-4 w-4" />
      </ToolButton>
      <ToolButton label="Italic" active={s.italic} onClick={() => chain().toggleItalic().run()}>
        <Italic className="h-4 w-4" />
      </ToolButton>
      <ToolButton label="Underline" active={s.underline} onClick={() => chain().toggleUnderline().run()}>
        <Underline className="h-4 w-4" />
      </ToolButton>
      <ToolButton label="Strikethrough" active={s.strike} onClick={() => chain().toggleStrike().run()}>
        <Strikethrough className="h-4 w-4" />
      </ToolButton>
      <ToolButton label="Inline code" active={s.code} onClick={() => chain().toggleCode().run()}>
        <Code className="h-4 w-4" />
      </ToolButton>
      <ToolButton label={s.link ? "Remove link" : "Add link"} active={s.link} onClick={toggleLink}>
        <Link2 className="h-4 w-4" />
      </ToolButton>
      <Divider />
      <ToolButton label="Bulleted list" active={s.bullet} onClick={() => chain().toggleBulletList().run()}>
        <List className="h-4 w-4" />
      </ToolButton>
      <ToolButton label="Numbered list" active={s.ordered} onClick={() => chain().toggleOrderedList().run()}>
        <ListOrdered className="h-4 w-4" />
      </ToolButton>
      <ToolButton label="Quote" active={s.quote} onClick={() => chain().toggleBlockquote().run()}>
        <Quote className="h-4 w-4" />
      </ToolButton>
      <ToolButton label="Callout box" active={s.callout} onClick={() => chain().toggleCallout().run()}>
        <PanelTop className="h-4 w-4" />
      </ToolButton>
      <ToolButton label="Code block" active={s.codeBlock} onClick={() => chain().toggleCodeBlock().run()}>
        <SquareCode className="h-4 w-4" />
      </ToolButton>
      <ToolButton label="Divider line" onClick={() => chain().setHorizontalRule().run()}>
        <Minus className="h-4 w-4" />
      </ToolButton>
      <Divider />
      <ToolButton label="Image" onClick={() => setImageOpen(true)}>
        <ImageIcon className="h-4 w-4" />
      </ToolButton>
      <ToolButton
        label="Table"
        active={s.table}
        onClick={() => chain().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
        disabled={s.table}
      >
        <TableIcon className="h-4 w-4" />
      </ToolButton>
      <span className="relative">
        <ToolButton label="Call to action" active={ctaOpen} onClick={() => setCtaOpen((v) => !v)}>
          <Megaphone className="h-4 w-4" />
        </ToolButton>
        {ctaOpen && (
          <div className="absolute left-0 top-full z-20 mt-1 w-72 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-1 shadow-lg">
            {ctas.length === 0 ? (
              <p className="p-3 text-xs text-neutral-500">
                No CTAs yet. Add them in the Blog library.
              </p>
            ) : (
              ctas.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    chain().insertCta(c.id).run();
                    setCtaOpen(false);
                  }}
                  className="block w-full rounded-md px-3 py-2 text-left text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  <span className="block font-medium">{c.name}</span>
                  <span className="block truncate text-xs text-neutral-500">{c.heading}</span>
                </button>
              ))
            )}
          </div>
        )}
      </span>
      <Divider />
      <ToolButton label="Undo" disabled={!s.canUndo} onClick={() => chain().undo().run()}>
        <Undo2 className="h-4 w-4" />
      </ToolButton>
      <ToolButton label="Redo" disabled={!s.canRedo} onClick={() => chain().redo().run()}>
        <Redo2 className="h-4 w-4" />
      </ToolButton>

      {s.table && (
        <div className="flex w-full flex-wrap items-center gap-1 border-t border-neutral-100 dark:border-neutral-800 pt-1.5 mt-1 text-xs">
          <span className="px-1 text-neutral-500">Table:</span>
          {[
            ["Row above", () => chain().addRowBefore().run()],
            ["Row below", () => chain().addRowAfter().run()],
            ["Column left", () => chain().addColumnBefore().run()],
            ["Column right", () => chain().addColumnAfter().run()],
            ["Delete row", () => chain().deleteRow().run()],
            ["Delete column", () => chain().deleteColumn().run()],
            ["Header row", () => chain().toggleHeaderRow().run()],
            ["Delete table", () => chain().deleteTable().run()],
          ].map(([label, run]) => (
            <button
              key={label as string}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={run as () => void}
              className={`rounded px-2 py-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 ${
                label === "Delete table" ? "text-red-600" : "text-neutral-700 dark:text-neutral-300"
              }`}
            >
              {label as string}
            </button>
          ))}
        </div>
      )}

      {imageOpen && (
        <ImageDialog
          onClose={() => setImageOpen(false)}
          onInsert={({ src, alt, title }) => {
            chain().setImage({ src, alt, title: title || undefined }).run();
            setImageOpen(false);
          }}
        />
      )}
    </div>
  );
}

/**
 * The post body. Holds its own document while typing and reports every change
 * as JSON; the page decides when to save. Keyed by post id, so opening a
 * different post starts a fresh editor instead of merging documents.
 */
export default function RichEditor({
  content,
  onChange,
  ctas,
  editable = true,
}: {
  content: DocNode;
  onChange: (doc: DocNode) => void;
  ctas: Cta[];
  editable?: boolean;
}) {
  // The document is only an input on mount; after that the editor owns it.
  // An empty document ({content: []}) isn't valid for the editor, which then
  // repairs it and leaves everything selected, so the first keystroke would
  // replace whatever block style was just chosen. Start from one paragraph.
  const [initialContent] = useState<DocNode>(() =>
    content?.content?.length ? content : { type: "doc", content: [{ type: "paragraph" }] },
  );
  const editor = useEditor({
    extensions: editorExtensions,
    content: initialContent,
    editable,
    // The dashboard renders on the client only; skip the SSR pass.
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "post-editor min-h-[28rem] px-6 py-5 focus:outline-none",
        "aria-label": "Post body",
      },
      // Pasting an image file uploads it and inserts the result.
      handlePaste: (view, event) => {
        const file = [...(event.clipboardData?.files ?? [])].find((f) => f.type.startsWith("image/"));
        if (!file) return false;
        event.preventDefault();
        uploadImage(file)
          .then((src) => {
            const alt = prompt("Describe this image (alt text):") ?? "";
            view.dispatch(
              view.state.tr.replaceSelectionWith(
                view.state.schema.nodes.image.create({ src, alt: alt.trim() }),
              ),
            );
          })
          .catch((e) =>
            alert(`${e instanceof Error ? e.message : "Upload failed."} Use the Image button to paste a link instead.`),
          );
        return true;
      },
    },
    // Belt and braces for any other document that loads fully selected.
    onCreate: ({ editor: e }) => {
      if (e.state.selection.toJSON().type === "all") e.commands.setTextSelection(1);
    },
    onUpdate: ({ editor: e }) => onChange(e.getJSON() as DocNode),
  });

  const ctaMap = Object.fromEntries(ctas.map((c) => [c.id, c]));

  return (
    <CtaLibraryContext.Provider value={ctaMap}>
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        {editor && editable && <Toolbar editor={editor} ctas={ctas} />}
        <EditorContent editor={editor} />
      </div>
    </CtaLibraryContext.Provider>
  );
}
