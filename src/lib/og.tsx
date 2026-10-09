import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

import { siteConfig } from "@/lib/site";

export const ogImageSize = { width: 1200, height: 630 };

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
    if (font.toString("latin1", record, record + 4) === "GPOS") {
      font.write("XPOS", record, "latin1");
    }
  }
  return font;
};

// Read on first render, not at import: pages import the image modules for
// their `alt` and `size` exports, and on Workers `public/` is not on disk.
// The images themselves are prerendered, so the read only happens at build.
let fontData: Promise<Buffer> | undefined;
const loadFont = () =>
  (fontData ??= readFile(
    join(process.cwd(), "public/fonts/SpaceGrotesk-SemiBold.ttf")
  ).then(withoutKerning));

const colors = {
  background: "#f8fafc",
  foreground: "#1e293b",
  muted: "#64748b",
  accent: "#0284c7",
};

type OgImageProps = {
  title: string;
  description?: string;
};

/** The 1200×630 card used for every Open Graph and Twitter image. */
export const renderOgImage = async ({ title, description }: OgImageProps) => {
  const host = new URL(siteConfig.url).host;
  const isSiteCard = title === siteConfig.name;

  return new ImageResponse(
    <div
      style={{
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
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 28,
          color: colors.muted,
        }}
      >
        <span>{isSiteCard ? "" : siteConfig.name}</span>
        <span>{host}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        <div
          style={{
            display: "block",
            lineClamp: 3,
            fontSize: title.length > 60 ? 60 : 72,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </div>
        {description ? (
          <div
            style={{
              display: "block",
              lineClamp: 2,
              fontSize: 32,
              lineHeight: 1.4,
              color: colors.muted,
            }}
          >
            {description}
          </div>
        ) : null}
      </div>
    </div>,
    {
      ...ogImageSize,
      fonts: [
        {
          name: FONT_FAMILY,
          data: await loadFont(),
          style: "normal",
          weight: 600,
        },
      ],
    }
  );
};
