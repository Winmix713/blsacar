'use client';

import React, { useCallback } from "react";
import Editor, { type OnChange, type OnMount } from "@monaco-editor/react";
import { ProjectFile } from "@/hooks/use-project-files";

export interface CursorPosition {
  line: number;
  column: number;
}

interface CodeEditorProps {
  file: ProjectFile;
  onChange: (id: string, value: string) => void;
  onCursorChange?: (position: CursorPosition) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ file, onChange, onCursorChange }) => {
  const handleEditorChange: OnChange = (value) => {
    if (value !== undefined) {
      onChange(file.id, value);
    }
  };

  const handleEditorMount: OnMount = useCallback((editor) => {
    if (!onCursorChange) return;

    const position = editor.getPosition();
    if (position) {
      onCursorChange({ line: position.lineNumber, column: position.column });
    }

    editor.onDidChangeCursorPosition((e) => {
      onCursorChange({ line: e.position.lineNumber, column: e.position.column });
    });
  }, [onCursorChange]);

  return (
    <div className="h-full w-full bg-[#1e1e1e]">
      <Editor
        height="100%"
        language={file.language}
        value={file.content}
        onChange={handleEditorChange}
        onMount={handleEditorMount}
        theme="vs-dark"
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          padding: { top: 16 },
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          lineNumbers: "on",
          roundedSelection: false,
          cursorStyle: "line",
          wordWrap: "on",
        }}
        loading={
          <div className="flex items-center justify-center h-full text-muted-foreground animate-pulse">
            Initializing editor...
          </div>
        }
      />
    </div>
  );
};
