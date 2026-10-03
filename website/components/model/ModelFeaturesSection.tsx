import { features } from "@/components/model/modelData";

export default function ModelFeaturesSection() {
  return (
    <section className="bg-white py-12 dark:bg-[#0a1d18] sm:py-14 lg:py-16">
      <div className="page-shell">
        <div className="max-w-[620px]">
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#6b837a]">Feature highlights</p>
          <h2 className="mt-2 text-[27px] font-semibold text-[#0c1a15] dark:text-white sm:text-[32px]">Comfort and confidence, thoughtfully combined</h2>
          <p className="mt-3 text-[11px] leading-5 text-[#68756f] dark:text-white/55">The most useful technology is placed around safety, long-distance comfort and simpler everyday driving.</p>
        </div>

        <div className="mt-9 grid border-l border-t border-black/[0.08] dark:border-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="group min-h-[170px] border-b border-r border-black/[0.08] p-5 transition-colors hover:bg-[#f3f7ed] dark:border-white/10 dark:hover:bg-white/[0.035] sm:p-6">
                <span className="grid h-9 w-9 place-items-center rounded-[6px] bg-[#e4f0d1] text-[#58720d] transition-colors group-hover:bg-[#c9ff49] group-hover:text-[#163128] dark:bg-[#c9ff49]/10 dark:text-[#c9ff49]"><Icon size={16} /></span>
                <h3 className="mt-4 text-[13px] font-semibold text-[#172a23] dark:text-white">{feature.title}</h3>
                <p className="mt-2 text-[10px] leading-5 text-[#6b7872] dark:text-white/48">{feature.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
