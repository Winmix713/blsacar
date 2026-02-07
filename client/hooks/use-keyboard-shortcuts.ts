'use client';

import { useEffect, useRef } from "react";

interface Shortcuts {
  [key: string]: () => void;
}

export function useKeyboardShortcuts(shortcuts: Shortcuts) {
  const shortcutsRef = useRef(shortcuts);
  shortcutsRef.current = shortcuts;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isMod = event.ctrlKey || event.metaKey;
      const isShift = event.shiftKey;

      let key = "";
      if (isMod) key += "mod+";
      if (isShift) key += "shift+";
      key += event.key.toLowerCase();

      const current = shortcutsRef.current;
      if (current[key]) {
        event.preventDefault();
        current[key]();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []); // Stable: no re-registration on every render
}
