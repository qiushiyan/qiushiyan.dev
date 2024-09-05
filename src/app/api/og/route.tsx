import { ImageResponse } from "next/og";

const size = {
  width: 1200,
  height: 630,
};
export const runtime = "edge";

export const GET = async (request: Request) => {
  const url = new URL(request.url);
  const title = url.searchParams.get("title");
  const description = url.searchParams.get("description");

  const font = fetch(
    new URL(
      "../../../../public/fonts/SpaceGrotesk-SemiBold.ttf",
      import.meta.url
    )
  ).then((res) => res.arrayBuffer());

  const fontData = await font;
  return new ImageResponse(
    (
      <div
        style={{
          background:
            "linear-gradient(to bottom right, #2d1b4e, #1c1c28, #1e3a5f)",
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "40px 40px",
        }}
      >
        {title != null && (
          <header
            style={{
              fontSize: 20,
              fontStyle: "normal",
              color: "gray",
            }}
          >
            <p>Qiushi Yan</p>
          </header>
        )}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "40px",
          }}
        >
          <h1
            style={{
              fontSize: 60,
              whiteSpace: "pre-wrap",
              fontFamily: "Kaisei Tokumin",
              letterSpacing: "-0.05em",
              fontStyle: "normal",
              color: "white",
            }}
          >
            {title || "Qiushi Yan"}
          </h1>
        </div>
        <footer
          style={{
            display: "flex",
            color: "white",
            marginTop: "auto",
            fontSize: 24,
            lineClamp: 2,
          }}
        >
          <p>{description || "A blog on web development and data science"}</p>
        </footer>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Kaisei Tokumin",
          data: fontData,
          style: "normal",
        },
      ],
    }
  );
};
