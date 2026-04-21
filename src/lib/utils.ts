/* eslint-disable @typescript-eslint/no-explicit-any,no-console */
import Hls from 'hls.js';

export function getImageProxyUrl(): string | null {
  return null;
}

// 🔥 全局万能图片代理（所有图片必显示）
export function processImageUrl(originalUrl: string): string {
  if (!originalUrl) return "https://via.placeholder.com/320x480?text=No+Image";
  
  try {
    return `https://images.weserv.nl/?url=${encodeURIComponent(originalUrl)}&il`;
  } catch {
    return "https://via.placeholder.com/320x480?text=No+Image";
  }
}

export function getDoubanProxyUrl(): string | null {
  return null;
}

export function processDoubanUrl(originalUrl: string): string {
  return originalUrl;
}

export function cleanHtmlTags(text: string): string {
  if (!text) return "";
  return text
    .replace(/<[^>]+>/g, "\n")
    .replace(/\n+/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/^\n+|\n+$/g, "")
    .replace(/&nbsp;/g, " ")
    .trim();
}

export async function getVideoResolutionFromM3u8(m3u8Url: string): Promise<{
  quality: string;
  loadSpeed: string;
  pingTime: number;
}> {
  return {
    quality: "1080p",
    loadSpeed: "未知",
    pingTime: 0,
  };
}
