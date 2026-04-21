/* eslint-disable @typescript-eslint/no-explicit-any,no-console */

import Hls from 'hls.js';

export function getImageProxyUrl(): string | null {
  if (typeof window === 'undefined') return null;
  const enableImageProxy = localStorage.getItem('enableImageProxy');
  if (enableImageProxy !== null) {
    if (!JSON.parse(enableImageProxy) as boolean) {
      return null;
    }
  }
  const localImageProxy = localStorage.getItem('imageProxyUrl');
  if (localImageProxy != null) {
    return localImageProxy.trim() || null;
  }
  const serverImageProxy = (window as any).RUNTIME_CONFIG?.IMAGE_PROXY;
  return serverImageProxy?.trim() || null;
}

// 核心：豆瓣图片强制走公共代理，必出图
export function processImageUrl(originalUrl: string): string {
  if (!originalUrl) return '';

  // 豆瓣图片强制走稳定公共代理
  if (originalUrl.includes('doubanio.com')) {
    const url = encodeURIComponent(originalUrl);
    return `https://i3.wp.com/${originalUrl.replace(/^https?:\/\//, '')}`;
  }

  const proxyUrl = getImageProxyUrl();
  if (!proxyUrl) return originalUrl;
  return `${proxyUrl}${encodeURIComponent(originalUrl)}`;
}

export function getDoubanProxyUrl(): string | null {
  if (typeof window === 'undefined') return null;
  const enableDoubanProxy = localStorage.getItem('enableDoubanProxy');
  if (enableDoubanProxy !== null) {
    if (!JSON.parse(enableDoubanProxy) as boolean) {
      return null;
    }
  }
  const localDoubanProxy = localStorage.getItem('doubanProxyUrl');
  if (localDoubanProxy != null) {
    return localDoubanProxy.trim() || null;
  }
  const serverDoubanProxy = (window as any).RUNTIME_CONFIG?.DOUBAN_PROXY;
  return serverDoubanProxy?.trim() || null;
}

export function processDoubanUrl(originalUrl: string): string {
  if (!originalUrl) return originalUrl;
  const proxyUrl = getDoubanProxyUrl();
  if (!proxyUrl) return originalUrl;
  return `${proxyUrl}${encodeURIComponent(originalUrl)}`;
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
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.muted = true;
      video.preload = 'metadata';
      const pingStart = performance.now();
      let pingTime = 0;
      fetch(m3u8Url, { method: 'HEAD', mode: 'no-cors' })
        .then(() => { pingTime = performance.now() - pingStart; })
        .catch(() => { pingTime = performance.now() - pingStart; });

      const hls = new Hls();
      const timeout = setTimeout(() => {
        hls.destroy();
        video.remove();
        reject(new Error('Timeout loading video metadata'));
      }, 4000);

      video.onerror = () => {
        clearTimeout(timeout);
        hls.destroy();
        video.remove();
        reject(new Error('Failed to load video metadata'));
      };

      let actualLoadSpeed = '未知';
      let hasSpeedCalculated = false;
      let hasMetadataLoaded = false;
      let fragmentStartTime = 0;

      const checkAndResolve = () => {
        if (hasMetadataLoaded) {
          clearTimeout(timeout);
          const w = video.videoWidth;
          const quality = w >= 3840 ? '4K' : w >= 2560 ? '2K' : w >= 1920 ? '1080p' : w >= 1280 ? '720p' : w >= 854 ? '480p' : 'SD';
          hls.destroy();
          video.remove();
          resolve({ quality, loadSpeed: actualLoadSpeed, pingTime: Math.round(pingTime) });
        }
      };

      hls.on(Hls.Events.FRAG_LOADING, () => { fragmentStartTime = performance.now(); });
      hls.on(Hls.Events.FRAG_LOADED, (_, data) => {
        if (fragmentStartTime > 0 && data?.payload && !hasSpeedCalculated) {
          const loadTime = performance.now() - fragmentStartTime;
          const size = data.payload.byteLength || 0;
          const speedKBps = size / 1024 / (loadTime / 1000);
          actualLoadSpeed = speedKBps >= 1024 ? `${(speedKBps / 1024).toFixed(1)} MB/s` : `${speedKBps.toFixed(1)} KB/s`;
          hasSpeedCalculated = true;
          checkAndResolve();
        }
      });

      hls.loadSource(m3u8Url);
      hls.attachMedia(video);
      hls.on(Hls.Events.ERROR, (_, data) => {
        console.error('HLS错误:', data);
        if (data.fatal) {
          clearTimeout(timeout);
          hls.destroy();
          video.remove();
          reject(new Error(`HLS播放失败: ${data.type}`));
        }
      });

      video.onloadedmetadata = () => {
        hasMetadataLoaded = true;
        checkAndResolve();
      };
    });
  } catch (error) {
    throw new Error(`Error getting video resolution: ${error instanceof Error ? error.message : String(error)}`);
  }
}
