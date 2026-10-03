"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { catalog, entryHref, sectionGroups, sectionOf } from "@/content/nav";
import { ThemeSwitcher } from "@/components/theme-switcher";

const groups = sectionGroups();
const NOTE_MARKS = /[①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳]/g;

export function ReadingShell({
  current,
  children,
}: {
  current: number | "start";
  children: ReactNode;
}) {
  const currentEntry = current === "start" ? undefined : catalog.find((entry) => entry.n === current);
  const label = currentEntry ? `${currentEntry.n} ${currentEntry.title}` : "开篇";

  return (
    <div className="min-h-full lg:grid lg:grid-cols-[18.5rem_minmax(0,1fr)]">
      <a
        href="#chapter"
        className="sr-only focus:not-sr-only focus:absolute focus:z-20 focus:bg-pine focus:px-4 focus:py-2 focus:text-paper"
      >
        跳到正文
      </a>
      <aside className="border-b border-line bg-paper lg:sticky lg:top-0 lg:h-svh lg:overflow-y-auto lg:border-r lg:border-b-0">
        <div className="px-5 py-6">
          <Link href="/" className="block">
            <p className="font-serif text-2xl text-pine">菜根谭</p>
            <p className="mt-1 font-kai text-sm leading-relaxed text-muted">
              先读原文，再用五步把味道嚼开
            </p>
          </Link>
          <ThemeSwitcher />
        </div>
        <details className="border-t border-line px-5 py-3 lg:hidden">
          <summary className="cursor-pointer text-sm font-semibold">目录 · {label}</summary>
          <ChapterIndex current={current} />
        </details>
        <div className="hidden px-3 pb-10 lg:block">
          <ChapterIndex current={current} />
        </div>
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

function ChapterIndex({ current }: { current: number | "start" }) {
  const [query, setQuery] = useState("");
  const keyword = query.trim();
  const hits = useMemo(() => {
    if (!keyword) return [];
    return catalog
      .filter((entry) => {
        return (
          String(entry.n) === keyword ||
          entry.title.includes(keyword) ||
          entry.original.replace(NOTE_MARKS, "").includes(keyword) ||
          entry.section.includes(keyword)
        );
      })
      .slice(0, 40);
  }, [keyword]);

  return (
    <nav aria-label="章节" className="py-4">
      <label className="mb-4 block px-2">
        <span className="sr-only">搜索则目</span>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="搜则数、标题或原文"
          className="w-full border border-line bg-background px-3 py-2 text-sm text-ink outline-none focus:border-pine"
        />
      </label>
      {keyword ? (
        <div className="px-2">
          <p className="text-xs font-semibold text-muted">
            {hits.length > 0 ? `找到 ${hits.length} 则` : "没有这一则"}
            {hits.length === 40 ? "，先显示前 40 则" : ""}
          </p>
          <ol className="mt-1">
            {hits.map((entry) => (
              <IndexLink key={entry.n} n={entry.n} title={entry.title} active={entry.n === current} />
            ))}
          </ol>
        </div>
      ) : (
        <>
          <div className="mb-5">
            <p className="px-2 text-xs font-semibold tracking-wide text-muted">读之前</p>
            <Link
              href="/"
              aria-current={current === "start" ? "page" : undefined}
              className={
                current === "start"
                  ? "mt-1 block border-l-2 border-pine bg-pine-soft px-3 py-2 text-sm font-semibold text-pine"
                  : "mt-1 block border-l-2 border-transparent px-3 py-2 text-sm text-ink hover:border-line hover:bg-band/60"
              }
            >
              开篇
            </Link>
          </div>
          {groups.map((group) => {
            const open = currentEntrySection(current) === group.name;
            return (
              <details key={group.name} open={open} className="mb-3">
                <summary className="cursor-pointer px-2 text-xs font-semibold tracking-wide text-muted">
                  {group.name}
                  <span className="ml-2 font-normal">{group.range}</span>
                </summary>
                <ol className="mt-1">
                  {group.entries.map((entry) => (
                    <IndexLink
                      key={entry.n}
                      n={entry.n}
                      title={entry.title}
                      active={entry.n === current}
                    />
                  ))}
                </ol>
              </details>
            );
          })}
        </>
      )}
    </nav>
  );
}

function currentEntrySection(current: number | "start") {
  if (current === "start") return "";
  return sectionOf(current);
}

function IndexLink({ n, title, active }: { n: number; title: string; active: boolean }) {
  return (
    <li>
      <Link
        href={entryHref(n)}
        aria-current={active ? "page" : undefined}
        className={
          active
            ? "block border-l-2 border-pine bg-pine-soft px-3 py-1.5 text-sm font-semibold text-pine"
            : "block border-l-2 border-transparent px-3 py-1.5 text-sm text-ink hover:border-line hover:bg-band/60"
        }
      >
        <span className="mr-1.5 font-num text-clay">{n}</span>
        {title}
      </Link>
    </li>
  );
}
