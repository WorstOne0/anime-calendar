// Next
import { ImageResponse } from "next/og";
import fs from "node:fs/promises";
import path from "node:path";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "kuuhaku/anime · Calendário de animes da temporada";

// x, y, diameter in px
const STARS = [
  [96, 64, 3],
  [412, 38, 2],
  [610, 96, 3],
  [1130, 70, 2],
  [880, 40, 3],
  [60, 560, 2],
  [520, 590, 3],
  [700, 540, 2],
  [1150, 580, 3],
  [760, 300, 2],
];

// Lives in (home) on purpose: a root one would override the AniList cover each /anime page sets as its image.
// Concrete colours, since this renders outside the CSS: Kuuhaku's violet and indigo (tokens.css).
export default async function OpengraphImage() {
  // Read from disk rather than fetching a URL: this runs at build time, when the site is not yet serving.
  const logo = await fs.readFile(path.join(process.cwd(), "public/logo/logo.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "80px",
          background: "radial-gradient(circle at 80% 50%, #5b21b6 0%, #1c1f4a 40%, #0e0f13 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        {STARS.map(([x, y, d]) => (
          <div key={`${x}-${y}`} style={{ position: "absolute", left: x, top: y, width: d, height: d, borderRadius: d, background: "white", opacity: 0.7 }} />
        ))}

        <div style={{ display: "flex", flexDirection: "column", maxWidth: 700 }}>
          <span style={{ fontSize: 30, color: "#a78bfa" }}>anime.kuuhaku.dev</span>
          <span style={{ fontSize: 84, fontWeight: 800, lineHeight: 1.05, marginTop: 18 }}>Calendário de animes da temporada</span>
          <span style={{ fontSize: 34, fontWeight: 600, marginTop: 32, color: "#8da4f7" }}>Horários no seu fuso · Onde assistir no Brasil</span>
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={300} height={300} alt="" />
      </div>
    ),
    size
  );
}
