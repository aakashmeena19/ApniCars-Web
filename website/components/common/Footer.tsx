import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import BrandMark from "@/components/common/BrandMark";

const columns = [
  { title: "Cars", links: [{ label: "New Cars", href: "/new-cars" }, { label: "Car Brands", href: "/brands" }, { label: "Electric Cars", href: "/electric-cars" }, { label: "Upcoming Cars", href: "/upcoming-cars" }] },
  { title: "Research", links: [{ label: "Compare Cars", href: "/compare" }, { label: "Car Reviews", href: "/reviews" }, { label: "Buying Guides", href: "/buying-guide" }, { label: "Car News", href: "/news" }] },
  { title: "Services", links: [{ label: "Book a Test Drive", href: "/contact" }, { label: "Car Valuation", href: "/car-valuation" }, { label: "EMI Calculator", href: "/emi-calculator" }, { label: "Sell Your Car", href: "/sell-car" }] },
  { title: "Company", links: [{ label: "About Us", href: "/about" }, { label: "Contact", href: "/contact" }, { label: "Careers", href: "/careers" }, { label: "Dealer Login", href: "/dealer-login" }] },
];

export default function Footer() {
  return (
    <footer className="border-t border-[#dce5e0] bg-[#edf3f0] text-[#14251e] dark:border-[#c9ff49]/20 dark:bg-[#041713] dark:text-white">
      <div className="page-shell">

        <div className="grid gap-12 py-12 lg:grid-cols-[1.25fr_2fr]">
          <div className="max-w-[340px]">
            <BrandMark themeAware />
            <p className="mt-6 text-[11px] leading-6 text-[#607068] dark:text-white/55">A clearer, more confident way to discover, compare and choose cars across India.</p>
            <div className="mt-6 grid gap-3 text-[10px] text-[#566961] dark:text-white/65">
              <a href="tel:+918112260346" className="flex items-center gap-2.5 transition-colors hover:text-[#c9ff49]"><Phone size={14} /> +91 81122 60346</a>
              <a href="mailto:hello@apnicars.com" className="flex items-center gap-2.5 transition-colors hover:text-[#c9ff49]"><Mail size={14} /> hello@apnicars.com</a>
              <span className="flex items-center gap-2.5"><MapPin size={14} /> Serving car buyers across India</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
            {columns.map((column) => (
              <div key={column.title}>
                <h3 className="text-[10px] font-semibold uppercase text-[#15271f] dark:text-white">{column.title}</h3>
                <nav className="mt-5 grid gap-3.5">
                  {column.links.map((link) => <Link key={link.label} href={link.href} className="w-fit text-[10px] text-[#63736c] transition-colors hover:text-[#668100] dark:text-white/50 dark:hover:text-[#c9ff49]">{link.label}</Link>)}
                </nav>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-black/10 py-6 sm:flex-row sm:items-center sm:justify-between dark:border-white/10">
          <p className="text-[9px] text-[#738078] dark:text-white/40">Copyright {new Date().getFullYear()} Apni cars. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link href="/privacy" className="text-[9px] text-[#6a7871] hover:text-[#17271f] dark:text-white/45 dark:hover:text-white">Privacy</Link>
            <Link href="/terms" className="text-[9px] text-[#6a7871] hover:text-[#17271f] dark:text-white/45 dark:hover:text-white">Terms</Link>
            <Link href="/cookies" className="text-[9px] text-[#6a7871] hover:text-[#17271f] dark:text-white/45 dark:hover:text-white">Cookies</Link>
            <Link href="/sitemap" className="text-[9px] text-[#6a7871] hover:text-[#17271f] dark:text-white/45 dark:hover:text-white">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
