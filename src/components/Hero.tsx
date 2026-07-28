/**
 * <Hero> — 首屏（home.md §2）：100dvh，左对齐杂志大标题，字就是主角。
 *
 * 动效（GSAP 独占本组件，与 Framer Motion 隔离）：
 * - 入场时间线（加载后 300ms）：eyebrow 上移淡入 → 大标题按字 SplitText
 *   （y:60, rotate:4°, stagger 0.05s）→ 渐变下划线 scaleX → 英文行 → 签名句
 *   → 滚动提示淡入（主人反馈：三个玻璃快捷药丸已去掉）
 * - ScrollTrigger scrub：Hero 整体 y:-15% 视差 + opacity 渐隐至 0.3
 * - 大标题右后方 peach 光斑 8s 缓慢呼吸（纯 CSS）
 * - prefers-reduced-motion：跳过全部入场与视差
 */
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { Moon, Sun } from "lucide-react";
import { useDarkMode } from "@/lib/theme";

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function Hero() {
  const [dark, toggleDark] = useDarkMode();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const split = new SplitText(".hero-title-line", { type: "chars" });
        const tl = gsap.timeline({ delay: 0.3, defaults: { ease: "power3.out" } });
        tl.from(".hero-eyebrow", { y: 20, autoAlpha: 0, duration: 0.4 })
          .from(split.chars, { y: 60, rotate: 4, autoAlpha: 0, duration: 0.6, stagger: 0.05 }, "-=0.1")
          .from(".hero-underline", { scaleX: 0, transformOrigin: "left center", duration: 0.5 }, "-=0.2")
          .from(".hero-en", { autoAlpha: 0, duration: 0.3 }, "-=0.15")
          .from(".hero-sign", { y: 24, autoAlpha: 0, duration: 0.5 }, "-=0.1")
          // 注意：明暗开关（.hero-theme）不交给 GSAP——曾出现 tween 未播放导致按钮卡隐藏态，
          // 改用 index.css 里的纯 CSS 延迟入场（hero-toggle-in），见下方按钮注释。
          .from(".hero-cue", { autoAlpha: 0, duration: 0.4 }, "-=0.2");

        // 滚动视差：让位给第一板块
        gsap.to(".hero-inner", {
          yPercent: -15,
          autoAlpha: 0.3,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom 40%", scrub: true },
        });
        return () => split.revert(); // 清理 split DOM
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="relative z-10" style={{ minHeight: "max(100dvh, 640px)" }}>
      {/* Hero 专属 peach 呼吸光斑（大标题右后方） */}
      <div
        aria-hidden="true"
        className="blob blob-peach"
        style={{ right: "4%", top: "12%", width: "38vw", height: "38vw", animation: "blob-breathe 8s ease-in-out infinite" }}
      />

      <div className="hero-inner mx-auto max-w-[1280px] px-[clamp(20px,5vw,64px)] pt-[22vh]">
        <div className="max-w-[900px]">
          {/* 1. Eyebrow 行：32px accent 渐变短线 + 标签 */}
          <div className="hero-eyebrow flex items-center gap-4">
            <span
              aria-hidden="true"
              className="h-px w-8"
              style={{ background: "linear-gradient(90deg, #7B6BD6, #E07A54)" }}
            />
            <p className="eyebrow">A PERSONAL CANON · 私人珍藏志</p>
          </div>

          {/* 2. 中文大标题（按字 split 入场） */}
          <h1 className="mt-8 font-serif text-[clamp(3rem,8.5vw,7.5rem)] font-black leading-[1.05] tracking-[0.02em] text-ink">
            <span className="hero-title-line block">把热爱的事物</span>
            <span className="hero-title-line relative block">
              <span className="relative inline-block">
                装订成册
                {/* lavender → peach 渐变下划线（宽 40%） */}
                <span
                  aria-hidden="true"
                  className="hero-underline absolute -bottom-3 left-0 h-1 w-[40%] rounded-full"
                  style={{ background: "linear-gradient(90deg, #DCD3F7, #FFD9C2)" }}
                />
              </span>
              。
            </span>
          </h1>

          {/* 3. 英文装饰行 */}
          <p className="hero-en mt-10 font-serif text-[clamp(1rem,2vw,1.5rem)] italic tracking-[0.14em] text-ink-2">
            Music, Film &amp; Play — pressed between pages like dried flowers.
          </p>

          {/* 4. 个人签名句（TODO(主人): 替换为你自己的一句话） */}
          <p className="hero-sign mt-8 max-w-[520px] text-[1.05rem] leading-[1.9] text-ink-2">
            「这里收藏着我反复聆听的唱片、不愿散场的电影，和通关了还想重来一次的游戏。排名不分先后，喜欢不分高下。」
            <span className="mt-2 block text-[0.8rem] text-ink-3">—— 占位签名，请替换为你自己的一句话</span>
          </p>

          {/* 5. 明暗切换开关（玻璃小药丸，签名句后独立入场） */}
          <button
            type="button"
            onClick={toggleDark}
            aria-label={dark ? "切换到浅色模式" : "切换到深色模式"}
            className="hero-theme glass group mt-8 inline-flex items-center gap-2.5 rounded-full px-4 py-2 text-[0.78rem] font-medium text-ink-2 transition-all duration-300 hover:text-ink"
          >
            {dark ? (
              <Sun size={15} strokeWidth={1.8} className="transition-transform duration-500 group-hover:rotate-90" />
            ) : (
              <Moon size={15} strokeWidth={1.8} className="transition-transform duration-500 group-hover:-rotate-12" />
            )}
            {dark ? "浅色模式" : "深色模式"}
          </button>

        </div>
      </div>

      {/* 5. 滚动提示：1px 竖线内 6px 圆点循环下落 */}
      {/* 滚动提示：窄屏靠右下（避开左下的明暗开关），sm 起回到底部居中 */}
      <div className="hero-cue absolute bottom-8 right-6 flex flex-col items-center gap-3 sm:left-1/2 sm:right-auto sm:-translate-x-1/2">
        <div className="relative h-12 w-px overflow-hidden bg-ink/10">
          <span
            aria-hidden="true"
            className="scroll-dot-anim absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-ink-2"
            style={{ animation: "scroll-dot 1.8s ease-in-out infinite" }}
          />
        </div>
        <p className="eyebrow text-[0.6rem]">向下翻阅 · SCROLL</p>
      </div>
    </section>
  );
}
