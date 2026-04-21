// src/utils/proxy.ts
export function proxyImg(url: string): string {
  if (!url) return '';

  // 替换成你自己的 Worker 地址
  const workerPrefix = 'https://douban-img-proxy.yl21yl.workers.dev';

  // 处理豆瓣图片地址
  if (url.includes('doubanio.com')) {
    return `${workerPrefix}/?url=${encodeURIComponent(url)}`;
  }

  // 相对路径的情况（只有 /xxx.jpg 没有域名）
  if (url.startsWith('/')) {
    return `${workerPrefix}/?url=${encodeURIComponent('https://img9.doubanio.com' + url)}`;
  }

  // 非豆瓣图片直接返回
  return url;
}