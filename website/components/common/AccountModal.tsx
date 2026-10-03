"use client";

import { Eye, EyeOff, LockKeyhole, Mail, Phone, User, X } from "lucide-react";
import { FormEvent, ReactNode, useEffect, useState } from "react";

type AccountMode = "login" | "signup";

export default function AccountModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [mode, setMode] = useState<AccountMode>("login");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  function changeMode(nextMode: AccountMode) {
    setMode(nextMode);
    setShowPassword(false);
  }

  return (
    <div className="fixed inset-0 z-[120] grid place-items-center px-4 py-8" role="presentation">
      <button type="button" aria-label="Close account dialog" onClick={onClose} className="absolute inset-0 bg-[#03110e]/62 backdrop-blur-[3px]" />

      <section role="dialog" aria-modal="true" aria-labelledby="account-dialog-title" className="relative z-10 w-full max-w-[430px] overflow-hidden rounded-[8px] border border-black/10 bg-white shadow-[0_28px_80px_rgba(3,20,16,.28)] dark:border-white/10 dark:bg-[#0b211b]">
        <div className="border-b border-black/[0.07] px-6 pb-5 pt-6 dark:border-white/10 sm:px-8 sm:pt-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#698078] dark:text-[#9cb8af]">Your account</p>
              <h2 id="account-dialog-title" className="mt-2 text-[25px] font-semibold text-[#10221b] dark:text-white">{mode === "login" ? "Welcome back" : "Create your account"}</h2>
              <p className="mt-2 text-[11px] leading-5 text-[#6e7974] dark:text-white/50">{mode === "login" ? "Sign in to manage saved cars and comparisons." : "Save cars, comparisons and launch updates in one place."}</p>
            </div>
            <button type="button" onClick={onClose} aria-label="Close" className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-black/10 text-[#52675f] transition-colors hover:bg-[#eff4f1] hover:text-[#15372c] dark:border-white/12 dark:text-white/65 dark:hover:bg-white/10 dark:hover:text-white"><X size={17} /></button>
          </div>

          <div className="mt-6 grid grid-cols-2 rounded-[6px] bg-[#eef3f0] p-1 dark:bg-white/[0.06]" role="tablist" aria-label="Account access">
            <button type="button" role="tab" aria-selected={mode === "login"} onClick={() => changeMode("login")} className={`h-9 rounded-[5px] text-[11px] font-semibold transition-all ${mode === "login" ? "bg-white text-[#17372d] shadow-sm dark:bg-[#173a30] dark:text-white" : "text-[#718078] hover:text-[#27483d] dark:text-white/45 dark:hover:text-white"}`}>Login</button>
            <button type="button" role="tab" aria-selected={mode === "signup"} onClick={() => changeMode("signup")} className={`h-9 rounded-[5px] text-[11px] font-semibold transition-all ${mode === "signup" ? "bg-white text-[#17372d] shadow-sm dark:bg-[#173a30] dark:text-white" : "text-[#718078] hover:text-[#27483d] dark:text-white/45 dark:hover:text-white"}`}>Sign up</button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4 px-6 py-6 sm:px-8 sm:py-7">
          {mode === "signup" && (
            <>
              <AccountField label="Full name" name="name" type="text" autoComplete="name" placeholder="Enter your full name" icon={<User size={15} />} />
              <AccountField label="Phone number" name="phone" type="tel" autoComplete="tel" placeholder="Enter your phone number" icon={<Phone size={15} />} />
            </>
          )}

          <AccountField label="Email address" name="email" type="email" autoComplete="email" placeholder="Enter your email" icon={<Mail size={15} />} />

          <label className="grid gap-1.5 text-[10px] font-semibold text-[#30473e] dark:text-white/75">
            {mode === "login" ? "Password" : "Set password"}
            <span className="flex h-11 items-center rounded-[6px] border border-[#d6dfda] bg-white px-3 transition-colors focus-within:border-[#78962a] focus-within:ring-2 focus-within:ring-[#c9ff49]/20 dark:border-white/12 dark:bg-[#0d2a22] dark:focus-within:border-[#c9ff49]/45">
              <LockKeyhole size={15} className="shrink-0 text-[#72847c] dark:text-white/40" />
              <input required name="password" type={showPassword ? "text" : "password"} autoComplete={mode === "login" ? "current-password" : "new-password"} minLength={8} placeholder={mode === "login" ? "Enter your password" : "Minimum 8 characters"} className="h-full min-w-0 flex-1 bg-transparent px-3 text-[12px] font-medium text-[#182b24] outline-none placeholder:font-normal placeholder:text-[#9aa39f] dark:text-white dark:placeholder:text-white/35" />
              <button type="button" onClick={() => setShowPassword((current) => !current)} aria-label={showPassword ? "Hide password" : "Show password"} className="grid h-8 w-8 shrink-0 place-items-center text-[#75837d] hover:text-[#24483c] dark:text-white/40 dark:hover:text-white">{showPassword ? <EyeOff size={15} /> : <Eye size={15} />}</button>
            </span>
          </label>

          {mode === "login" && <button type="button" className="justify-self-end text-[10px] font-semibold text-[#527164] transition-colors hover:text-[#6d880d] dark:text-white/55 dark:hover:text-[#c9ff49]">Forgot password?</button>}

          <button type="submit" className="mt-1 flex h-11 items-center justify-center rounded-full bg-[#c9ff49] text-[11px] font-bold text-[#10271f] shadow-[0_10px_24px_rgba(201,255,73,.16)] transition-all hover:-translate-y-px hover:bg-[#bced3e]">Continue</button>
        </form>
      </section>
    </div>
  );
}

function AccountField({ label, icon, ...inputProps }: { label: string; icon: ReactNode } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="grid gap-1.5 text-[10px] font-semibold text-[#30473e] dark:text-white/75">
      {label}
      <span className="flex h-11 items-center rounded-[6px] border border-[#d6dfda] bg-white px-3 transition-colors focus-within:border-[#78962a] focus-within:ring-2 focus-within:ring-[#c9ff49]/20 dark:border-white/12 dark:bg-[#0d2a22] dark:focus-within:border-[#c9ff49]/45">
        <span className="shrink-0 text-[#72847c] dark:text-white/40">{icon}</span>
        <input required {...inputProps} className="h-full min-w-0 flex-1 bg-transparent px-3 text-[12px] font-medium text-[#182b24] outline-none placeholder:font-normal placeholder:text-[#9aa39f] dark:text-white dark:placeholder:text-white/35" />
      </span>
    </label>
  );
}
