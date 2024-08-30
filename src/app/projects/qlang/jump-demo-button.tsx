"use client";

import { Button } from "@/components/ui/button";
import { FlaskConical } from "lucide-react";

export const JumpDemoButton = () => {
  return (
    <Button
      variant="outline"
      className="gap-2"
      role="link"
      onClick={() => {
        const element = document.getElementById("demo");
        if (element) {
          const rect = element.getBoundingClientRect();
          const scrollTop =
            window.scrollY || document.documentElement.scrollTop;
          const targetY = rect.top + scrollTop - 100;

          window.scrollTo({
            top: targetY,
            behavior: "smooth",
          });
        }
      }}
    >
      <FlaskConical className="size-4" />
      <span>Jump to demo</span>
    </Button>
  );
};
