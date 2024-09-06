"use client";

import { EditorView, KeyBinding, keymap } from "@codemirror/view";

export const BaseEditorTheme = EditorView.baseTheme({
  "&": {
    height: "100%",
  },
  ".cm-content": {
    fontSize: "16px",
    padding: "16px",
    lineHeight: "2rem",
  },
  "&dark .cm-activeLine": {
    backgroundColor: "hsl(var(--accent)) !important",
  },
  "&dark .cm-content": {
    backgroundColor: "hsl(var(--background))",
  },
  "&.cm-editor.cm-editor-dark": {
    backgroundColor: "hsl(var(--background))",
  },
  ".cm-gutters": {
    display: "none",
  },
});

export const createShortcuts = (keybindings: readonly KeyBinding[]) => {
  return keymap.of(keybindings);
};

export const baseExtensions = [BaseEditorTheme];
