import type { Metadata } from "next";
import { OverviewView } from "@/components/overview-view";
import { ReadingShell } from "@/components/reading-shell";

export const metadata: Metadata = {
  title: "菜根里有真味",
  description:
    "《菜根谭》清刻本导读。每一则先放原文，再按先理解、核心观点、逻辑因果链、简单表达、自我检查五步讲明白。",
};

export default function HomePage() {
  return (
    <ReadingShell current="start">
      <OverviewView />
    </ReadingShell>
  );
}
