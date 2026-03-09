import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

function listFiles(dirPath: string, exts: string[]) {
  if (!fs.existsSync(dirPath)) return [];
  return fs
    .readdirSync(dirPath)
    .filter((f) => {
      const ext = path.extname(f).toLowerCase();
      return exts.includes(ext);
    })
    .map((f) => f);
}

export async function GET() {
  const photosDir = path.join(process.cwd(), "public", "ads", "photo");
  const videosDir = path.join(process.cwd(), "public", "ads", "video");

  const photos = listFiles(photosDir, [".jpg", ".jpeg", ".png", ".webp", ".gif"]);
  const videos = listFiles(videosDir, [".mp4", ".webm", ".mov"]);

  // رجّع المسارات كـ URL من public
  return NextResponse.json({
    photos: photos.map((f) => `/ads/photo/${f}`),
    videos: videos.map((f) => `/ads/video/${f}`),
  });
}