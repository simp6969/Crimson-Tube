import youtubedl from "youtube-dl-exec";
import path from "path";
import fs from "fs";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { url, format } = await req.json();
    const isVideo = format === "MP4";
    const binaryPath = path.join(
      process.cwd(),
      "node_modules",
      "youtube-dl-exec",
      "bin",
      "yt-dlp"
    );
    const cookiesPath = path.join(process.cwd(), "cookies.txt");
    const cookiesExist = fs.existsSync(cookiesPath);
    if (!cookiesExist) {
      console.warn("Cookies file not found at:", cookiesPath);
    }
    const yt = youtubedl.create(binaryPath);

    // 1. Get Video Metadata (Title and Filename)
    // We use dumpSingleJson because it's fast and gives us the "clean" title
    const info = await yt(url, {
      dumpSingleJson: true,
      noCheckCertificates: true,
      preferFreeFormats: true,
      cookies: cookiesExist ? cookiesPath : "",
      format: isVideo ? "bestvideo+bestaudio/best" : "bestaudio/best",
    });

    const cleanTitle = info.title.replace(/[^\w\s]/gi, ""); // Remove illegal filename chars
    const extension = isVideo ? "mp4" : "mp3";
    const outputFilename = `${cleanTitle}.${extension}`;
    const outputPath = path.join("/tmp", `dl-${Date.now()}.${extension}`);

    // 2. Perform the actual download
    await yt(url, {
      output: outputPath,
      format: isVideo ? "bestvideo+bestaudio/best" : "bestaudio/best",
      mergeOutputFormat: isVideo ? "mp4" : null,
      audioFormat: isVideo ? null : "mp3",
      noCheckCertificates: true,
      cookies: cookiesExist ? cookiesPath : "",
    });

    if (fs.existsSync(outputPath)) {
      const fileBuffer = fs.readFileSync(outputPath);
      const stats = fs.statSync(outputPath);
      fs.unlinkSync(outputPath); // Cleanup /tmp

      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          "Content-Type": isVideo ? "video/mp4" : "audio/mpeg",
          "Content-Length": stats.size.toString(),
          // This is what makes the "Save As" name match the YouTube title
          "Content-Disposition": `attachment; filename="${encodeURIComponent(
            outputFilename
          )}"`,
          "Access-Control-Expose-Headers": "Content-Disposition",
        },
      });
    } else {
      throw new Error("File was not created");
    }
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
