/**
 * useDarkMode — 明暗主题切换（「私藏」默认亮色毛玻璃）。
 * 状态写入 <html> 的 .dark class（Tailwind darkMode: ["class"]），
 * 偏好存 localStorage（仅本浏览器，不换设备同步）；index.html 里有
 * 预置脚本在首帧前应用已存偏好，避免闪烁。
 */
import { useCallback, useEffect, useState } from "react";

const KEY = "pc-theme";

export function useDarkMode(): [boolean, () => void] {
  const [dark, setDark] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(KEY) === "dark";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem(KEY, dark ? "dark" : "light");
  }, [dark]);

  const toggle = useCallback(() => setDark((d) => !d), []);
  return [dark, toggle];
}
