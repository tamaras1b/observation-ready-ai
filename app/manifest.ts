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
    lang: "en-US",
    dir: "ltr",
    display: "standalone",
    // tabbed added — lets the app open in a tabbed window on supporting OSes
    display_override: ["tabbed", "window-controls-overlay", "standalone", "minimal-ui", "browser"],
    orientation: "portrait",
    background_color: "#1e1b4b",
    theme_color: "#4f46e5",
    categories: ["education", "productivity"],
    iarc_rating_id: "e84b072d-71b3-4d3e-86ae-31a8ce4e53b7",
    prefer_related_applications: false,
    related_applications: [
      {
        platform: "play",
        id: "com.tamand.observationreadyai",
        url: "https://play.google.com/store/apps/details?id=com.tamand.observationreadyai",
      },
      {
        platform: "webapp",
        url: "https://www.observationreadyai.app/manifest.webmanifest",
      },
    ],
    scope_extensions: [
      { origin: "https://observationreadyai.app" },
      { origin: "https://www.observationreadyai.app" },
    ],
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
    // Register as a note-taking app so the OS can offer "New Note" shortcuts
    note_taking: {
      new_note_url: "/lesson-plan",
    },
    // Pin to Microsoft Edge sidebar
    edge_side_panel: {
      preferred_width: 400,
    },
    // Home screen / desktop widget (Windows 11, Android)
    widgets: [
      {
        name: "Observation Ready AI",
        description: "Quick access to lesson planning and IPDP tools",
        tag: "obs-ready-widget",
        template: "generic-template",
        ms_ac_template: "/widget/template.json",
        data: "/widget/data.json",
        type: "application/json",
        screenshots: [
          {
            src: "/icons/icon-512.png",
            sizes: "512x512",
            label: "Observation Ready AI Widget",
          },
        ],
        icons: [
          { src: "/icons/icon-192.png", sizes: "192x192" },
        ],
        auth: false,
        update: 86400,
      },
    ],
  } as MetadataRoute.Manifest;
}
