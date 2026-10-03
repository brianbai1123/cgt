import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SECTION_META } from "@/content/book";
import { entryHref } from "@/content/nav";
import { overviewPlain, preface } from "@/content/overview";
import { FiveSteps } from "@/components/steps";
import { buttonVariants } from "@/components/ui/button";

export function OverviewView() {
  return (
    <article id="chapter" className="mx-auto w-full max-w-3xl px-5 py-10 sm:px-8 sm:py-14">
      <p className="text-sm font-semibold text-clay">
        开篇
        <span className="mx-2 text-line">/</span>
        <span className="text-muted">
          清刻本 · <span className="font-num">534</span> 则
        </span>
      </p>
      <h1 className="mt-3 font-serif text-4xl leading-tight text-ink sm:text-5xl">
        菜根里有真味
      </h1>
      <p className="mt-4 font-kai text-sm leading-relaxed text-muted">
        先读于孔兼的序，再按清刻本的五部，一则一则往下走
      </p>
      <p className="mt-6 font-kai text-lg leading-relaxed text-ink">
        洪应明把人生的分寸写成短句。于孔兼说，这些句子从清苦里来，也从自己栽培里来。本站每一则都先摆原文，再用五步把它嚼开：先理解，找出核心观点，理清逻辑因果链，用简单的话说一遍，最后留问题让你自己讲。
      </p>

      <p className="mt-8 flex flex-wrap gap-4 text-sm">
        <a href="#original" className="font-semibold text-pine underline-offset-4 hover:underline">
          先看序文
        </a>
        <a href="#map" className="font-semibold text-teal underline-offset-4 hover:underline">
          五部怎么排
        </a>
        <a href="#plain" className="font-semibold text-clay underline-offset-4 hover:underline">
          五步讲明白
        </a>
      </p>

      <section id="original" className="mt-12 scroll-mt-6">
        <h2 className="font-serif text-3xl text-ink">原文</h2>
        <p className="mt-4 font-kai text-sm leading-relaxed text-muted">
          于孔兼《菜根谭题词》。现代校注里的夹注已去掉，句子按序文本身来读。
        </p>
        <blockquote className="mt-5 border-l-2 border-pine bg-paper px-5 py-6 font-kai text-lg leading-[1.95] text-ink">
          {preface}
          <footer className="mt-4 text-base text-muted">三峰主人于孔兼题</footer>
        </blockquote>
      </section>

      <section id="map" className="mt-12 scroll-mt-6">
        <h2 className="font-serif text-3xl text-ink">清刻本分成五部</h2>
        <p className="mt-4 leading-relaxed">
          目录按太极书馆所录清刻本：修身、应酬、评议、闲适、概论，一共 534 则。先修自己，再进入人事，把眼光放远，给日子留白，最后收成可以天天对照的句子。
        </p>
        <ol className="mt-6 space-y-3">
          {SECTION_META.map((section, index) => (
            <li key={section.name}>
              <Link
                href={entryHref(section.from)}
                className="grid gap-1 border border-line bg-paper px-4 py-4 transition-colors hover:border-pine sm:grid-cols-[7rem_1fr_auto] sm:items-center"
              >
                <span className="font-serif text-xl text-pine">
                  <span className="mr-2 font-num text-clay">{index + 1}</span>
                  {section.name}
                </span>
                <span className="text-sm leading-relaxed text-muted">
                  第 <span className="font-num">{section.range}</span> 则 · {section.blurb}
                </span>
                <span className="text-sm font-semibold text-teal">
                  从第 <span className="font-num">{section.from}</span> 则读起
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <FiveSteps
        reading={overviewPlain}
        intro="上面是序，也是这五部的地图。下面按同一个意思走五步。"
      />

      <p className="mt-10 border-l-2 border-gold pl-4 font-serif text-xl leading-relaxed text-ink">
        {overviewPlain.core}
      </p>

      <div className="mt-12">
        <Link href={entryHref(1)} className={buttonVariants()}>
          从第 <span className="font-num">1</span> 则读起
          <ArrowRight />
        </Link>
      </div>

      <footer className="mt-16 font-kai text-sm leading-relaxed text-muted">
        这是一份独立导读。原文取自明人洪应明《菜根谭》的清刻本，在线对照
        太极书馆目录。解析是本站自己写的，不替代原书。
      </footer>
    </article>
  );
}
