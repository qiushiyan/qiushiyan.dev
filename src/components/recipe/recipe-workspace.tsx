import { useCallback, useEffect, useState } from "react";
import { python } from "@codemirror/lang-python";
import { EditorView } from "@codemirror/view";
import CodeMirror from "@uiw/react-codemirror";
import { Loader2Icon, PlayIcon } from "lucide-react";
import { PythonProvider, usePython } from "react-py";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

/*
  The recipe page's editor and output: CodeMirror over the recipe's files,
  run in the browser by react-py (Pyodide in a web worker). The site's only
  React island, rendered client-only (src/pages/recipes/[group]/[slug].astro).
*/

type Props = {
  title: string;
  recipesHref: string;
  files: { name: string; source: string }[];
};

// `.cm-editor` adds specificity over CodeMirror's light/dark theme, so the
// editor sits on the page surface in both modes.
const editorTheme = EditorView.baseTheme({
  "&.cm-editor": { height: "100%", backgroundColor: "transparent" },
  ".cm-content": {
    fontFamily: "var(--font-mono)",
    fontSize: "14px",
    lineHeight: "1.6",
    padding: "12px 16px",
  },
  "&dark .cm-activeLine": { backgroundColor: "hsl(var(--accent)) !important" },
  ".cm-gutters": { display: "none" },
});
const extensions = [editorTheme, python()];

/** The site theme, following the `dark` class the theme script toggles on <html>. */
const useDarkMode = () => {
  const read = () => document.documentElement.classList.contains("dark");
  const [dark, setDark] = useState(read);
  useEffect(() => {
    const update = () => setDark(read());
    window.addEventListener("themechange", update);
    return () => window.removeEventListener("themechange", update);
  }, []);
  return dark;
};

/** Editor and output side by side; stacked on phones, where two columns of code are too narrow to read. */
const useStacked = () => {
  const query = "(max-width: 767px)";
  const [stacked, setStacked] = useState(() => matchMedia(query).matches);
  useEffect(() => {
    const media = matchMedia(query);
    const update = () => setStacked(media.matches);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  return stacked;
};

const PanelHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="flex h-9 shrink-0 items-center border-b px-3 text-xs font-medium text-muted-foreground">
    {children}
  </div>
);

function Workspace({ title, recipesHref, files }: Props) {
  const { runPython, stdout, stderr, isLoading, isRunning } = usePython();
  const [codes, setCodes] = useState(() =>
    Object.fromEntries(files.map((file) => [file.name, file.source]))
  );
  const [file] = useState(files[0].name);
  const dark = useDarkMode();
  const stacked = useStacked();
  const busy = isLoading || isRunning;

  const run = useCallback(() => {
    if (!busy) void runPython(codes[file]);
  }, [busy, codes, file, runPython]);

  return (
    <>
      <div className="flex min-h-12 items-center gap-2 py-2 text-sm">
        <a
          href={recipesHref}
          className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
        >
          Recipes
        </a>
        <span aria-hidden className="text-muted-foreground">
          /
        </span>
        <h1 className="min-w-0 truncate font-medium">{title}</h1>
        <button
          type="button"
          onClick={run}
          disabled={busy}
          title="Run (⌘/Ctrl + Enter)"
          className="ml-auto inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md border bg-background pr-3 pl-2.5 text-sm font-medium transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-50"
        >
          {busy ? (
            <Loader2Icon
              aria-hidden
              className="size-3.5 motion-safe:animate-spin"
            />
          ) : (
            // The triangle's visual centre sits left of its box, so nudge it right.
            <PlayIcon
              aria-hidden
              className="size-3.5 translate-x-px fill-current"
            />
          )}
          Run
        </button>
      </div>
      <PanelGroup
        direction={stacked ? "vertical" : "horizontal"}
        className="min-h-0 flex-1 rounded-md border"
      >
        <Panel defaultSize={60} className="flex flex-col">
          <PanelHeader>{file}</PanelHeader>
          {/* Capture phase, so the shortcut wins over CodeMirror's own Mod-Enter (insert blank line). */}
          <div
            className="min-h-0 flex-1"
            onKeyDownCapture={(event) => {
              if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
                event.preventDefault();
                event.stopPropagation();
                run();
              }
            }}
          >
            <CodeMirror
              className="h-full"
              height="100%"
              value={codes[file]}
              onChange={(value) =>
                setCodes((current) => ({ ...current, [file]: value }))
              }
              basicSetup={{ lineNumbers: false }}
              theme={dark ? "dark" : "light"}
              extensions={extensions}
            />
          </div>
        </Panel>
        <PanelResizeHandle className="bg-border data-[panel-group-direction=horizontal]:w-px data-[panel-group-direction=vertical]:h-px" />
        <Panel defaultSize={40} className="flex flex-col">
          <PanelHeader>Output</PanelHeader>
          <pre className="min-h-0 flex-1 overflow-auto p-3 font-mono text-sm/6 whitespace-pre-wrap">
            {isLoading ? (
              <span className="text-muted-foreground">Loading Python…</span>
            ) : (
              <>
                {stdout}
                <span className="text-destructive">{stderr}</span>
              </>
            )}
          </pre>
        </Panel>
      </PanelGroup>
    </>
  );
}

/** No recipe imports a third-party package, so none are preinstalled. */
export function RecipeWorkspace(props: Props) {
  return (
    <PythonProvider>
      <Workspace {...props} />
    </PythonProvider>
  );
}
