import youtubedl from 'youtube-dl-exec';
import path from 'path';
import fs from 'fs';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Vercel only allows writing to /tmp
    const outputFilename = `video-${Date.now()}.mp4`;
    const outputPath = path.join('/tmp', outputFilename);

    // Explicitly point to the binary
    const binaryPath = path.join(process.cwd(), 'node_modules', 'youtube-dl-exec', 'bin', 'yt-dlp');
    const yt = youtubedl.create(binaryPath);

    // This executes yt-dlp
    await yt(url, {
      output: outputPath,
      format: 'best',
      noCheckCertificates: true,
      noWarnings: true,
      preferFreeFormats: true,
      addHeader: ['referer:youtube.com', 'user-agent:googlebot']
    });

    // Check if file exists
    if (fs.existsSync(outputPath)) {
      const fileBuffer = fs.readFileSync(outputPath);
      
      // Cleanup: Delete file from /tmp after reading it into memory
      fs.unlinkSync(outputPath);

      // Return the file as a response
      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'video/mp4',
          'Content-Disposition': `attachment; filename=${outputFilename}`,
        },
      });
    } else {
      throw new Error('File was not created');
    }
  } catch (error) {
    console.error('yt-dlp Error:', error);
    return NextResponse.json(
      { error: 'Download failed', details: error.message },
      { status: 500 }
    );
  }
}