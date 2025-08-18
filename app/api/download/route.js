// route.js in Next.js App Router
import ytdl, { filterFormats } from "@distube/ytdl-core";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const videoUrl = searchParams.get("url");
  const formatType = searchParams.get("format") || "mp4";

  if (!videoUrl || !ytdl.validateURL(videoUrl)) {
    return NextResponse.json(
      { error: "Invalid or missing YouTube URL parameter." },
      { status: 400 }
    );
  }
  const YOUTUBE_COOKIES = process.env.YOUTUBE_COOKIES;
  const agentOptions = {
    pipelining: 5,
    maxRedirections: 0,
  };

  // agent should be created once if you don't want to change your cookie
  const agent = ytdl.createAgent(YOUTUBE_COOKIES, agentOptions);
  try {
    // First, get video info without any format filtering
    const info = await ytdl.getInfo(videoUrl, { agent });
    const title =
      info.videoDetails.title.replace(/[^\w\s.-]/g, "_").replace(/\s+/g, " ") ||
      "video";

    const isAudioOnly = formatType === "mp3";
    const downloadOptions = {
      filter: isAudioOnly ? "audioonly" : "videoandaudio",
      agent,
    };
    const fileExtension = isAudioOnly ? "mp3" : "mp4";
    const mimeType = isAudioOnly ? "audio/mpeg" : "video/mp4";
    const videoStream = ytdl.downloadFromInfo(info, downloadOptions);

    // Create a new ReadableStream from the ytdl stream
    const webStream = new ReadableStream({
      start(controller) {
        videoStream.on("data", (chunk) => controller.enqueue(chunk));
        videoStream.on("end", () => controller.close());
        videoStream.on("error", (err) => controller.error(err));
      },
    });

    const responseHeaders = new Headers();
    responseHeaders.set("Content-Type", mimeType);
    responseHeaders.set(
      "Content-Disposition",
      `attachment; filename="${title}.${fileExtension}"`
    );

    return new Response(webStream, { headers: responseHeaders });
  } catch (error) {
    console.error("Failed to download video:", error);
    return NextResponse.json(
      { error: "Failed to process video download.", details: error.message },
      { status: 500 }
    );
  }
}
