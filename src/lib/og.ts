import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { Resvg } from "@resvg/resvg-js";
import satori from "satori";

import { siteConfig } from "@/lib/site";

/*
  The 1200×630 Open Graph card for every page, rendered at build time
  (src/pages/og/[...card].png.ts): satori lays out the card as SVG, resvg
  rasterises it.
*/

const size = { width: 1200, height: 630 };
const FONT_FAMILY = "Space Grotesk";

/**
 * Satori lays text out with unkerned widths but draws it kerned, which leaves
 * a wide gap after every word with a kerning pair ("Pattern  Matching").
 * Renaming the font's GPOS table, where it keeps its kerning, makes
 * opentype.js skip it, so layout and drawing agree. Ligatures (GSUB) stay.
 */
const withoutKerning = (font: Buffer) => {
  const tableCount = font.readUInt16BE(4);
  for (let index = 0; index < tableCount; index++) {
    const record = 12 + index * 16;
    if (font.toString("latin1", record, record + 4) === "GPOS")
      font.write("XPOS", record, "latin1");
  }
  return font;
};

let fontData: Promise<Buffer> | undefined;
const loadFont = () =>
  (fontData ??= readFile(join(process.cwd(), "public/fonts/SpaceGrotesk-SemiBold.ttf")).then(
    withoutKerning,
  ));

const colors = {
  background: "#f8fafc",
  foreground: "#1e293b",
  muted: "#64748b",
  accent: "#0284c7",
};

type Node = {
  type: string;
  props: {
    style?: Record<string, unknown>;
    children?: (Node | string | null)[] | Node | string;
  };
};
const el = (
  type: string,
  style: Record<string, unknown>,
  children?: Node["props"]["children"],
): Node => ({
  type,
  props: { style, children },
});

/** A PNG card with the title and an optional one-line description. */
export const renderOgImage = async ({
  title,
  description,
}: {
  title: string;
  description?: string;
}) => {
  const isSiteCard = title === siteConfig.name;
  const card = el(
    "div",
    {
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      padding: "72px 80px",
      background: colors.background,
      borderTop: `12px solid ${colors.accent}`,
      color: colors.foreground,
      fontFamily: FONT_FAMILY,
    },
    [
      el(
        "div",
        {
          display: "flex",
          justifyContent: "space-between",
          fontSize: 28,
          color: colors.muted,
        },
        [
          el("span", {}, isSiteCard ? "" : siteConfig.name),
          el("span", {}, new URL(siteConfig.url).host),
        ],
      ),
      el("div", { display: "flex", flexDirection: "column", gap: 28 }, [
        el(
          "div",
          {
            display: "block",
            lineClamp: 3,
            fontSize: title.length > 60 ? 60 : 72,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
          },
          title,
        ),
        description
          ? el(
              "div",
              {
                display: "block",
                lineClamp: 2,
                fontSize: 32,
                lineHeight: 1.4,
                color: colors.muted,
              },
              description,
            )
          : null,
      ]),
    ],
  );

  const svg = await satori(card as never, {
    ...size,
    fonts: [
      {
        name: FONT_FAMILY,
        data: await loadFont(),
        style: "normal",
        weight: 600,
      },
    ],
  });
  return new Resvg(svg, { fitTo: { mode: "width", value: size.width } }).render().asPng();
};
