/**
 * <Footer> — 胶囊形细页脚（页面最底部居中悬浮一条）：
 * 左侧站点 slogan（src/config.ts 的 SITE.footerSlogan），
 * 右侧 GitHub 图标（链接为 SITE.repoUrl，置空则不显示），
 * hover 时右侧展开「Powered by Stash」。
 * 半透明玻璃质感（bg-paper-2/40 + backdrop-blur），圆角胶囊。
 */
import { Github } from "lucide-react";
import { SITE } from "@/config";

export default function Footer() {
  return (
    <footer className="relative z-10 flex justify-center px-4 pb-3 pt-2">
      <div className="flex items-center gap-8 rounded-full border border-ink/10 bg-paper-2/40 px-6 py-2.5 backdrop-blur-md">
        <p className="text-[0.78rem] tracking-[0.04em] text-ink-3">{SITE.footerSlogan}</p>
        {SITE.repoUrl && (
          <a
            href={SITE.repoUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub 仓库"
            className="group flex items-center text-ink-3 transition-colors duration-200 hover:text-ink"
          >
            <Github size={16} strokeWidth={1.75} />
            {/* hover 时文字向右侧展开（不用原生 title 提示） */}
            <span className="max-w-0 overflow-hidden whitespace-nowrap text-[0.72rem] font-medium opacity-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:ml-1.5 group-hover:max-w-[110px] group-hover:opacity-100">
              Powered by Stash
            </span>
          </a>
        )}
      </div>
    </footer>
  );
}
