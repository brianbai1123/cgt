export const SECTIONS = ["修身", "应酬", "评议", "闲适", "概论"] as const;

export type SectionName = (typeof SECTIONS)[number];

export type OriginalEntry = {
  n: number;
  section: SectionName;
  title: string;
  original: string;
};

export type Annotation = {
  notes: string[];
  translation: string[];
};

export type Check = {
  question: string;
  answer: string;
};

export type ChainLink = {
  via?: string;
  claim: string;
  detail: string;
};

export type Reading = {
  understand: string;
  core: string;
  chain: ChainLink[];
  breaks: string[];
  plain: string;
  checks: Check[];
};

export type Entry = OriginalEntry & Annotation & Reading;

export type SectionMeta = {
  name: SectionName;
  range: string;
  from: number;
  to: number;
  blurb: string;
};

export const SECTION_META: SectionMeta[] = [
  {
    name: "修身",
    range: "1–30",
    from: 1,
    to: 30,
    blurb: "先把自己炼干净。念头、欲望和过失，都从自己身上查起。",
  },
  {
    name: "应酬",
    range: "31–81",
    from: 31,
    to: 81,
    blurb: "人要来往。软硬、亲疏、担当和抽身，都得有分寸。",
  },
  {
    name: "评议",
    range: "82–130",
    from: 82,
    to: 130,
    blurb: "把世事放远了看。荣辱、福祸、真假，别被眼前一截骗了。",
  },
  {
    name: "闲适",
    range: "131–176",
    from: 131,
    to: 176,
    blurb: "心要有个能歇的地方。淡和闲不是逃避，是让人还能继续走。",
  },
  {
    name: "概论",
    range: "177–534",
    from: 177,
    to: 534,
    blurb: "把道理收成日常能用的句子。处世、居家、读书、进退，都在这里。",
  },
];
