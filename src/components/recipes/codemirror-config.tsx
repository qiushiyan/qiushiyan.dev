import { EditorView } from "@codemirror/view";

export const BaseEditorTheme = EditorView.baseTheme({
  // `.cm-editor` adds specificity over the light/dark theme's own background,
  // so the editor sits on the page surface in both modes.
  "&.cm-editor": {
    height: "100%",
    backgroundColor: "transparent",
  },
  ".cm-content": {
    fontFamily: "var(--font-mono)",
    fontSize: "14px",
    lineHeight: "1.6",
    padding: "12px 16px",
  },
  "&dark .cm-activeLine": {
    backgroundColor: "hsl(var(--accent)) !important",
  },
  ".cm-gutters": {
    display: "none",
  },
});

export const baseExtensions = [BaseEditorTheme];
