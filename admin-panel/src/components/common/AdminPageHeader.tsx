import type { ReactNode } from "react";

interface AdminPageHeaderProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export default function AdminPageHeader({ title, description, action }: AdminPageHeaderProps) {
  return (
    <div className="admin-page-header relative flex items-center justify-between gap-5 flex-wrap border-l-[3px] border-[#9dcf3f] px-5 py-4">
      <div className="relative">
        <p className="text-[10px] font-bold uppercase text-[#0b5a48] mb-1.5">ApniCars administration</p>
        <h1 className="admin-display text-[25px] leading-tight text-[#12342c]">{title}</h1>
        <p className="text-[12.5px] leading-5 text-[#62766f] mt-1 max-w-2xl">{description}</p>
      </div>
      {action}
    </div>
  );
}
