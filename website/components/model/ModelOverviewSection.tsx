import { Check, Info, ShieldCheck } from "lucide-react";

const strengths = [
  "Strong road presence with a spacious five-seat cabin",
  "Refined diesel performance for highways and daily driving",
  "Useful safety and driver assistance technology",
  "Comfortable ride quality with generous luggage space",
];

const considerations = [
  "No petrol engine option in the current range",
  "Some premium features are limited to higher variants",
  "Large dimensions need more care in tight city parking",
];

export default function ModelOverviewSection() {
  return (
    <section className="bg-white py-12 dark:bg-[#0a1d18] sm:py-14 lg:py-16">
      <div className="page-shell grid gap-10 lg:grid-cols-[1.05fr_.95fr] lg:gap-16">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#6b837a]">Model overview</p>
          <h2 className="mt-2 text-[27px] font-semibold leading-tight text-[#0c1a15] dark:text-white sm:text-[32px]">A confident SUV built for long journeys</h2>
          <p className="mt-5 max-w-[610px] text-[12px] leading-6 text-[#5f6e67] dark:text-white/60">The Tata Harrier combines a strong diesel powertrain with an airy cabin, composed road manners and a broad safety package. Its design feels substantial without becoming overly decorative, while the higher variants add the technology expected from a modern premium SUV.</p>
          <p className="mt-4 max-w-[610px] text-[12px] leading-6 text-[#5f6e67] dark:text-white/60">For buyers comparing five-seat SUVs, the Harrier is especially relevant when highway comfort, cabin space and road presence matter more than compact dimensions or a petrol option.</p>

          <div className="mt-7 flex items-center gap-3 border-l-2 border-[#9dba35] pl-4 text-[11px] leading-5 text-[#395249] dark:text-white/70"><ShieldCheck size={19} className="shrink-0 text-[#789611] dark:text-[#c9ff49]" /><span>Safety and convenience equipment varies by variant. Compare the final feature list before booking.</span></div>
        </div>

        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          <div>
            <div className="flex items-center gap-2"><span className="grid h-8 w-8 place-items-center rounded-full bg-[#e7f1d2] text-[#56720a] dark:bg-[#c9ff49]/12 dark:text-[#c9ff49]"><Check size={15} /></span><h3 className="text-[14px] font-semibold text-[#172a23] dark:text-white">What stands out</h3></div>
            <ul className="mt-5 grid gap-4">
              {strengths.map((item) => <li key={item} className="flex gap-3 text-[11px] leading-5 text-[#5e6d66] dark:text-white/58"><Check size={14} className="mt-0.5 shrink-0 text-[#789611] dark:text-[#c9ff49]" />{item}</li>)}
            </ul>
          </div>

          <div>
            <div className="flex items-center gap-2"><span className="grid h-8 w-8 place-items-center rounded-full bg-[#eef1ef] text-[#62736c] dark:bg-white/[0.06] dark:text-white/60"><Info size={15} /></span><h3 className="text-[14px] font-semibold text-[#172a23] dark:text-white">Worth considering</h3></div>
            <ul className="mt-5 grid gap-4">
              {considerations.map((item) => <li key={item} className="flex gap-3 text-[11px] leading-5 text-[#5e6d66] dark:text-white/58"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#87978f] dark:bg-white/35" />{item}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
