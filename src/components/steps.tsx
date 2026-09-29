import type { ReactNode } from "react";
import type { Reading } from "@/content/types";

export function FiveSteps({
  reading,
  intro,
}: {
  reading: Reading;
  intro: string;
}) {
  return (
    <section id="plain" className="mt-14 scroll-mt-6 bg-band px-5 py-8 sm:px-8">
      <h2 className="font-serif text-3xl text-ink">用简单的话再讲一遍</h2>
      <p className="mt-4 leading-relaxed">{intro}</p>
      <ol className="mt-8 space-y-8">
        <Step n={1} title="先理解">
          <p>{reading.understand}</p>
        </Step>
        <Step n={2} title="找出核心观点">
          <blockquote className="border-l-2 border-gold pl-4 font-serif text-2xl leading-snug text-pine">
            {reading.core}
          </blockquote>
        </Step>
        <Step n={3} title="逻辑因果链">
          <ol>
            {reading.chain.map((link, linkIndex) => (
              <li key={link.claim}>
                {link.via ? (
                  <p className="flex items-center gap-2 py-2 pl-1.5 text-sm font-semibold text-clay">
                    <span aria-hidden>↓</span>
                    {link.via}
                  </p>
                ) : null}
                <div className="flex gap-3">
                  <span className="mt-1.5 flex size-6 shrink-0 items-center justify-center rounded-full border border-clay/50 text-sm font-semibold leading-none text-clay">
                    {linkIndex + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="font-semibold text-ink">{link.claim}</p>
                    <p className="mt-1">{link.detail}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-5 border border-line px-4 py-3 text-[0.95rem]">
            <p className="font-semibold text-clay">如果这条链断了</p>
            <ul className="mt-1.5 space-y-1">
              {reading.breaks.map((line) => (
                <li key={line} className="flex gap-2">
                  <span className="mt-3 size-1 shrink-0 rounded-full bg-clay" aria-hidden />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </Step>
        <Step n={4} title="用简单语言表达">
          <p>{reading.plain}</p>
        </Step>
        <Step n={5} title="检查你是否能快速理解">
          <p>先盖住答案，用自己的话说。说得出来，这一则才算读过。</p>
          <div className="mt-4 divide-y divide-line border-y border-line">
            {reading.checks.map((check, checkIndex) => (
              <details key={check.question} className="group py-3">
                <summary className="cursor-pointer list-none font-semibold leading-relaxed [&::-webkit-details-marker]:hidden">
                  <span className="mr-2 text-clay">{checkIndex + 1}</span>
                  {check.question}
                  <span className="mt-1 block text-sm font-normal text-muted group-open:hidden">
                    我想好了，再看答案
                  </span>
                </summary>
                <p className="mt-3 leading-relaxed text-ink">{check.answer}</p>
              </details>
            ))}
          </div>
        </Step>
      </ol>
    </section>
  );
}

function Step({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <li className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-3">
      <span className="font-serif text-3xl leading-none text-clay">{n}</span>
      <div className="leading-[1.9]">
        <h3 className="font-serif text-2xl leading-snug text-ink">{title}</h3>
        <div className="mt-3">{children}</div>
      </div>
    </li>
  );
}
