import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const pastedText = formData.get("text") as string | null;

  try {
    let content = "";

    if (pastedText && pastedText.trim()) {
      content = pastedText.trim();
    } else if (file) {
      const ext = file.name.split(".").pop()?.toLowerCase();
      if (ext === "txt" || ext === "csv" || ext === "md") {
        content = await file.text();
      } else if (ext === "pdf") {
        // For PDF files, return a message asking user to paste text
        return NextResponse.json({
          success: false,
          error: "PDF parsing is not available in this version. Please copy the text from your PDF and paste it into the text field.",
        });
      } else {
        content = await file.text();
      }
    } else {
      return NextResponse.json({ success: false, error: "No content provided." });
    }

    // Parse content into individual items (split by newlines, filter blanks)
    const lines = content
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 5);

    return NextResponse.json({
      success: true,
      content,
      items: lines,
      count: lines.length,
    });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to process the uploaded document." });
  }
}
