export function isActive(item, pathname) {
  if (!item.href) return false;

  if (item.href === "/" || item.href === "/admin")
    return pathname === item.href;

  return pathname.startsWith(item.href);
}
