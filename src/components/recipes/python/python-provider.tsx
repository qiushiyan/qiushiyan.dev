"use client";

import { createContext, useCallback, useContext } from "react";
import {
  usePython as _usePython,
  PythonProvider as ReactPythonProvider,
} from "react-py";

import { useEditor } from "../editor-provider";

type PythonContext = {
  /** Runs the current file. */
  run: () => void;
  isLoading: boolean;
  isRunning: boolean;
  stdout: string;
  stderr: string;
};
const PythonContext = createContext<PythonContext>({} as PythonContext);

/**
 * react-py's provider must sit above its `usePython` hook, so the runner
 * context lives in a child component. No recipe imports a third-party
 * package, so none are preinstalled.
 */
export const PythonProvider = ({ children }: { children: React.ReactNode }) => (
  <ReactPythonProvider>
    <PythonRunner>{children}</PythonRunner>
  </ReactPythonProvider>
);

function PythonRunner({ children }: { children: React.ReactNode }) {
  const { runPython, stdout, stderr, isLoading, isRunning } = _usePython();
  const { codes, file } = useEditor();

  const run = useCallback(() => {
    if (isLoading || isRunning) return;
    void runPython(codes[file]);
  }, [codes, file, isLoading, isRunning, runPython]);

  return (
    <PythonContext.Provider
      value={{ run, isLoading, isRunning, stdout, stderr }}
    >
      {children}
    </PythonContext.Provider>
  );
}

export const usePython = () => useContext(PythonContext);
