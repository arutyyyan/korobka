import MDEditor from "@uiw/react-md-editor";
import rehypeSanitize from "rehype-sanitize";

import { cn } from "@/lib/utils";

import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

type MarkdownEditorProps = {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  height?: number;
  className?: string;
};

export const MarkdownEditor = ({
  value = "",
  onChange,
  placeholder,
  height = 320,
  className,
}: MarkdownEditorProps) => {
  return (
    <div data-color-mode="light" className={cn("rounded-lg border bg-background", className)}>
      <MDEditor
        value={value}
        onChange={(val) => onChange?.(val ?? "")}
        height={height}
        preview="edit"
        textareaProps={{ placeholder }}
        previewOptions={{
          rehypePlugins: [[rehypeSanitize]],
        }}
      />
    </div>
  );
};

type MarkdownPreviewProps = {
  value?: string | null;
  className?: string;
};

export const MarkdownPreview = ({ value = "", className }: MarkdownPreviewProps) => {
  return (
    <div data-color-mode="light" className={cn("rounded-lg border bg-muted/30", className)}>
      <MDEditor.Markdown source={value || ""} rehypePlugins={[[rehypeSanitize]]} />
    </div>
  );
};




