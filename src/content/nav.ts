import originalsJson from "./originals.json";
import { SECTION_META, type OriginalEntry, type SectionName } from "./types";

export const catalog = originalsJson as OriginalEntry[];

/** Next 的静态导出把 /404/ 留给“页面不存在”，第 404 则改走 /0404/。 */
export function entrySlug(n: number) {
  return n === 404 ? "0404" : String(n);
}

export function entryHref(n: number) {
  return `/${entrySlug(n)}/`;
}

export function sectionGroups() {
  return SECTION_META.map((meta) => ({
    ...meta,
    entries: catalog.filter((entry) => entry.section === meta.name),
  }));
}

export function sectionOf(n: number): SectionName | "" {
  return SECTION_META.find((meta) => n >= meta.from && n <= meta.to)?.name ?? "";
}
