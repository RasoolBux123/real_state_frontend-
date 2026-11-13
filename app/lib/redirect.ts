export function safeRedirect(path: string | null) {
  if (!path || !path.startsWith("/") || path.startsWith("//")) return "/";
  if (path.startsWith("/login") || path.startsWith("/register")) return "/";
  return path;
}

// 1) URL ka ?redirect=  2) warna is tab ka pichla page  3) warna home
export function getReturnTo(param: string | null) {
  if (param) return safeRedirect(param);
  try {
    return safeRedirect(sessionStorage.getItem("lastPage"));
  } catch {
    return "/";
  }
}