"use client";

import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";

export default function HeaderSearch({ onClose, className = "" }: { onClose: () => void; className?: string }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const search = query.trim();
    if (!search) return;
    router.push(`/cars?search=${encodeURIComponent(search)}`);
    onClose();
  }

  return (
    <form onSubmit={handleSubmit} role="search" className={`flex h-11 items-center rounded-full border border-[#a9bcaf] bg-white pl-4 pr-1.5 shadow-[0_8px_24px_rgba(5,31,24,.10)] transition-all dark:border-[#c9ff49]/35 dark:bg-[#0c251f] ${className}`}>
      <Search size={17} className="shrink-0 text-[#527066] dark:text-[#c9ff49]" />
      <input ref={inputRef} value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => event.key === "Escape" && onClose()} type="search" placeholder="Search brand or model" aria-label="Search brand or model" className="h-full min-w-0 flex-1 bg-transparent px-3 text-[12px] font-medium text-[#172a23] outline-none placeholder:text-[#89958f] dark:text-white dark:placeholder:text-white/40" />
      <button type="button" onClick={onClose} aria-label="Close search" title="Close search" className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[#66766f] transition-colors hover:bg-[#eef3f0] hover:text-[#17372d] dark:text-white/55 dark:hover:bg-white/10 dark:hover:text-white"><X size={15} /></button>
    </form>
  );
}
