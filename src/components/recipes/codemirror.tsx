"use client";

import dynamic from "next/dynamic";

export const CodeMirror = dynamic(() => import("@uiw/react-codemirror"), {
  ssr: false,
});
