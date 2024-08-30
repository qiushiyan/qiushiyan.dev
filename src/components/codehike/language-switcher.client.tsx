"use client";

import { useState } from "react";

import { HighlightedCode, Pre } from "codehike/code";

import { AnimatedTabs } from "../ui/custom-tabs";
import { tokenTransitions } from "./token-transitions";

export function LanguageSwitcherClient({
  highlighted,
}: {
  highlighted: HighlightedCode[];
}) {
  const [selectedLang, setSelectedLang] = useState(highlighted[0].lang);
  const selectedCode =
    highlighted.find((code) => code.lang === selectedLang) ?? highlighted[0];

  return (
    <div>
      <AnimatedTabs
        tabs={highlighted.map((code) => ({
          id: code.lang,
          label: code.lang,
        }))}
        onTabChange={setSelectedLang}
      />

      <Pre
        code={selectedCode}
        className="m-0 overflow-y-hidden px-4 pt-2"
        handlers={[tokenTransitions]}
      />
    </div>
  );
}
