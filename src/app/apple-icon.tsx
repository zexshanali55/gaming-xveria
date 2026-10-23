import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Home-screen icon for iPhone (iOS ignores SVG favicons). */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#ffe500", color: "#04060d", fontSize: 130, fontWeight: 900 }}>
        X
      </div>
    ),
    size,
  );
}
