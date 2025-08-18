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
  const YOUTUBE_COOKIES = [
    {
      domain: ".youtube.com",
      expirationDate: 1789555219.350099,
      hostOnly: false,
      httpOnly: false,
      name: "__Secure-1PAPISID",
      path: "/",
      sameSite: "unspecified",
      secure: true,
      session: false,
      storeId: "0",
      value: "aN1NwoZd1SYZcTps/ALUwCJUrG_j4JdflC",
      id: 1,
    },
    {
      domain: ".youtube.com",
      expirationDate: 1789555219.349987,
      hostOnly: false,
      httpOnly: true,
      name: "__Secure-1PSID",
      path: "/",
      sameSite: "unspecified",
      secure: true,
      session: false,
      storeId: "0",
      value:
        "g.a0000AhdXxhAsLZhoA818VJjjj6-vSafOCQ_v8z6REhSRVI62ku4SlbVnbuvew6WRQxEJN4lYwACgYKAaUSARUSFQHGX2MihJJPLkIq_eamRs2egkUdrBoVAUF8yKqP5hR6EzpKLsJ4mpT6ODkz0076",
      id: 2,
    },
    {
      domain: ".youtube.com",
      expirationDate: 1787087812.71234,
      hostOnly: false,
      httpOnly: true,
      name: "__Secure-1PSIDCC",
      path: "/",
      sameSite: "unspecified",
      secure: true,
      session: false,
      storeId: "0",
      value:
        "AKEyXzWFVHCglBBtCXD7XNYf7bfZajgAMh8vzy7ljiyuqFa0-2Cw0-XUi9LKkvTdZ2QXAkLW4S0",
      id: 3,
    },
    {
      domain: ".youtube.com",
      expirationDate: 1787087645.788117,
      hostOnly: false,
      httpOnly: true,
      name: "__Secure-1PSIDTS",
      path: "/",
      sameSite: "unspecified",
      secure: true,
      session: false,
      storeId: "0",
      value:
        "sidts-CjQB5H03P_9C-luKscLwdqaLS9z2VI0j2jkGXy7KClIKRucFKjLFna_Y7xkPGTC5dDiv5f2TEAA",
      id: 4,
    },
    {
      domain: ".youtube.com",
      expirationDate: 1789555219.350115,
      hostOnly: false,
      httpOnly: false,
      name: "__Secure-3PAPISID",
      path: "/",
      sameSite: "no_restriction",
      secure: true,
      session: false,
      storeId: "0",
      value: "aN1NwoZd1SYZcTps/ALUwCJUrG_j4JdflC",
      id: 5,
    },
    {
      domain: ".youtube.com",
      expirationDate: 1789555219.350013,
      hostOnly: false,
      httpOnly: true,
      name: "__Secure-3PSID",
      path: "/",
      sameSite: "no_restriction",
      secure: true,
      session: false,
      storeId: "0",
      value:
        "g.a0000AhdXxhAsLZhoA818VJjjj6-vSafOCQ_v8z6REhSRVI62ku4A7RO5OxmVW-WbxI8KUDhmAACgYKARgSARUSFQHGX2Mi2v-PbUUStxtXM3Q7E0WhoRoVAUF8yKoAI9Fzss4_MeHW2DlkyjTk0076",
      id: 6,
    },
    {
      domain: ".youtube.com",
      expirationDate: 1787087812.712542,
      hostOnly: false,
      httpOnly: true,
      name: "__Secure-3PSIDCC",
      path: "/",
      sameSite: "no_restriction",
      secure: true,
      session: false,
      storeId: "0",
      value:
        "AKEyXzXsmxh-e1DtXKFNsomCeqlEBn7hJrJG3dQNQoVE7DbdUs4_kQq8CX1Zc5Q56nA7YI7VPPc",
      id: 7,
    },
    {
      domain: ".youtube.com",
      expirationDate: 1787087645.788279,
      hostOnly: false,
      httpOnly: true,
      name: "__Secure-3PSIDTS",
      path: "/",
      sameSite: "no_restriction",
      secure: true,
      session: false,
      storeId: "0",
      value:
        "sidts-CjQB5H03P_9C-luKscLwdqaLS9z2VI0j2jkGXy7KClIKRucFKjLFna_Y7xkPGTC5dDiv5f2TEAA",
      id: 8,
    },
    {
      domain: ".youtube.com",
      expirationDate: 1789555219.350064,
      hostOnly: false,
      httpOnly: false,
      name: "APISID",
      path: "/",
      sameSite: "unspecified",
      secure: false,
      session: false,
      storeId: "0",
      value: "oQo4HEjz9W5c3M4P/AI3t3NE9vWGhe4_RL",
      id: 9,
    },
    {
      domain: ".youtube.com",
      expirationDate: 1789555219.350031,
      hostOnly: false,
      httpOnly: true,
      name: "HSID",
      path: "/",
      sameSite: "unspecified",
      secure: false,
      session: false,
      storeId: "0",
      value: "AbD34aIKsYaBfFtR2",
      id: 10,
    },
    {
      domain: ".youtube.com",
      expirationDate: 1790109700.106503,
      hostOnly: false,
      httpOnly: true,
      name: "LOGIN_INFO",
      path: "/",
      sameSite: "no_restriction",
      secure: true,
      session: false,
      storeId: "0",
      value:
        "AFmmF2swRgIhAKvzM5kjA1kW8cUAaH7Vp9REMXMmNEj-pCZrMjwEldLPAiEA_jjL1zLdI5GiTSWGvbJAZiYD6baZayziLKTkPgOa0Ws:QUQ3MjNmeXdaMEVZWF9DcW5zZTdBek5aOUY3UGFValNHQW1RQzg2d2tuMVlOal9sS3packg3eWpJUjIxQXJGMEhtN0JaMkFyU2h1WEhuMWUxSUhzNHVOZm1OZzhVVlRiaFdiNzZ1RW9NRHJvQWtxd2R0VXBJVXkzVTl5QXJlUTFaNVJmajAyeGhrd19LRjlhY0Y1OFJDRkgzRVNrcnE5Mm13",
      id: 11,
    },
    {
      domain: ".youtube.com",
      expirationDate: 1790111787.213035,
      hostOnly: false,
      httpOnly: false,
      name: "PREF",
      path: "/",
      sameSite: "unspecified",
      secure: true,
      session: false,
      storeId: "0",
      value: "f6=40000000&tz=Asia.Ulaanbaatar&f7=100",
      id: 12,
    },
    {
      domain: ".youtube.com",
      expirationDate: 1789555219.350081,
      hostOnly: false,
      httpOnly: false,
      name: "SAPISID",
      path: "/",
      sameSite: "unspecified",
      secure: true,
      session: false,
      storeId: "0",
      value: "aN1NwoZd1SYZcTps/ALUwCJUrG_j4JdflC",
      id: 13,
    },
    {
      domain: ".youtube.com",
      expirationDate: 1789555219.349858,
      hostOnly: false,
      httpOnly: false,
      name: "SID",
      path: "/",
      sameSite: "unspecified",
      secure: false,
      session: false,
      storeId: "0",
      value:
        "g.a0000AhdXxhAsLZhoA818VJjjj6-vSafOCQ_v8z6REhSRVI62ku4JQhTib8Tle01HInwt0TMOAACgYKAcISARUSFQHGX2MiCgpvJrsa_OpRh8EOfxmZZxoVAUF8yKrsoxFwRVFrQqTWNbylDmXw0076",
      id: 14,
    },
    {
      domain: ".youtube.com",
      expirationDate: 1787087812.712122,
      hostOnly: false,
      httpOnly: false,
      name: "SIDCC",
      path: "/",
      sameSite: "unspecified",
      secure: false,
      session: false,
      storeId: "0",
      value:
        "AKEyXzVqMlMQra3QphpnE7R2QM3zqVAdDHsnGai8F2128_pT30kfDIU0nbgHbDnKTQlZ4neOsw",
      id: 15,
    },
    {
      domain: ".youtube.com",
      expirationDate: 1789555219.350048,
      hostOnly: false,
      httpOnly: true,
      name: "SSID",
      path: "/",
      sameSite: "unspecified",
      secure: true,
      session: false,
      storeId: "0",
      value: "Ar5wljVyDvIg4cFx9",
      id: 16,
    },
    {
      domain: ".youtube.com",
      expirationDate: 1755551819,
      hostOnly: false,
      httpOnly: false,
      name: "ST-3opvp5",
      path: "/",
      sameSite: "unspecified",
      secure: false,
      session: false,
      storeId: "0",
      value:
        "session_logininfo=AFmmF2swRgIhAKvzM5kjA1kW8cUAaH7Vp9REMXMmNEj-pCZrMjwEldLPAiEA_jjL1zLdI5GiTSWGvbJAZiYD6baZayziLKTkPgOa0Ws%3AQUQ3MjNmeXdaMEVZWF9DcW5zZTdBek5aOUY3UGFValNHQW1RQzg2d2tuMVlOal9sS3packg3eWpJUjIxQXJGMEhtN0JaMkFyU2h1WEhuMWUxSUhzNHVOZm1OZzhVVlRiaFdiNzZ1RW9NRHJvQWtxd2R0VXBJVXkzVTl5QXJlUTFaNVJmajAyeGhrd19LRjlhY0Y1OFJDRkgzRVNrcnE5Mm13",
      id: 17,
    },
  ];
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
