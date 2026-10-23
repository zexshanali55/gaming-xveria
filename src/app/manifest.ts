import type { MetadataRoute } from "next";

/** Lets phones "Add to Home screen" with the right name and colours. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Gaming Xveria",
    short_name: "Xveria",
    description: "Games at full throttle — PC keys & console discs in Pakistan.",
    start_url: "/",
    display: "standalone",
    background_color: "#04060d",
    theme_color: "#04060d",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
