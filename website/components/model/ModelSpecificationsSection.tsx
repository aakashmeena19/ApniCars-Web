import { Info } from "lucide-react";
import { specifications } from "@/components/model/modelData";

export default function ModelSpecificationsSection() {
  return (
    <section className="bg-[#06231d] py-12 text-white dark:bg-[#041713] sm:py-14 lg:py-16">
      <div className="page-shell">
        <div className="grid gap-5 lg:grid-cols-[.7fr_1.3fr] lg:items-end">
          <div><p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#9ebdb3]">Technical details</p><h2 className="mt-2 text-[27px] font-semibold sm:text-[32px]">Specifications at a glance</h2></div>
          <p className="max-w-[560px] text-[11px] leading-5 text-white/55 lg:justify-self-end">A clear view of the engine, dimensions and chassis details buyers most often compare.</p>
        </div>

        <div className="mt-9 grid border-l border-t border-white/12 lg:grid-cols-3">
          {specifications.map((group) => (
            <div key={group.title} className="border-b border-r border-white/12">
              <h3 className="border-b border-white/12 bg-white/[0.045] px-5 py-4 text-[12px] font-semibold text-[#c9ff49]">{group.title}</h3>
              <dl className="px-5 py-2">
                {group.rows.map(([label, value]) => <div key={label} className="grid grid-cols-[.9fr_1.1fr] gap-4 border-b border-white/[0.08] py-3.5 last:border-b-0"><dt className="text-[10px] text-white/45">{label}</dt><dd className="text-right text-[10px] font-semibold leading-4 text-white/88">{value}</dd></div>)}
              </dl>
            </div>
          ))}
        </div>

        <p className="mt-5 flex max-w-[780px] gap-2 text-[9px] leading-4 text-white/40"><Info size={13} className="mt-0.5 shrink-0" />Specifications and equipment can vary by variant and model year. Confirm the latest configuration before making a purchase decision.</p>
      </div>
    </section>
  );
}
