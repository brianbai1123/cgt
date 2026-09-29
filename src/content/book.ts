import annotationsJson from "./annotations.json";
import readingsJson from "./readings.json";
import { catalog } from "./nav";
import {
  SECTION_META,
  type Annotation,
  type Entry,
  type Reading,
  type SectionName,
} from "./types";

export type { Entry, SectionName } from "./types";
export { SECTION_META, SECTIONS } from "./types";
export { entryHref } from "./nav";

const originals = catalog;
const readings = readingsJson as Record<string, Reading>;
const annotations = annotationsJson as Record<string, Annotation>;

export const entries: Entry[] = originals.map((item) => {
  const reading = readings[String(item.n)];
  const annotation = annotations[String(item.n)];
  if (!reading) {
    throw new Error(`缺少第 ${item.n} 则解析`);
  }
  if (!annotation) {
    throw new Error(`缺少第 ${item.n} 则注释与译文`);
  }
  return { ...item, ...annotation, ...reading };
});

export function findEntry(slug: string) {
  const n = Number(slug);
  if (!Number.isInteger(n)) return undefined;
  return entries.find((entry) => entry.n === n);
}

export function locate(n: number) {
  const index = entries.findIndex((entry) => entry.n === n);
  return {
    index,
    total: entries.length,
    prev: index > 0 ? entries[index - 1] : undefined,
    next: index >= 0 && index < entries.length - 1 ? entries[index + 1] : undefined,
  };
}

export function entriesIn(section: SectionName) {
  return entries.filter((entry) => entry.section === section);
}

export function sectionGroups() {
  return SECTION_META.map((meta) => ({
    ...meta,
    entries: entriesIn(meta.name),
  }));
}
