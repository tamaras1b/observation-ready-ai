import { NextResponse } from "next/server";

// Serves /.well-known/assetlinks.json
// Required for TWA (Trusted Web Activity) to remove the browser URL bar
// The SHA-256 fingerprint must match the Android app signing certificate
export async function GET() {
  return NextResponse.json(
    [
      {
        relation: ["delegate_permission/common.handle_all_urls"],
        target: {
          namespace: "android_app",
          package_name: "com.tamand.observationreadyai",
          sha256_cert_fingerprints: [
            // Upload key fingerprint (used to sign the AAB you upload to Play Console)
            "47:57:3C:54:B7:57:22:2A:D0:FA:D8:9E:ED:04:D3:7A:DF:5C:FE:55:A5:4E:BB:85:9E:D5:99:82:1E:22:13:28",
            // NOTE: After uploading to Play Console with Google Play App Signing enabled,
            // go to Play Console → App Integrity → App Signing and add Google's
            // signing certificate SHA-256 fingerprint here as a second entry.
          ],
        },
      },
    ],
    {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=86400",
      },
    }
  );
}
