import { NextResponse } from "next/server";
import ytdl from "@distube/ytdl-core";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const videoUrl = searchParams.get("url");
  const formatType = searchParams.get("format") || "mp4"; // 'mp4' or 'mp3'

  if (!videoUrl || !ytdl.validateURL(videoUrl)) {
    return NextResponse.json(
      { error: "Invalid or missing YouTube URL parameter." },
      { status: 400 }
    );
  }

  try {
    const isAudioOnly = formatType === "mp3";
    const fileExtension = isAudioOnly ? "mp3" : "mp4";
    const mimeType = isAudioOnly ? "audio/mpeg" : "video/mp4";
    const ytdlFilter = isAudioOnly ? "audioonly" : "videoandaudio";

    // --- 1. Prepare Request Options for ytdl-core ---
    const YOUTUBE_COOKIE = process.env.YOUTUBE_COOKIE;
    const requestHeaders = {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
    };
    if (YOUTUBE_COOKIE) {
      requestHeaders.cookie = YOUTUBE_COOKIE;
    }
    const requestOptions = { headers: requestHeaders };

    const info = await ytdl.getInfo(videoUrl, { requestOptions });
    const title =
      info.videoDetails.title.replace(/[^\w\s.-]/g, "_").replace(/\s+/g, " ") ||
      "video";

    // --- 2. Choose the best format ---
    const format = ytdl.chooseFormat(info.formats, {
      quality: "highest",
      filter: ytdlFilter,
    });

    // If we can't find a format with a known length, we can't support range requests.
    // This might happen with some live streams or very new videos.
    const responseHeaders = new Headers();
    responseHeaders.set("Content-Type", mimeType);
    responseHeaders.set(
      "Content-Disposition",
      `attachment; filename="${title}.${fileExtension}"`
    );

    if (!format || !format.contentLength) {
      console.warn(
        `Could not find a format with a known content length for URL: ${videoUrl}. Falling back to simple stream.`
      );
      // Fallback to streaming without length, which means no progress bar or resuming.
      const videoStream = ytdl(videoUrl, {
        quality: "highest",
        filter: ytdlFilter,
        requestOptions,
      });

      const webStream = new ReadableStream({
        start(controller) {
          videoStream.on("data", (chunk) => controller.enqueue(chunk));
          videoStream.on("end", () => controller.close());
          videoStream.on("error", (err) => controller.error(err));
        },
      });
      return new Response(webStream, { headers: responseHeaders });
    }

    const totalSize = parseInt(format.contentLength, 10);
    const rangeHeader = request.headers.get("range");

    let start, end;
    let status = 200;
    responseHeaders.set("Accept-Ranges", "bytes");

    if (rangeHeader) {
      status = 206; // Partial Content
      const parts = rangeHeader.replace(/bytes=/, "").split("-");
      start = parseInt(parts[0], 10);
      end = parts[1] ? parseInt(parts[1], 10) : totalSize - 1;
      const chunkSize = end - start + 1;

      responseHeaders.set(
        "Content-Range",
        `bytes ${start}-${end}/${totalSize}`
      );
      responseHeaders.set("Content-Length", chunkSize.toString());
    } else {
      start = 0;
      end = totalSize - 1;
      responseHeaders.set("Content-Length", totalSize.toString());
    }

    const videoStream = ytdl(videoUrl, {
      format,
      range: { start, end },
      requestOptions,
    });
    const webStream = new ReadableStream({
      start(controller) {
        videoStream.on("data", (chunk) => controller.enqueue(chunk));
        videoStream.on("end", () => controller.close());
        videoStream.on("error", (err) => controller.error(err));
      },
    });

    return new Response(webStream, { status, headers: responseHeaders });
  } catch (error) {
    console.error("Failed to download video:", error);
    return NextResponse.json(
      { error: "Failed to process video download.", details: error.message },
      { status: 500 }
    );
  }
}
