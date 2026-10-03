import { ChevronDown } from "lucide-react";
import { faqs } from "@/components/model/modelData";

export default function ModelFaqSection() {
  return (
    <section className="bg-white py-12 dark:bg-[#0a1d18] sm:py-14 lg:py-16">
      <div className="page-shell grid gap-9 lg:grid-cols-[.62fr_1.38fr] lg:gap-16">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#6b837a]">Common questions</p>
          <h2 className="mt-2 text-[27px] font-semibold leading-tight text-[#0c1a15] dark:text-white sm:text-[32px]">Tata Harrier FAQs</h2>
          <p className="mt-4 max-w-[360px] text-[11px] leading-5 text-[#68756f] dark:text-white/55">Quick answers to the questions buyers usually ask before comparing variants or requesting a test drive.</p>
        </div>

        <div className="border-t border-black/[0.09] dark:border-white/12">
          {faqs.map((faq, index) => (
            <details key={faq.question} className="group border-b border-black/[0.09] dark:border-white/12" open={index === 0}>
              <summary className="flex min-h-[62px] list-none items-center justify-between gap-5 py-4 text-[12px] font-semibold text-[#1b3028] marker:content-none dark:text-white"><span>{faq.question}</span><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-black/10 text-[#5e746a] transition-transform group-open:rotate-180 dark:border-white/15 dark:text-white/55"><ChevronDown size={13} /></span></summary>
              <p className="max-w-[720px] pb-5 pr-10 text-[10px] leading-5 text-[#69766f] dark:text-white/52">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
