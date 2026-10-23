import { ImageResponse } from "next/og";

export const alt = "Gaming Xveria — games at full throttle";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** The preview card shown when the site is shared on WhatsApp, Facebook, X… */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center",
          padding: "0 90px", color: "#e8f1ff",
          background: "radial-gradient(circle at 85% 0%, #0b3a8a 0%, #04060d 60%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ width: 96, height: 96, display: "flex", alignItems: "center", justifyContent: "center", background: "#ffe500", color: "#04060d", fontSize: 70, fontWeight: 900 }}>X</div>
          <div style={{ fontSize: 56, fontWeight: 900, letterSpacing: 10 }}>XVERIA</div>
        </div>
        <div style={{ marginTop: 50, fontSize: 92, fontWeight: 900, lineHeight: 1, display: "flex", flexDirection: "column" }}>
          <span>FULL</span>
          <span style={{ color: "#00c2ff" }}>THROTTLE</span>
          <span style={{ color: "#ffe500" }}>GAMING.</span>
        </div>
        <div style={{ marginTop: 40, fontSize: 30, color: "#8fa3c8" }}>PC keys by email · PS5 &amp; Xbox discs to your door · Pakistan</div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 12, background: "linear-gradient(90deg, #ffe500, #00c2ff)" }} />
      </div>
    ),
    size,
  );
}
