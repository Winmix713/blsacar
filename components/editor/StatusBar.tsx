import React from "react";
import type { CursorPosition } from "./CodeEditor";

const LANGUAGE_LABELS: Record<string, string> = {
  html: "HTML",
  css: "CSS",
  javascript: "JavaScript",
};

const INDENT_SIZES: Record<string, number> = {
  html: 2,
  css: 2,
  javascript: 2,
};

interface StatusBarProps {
  language?: string;
  cursor?: CursorPosition;
}

export const StatusBar: React.FC<StatusBarProps> = ({ language = "html", cursor }) => {
  const languageLabel = LANGUAGE_LABELS[language] ?? language.toUpperCase();
  const indentSize = INDENT_SIZES[language] ?? 2;
  const line = cursor?.line ?? 1;
  const column = cursor?.column ?? 1;

  return (
    <div className="h-6 bg-[#18181b] border-t border-white/5 px-3 flex items-center justify-between text-[10px] text-muted-foreground uppercase tracking-widest font-medium z-50">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
          Prettier Ready
        </div>
        <div>UTF-8</div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span>{languageLabel}</span>
          <span>Ln {line}, Col {column}</span>
        </div>
        <div>Spaces: {indentSize}</div>
      </div>
    </div>
  );
};
