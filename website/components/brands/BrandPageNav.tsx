import Link from "next/link";

export default function BrandPageNav({ hasUpcoming, hasNews }: { hasUpcoming: boolean; hasNews: boolean }) {
  const links = [{ label: "Price list", href: "#price-list" }, { label: "All models", href: "#all-models" }, { label: "Explore range", href: "#explore-range" }, { label: "Highlights", href: "#highlights" }, ...(hasUpcoming ? [{ label: "Upcoming", href: "#upcoming" }] : []), ...(hasNews ? [{ label: "News", href: "#brand-news" }] : []), { label: "FAQs", href: "#faqs" }];
  return <nav aria-label="On this page" className="sticky top-[86px] z-30 border-b border-black/[0.08] bg-white/95 backdrop-blur-xl dark:border-white/10 dark:bg-[#0b211b]/95"><div className="page-shell flex gap-5 overflow-x-auto py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">{links.map((link) => <Link key={link.href} href={link.href} className="shrink-0 text-[9px] font-semibold text-[#5f7169] hover:text-[#1d4d3e] dark:text-white/55 dark:hover:text-[#c9ff49]">{link.label}</Link>)}</div></nav>;
}
