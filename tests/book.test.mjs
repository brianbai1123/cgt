import assert from "node:assert/strict";
import test from "node:test";
import { existsSync, readFileSync } from "node:fs";
import vm from "node:vm";
import { entries, findEntry, sectionGroups, SECTION_META } from "../src/content/book.ts";
import { catalog, entryHref, entrySlug } from "../src/content/nav.ts";

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

test("第 404 则避开 Next 保留的 /404/，其余地址不变", () => {
  assert.equal(entryHref(404), "/0404/");
  assert.equal(entryHref(403), "/403/");
  assert.ok(entries.every((entry) => entryHref(entry.n) !== "/404/"));
  assert.equal(findEntry(entrySlug(404))?.n, 404);
  const page = readFileSync(new URL("../src/app/[slug]/page.tsx", import.meta.url), "utf8");
  assert.ok(page.includes("slug: entrySlug(entry.n)"));
  const notFound = readFileSync(new URL("../src/app/not-found.tsx", import.meta.url), "utf8");
  assert.ok(notFound.includes("entryHref(404)"));
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

test("主题解析遵循 URL、storage、paper 的优先级", async () => {
  const themeUrl = new URL("../src/lib/theme.ts", import.meta.url);
  assert.ok(existsSync(themeUrl), "主题模块尚未创建");
  const { resolveTheme, THEMES } = await import(themeUrl);

  assert.deepEqual(THEMES.map(({ id }) => id), ["paper", "celadon", "night"]);
  assert.equal(resolveTheme("night", "celadon"), "night");
  assert.equal(resolveTheme(null, "celadon"), "celadon");
  assert.equal(resolveTheme("sepia", "celadon"), "celadon");
  assert.equal(resolveTheme("sepia", "sepia"), "paper");
});

test("首屏主题脚本使用独立键并安全处理 storage", async () => {
  const themeUrl = new URL("../src/lib/theme.ts", import.meta.url);
  assert.ok(existsSync(themeUrl), "主题模块尚未创建");
  const { THEME_BOOTSTRAP_SCRIPT, THEME_KEY } = await import(themeUrl);

  assert.equal(THEME_KEY, "cgt:theme");
  assert.deepEqual(
    [...new Set(THEME_BOOTSTRAP_SCRIPT.match(/[a-z0-9]+:theme/g))],
    ["cgt:theme"],
  );

  function runBootstrap({ search = "", stored = null, throws = false }) {
    const writes = [];
    const attributes = {};
    const context = {
      location: { search },
      URLSearchParams,
      localStorage: {
        getItem() {
          if (throws) throw new Error("storage unavailable");
          return stored;
        },
        setItem(key, value) {
          if (throws) throw new Error("storage unavailable");
          writes.push([key, value]);
        },
      },
      document: {
        documentElement: {
          setAttribute(key, value) {
            attributes[key] = value;
          },
          removeAttribute(key) {
            delete attributes[key];
          },
        },
      },
    };
    vm.runInNewContext(THEME_BOOTSTRAP_SCRIPT, context);
    return { attributes, writes };
  }

  assert.deepEqual(runBootstrap({ search: "?theme=night", stored: "celadon" }), {
    attributes: { "data-theme": "night" },
    writes: [["cgt:theme", "night"]],
  });
  assert.deepEqual(runBootstrap({ search: "?theme=invalid", stored: "celadon" }).attributes, {
    "data-theme": "celadon",
  });
  assert.deepEqual(runBootstrap({ search: "?theme=night", throws: true }), {
    attributes: { "data-theme": "night" },
    writes: [],
  });
});

test("布局、主题、字体和切换器遵循统一契约", async () => {
  const layout = readFileSync(new URL("../src/app/layout.tsx", import.meta.url), "utf8");
  const css = readFileSync(new URL("../src/app/globals.css", import.meta.url), "utf8");
  const themeSource = readFileSync(new URL("../src/lib/theme.ts", import.meta.url), "utf8");
  const switcherUrl = new URL("../src/components/theme-switcher.tsx", import.meta.url);
  assert.ok(existsSync(switcherUrl), "主题切换器尚未创建");
  const switcher = readFileSync(switcherUrl, "utf8");
  const shell = readFileSync(new URL("../src/components/reading-shell.tsx", import.meta.url), "utf8");

  assert.ok(layout.includes("THEME_BOOTSTRAP_SCRIPT"));
  assert.ok(layout.includes("suppressHydrationWarning"));
  const headStart = layout.indexOf("<head>");
  const bootstrapScript = layout.indexOf("<script", headStart);
  const headEnd = layout.indexOf("</head>", bootstrapScript);
  const bodyStart = layout.indexOf("<body", headEnd);
  assert.ok(headStart >= 0, "layout 必须显式包含 head");
  assert.ok(bootstrapScript > headStart, "bootstrap script 必须位于 head 内");
  assert.ok(headEnd > bootstrapScript, "bootstrap script 必须在 head 结束前");
  assert.ok(bodyStart > headEnd, "head 与 bootstrap script 必须位于 body 前");

  assert.ok(layout.includes("Cormorant_Garamond"));
  assert.ok(layout.includes("lxgw-wenkai-screen-web/lxgwwenkaiscreen/result.css"));
  for (const font of ["--font-sans", "--font-serif", "--font-numerals", "font-kai"]) {
    assert.ok(`${layout}\n${css}`.includes(font), font);
  }

  function declarations(selector) {
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const match = css.match(new RegExp(`${escaped}\\s*\\{([^}]*)\\}`));
    assert.ok(match, `缺少 ${selector}`);
    return Object.fromEntries(
      [...match[1].matchAll(/(--[\w-]+|color-scheme):\s*([^;]+);/g)].map(
        ([, property, value]) => [property, value.trim()],
      ),
    );
  }

  assert.deepEqual(declarations(":root"), {
    "--background": "#f3efe6",
    "--foreground": "#1c1916",
    "--pine": "#1c3d36",
    "--pine-soft": "#e5f0eb",
    "--clay": "#8a4b32",
    "--gold": "#b8872f",
    "--teal": "#1d4a5c",
    "--band": "#efe4d2",
    "--line": "#e0d5c4",
    "--muted": "#5c554c",
    "--paper": "#f7f3eb",
    "--ink": "#1c1916",
    "--mint": "#8fc7b0",
    "--on-pine": "#f7f3eb",
    "--selection": "#d7ebe3",
    "color-scheme": "light",
  });
  assert.deepEqual(declarations(':root[data-theme="celadon"]'), {
    "--background": "#e5ede9",
    "--foreground": "#16201d",
    "--pine": "#1d4a5c",
    "--pine-soft": "#dcebf0",
    "--clay": "#9c5236",
    "--gold": "#96722f",
    "--teal": "#1d4a5c",
    "--band": "#d6e4de",
    "--line": "#c3d4cc",
    "--muted": "#4c5b55",
    "--paper": "#f1f6f3",
    "--ink": "#14201c",
    "--mint": "#82b7a2",
    "--on-pine": "#f1f6f3",
    "--selection": "#c7dfe8",
    "color-scheme": "light",
  });
  assert.deepEqual(declarations(':root[data-theme="night"]'), {
    "--background": "#161412",
    "--foreground": "#e9e2d5",
    "--pine": "#8fc7b0",
    "--pine-soft": "#1f2e29",
    "--clay": "#e0a07c",
    "--gold": "#d7b66c",
    "--teal": "#91c6d8",
    "--band": "#2a251f",
    "--line": "#38322a",
    "--muted": "#a69d90",
    "--paper": "#1f1c18",
    "--ink": "#efe8db",
    "--mint": "#8fc7b0",
    "--on-pine": "#13201c",
    "--selection": "#2f4a40",
    "color-scheme": "dark",
  });

  for (const theme of ['id: "paper"', 'id: "celadon"', 'id: "night"']) {
    assert.ok(themeSource.includes(theme), theme);
  }
  assert.ok(switcher.includes('role="radio"'));
  assert.ok(switcher.includes("aria-checked={theme === option.id}"));
  assert.ok(switcher.includes("cgt-theme-change"));
  assert.ok(shell.includes("<ThemeSwitcher />"));

  const { ThemeSwitcher } = await import(switcherUrl);
  const { createElement } = await import("react");
  const { renderToStaticMarkup } = await import("react-dom/server");
  const rendered = renderToStaticMarkup(createElement(ThemeSwitcher));
  assert.equal((rendered.match(/role="radio"/g) ?? []).length, 3);
  assert.equal((rendered.match(/aria-checked="true"/g) ?? []).length, 1);
  assert.equal((rendered.match(/aria-checked="false"/g) ?? []).length, 2);
  for (const label of ["宣纸", "青瓷", "夜读"]) assert.ok(rendered.includes(label), label);
});
