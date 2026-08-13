export function h_navigation_is_active(pathname: string, href: string): boolean {
  const currentPath = normalizePath(pathname)
  const targetPath = normalizePath(href)

  return currentPath === targetPath
    || (targetPath !== '/' && currentPath.startsWith(`${targetPath}/`))
}

function normalizePath(path: string): string {
  const normalized = `/${path}`.replace(/\/{2,}/g, '/').replace(/\/$/, '')
  return normalized || '/'
}
