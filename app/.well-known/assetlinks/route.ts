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
          package_name: "com.tamand.observationreadyai2",
          sha256_cert_fingerprints: [
            // Upload key fingerprint (used to sign the AAB you upload to Play Console)
            "9C:E8:18:64:C2:D0:84:53:86:80:38:4B:33:8D:B6:E9:51:78:C0:4B:46:CD:B4:8F:3A:01:54:5E:11:D4:92:78",
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
