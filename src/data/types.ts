/**
 * 「私藏 · Stash」公共数据模型（design.md §8）
 *
 * 所有板块共用同一个 Work 类型：公共字段必填，板块特有字段（导演 / 片长 /
 * 平台 / 时长…）全部为可选——新增板块不需要扩展类型，在数据文件里直接填、
 * 在 src/config.ts 的 SECTIONS 条目里决定哪些字段进信息栏（infoCells）。
 * 封面替换只需改 `cover` 路径；站点级配置见 src/config.ts。
 */

/** 媒体 / 权威机构评语 */
export interface PressQuote {
  source: string; // 来源名：Pitchfork / 烂番茄 / IGN / 豆瓣…
  quote: string; // 引语正文
  score?: string; // 评分，如 '8.7'、'94%'、'9/10'
  url?: string; // 原文链接（可选）
}

/** 作品（全板块通用；板块特有字段按需填可选部分） */
export interface Work {
  id: string; // 'film-01' —— 路由与 FLIP layoutId 依赖，不要随意改
  title: string; // 中文名
  titleEn: string; // 英文 / 原文名
  creator: string; // 艺术家 / 导演 / 开发商 / 作者
  year: number;
  genres: string[]; // 2-3 个标签
  cover: string; // 'assets/cover-film-01.png' —— 替换封面改这里（相对路径，见 AGENTS.md 子路径约定）
  palette: string; // 封面主色 hex，用于卡片光晕与详情页光斑
  press: PressQuote[]; // 2-3 条媒体评语
  myRating: number; // 个人评分 0-10
  description: string; // 简短简介（一两句话）
  lines: { text: string; speaker?: string }[]; // 名台词展示

  // ── 以下为板块特有可选字段，用到的板块才填 ──
  director?: string; // 影视：导演
  runtime?: string; // 影视：'118 分钟' / '全 11 集'
  type?: "电影" | "剧集" | "纪录片"; // 影视：作品类型
  platforms?: string[]; // 游戏：['Switch', 'PC'] —— 显示名与图标见 src/config.ts PLATFORM_TAGS
  hoursPlayed?: number; // 游戏：游玩时长（小时）
}

/**
 * 板块扩展字段（与 works 按 id 关联）。具体字段由各板块数据文件自定义
 * （只要值是 string / number），例如 games.ts 的 GameExtra（通关状态 / 成就）。
 * 是否展示、如何展示由 config.ts 该板块的 infoCells 决定。
 */
export type WorkExtra = Record<string, string | number | undefined>;
