/* eslint-disable @typescript-eslint/no-explicit-any,no-console */

import Hls from 'hls.js';

export function getImageProxyUrl(): string | null {
  return null;
}

export function processImageUrl(originalUrl: string): string {
  if (!originalUrl) return '';

  // 直接原样返回，不做任何处理
  return originalUrl;
}

export function getDoubanProxyUrl(): string | null {
  return null;
}

export function processDoubanUrl(originalUrl: string): string {
  return originalUrl;
}

export function cleanHtmlTags(text: string): string {
  if (!text) return '';
  return text
    .replace(/<[^>]+>/g, '\n')
    .replace(/\n+/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/^\n+|\n+$/g, '')
    .replace(/&nbsp;/g, ' ')
    .trim();
}

export async function getVideoResolutionFromM3u8(m3u8Url: string): Promise<{
  quality: string;
  loadSpeed: string;
  pingTime: number;
}> {
  try {
    return new Promise((resolve) => {
      resolve({
        quality: '未知',
        loadSpeed: '未知',
        pingTime: 0,
      });
    });
  } catch (error) {
    throw new Error('error');
  }
}
