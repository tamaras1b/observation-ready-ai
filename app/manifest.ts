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
    display_override: ["tabbed", "window-controls-overlay", "standalone", "minimal-ui", "browser"],
    tab_strip: {
      home_tab:       { url: "/" },
      new_tab_button: { url: "/lesson-plan" },
    },
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

    // focus-existing: re-use the open tab instead of launching a duplicate
    // Must be a string — PWABuilder does not support the array form
    launch_handler: {
      client_mode: "focus-existing",
    },

    protocol_handlers: [
      {
        protocol: "web+obsready",
        url: "/?action=%s",
      },
    ],

    share_target: {
      action: "/share-target",
      method: "GET",
      enctype: "application/x-www-form-urlencoded",
      params: {
        title: "title",
        text:  "text",
        url:   "url",
      },
    },

    note_taking: {
      new_note_url: "/lesson-plan",
    },

    edge_side_panel: {
      preferred_width: 400,
    },

    shortcuts: [
      {
        name: "New Lesson Plan",
        short_name: "Lesson Plan",
        description: "Create a new AI-powered lesson plan",
        url: "/lesson-plan",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
      },
      {
        name: "My IPDP",
        short_name: "IPDP",
        description: "View and update your Individual Professional Development Plan",
        url: "/ipdp",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
      },
      {
        name: "Saved Plans",
        short_name: "Saved",
        description: "View your saved lesson plans",
        url: "/saved",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
      },
      {
        name: "Upload Standards",
        short_name: "Standards",
        description: "Upload and manage your teaching standards",
        url: "/standards",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
      },
    ],

    file_handlers: [
      {
        action: "/",
        accept: {
          "application/pdf": [".pdf"],
          "text/plain": [".txt"],
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
          "application/msword": [".doc"],
        },
      },
    ],

    widgets: [
      {
        name: "Observation Ready AI",
        short_name: "ObsReady AI",
        description: "Quick access to lesson planning and IPDP tools",
        tag: "obs-ready-widget",
        template: "generic-template",
        ms_ac_template: "/widget/template.json",
        data: "/widget/data.json",
        type: "application/json",
        screenshots: [
          { src: "/icons/icon-512.png", sizes: "512x512", label: "Observation Ready AI Widget" },
        ],
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
        auth: false,
        update: 86400,
      },
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
  } as MetadataRoute.Manifest;
}
