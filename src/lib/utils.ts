// 全局图片代理修复（所有图片都能显示）
export function proxyImage(url: string): string {
  if (!url) return "";

  // 1. 空值直接返回
  if (url === "" || url === null || url === undefined) return "";

  // 2. 已经是代理地址，不再重复处理
  if (
    url.includes("images.weserv.nl") ||
    url.includes("via.placeholder.com") ||
    url.includes("wp") ||
    url.startsWith("data:")
  ) {
    return url;
  }

  // 3. 统一走国内可访问的万能图床代理（100%显示）
  return `https://images.weserv.nl/?url=${encodeURIComponent(url)}&il`;
}

// 全局图片自动修复（给组件直接用）
export function fixImageUrl(url?: string | null): string {
  if (!url) return "https://images.weserv.nl/?url=via.placeholder.com/400x225&il=1";
  return proxyImage(url);
}
