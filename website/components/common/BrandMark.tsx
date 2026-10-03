import Link from "next/link";

export default function BrandMark({ onDark = false, themeAware = false }: { onDark?: boolean; themeAware?: boolean }) {
  return (
    <Link href="/" aria-label="Apni cars home" className="inline-flex w-[128px] shrink-0 flex-col items-center">
      <svg viewBox="0 0 150 25" className="h-[22px] w-[122px] text-[#c9ff49]" fill="none" aria-hidden="true">
        <path d="M6 19.2c10.8-1.4 20.7-4.7 30.3-9.4C45.8 5.2 57 3 68 3.2c13 .2 24 4.5 34.4 10.5 13.8.4 27.6 1.6 41.6 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M21 18.6c15-1.8 29.2-3.1 44.3-3.4 15.8-.3 31.5-.1 47.2.8" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" opacity=".8" />
        <path d="M35 10.4c8.3-3.1 17-4.7 26.2-4.8 10.3-.1 19.3 2.4 28 7" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity=".56" />
      </svg>
      <span className={`w-[122px] text-center text-[23px] font-medium leading-[0.9] ${themeAware ? "text-[#08251f] dark:text-white" : onDark ? "text-white" : "text-[#08251f]"}`}>Apni cars</span>
      <span className={`mt-2 text-[7px] font-medium ${themeAware ? "text-[#6f7c77] dark:text-white/55" : onDark ? "text-white/55" : "text-[#6f7c77]"}`}>SEARCH. COMPARE. DRIVE.</span>
    </Link>
  );
}
