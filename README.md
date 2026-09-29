# 菜根谭

《菜根谭》清刻本的独立导读。在线阅读：

**https://brianbai1123.github.io/cgt/**

每一则都先放原文，再按五步讲开：先理解，找出核心观点，理清逻辑因果链，用简单的话说一遍，最后用两个问题检查能不能自己讲出来。

目录按清刻本的五部来排：修身、应酬、评议、闲适、概论，共 534 则。开篇是于孔兼的序。

原文取自清刻本。本站的解析是自己写的，不替代原书，也不照搬他人注释。

## 本地预览

```bash
npm install
npm run dev
```

打开 http://127.0.0.1:43141 。

本地模拟 GitHub Pages 子路径：

```bash
npm run build:gh
npx serve out
```

## 检查

```bash
npm test
npm run lint
npm run build
```

## 部署

推送到 `main` 后，GitHub Actions 会静态导出并发布到 Pages。仓库名需要是 `cgt`，Pages 源是 **GitHub Actions**，站点路径才是 `/cgt/`。

## 技术栈

Next.js 16（`output: 'export'`）+ React 19 + TypeScript + Tailwind CSS v4。无后端、无数据库。原文在 `src/content/originals.json`，解析在 `src/content/readings.json`。
