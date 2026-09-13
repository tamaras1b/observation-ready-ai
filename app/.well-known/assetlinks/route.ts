import { NextResponse } from "next/server";

// Serves /.well-known/assetlinks.json
// Required for TWA (Trusted Web Activity) to remove the browser URL bar,
// and for Google's credential-sharing (Smart Lock / Credential Manager) verification
export async function GET() {
  return NextResponse.json(
    [
      {
        // Entry 1: TWA URL-bar removal for the current GLOW-published app
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
      {
        // Entry 2: exact JSON provided by Google Play Console's
        // "Turn on credential sharing" step (Smart Lock / Credential Manager)
        relation: [
          "delegate_permission/common.handle_all_urls",
          "delegate_permission/common.get_login_creds",
        ],
        target: {
          namespace: "android_app",
          package_name: "com.tamand.observationreadyai",
          sha256_cert_fingerprints: [
            "30:EE:9D:21:80:83:CA:06:5E:1A:F9:AE:17:2B:0E:CB:EE:E6:67:65:F0:F6:22:12:21:A7:D0:3F:15:16:46:F6",
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
