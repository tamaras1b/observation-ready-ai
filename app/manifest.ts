import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "com.tamand.observationreadyai",
    name: "Observation Ready AI",
    short_name: "ObsReady AI",
    description:
      "AI-powered lesson planning and IPDP tools for K–12 educators. Build observation-ready lesson plans, craft professional IPDP responses, and manage your standards — all in one place.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#1e1b4b",
    theme_color: "#4f46e5",
    categories: ["education", "productivity"],
    prefer_related_applications: false,
    display_override: ["window-controls-overlay", "standalone", "minimal-ui", "browser"],
    iarc_rating_id: "e84b072d-71b3-4d3e-86ae-31a8ce4e53b7",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    screenshots: [
      {
        src: "/icons/screenshot-mobile.png",
        sizes: "390x844",
        type: "image/png",
        form_factor: "narrow",
        label: "Dashboard",
      },
      {
        src: "/icons/screenshot-lesson.png",
        sizes: "390x844",
        type: "image/png",
        form_factor: "narrow",
        label: "Lesson Plan Builder",
      },
      {
        src: "/icons/screenshot-desktop.png",
        sizes: "1280x720",
        type: "image/png",
        form_factor: "wide",
        label: "Desktop View",
      },
    ],
  } as MetadataRoute.Manifest;
}
