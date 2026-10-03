import Image from "next/image";
import { BadgeCheck, BadgeIndianRupee, CalendarDays, Headphones } from "lucide-react";

const benefits = [
  { title: "Verified pricing", text: "Clear ex-showroom and ownership estimates", icon: BadgeIndianRupee },
  { title: "Inspected details", text: "Important specifications checked carefully", icon: BadgeCheck },
  { title: "Expert support", text: "Guidance throughout your car research", icon: Headphones },
  { title: "Easy shortlisting", text: "Save and compare the right models", icon: CalendarDays },
];

export default function WhyApnicarsSection() {
  return (
    <section className="bg-[#f6f7f4] py-12 dark:bg-[#0a1d18] sm:py-14">
      <div className="page-shell overflow-hidden rounded-[8px] border border-black/[0.06] bg-white shadow-[0_14px_38px_rgba(9,31,26,.08)] dark:border-white/10 dark:bg-[#102720]">
        <div className="grid lg:grid-cols-[.82fr_1.18fr]">
          <div className="relative min-h-[285px] overflow-hidden lg:min-h-[330px] lg:[clip-path:polygon(0_0,89%_0,100%_100%,0_100%)]">
            <Image src="/images/exec-315ae8f6-92a4-4bda-98fb-600e5ac4029b.png" alt="Premium vehicle interior" fill sizes="(max-width: 1024px) 100vw, 44vw" className="object-cover" />
          </div>
          <div className="px-6 py-9 sm:px-9 lg:px-12 lg:py-11">
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#69827a]">Why choose Apnicars</p>
            <h2 className="mt-2 text-[26px] font-semibold leading-tight text-[#0b1512] dark:text-white sm:text-[31px]">More than just a car listing</h2>
            <p className="mt-3 max-w-[480px] text-[11px] leading-5 text-[#69716d] dark:text-white/60">Research with cleaner information and make every shortlist more confident.</p>
            <div className="mt-7 grid gap-x-8 gap-y-6 sm:grid-cols-2">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;
                return <div key={benefit.title} className="flex gap-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-[5px] bg-[#dfff82] text-[#19352d]"><Icon size={15} /></span><div><h3 className="text-[12px] font-bold text-[#16201c] dark:text-white">{benefit.title}</h3><p className="mt-1 text-[9px] leading-4 text-[#747b77] dark:text-white/50">{benefit.text}</p></div></div>;
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
