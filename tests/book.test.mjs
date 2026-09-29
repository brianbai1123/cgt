import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { entries, sectionGroups, SECTION_META } from "../src/content/book.ts";
import { catalog } from "../src/content/nav.ts";

test("清刻本 534 则按顺序排齐", () => {
  assert.equal(entries.length, 534);
  assert.deepEqual(
    entries.map((entry) => entry.n),
    Array.from({ length: 534 }, (_, index) => index + 1),
  );
  assert.deepEqual(
    catalog.map((entry) => entry.n),
    entries.map((entry) => entry.n),
  );
});

test("五部的范围和则数与目录一致", () => {
  assert.deepEqual(
    sectionGroups().map((group) => [group.name, group.entries.length, group.from, group.to]),
    [
      ["修身", 30, 1, 30],
      ["应酬", 51, 31, 81],
      ["评议", 49, 82, 130],
      ["闲适", 46, 131, 176],
      ["概论", 358, 177, 534],
    ],
  );
  assert.equal(
    SECTION_META.reduce((sum, section) => sum + (section.to - section.from + 1), 0),
    534,
  );
});

function assertChain(chain, breaks, label) {
  assert.ok(chain.length >= 6, label);
  assert.equal(chain[0].via, undefined, label);
  for (const link of chain.slice(1)) {
    assert.ok(link.via, `${label} ${link.claim}`);
    assert.ok(!link.claim.startsWith(link.via), `${label} repeats via: ${link.claim}`);
  }
  for (const link of chain) assert.ok(link.detail.length >= 20, `${label} ${link.claim}`);
  assert.ok(chain.at(-1).claim.startsWith("结果："), label);
  assert.ok(breaks.length >= 2, label);
}

test("总览的五步同样用逻辑因果链", async () => {
  const { overviewPlain } = await import("../src/content/overview.ts");
  assert.equal(overviewPlain.logic, undefined);
  assertChain(overviewPlain.chain, overviewPlain.breaks, "overview");
});

test("每一则先有原文，再有完整的五步", () => {
  const cores = new Set();
  for (const entry of entries) {
    assert.ok(entry.title.length >= 4, String(entry.n));
    assert.ok(entry.original.length >= 8, String(entry.n));
    assert.ok(entry.understand.length > 24, String(entry.n));
    assert.equal(entry.core.split("。").length, 2, `${entry.n} ${entry.core}`);
    assert.ok(entry.core.endsWith("。"), entry.core);
    assert.equal(entry.logic, undefined, String(entry.n));
    assertChain(entry.chain, entry.breaks, String(entry.n));
    assert.ok(entry.plain.length > 60, String(entry.n));
    assert.equal(entry.checks.length, 2, String(entry.n));
    for (const check of entry.checks) {
      assert.ok(check.question.endsWith("？"), check.question);
      assert.ok(check.answer.length > 20, check.question);
    }
    assert.ok(!cores.has(entry.core), entry.core);
    cores.add(entry.core);
  }
});

test("每一则都带注释和译文，评语不混进译文", () => {
  for (const entry of entries) {
    assert.ok(entry.notes.length >= 1, String(entry.n));
    assert.ok(entry.translation.length >= 1, String(entry.n));
    for (const paragraph of entry.translation) {
      assert.ok(paragraph.length >= 8, `${entry.n} ${paragraph}`);
      assert.ok(!/【(评|抨)语】|【注/.test(paragraph), `${entry.n} ${paragraph}`);
    }
    for (const note of entry.notes) {
      assert.ok(note.length >= 4, `${entry.n} ${note}`);
    }
  }
  assert.equal(entries[237].notes.filter((note) => /^[①②③④]/.test(note)).length, 4);
});

test("浏览器端目录不带注释和译文", () => {
  assert.ok(catalog.every((entry) => !("notes" in entry) && !("translation" in entry)));
});

test("页面依次放原文、注释、译文，再按五步解析", () => {
  const entry = readFileSync(new URL("../src/components/entry-view.tsx", import.meta.url), "utf8");
  const order = ['id="original"', 'id="notes"', 'id="translation"', "<FiveSteps"].map((mark) =>
    entry.indexOf(mark),
  );
  assert.ok(order[0] > 0, "original");
  assert.deepEqual([...order].sort((a, b) => a - b), order);

  const steps = readFileSync(new URL("../src/components/steps.tsx", import.meta.url), "utf8");
  const labels = ["先理解", "找出核心观点", "逻辑因果链", "用简单语言表达", "检查你是否能快速理解"];
  let cursor = 0;
  for (const label of labels) {
    const at = steps.indexOf(label, cursor);
    assert.ok(at > cursor, label);
    cursor = at;
  }
});
