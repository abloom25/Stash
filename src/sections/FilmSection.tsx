/**
 * 板块 02 · 影视 CINEMA & SCREEN — 海报墙（画廊墙简版）
 *
 * <section id="film">：SectionHeader（02 — FILM）+ 6 张裸海报卡（2:3）。
 * 主人反馈：去掉装裱白边 / 挂画钉 / 短评遮罩 / 评分圆环 / 高光扫过——
 * 海报直接陈列（2:3 裸海报 + 圆角 + 柔和静影），下方仅有片名与导演 · 年份。
 *
 * FLIP：海报 <motion.img> 使用 layoutId={`cover-${work.id}`} + FLIP_SPRING，
 * 与 FilmDetail 详情海报配对（§6.1）。prefers-reduced-motion：不加 layoutId，退化为淡入。
 * hover（安静版）：整卡 translateY(-4px) + 海报 scale(1.03) + 柔和阴影略加深。
 * 点击 → useNavigate() 至 `/film/${work.id}`。
 */
import { useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import type { Variants } from "framer-motion";
import type { FilmWork } from "@/data/types";
import { SECTIONS } from "@/data/types";
import { filmWorks } from "@/data/films";
import SectionHeader from "@/components/SectionHeader";
import { FLIP_SPRING } from "@/lib/motion";

const META = SECTIONS.find((s) => s.id === "film")!;
const ACCENT = META.accent; // #E07A54 暖珊瑚

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

/** 网格入场：stagger 0.08s、上移 40px、scale 0.96→1（design.md §6，trigger ≈ top 75%） */
const gridVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: EASE } },
};

/** <PosterCard> — 裸海报卡（陈列目录版：图内底部渐变遮罩 + 编号 + 片名） */
function PosterCard({ work, no }: { work: FilmWork; no: number }) {
  const navigate = useNavigate();
  const reduce = useReducedMotion();

  const open = () => navigate(`/film/${work.id}`);

  return (
    <motion.article
      role="link"
      tabIndex={0}
      aria-label={`查看《${work.title}》详情`}
      onClick={open}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open();
        }
      }}
      whileTap={{ scale: 0.98 }}
      // 400ms 任意值时长与 tailwindcss-animate 的 duration 工具冲突（有歧义不会生成 CSS），改用内联 transitionDuration 保持规格
      style={{ transitionDuration: "400ms" }}
      className="group cursor-pointer rounded-cover transition-transform ease-out hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
    >
      {/* 裸海报（2:3，FLIP 源元素=整个封面容器：圆角与阴影随容器一起飞行，更像卡片被"拿起"） */}
      <motion.div
        layoutId={reduce ? undefined : `cover-${work.id}`}
        transition={FLIP_SPRING}
        style={{ transitionDuration: "400ms" }}
        className="relative aspect-[2/3] overflow-hidden rounded-cover shadow-[0_12px_32px_rgba(35,32,43,0.10)] transition-shadow ease-out group-hover:shadow-[0_20px_48px_rgba(35,32,43,0.16)]"
      >
        <img
          src={work.cover}
          alt={`《${work.title}》海报`}
          loading="lazy"
          draggable={false}
          style={{ transitionDuration: "400ms" }}
          className="h-full w-full object-cover transition-transform ease-out group-hover:scale-[1.03]"
        />
        {/* 底部渐变遮罩 + 陈列编号 + 片名 / 导演 · 年份（叠在图内） */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent px-5 pb-5 pt-16 transition-colors duration-500 group-hover:from-black/80">
          <p className="mb-1.5 font-serif text-[0.68rem] font-medium tracking-[0.3em] text-white/60">
            NO.{String(no).padStart(2, "0")}
          </p>
          <h3 className="font-serif text-[1.15rem] font-bold leading-snug text-white">{work.title}</h3>
          <p className="mt-1 text-[0.8rem] font-medium text-white/75">
            {work.director} · {work.year}
          </p>
        </div>
      </motion.div>
    </motion.article>
  );
}

export default function FilmSection() {
  return (
    <section id="film" className="relative z-10 scroll-mt-16 py-32">
      <div className="mx-auto max-w-[1280px] px-[clamp(20px,5vw,64px)]">
        <SectionHeader
          index="01"
          eyebrow="FILM & TV · CINEMA & SCREEN"
          title="不愿散场的光影"
          note="灯暗下来的那两个小时，是我和世界签署的停战协议。五部片子，按上映年份排成一列——也是一条国漫的时间轴。"
          accent={ACCENT}
        />

        {/* 2:3 海报陈列墙：桌面 5 列（整墙展示）/ 平板 2 列 / 手机 1 列 */}
        <motion.div
          variants={gridVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-25% 0px" }}
          className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-5 lg:gap-6"
        >
          {filmWorks.map((work, i) => (
            <motion.div key={work.id} variants={cardVariants}>
              <PosterCard work={work} no={i + 1} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
