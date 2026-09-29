import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { entryHref } from "@/content/nav";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-full max-w-xl flex-col justify-center px-6 py-24">
      <p className="text-sm font-semibold text-clay">目录里没有这一则</p>
      <h1 className="mt-3 font-serif text-4xl text-ink">页面不存在</h1>
      <p className="mt-4 leading-relaxed text-muted">
        从开篇读起，顺着修身、应酬、评议、闲适，走到概论。
      </p>
      <p className="mt-3 leading-relaxed text-muted">
        要找第 404 则？它在{" "}
        <Link href={entryHref(404)} className="font-semibold text-clay underline-offset-4 hover:underline">
          这里
        </Link>
        。
      </p>
      <Link href="/" className={`${buttonVariants()} mt-8 w-fit`}>
        回到开篇
      </Link>
    </main>
  );
}
