import { NextResponse } from "next/server";

// Serves /.well-known/web-app-origin-association
// Required for scope_extensions in the PWA manifest to be validated by browsers
export async function GET() {
  return NextResponse.json(
    {
      web_apps: [
        {
          web_app_identity:
            "https://www.observationreadyai.app/manifest.webmanifest",
        },
      ],
    },
    {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=86400",
      },
    }
  );
}
