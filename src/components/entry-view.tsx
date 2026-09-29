import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { locate, type Entry } from "@/content/book";
import { entryHref } from "@/content/nav";
import { FiveSteps } from "@/components/steps";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function EntryView({ entry }: { entry: Entry }) {
  const { index, total, prev, next } = locate(entry.n);

  return (
    <article id="chapter" className="mx-auto w-full max-w-3xl px-5 py-10 sm:px-8 sm:py-14">
      <p className="text-sm font-semibold text-clay">
        第 {index + 1} 则，共 {total} 则
        <span className="mx-2 text-line">/</span>
        <span className="text-muted">{entry.section}</span>
      </p>
      <h1 className="mt-3 font-serif text-4xl leading-tight text-ink sm:text-5xl">
        {entry.title}
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-muted">
        清刻本第 {entry.n} 则 · 洪应明《菜根谭》
      </p>

      <p className="mt-8 flex flex-wrap gap-4 text-sm">
        <a href="#notes" className="font-semibold text-teal underline-offset-4 hover:underline">
          注释
        </a>
        <a href="#translation" className="font-semibold text-teal underline-offset-4 hover:underline">
          译文
        </a>
        <a href="#plain" className="font-semibold text-pine underline-offset-4 hover:underline">
          五步解析
        </a>
      </p>

      <section id="original" className="mt-8 scroll-mt-6">
        <h2 className="font-serif text-3xl text-ink">原文</h2>
        <blockquote className="mt-5 border-l-2 border-pine bg-paper px-5 py-6 font-serif text-xl leading-[1.9] text-ink sm:text-2xl">
          {withNoteMarks(entry.original)}
        </blockquote>
      </section>

      <section id="notes" className="mt-10 scroll-mt-6">
        <h2 className="font-serif text-2xl text-ink">注释</h2>
        <ol className="mt-4 space-y-3 leading-[1.9]">
          {entry.notes.map((note, index) => {
            const mark = NOTE_MARK.test(note[0]) ? note[0] : "";
            return (
              <li key={index} className="grid grid-cols-[1.5rem_1fr] gap-2">
                <span className="font-semibold text-clay">{mark}</span>
                <span>{mark ? note.slice(1) : note}</span>
              </li>
            );
          })}
        </ol>
      </section>

      <section id="translation" className="mt-10 scroll-mt-6">
        <h2 className="font-serif text-2xl text-ink">译文</h2>
        <div className="mt-4 space-y-3 border-l-2 border-teal pl-4 text-lg leading-[1.9] text-ink">
          {entry.translation.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </section>

      <FiveSteps
        reading={entry}
        intro="上面是原文、注释和译文。下面按同一个意思走五步，方便你检查自己是不是真的懂了。"
      />

      <p className="mt-10 border-l-2 border-gold pl-4 font-serif text-xl leading-relaxed text-ink">
        {entry.core}
      </p>

      <nav className="mt-12 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:justify-between">
        {prev ? (
          <Link
            href={entryHref(prev.n)}
            className={cn(buttonVariants({ variant: "outline" }), "justify-start")}
          >
            <ArrowLeft />
            {prev.n}. {prev.title}
          </Link>
        ) : (
          <Link href="/" className={cn(buttonVariants({ variant: "outline" }), "justify-start")}>
            <ArrowLeft />
            回到开篇
          </Link>
        )}
        {next ? (
          <Link href={entryHref(next.n)} className={buttonVariants()}>
            {next.n}. {next.title}
            <ArrowRight />
          </Link>
        ) : null}
      </nav>

      <footer className="mt-16 text-sm leading-relaxed text-muted">
        这是一份独立导读。原文、注释、译文照录太极书馆所收清刻本《菜根谭》；五步解析是本站按「先理解、找核心、理因果链、说人话、自己检查」写的，不替代原书。
      </footer>
    </article>
  );
}

const NOTE_MARK = /([①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳])/;

function withNoteMarks(text: string) {
  return text.split(NOTE_MARK).map((part, index) =>
    NOTE_MARK.test(part) ? (
      <a key={index} href="#notes" className="align-super text-sm text-clay no-underline">
        {part}
      </a>
    ) : (
      part
    ),
  );
}
