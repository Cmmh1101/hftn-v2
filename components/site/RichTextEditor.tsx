"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useToast } from "@/components/ui/Toast";
import { Spinner } from "@/components/ui/Spinner";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { cn } from "@/lib/cn";
import { uploadEditorImage } from "@/app/[locale]/admin/(dashboard)/content/actions";

function ToolbarButton({
  active,
  onClick,
  children,
  title,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  title: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={cn(
        "cursor-pointer rounded px-2 py-1 text-[15px] font-bold hover:bg-surface-soft-2",
        active ? "bg-accent-strong text-accent-ink" : "text-ink-soft",
      )}
    >
      {children}
    </button>
  );
}

export function RichTextEditor({
  name,
  defaultValue,
  placeholder = "Write the post…",
  lang,
}: {
  name: string;
  defaultValue?: string;
  placeholder?: string;
  lang?: string;
}) {
  const t = useTranslations("admin.editor");
  const tFeedback = useTranslations("feedback");
  const toast = useToast();
  const [html, setHtml] = useState(defaultValue ?? "");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false, autolink: true, protocols: ["http", "https", "mailto"] }),
      Image,
      Placeholder.configure({ placeholder }),
    ],
    content: defaultValue ?? "",
    editorProps: {
      attributes: {
        class: "article-body min-h-[260px] px-3.5 py-3 focus:outline-none",
        ...(lang ? { lang } : {}),
      },
    },
    onUpdate: ({ editor }) => setHtml(editor.getHTML()),
  });

  async function handleImagePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !editor) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);
    try {
      const result = await uploadEditorImage(formData);
      if ("url" in result) {
        editor.chain().focus().setImage({ src: result.url }).run();
        toast.success(tFeedback("imageUploaded"));
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error(tFeedback("uploadFailed"));
    } finally {
      setUploading(false);
    }
  }

  function setLink() {
    if (!editor) return;
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt(t("linkPrompt"), previous ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().setLink({ href: url }).run();
  }

  if (!editor) return null;

  return (
    <div className="rounded-md border border-border-soft">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-border-soft bg-surface-soft-2 p-1.5">
        <ToolbarButton title={t("heading2")} active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          H2
        </ToolbarButton>
        <ToolbarButton title={t("heading3")} active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          H3
        </ToolbarButton>
        <ToolbarButton title={t("bold")} active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
          B
        </ToolbarButton>
        <ToolbarButton title={t("italic")} active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
          I
        </ToolbarButton>
        <ToolbarButton title={t("quote")} active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          “ ”
        </ToolbarButton>
        <ToolbarButton title={t("bulletList")} active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          {t("bulletShort")}
        </ToolbarButton>
        <ToolbarButton title={t("numberedList")} active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          {t("numberedShort")}
        </ToolbarButton>
        <ToolbarButton title={t("link")} active={editor.isActive("link")} onClick={setLink}>
          {t("link")}
        </ToolbarButton>
        <ToolbarButton title={t("image")} onClick={() => fileInputRef.current?.click()}>
          {uploading ? (
            <span className="inline-flex items-center gap-1.5">
              <Spinner className="h-3.5 w-3.5" />
              {tFeedback("uploading")}
            </span>
          ) : (
            t("image")
          )}
        </ToolbarButton>
        <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp,image/gif" className="hidden" onChange={handleImagePick} />
      </div>
      <EditorContent editor={editor} />
      <input type="hidden" name={name} value={html} />
    </div>
  );
}
