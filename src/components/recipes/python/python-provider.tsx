"use client";

import { createContext, useCallback, useContext, useState } from "react";

import {
  usePython as _usePython,
  PythonProvider as ReactPythonProvider,
} from "react-py";

type PythonContext = {
  input: string;
  setInput: (input: string) => void;
  run: () => void;
  isLoading: boolean;
  isRunning: boolean;
  stdout: string;
  stderr: string;
};
const PythonContext = createContext<PythonContext>({} as PythonContext);

export const PythonProvider = ({
  children,
  code,
}: {
  children: React.ReactNode;
  code: string;
}) => {
  const [input, setInput] = useState(code);
  const { runPython, stdout, stderr, isLoading, isRunning } = _usePython();

  const run = useCallback(() => {
    runPython(input);
  }, [input, runPython]);

  return (
    <PythonContext.Provider
      value={{ input, setInput, run, isLoading, isRunning, stdout, stderr }}
    >
      <ReactPythonProvider
        packages={{
          micropip: ["requests"],
        }}
      >
        {children}
      </ReactPythonProvider>
    </PythonContext.Provider>
  );
};

export const usePython = () => useContext(PythonContext);
