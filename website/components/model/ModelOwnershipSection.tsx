"use client";

import { BadgeIndianRupee, ShieldCheck, Wrench } from "lucide-react";
import { useMemo, useState } from "react";

const vehiclePrice = 23.64;
const interestRate = 9.25;

export default function ModelOwnershipSection() {
  const [downPayment, setDownPayment] = useState(4.75);
  const [tenure, setTenure] = useState(5);

  const monthlyEmi = useMemo(() => {
    const principal = Math.max(vehiclePrice - downPayment, 0) * 100000;
    const monthlyRate = interestRate / 12 / 100;
    const months = tenure * 12;
    return principal * monthlyRate * (1 + monthlyRate) ** months / ((1 + monthlyRate) ** months - 1);
  }, [downPayment, tenure]);

  const formattedEmi = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(monthlyEmi);

  return (
    <section className="bg-[#f2f6f3] py-12 dark:bg-[#071b16] sm:py-14 lg:py-16">
      <div className="page-shell">
        <div className="grid gap-10 lg:grid-cols-[.72fr_1.28fr] lg:items-start lg:gap-14">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#6b837a]">Ownership planning</p>
            <h2 className="mt-2 text-[27px] font-semibold leading-tight text-[#0c1a15] dark:text-white sm:text-[32px]">Plan beyond the ex-showroom price</h2>
            <p className="mt-4 max-w-[420px] text-[11px] leading-5 text-[#65736c] dark:text-white/55">Use a simple finance estimate, then account for registration, insurance and ongoing care before choosing a variant.</p>

            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
              <div className="flex gap-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-[6px] bg-[#e1edcf] text-[#5e790c] dark:bg-[#c9ff49]/10 dark:text-[#c9ff49]"><ShieldCheck size={16} /></span><div><h3 className="text-[12px] font-semibold text-[#1b3028] dark:text-white">Warranty cover</h3><p className="mt-1 text-[10px] leading-5 text-[#6b7872] dark:text-white/48">3 years or 1 lakh km, whichever comes first.</p></div></div>
              <div className="flex gap-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-[6px] bg-[#e1edcf] text-[#5e790c] dark:bg-[#c9ff49]/10 dark:text-[#c9ff49]"><Wrench size={16} /></span><div><h3 className="text-[12px] font-semibold text-[#1b3028] dark:text-white">Service planning</h3><p className="mt-1 text-[10px] leading-5 text-[#6b7872] dark:text-white/48">Ask for a city-specific maintenance and service package estimate.</p></div></div>
            </div>
          </div>

          <div className="overflow-hidden rounded-[8px] border border-black/[0.08] bg-white shadow-[0_14px_38px_rgba(7,30,24,.07)] dark:border-white/10 dark:bg-[#102720]">
            <div className="grid lg:grid-cols-[1.1fr_.9fr]">
              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-[6px] bg-[#c9ff49] text-[#173027]"><BadgeIndianRupee size={17} /></span><div><p className="text-[9px] text-[#75827c] dark:text-white/42">Estimated monthly EMI</p><p className="mt-0.5 text-[23px] font-semibold text-[#153128] dark:text-white">Rs. {formattedEmi}</p></div></div>

                <div className="mt-7 grid gap-6">
                  <label className="grid gap-3 text-[10px] font-semibold text-[#40564d] dark:text-white/70">
                    <span className="flex justify-between gap-3"><span>Down payment</span><span className="text-[#68830e] dark:text-[#c9ff49]">Rs. {downPayment.toFixed(2)} Lakh</span></span>
                    <input type="range" min="2.5" max="12" step="0.25" value={downPayment} onChange={(event) => setDownPayment(Number(event.target.value))} className="h-1.5 w-full accent-[#789611]" />
                  </label>
                  <label className="grid gap-3 text-[10px] font-semibold text-[#40564d] dark:text-white/70">
                    <span className="flex justify-between gap-3"><span>Loan tenure</span><span className="text-[#68830e] dark:text-[#c9ff49]">{tenure} years</span></span>
                    <input type="range" min="3" max="7" step="1" value={tenure} onChange={(event) => setTenure(Number(event.target.value))} className="h-1.5 w-full accent-[#789611]" />
                  </label>
                </div>

                <div className="mt-7 flex items-center justify-between border-t border-black/[0.07] pt-4 text-[10px] dark:border-white/10"><span className="text-[#77847e] dark:text-white/45">Interest used</span><span className="font-semibold text-[#203a30] dark:text-white">{interestRate}% p.a.</span></div>
              </div>

              <div className="border-t border-black/[0.07] bg-[#edf3ef] p-6 dark:border-white/10 dark:bg-[#0b211b] sm:p-8 lg:border-l lg:border-t-0">
                <p className="text-[11px] font-semibold text-[#193128] dark:text-white">Indicative price breakdown</p>
                <dl className="mt-5 grid gap-3">
                  <PriceRow label="Selected variant" value="Rs. 23.64 Lakh" />
                  <PriceRow label="Registration estimate" value="Rs. 2.36 Lakh" />
                  <PriceRow label="Insurance estimate" value="Rs. 0.98 Lakh" />
                  <PriceRow label="Other charges" value="Rs. 0.15 Lakh" />
                </dl>
                <div className="mt-5 border-t border-black/10 pt-4 dark:border-white/10"><p className="text-[9px] text-[#7b8881] dark:text-white/40">Estimated on-road price</p><p className="mt-1 text-[18px] font-semibold text-[#173128] dark:text-white">Rs. 27.13 Lakh</p></div>
                <button type="button" className="mt-5 h-10 w-full rounded-full bg-[#173a30] text-[10px] font-semibold text-white transition-colors hover:bg-[#245244] dark:bg-[#c9ff49] dark:text-[#10271f] dark:hover:bg-[#bced3e]">Request exact price</button>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-4 text-right text-[9px] text-[#8a948f] dark:text-white/35">Finance and on-road figures are illustrative, not a loan offer.</p>
      </div>
    </section>
  );
}

function PriceRow({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between gap-4 text-[10px]"><dt className="text-[#718078] dark:text-white/45">{label}</dt><dd className="font-semibold text-[#263f35] dark:text-white/80">{value}</dd></div>;
}
