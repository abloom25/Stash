/**
 * 板块 01 · 影视 CINEMA & SCREEN — 片单数据（按上映时间升序排列）
 *
 * 片名 / 导演 / 年份 / 海报 / 媒体与豆瓣引语 / 台词为真实信息；
 * 简介可按喜好替换。
 * 封面替换只需改 `cover` 路径（2:3）。
 */
import type { FilmWork } from "./types";

export const filmWorks: FilmWork[] = [
  {
    id: "film-01",
    title: "龙之谷：破晓奇兵",
    titleEn: "Dragon Nest: Warriors' Dawn",
    creator: "宋岳峰",
    year: 2014,
    genres: ["动画", "奇幻", "冒险"],
    cover: "/assets/cover-film-01.png", // TODO(主人): 替换为真实海报（建议 2:3，如 600×900）
    palette: "#CD8D83", // TODO(主人): 替换为海报主色 hex
    press: [
      { source: "豆瓣", quote: "良心国产动画，制作精良，布景、造型、视效都能看出创作者的用心；几乎占了半部电影的决战打斗戏份，场面调度出乎意料的好。", score: "7.8/10" }, // 豆瓣影评摘录
      { source: "豆瓣影评", quote: "莉雅并非“主角为之努力的奖品”，而更像一名陪伴士兵成长为将军的伙伴。", score: "5/5" }, // 豆瓣影评摘录
    ],
    myRating: 8, // TODO(主人): 替换为个人评分（0-10）
    description: "黑龙苏醒，少年兰伯特加入屠龙勇士团，踏上复仇与成长的征程。", // TODO(主人): 可替换为你自己的一句话简介
    lines: [
      { text: "一个真正的战士，会永远跟随自己的内心，永远知道自己为什么而战、为什么而死。", speaker: "莉娜" },
      { text: "战斗是为了和平。如果我们不清楚这一点，世界会再次陷入战争。", speaker: "莉娜" },
    ],
    director: "宋岳峰",
    runtime: "88 分钟",
    type: "电影",
  },
  {
    id: "film-02",
    title: "熊出没之雪岭熊风",
    titleEn: "Boonie Bears: Mystical Winter",
    creator: "丁亮",
    year: 2015,
    genres: ["动画", "喜剧", "家庭"],
    cover: "/assets/cover-film-02.png", // TODO(主人): 替换为真实海报
    palette: "#2E7BA6", // TODO(主人): 替换为海报主色 hex
    press: [
      { source: "豆瓣", quote: "熊出没系列的这一部雪岭熊风，凭心而论比前几部精彩不少。", score: "8.4/10" }, // 豆瓣影评摘录
      { source: "豆瓣影评", quote: "营救大白熊，明明知道会送命也还是义无反顾——讲真，看到这里我哭了。", score: "4/5" }, // 豆瓣影评摘录
    ],
    myRating: 8, // TODO(主人): 替换为个人评分（0-10）
    description: "熊二在白熊山的雪原上遇见神秘大白熊，一段关于守护、友谊与告别的冬日奇遇。", // TODO(主人): 可替换为你自己的一句话简介
    lines: [
      { text: "熊二加油！熊，就要有个熊样！", speaker: "熊大" },
    ],
    director: "丁亮",
    runtime: "96 分钟",
    type: "电影",
  },
  {
    id: "film-03",
    title: "白蛇：缘起",
    titleEn: "White Snake",
    creator: "黄家康 / 赵霁",
    year: 2019,
    genres: ["动画", "爱情", "奇幻"],
    cover: "/assets/cover-film-03.png", // TODO(主人): 替换为真实海报
    palette: "#6B808D", // TODO(主人): 替换为海报主色 hex
    press: [
      { source: "豆瓣", quote: "2019 年第一份国产电影惊喜，居然是《白蛇：缘起》。", score: "7.8/10" }, // 豆瓣网友评价（信息时报转引）
      { source: "猫眼", quote: "场面、角色塑造以及画风上都是上乘之作，故事及叙事节奏也不错。", score: "9.4/10" }, // 信息时报影评
    ],
    myRating: 9, // TODO(主人): 替换为个人评分（0-10）
    description: "晚唐乱世，白蛇小白失忆落入凡间，与捕蛇少年阿宣相识相恋——许仙与白娘子前世的故事。",
    lines: [
      { text: "无论他在世间何处，无论他是何模样，无论他还记不记得我，我都要找到他，因为我记得。", speaker: "小白" },
      { text: "人生苦多乐少，多记些美好的事儿，痛痛快快活一回。", speaker: "阿宣" },
    ],
    director: "黄家康 / 赵霁",
    runtime: "99 分钟",
    type: "电影",
  },
  {
    id: "film-04",
    title: "姜子牙",
    titleEn: "Legend of Deification",
    creator: "程腾 / 李炜",
    year: 2020,
    genres: ["动画", "奇幻", "动作"],
    cover: "/assets/cover-film-04.png", // TODO(主人): 替换为真实海报
    palette: "#9E391B", // 海报主色（火红）
    press: [
      { source: "豆瓣", quote: "观众诟病最多的是故事改编不够普世；但画面的制作精良，几乎无人否认。", score: "6.6/10" }, // 豆瓣口碑综述（新浪财经）
      { source: "猫眼", quote: "一个场景要画 600 层，一帧画面制作耗时两天，一个镜头要做三个月——堪称国产动画的“封神制作”。", score: "8.7/10" }, // 网易新闻报道
    ],
    myRating: 8.5, // TODO(主人): 替换为个人评分（0-10）
    description: "封神大战之后，姜子牙因一念之仁被贬下凡；为寻九尾真相，他再踏征途，叩问天道。",
    lines: [
      { text: "愿天下，再无不公。", speaker: "姜子牙" },
      { text: "你连鱼都放了，就不能放自己一马？", speaker: "申公豹" },
    ],
    director: "程腾 / 李炜",
    runtime: "110 分钟",
    type: "电影",
  },
  {
    id: "film-05",
    title: "深海",
    titleEn: "Deep Sea",
    creator: "田晓鹏",
    year: 2023,
    genres: ["动画", "奇幻", "剧情"],
    cover: "/assets/cover-film-05.png", // TODO(主人): 替换为真实海报
    palette: "#199ACA", // 海报主色（深海蓝）
    press: [
      { source: "豆瓣", quote: "深海真的很适合大荧幕观看，视效体验拉满。", score: "7.4/10" }, // 豆瓣短评摘录
      { source: "猫眼", quote: "顶级视觉盛宴，后半部分全是刀——观看请带足够的纸巾。", score: "9.2/10" }, // 猫眼影评摘录
    ],
    myRating: 9.5, // TODO(主人): 替换为个人评分（0-10）
    description: "少女参宿坠入绚烂而危险的深海世界，与深海大饭店船长南河相遇，展开一段关于心结与救赎的旅程。",
    lines: [
      { text: "希望你以后的每一次笑，都是真心的。", speaker: "南河" },
    ],
    director: "田晓鹏",
    runtime: "112 分钟",
    type: "电影",
  },
];
