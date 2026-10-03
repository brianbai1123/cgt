import type { Metadata } from "next";
import { Cormorant_Garamond, Noto_Sans_SC, Noto_Serif_SC } from "next/font/google";
import { THEME_BOOTSTRAP_SCRIPT } from "@/lib/theme";
import "lxgw-wenkai-screen-web/lxgwwenkaiscreen/result.css";
import "./globals.css";

const sans = Noto_Sans_SC({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  preload: false,
});

const serif = Noto_Serif_SC({
  weight: ["600", "700", "900"],
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  preload: false,
});

const numerals = Cormorant_Garamond({
  weight: ["500", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-numerals",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "菜根谭",
    template: "%s · 菜根谭",
  },
  description:
    "按《菜根谭》清刻本的顺序，每一则先读原文，再用五步把意思讲成能记住的话。",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="zh-CN"
      className={`${sans.variable} ${serif.variable} ${numerals.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP_SCRIPT }} />
      </head>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
