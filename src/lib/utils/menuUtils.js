import { menuStructure } from '@/lib/constants/menuStructure';

/**
 * 현재 경로에 맞는 브레드크럼 항목 반환
 * @param {string} pathname - usePathname() 값
 * @returns {{ name: string, url: string, isHome?: boolean }[]}
 */
export function getBreadcrumb(pathname) {
  const home = menuStructure.find((m) => m.id === 'home');
  const items = [{ name: home.name, url: home.url, isHome: true }];

  if (!pathname || pathname === '/') return items;

  const segments = pathname.split('/').filter(Boolean);
  let currentParent = null;

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];

    if (i === 0) {
      const found = menuStructure.find((m) => m.id === seg);
      if (!found) break;

      if (found.depth2) {
        items.push({ name: found.name, url: found.url });
        currentParent = found;
      } else {
        items.push({ name: found.name, url: found.url });
        break;
      }
    } else if (currentParent?.depth2) {
      const found = currentParent.depth2.find((d) => d.id === seg);
      if (found) {
        items.push({ name: found.name, url: found.url });
      }
      break;
    }
  }

  return items;
}
