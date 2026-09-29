import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EntryView } from "@/components/entry-view";
import { ReadingShell } from "@/components/reading-shell";
import { entries, entrySlug, findEntry } from "@/content/book";

export const dynamicParams = false;

export function generateStaticParams() {
  return entries.map((entry) => ({ slug: entrySlug(entry.n) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = findEntry(slug);
  if (!entry) {
    return { title: "没有这一则" };
  }
  return {
    title: entry.title,
    description: entry.core,
  };
}

export default async function EntryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = findEntry(slug);
  if (!entry) {
    notFound();
  }
  return (
    <ReadingShell current={entry.n}>
      <EntryView entry={entry} />
    </ReadingShell>
  );
}
