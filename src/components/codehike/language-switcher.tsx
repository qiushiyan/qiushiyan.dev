import { highlight } from "codehike/code";

import { LanguageSwitcherClient } from "./language-switcher.client";

export const LanguageSwitcher = async ({ data }: { data: string }) => {
  const entries = JSON.parse(data) as Array<{ lang: string; code: string }>;

  const highlighted = await Promise.all(
    entries.map(async (entry) =>
      highlight(
        {
          lang: entry.lang,
          value: entry.code,
          meta: "",
        },
        "one-dark-pro"
      )
    )
  );
  return <LanguageSwitcherClient highlighted={highlighted} />;
};
