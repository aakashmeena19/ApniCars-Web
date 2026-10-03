"use client";

import Link from "next/link";
import { ChevronDown, Menu, Search, User, X } from "lucide-react";
import { useState } from "react";
import AccountModal from "@/components/common/AccountModal";
import BrandMark from "@/components/common/BrandMark";
import HeaderSearch from "@/components/common/HeaderSearch";
import ThemeToggle from "@/components/common/ThemeToggle";

const navLinks = [
  {
    label: "Buy a Car",
    href: "/cars",
    children: [
      { label: "New Cars", href: "/new-cars" },
      { label: "Car Brands", href: "/brands" },
      { label: "Used Cars", href: "/used-cars" },
      { label: "Popular Cars", href: "/popular-cars" },
      { label: "Upcoming Cars", href: "/upcoming-cars" },
    ],
  },
  { label: "Electric", href: "/electric-cars" },
  { label: "Compare", href: "/compare" },
  {
    label: "News",
    href: "/news",
    children: [
      { label: "Latest News", href: "/news" },
      { label: "Car Reviews", href: "/reviews" },
      { label: "Buying Guides", href: "/buying-guide" },
      { label: "Industry Updates", href: "/news/industry" },
    ],
  },
  {
    label: "Tools",
    href: "/tools",
    children: [
      { label: "EMI Calculator", href: "/emi-calculator" },
      { label: "Car Valuation", href: "/car-valuation" },
      { label: "Fuel Cost Calculator", href: "/fuel-cost-calculator" },
      { label: "RTO Information", href: "/rto" },
    ],
  },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  function closeMobileMenu() {
    setMobileMenuOpen(false);
    setMobileExpanded(null);
  }

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[#dfe6e2] bg-white/95 text-[#16261f] shadow-[0_8px_24px_rgba(4,24,20,.07)] backdrop-blur-xl dark:border-white/10 dark:bg-[#061f1b]/95 dark:text-white dark:shadow-[0_8px_24px_rgba(4,24,20,.14)]">
        <div className="page-shell flex h-[86px] items-center gap-8">
          <BrandMark themeAware />

          <nav className={`mx-auto hidden items-center gap-9 ${searchOpen ? "lg:hidden" : "lg:flex"}`}>
            {navLinks.map((item) => item.children ? (
              <div key={item.label} className="group relative flex h-[86px] items-center">
                <button type="button" aria-haspopup="menu" className="flex h-full items-center gap-1.5 whitespace-nowrap text-[14px] font-medium text-[#45554f] transition-colors hover:text-[#14241e] group-focus-within:text-[#14241e] dark:text-white/76 dark:hover:text-white dark:group-focus-within:text-white">
                  {item.label}<ChevronDown size={13} className="transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180" />
                </button>
                <div role="menu" className="invisible absolute left-1/2 top-[70px] w-[210px] -translate-x-1/2 translate-y-2 rounded-[7px] border border-black/10 bg-white p-2 opacity-0 shadow-[0_18px_42px_rgba(5,30,24,.16)] transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 dark:border-white/10 dark:bg-[#0c251f]">
                  <Link href={item.href} role="menuitem" className="flex items-center justify-between rounded-[5px] px-3 py-2.5 text-[11px] font-semibold text-[#1f392f] transition-colors hover:bg-[#edf4df] dark:text-white dark:hover:bg-white/10">Explore all <span className="text-[#789411]">+</span></Link>
                  <div className="my-1 border-t border-black/[0.07] dark:border-white/10" />
                  {item.children.map((child) => <Link key={child.label} href={child.href} role="menuitem" className="block rounded-[5px] px-3 py-2.5 text-[11px] text-[#5d6d66] transition-colors hover:bg-[#f2f5f3] hover:text-[#18372d] dark:text-white/60 dark:hover:bg-white/[0.07] dark:hover:text-white">{child.label}</Link>)}
                </div>
              </div>
            ) : (
              <Link key={item.label} href={item.href} className="flex h-[86px] items-center whitespace-nowrap text-[14px] font-medium text-[#45554f] transition-colors hover:text-[#14241e] dark:text-white/76 dark:hover:text-white">{item.label}</Link>
            ))}
          </nav>

          <div className="ml-auto hidden items-center gap-2 lg:flex">
            <ThemeToggle />
            {searchOpen ? <HeaderSearch onClose={() => setSearchOpen(false)} className="w-[280px]" /> : <button type="button" onClick={() => setSearchOpen(true)} aria-label="Search cars" aria-expanded={searchOpen} title="Search cars" className="grid h-11 w-11 place-items-center rounded-full border border-[#d8e0dc] text-[#29463c] transition-all hover:border-[#94b02d] hover:bg-[#f1f6e7] dark:border-white/12 dark:text-white/80 dark:hover:border-[#c9ff49]/45 dark:hover:bg-white/[0.06] dark:hover:text-[#c9ff49]"><Search size={19} /></button>}
            <button type="button" onClick={() => { setSearchOpen(false); setAccountOpen(true); }} aria-label="Your account" aria-haspopup="dialog" title="Your account" className="grid h-11 w-11 place-items-center rounded-full border border-[#d8e0dc] text-[#29463c] transition-all hover:border-[#94b02d] hover:bg-[#f1f6e7] dark:border-white/12 dark:text-white/80 dark:hover:border-[#c9ff49]/45 dark:hover:bg-white/[0.06] dark:hover:text-[#c9ff49]"><User size={19} /></button>
            <Link href="/contact" className="ml-2 inline-flex h-11 items-center gap-2 rounded-full bg-[#c9ff49] px-6 text-[12px] font-semibold text-[#10271f] shadow-[0_8px_18px_rgba(201,255,73,.14)] transition-all hover:-translate-y-px hover:bg-[#bced3e]">Book Now <span aria-hidden="true">+</span></Link>
          </div>

          <div className="ml-auto flex items-center gap-2 lg:hidden">
            <ThemeToggle className="h-10 w-10" />
            <button type="button" onClick={() => setSearchOpen((current) => !current)} aria-label="Search cars" aria-expanded={searchOpen} className="grid h-10 w-10 place-items-center rounded-full border border-[#d8e0dc] text-[#29463c] dark:border-white/10 dark:text-white/80">{searchOpen ? <X size={18} /> : <Search size={18} />}</button>
            <button type="button" aria-label="Open navigation" onClick={() => setMobileMenuOpen(true)} className="grid h-10 w-10 place-items-center rounded-full border border-[#d8e0dc] text-[#18352c] dark:border-white/10 dark:text-white"><Menu size={19} /></button>
          </div>
        </div>
        {searchOpen && <div className="border-t border-black/[0.06] px-4 py-3 dark:border-white/10 lg:hidden"><HeaderSearch onClose={() => setSearchOpen(false)} className="mx-auto w-full max-w-[560px]" /></div>}
      </header>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <button type="button" aria-label="Close navigation" className="absolute inset-0 bg-[#03110e]/65 backdrop-blur-sm" onClick={closeMobileMenu} />
          <aside className="absolute right-0 top-0 flex h-full w-full max-w-[350px] flex-col border-l border-black/10 bg-white p-6 text-[#14241e] shadow-[-20px_0_50px_rgba(0,0,0,.18)] dark:border-white/10 dark:bg-[#061f1b] dark:text-white">
            <div className="flex items-center justify-between"><BrandMark themeAware /><button type="button" aria-label="Close menu" onClick={closeMobileMenu} className="grid h-9 w-9 place-items-center rounded-full border border-black/10 text-[#18352c] dark:border-white/15 dark:text-white"><X size={17} /></button></div>
            <nav className="mt-10 flex flex-col">
              {navLinks.map((item) => item.children ? (
                <div key={item.label} className="border-b border-black/10 dark:border-white/10">
                  <button type="button" onClick={() => setMobileExpanded((current) => current === item.label ? null : item.label)} aria-expanded={mobileExpanded === item.label} className="flex w-full items-center justify-between py-4 text-[13px] font-semibold text-[#354941] hover:text-[#729000] dark:text-white/80 dark:hover:text-[#c9ff49]">{item.label}<ChevronDown size={14} className={`transition-transform ${mobileExpanded === item.label ? "rotate-180" : ""}`} /></button>
                  {mobileExpanded === item.label && <div className="mb-3 grid rounded-[6px] bg-[#f2f5f3] p-2 dark:bg-white/[0.05]"><Link href={item.href} onClick={closeMobileMenu} className="rounded-[4px] px-3 py-2.5 text-[11px] font-semibold text-[#28483d] dark:text-[#c9ff49]">Explore all</Link>{item.children.map((child) => <Link key={child.label} href={child.href} onClick={closeMobileMenu} className="rounded-[4px] px-3 py-2.5 text-[11px] text-[#66766f] hover:bg-white dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white">{child.label}</Link>)}</div>}
                </div>
              ) : <Link key={item.label} href={item.href} onClick={closeMobileMenu} className="flex items-center justify-between border-b border-black/10 py-4 text-[13px] font-semibold text-[#354941] hover:text-[#729000] dark:border-white/10 dark:text-white/80 dark:hover:text-[#c9ff49]">{item.label}</Link>)}
            </nav>
            <div className="mt-auto grid gap-3"><button type="button" onClick={() => { closeMobileMenu(); setAccountOpen(true); }} className="flex h-11 items-center justify-center gap-2 rounded-[5px] border border-black/10 text-[11px] font-bold text-[#18352c] dark:border-white/15 dark:text-white"><User size={15} /> My account</button><Link href="/contact" onClick={closeMobileMenu} className="flex h-11 items-center justify-center rounded-full bg-[#c9ff49] text-[11px] font-bold text-[#10271f]">Book Now</Link></div>
          </aside>
        </div>
      )}
      <AccountModal open={accountOpen} onClose={() => setAccountOpen(false)} />
    </>
  );
}
